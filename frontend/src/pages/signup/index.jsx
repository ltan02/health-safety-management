import { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Grid,
    Link,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import pwcLogo from "../../assets/pwcLogo.svg";

function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    missingEmail: false,
    missingPassword: false,
    passwordsDontMatch: false,
    general: "",
  });

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  useEffect(() => {
    document.body.style.backgroundColor = "#EB8C00";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  const handleSubmit = async () => {
    setErrors({
      missingEmail: false,
      missingPassword: false,
      passwordsDontMatch: false,
      general: "",
    });

    if (!email) {
      setErrors((errors) => ({ ...errors, missingEmail: true }));
      return;
    } else if (!password) {
      setErrors((errors) => ({ ...errors, missingPassword: true }));
      return;
    } else if (password !== confirmPassword) {
      setErrors((errors) => ({ ...errors, passwordsDontMatch: true }));
      return;
    }

    try {
      await signUp(email, password);
      navigate("/");
    } catch (error) {
      console.error("Sign up error: ", error);
      setErrors((errors) => ({ ...errors, general: error.message }));
    }
  };

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
            paddingBottom: "2rem",
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
              src={pwcLogo}
              alt="logo"
              style={{
                marginTop: "1.5rem",
                marginBottom: "1.5rem",
                height: "100px",
                width: "auto",
                alignSelf: "center",
              }}
            />
            <Typography
              variant="h5"
              component="h2"
              style={{ marginBottom: "20px" }}
            >
              Sign Up
            </Typography>
          </div>
          <form noValidate autoComplete="off">
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
            {errors.missingEmail && (
              <Alert severity="error">Email is required</Alert>
            )}

            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={toggleShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            {errors.missingPassword && (
              <Alert severity="error">Password is required</Alert>
            )}

            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <InputLabel htmlFor="confirm-password">
                Confirm Password
              </InputLabel>
              <OutlinedInput
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={toggleShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirm Password"
              />
            </FormControl>
            {errors.passwordsDontMatch && (
              <Alert severity="error">Passwords do not match</Alert>
            )}
            {errors.general && <Alert severity="error">{errors.general}</Alert>}

            <Button
              onClick={handleSubmit}
              color="primary"
              variant="contained"
              fullWidth
              sx={{ mt: 3, height: 45 }}
            >
              Sign Up
            </Button>
          </form>
          <Grid
            container
            alignItems="center"
            style={{ justifyContent: "start" }}
          >
            <Link href="/" style={{ marginTop: "20px", display: "flex" }}>
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
                style={{ paddingLeft: "5px" }}
              >
                Sign In
              </Typography>
            </Link>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

export default SignUp;
