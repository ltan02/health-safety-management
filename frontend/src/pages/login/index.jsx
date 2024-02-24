import { useEffect, useState } from "react";
import { Container, Card, CardContent, Typography, TextField, Button } from "@mui/material";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
    return (
        <Container maxWidth="sm" style={{ marginTop: "100px" }}>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2" style={{ marginBottom: "20px" }}>
                        Login
                    </Typography>
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
                            style={{ marginTop: "20px" }}
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
