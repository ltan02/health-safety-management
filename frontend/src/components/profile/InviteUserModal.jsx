import {
  Container,
  Typography,
  Button,
  Grid,
  Divider,
  Box,
  Modal,
  TextField,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useAuthContext } from "../../context/AuthContext";
import { useState } from "react";

export default function InviteUserModal({ open, onClose }) {
  const { user, createAccount, loading } = useAuthContext();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await createAccount(
        email,
        "password123",
        firstName,
        lastName,
        role
      );
      setSuccess(res);
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
            {" "}
            {/* Adjusted color */}
            Invite New User
          </Typography>
          <Divider
            style={{
              width: "100%",
              marginBottom: "20px",
              backgroundColor: "primary",
            }}
          />{" "}
          {/* Adjusted color */}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="fname"
            autoFocus
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="lname"
            onChange={(e) => setLastName(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              label="Role"
              name="role"
              defaultValue=""
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <MenuItem value="EMPLOYEE">Employee</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="SAFETY_WARDEN">Safety Warden</MenuItem>
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
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: "primary", color: "white" }} // Adjusted to a more neutral color
            onClick={handleSubmit}
            disabled={loading || !email || !firstName || !lastName || !role}
          >
            {loading ? <CircularProgress color="inherit" /> : "Invite User"}
          </Button>
        </Box>
      </Container>
    </Modal>
  );
}
