import { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Button,
    Divider,
    Box,
    Modal,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
} from "@mui/material";
import { useAuthContext } from "../../context/AuthContext";
import useAxios from "../../hooks/useAxios";

const formatRoleToString = (role) => {
    return role
        .split("_")
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
        .join(" ");
};

const formatStringToRole = (role) => {
    return role
        .split(" ")
        .map((word) => word.toUpperCase())
        .join("_");
};

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export default function InviteUserModal({ open, onClose }) {
    const { loading } = useAuthContext();
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { sendRequest } = useAxios();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await sendRequest({ url: "/groups" });
                setRoles(response);
            } catch (e) {
                setError(e.message);
            }
        };

        fetchRoles();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await sendRequest({ url: "/users" });
                setUsers(response);
            } catch (e) {
                setError(e.message);
            }
        };

        fetchUsers();
    }, []);

    const handleSubmit = async () => {
        if (!email || !role) {
            setError("Email and role are required");
            return;
        }

        if (!validateEmail(email)) {
            setError("Invalid email address");
            return;
        }

        if (users.some((user) => user.email === email)) {
            setError("User already exists with the provided email");
            return;
        }

        try {
            await sendRequest({
                url: "/invitations",
                method: "POST",
                body: {
                    email,
                    role: role.name,
                    isActive: true,
                },
            });
            setEmail("");
            setRole("");
            onClose();
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="invite-user-modal-title"
            aria-describedby="invite-user-modal-description"
        >
            <Container
                component="main"
                maxWidth="xs"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "5%",
                    backgroundColor: "white",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        borderRadius: 2,
                        padding: 5,
                        width: "100%",
                        backgroundColor: "white",
                    }}
                >
                    <Typography component="h1" variant="h5" fontWeight={600}>
                        Invite New User
                    </Typography>
                    <Divider
                        style={{
                            width: "100%",
                            marginBottom: "20px",
                        }}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            labelId="role-label"
                            id="role"
                            value={role}
                            label="Role"
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            {roles.map((role) => (
                                <MenuItem key={role.id} value={role}>
                                    {formatRoleToString(role.name)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        value={email}
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleSubmit}
                        disabled={loading || !email || !role}
                    >
                        {loading ? <CircularProgress color="inherit" /> : "Invite User"}
                    </Button>
                    {error && (
                        <Typography color="error" variant="body2">
                            {error}
                        </Typography>
                    )}
                    {success && (
                        <Typography color="primary" variant="body2">
                            {success}
                        </Typography>
                    )}
                </Box>
            </Container>
        </Modal>
    );
}
