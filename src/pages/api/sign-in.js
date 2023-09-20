import mongoose from "mongoose";
import UserSchema from "@/schemas/User.schema";

const connection = mongoose.connect(process.env.MONGO_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const handler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await UserSchema.findOne({ email }).lean();

    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export default handler;
