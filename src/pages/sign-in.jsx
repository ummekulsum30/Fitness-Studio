import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import Grid from "@mui/material/Grid";
import Email from "@mui/icons-material/Email";
import Lock from "@mui/icons-material/Lock";
import { vh, vw } from "@/utils/responsive";
import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useDispatch } from "react-redux";
import { signIn } from "@/redux/slices/AuthSlice";
import { useRouter } from "next/router";
import { useState } from "react";

export const getStaticProps = async () => {
  return {
    props: {},
  };
};

const SignInPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      const formData = new FormData(e.target);
      const email = formData.get("email");
      const password = formData.get("password");

      const response = await fetch("/api//sign-in", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        e.target.reset();
        dispatch(signIn(data.user._id));
        setLoading(false);
        router.push("/");
      } else {
        throw new Error(data.message || "Unknown Error");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          height: vh(100),
          padding: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            width: vw(80),
            maxWidth: "400px",
          }}
        >
          <Typography variant="h5">Sign In</Typography>
          <br />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                disabled={loading}
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                InputProps={{
                  startAdornment: <Email />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                disabled={loading}
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                InputProps={{
                  startAdornment: <Lock />,
                }}
              />
            </Grid>
          </Grid>
          <LoadingButton
            loading={loading}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, borderRadius: "10px" }}
          >
            Sign In
          </LoadingButton>
          <Typography variant="body2" mt={2}>
            Don't have an account? <Link href="/sign-up">Sign Up</Link>
          </Typography>
        </form>
      </Box>
      <Link href="/">
        <IconButton sx={{ position: "absolute", top: "10px", left: "10px" }}>
          <ArrowBackRoundedIcon />
        </IconButton>
      </Link>
    </>
  );
};

export default SignInPage;
