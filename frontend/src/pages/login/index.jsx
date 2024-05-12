import { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Alert from "@mui/material/Alert";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/react.svg";

function Login() {
  const navigate = useNavigate();
  const { user, signIn } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showMissingEmail, setShowMissingEmail] = useState(false);
  const [showMissingPassword, setShowMissingPassword] = useState(false);
  const [showInvalidDetails, setShowInvalidDetails] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (user !== null) {
      navigate("/");
    }
  }, [navigate, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowMissingEmail(false);
    setShowMissingPassword(false);
    setShowInvalidDetails(false);

    if (email === "") {
      setShowMissingEmail(true);
    } else if (password === "") {
      setShowMissingPassword(true);
    } else {
      signIn(email, password).catch((e) => {
        console.error("Login error: ", e);
        setShowInvalidDetails(true);
      });
    }
  };

  useEffect(() => {
    document.body.style.backgroundColor = "#EB8C00";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <Container
      maxWidth="xs"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        maxHeight: "100vh",
      }}
    >
      <Card>
        <CardContent
          style={{
            paddingRight: "1.5rem",
            paddingLeft: "1.5rem",
            marginBottom: "100px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={logo}
              alt="logo"
              style={{
                marginTop: "1.5rem",
                marginBottom: "1.5rem",
                height: "100px",
                width: "auto",
                alignSelf: "center",
              }}
            ></img>
            <Typography
              variant="h6"
              component="h6"
              style={{ marginBottom: "20px" }}
            >
              Login to continue
            </Typography>
          </div>
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              margin="normal"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormControl fullWidth sx={{ marginTop: 1 }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Password*
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </FormControl>

            {showMissingEmail && (
              <Alert severity="error" sx={{ marginTop: 1 }}>
                Email field must not be left blank
              </Alert>
            )}
            {showMissingPassword && (
              <Alert severity="error" sx={{ marginTop: 1 }}>
                Password field must not be left blank
              </Alert>
            )}
            {showInvalidDetails && (
              <Alert severity="error" sx={{ marginTop: 1 }}>
                Your email or password are incorrect. Please try again!
              </Alert>
            )}

            <Button
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              style={{ marginTop: "20px", height: "45px" }}
            >
              Login
            </Button>
          </form>
          {/* <Grid
            container
            alignItems="center"
            style={{ justifyContent: "center" }}
          >
            <Link href="/signup" style={{ marginTop: "20px", display: "flex" }}>
              <Typography
                color="secondary"
                fontSize={14}
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Do not have an account?
              </Typography>
              <Typography
                color="primary"
                fontSize={14}
                href="/signup"
                style={{ paddingLeft: "5px" }}
              >
                Sign Up
              </Typography>
            </Link>
          </Grid> */}
        </CardContent>
      </Card>
    </Container>
  );
}

export default Login;
