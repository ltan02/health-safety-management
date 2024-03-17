import { useEffect, useState } from "react";
import { Container, Card, CardContent, Typography, TextField, Button } from "@mui/material";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import pwcLogo from "../../assets/pwcLogo.svg";

function Login() {
    const navigate = useNavigate();
    const { user, signIn } = useAuthContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (user !== null) {
            navigate("/");
        }
    }, [navigate, user]);

    const handleSubmit = () => {
        signIn(email, password);
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
            style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", width: "100vw" }}
        >
            <Card>
                <CardContent style={{ paddingRight: "1.5rem", paddingLeft: "1.5rem", marginBottom: "100px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
                        ></img>
                        <Typography variant="h6" component="h6" style={{ marginBottom: "20px" }}>
                            Login to continue
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
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            required
                            margin="normal"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            onClick={handleSubmit}
                            color="primary"
                            variant="contained"
                            fullWidth
                            style={{ marginTop: "20px", height: "45px" }}
                        >
                            Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
}

export default Login;
