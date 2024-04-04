import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useAuthContext } from "../../context/AuthContext";

export default function ProfilePage() {
  // State for managing the switch (notification preference)
  const { user } = useAuthContext();
  const [isNotified, setIsNotified] = useState(false);
  console.log(user);

  const handleNotificationChange = (event) => {
    setIsNotified(event.target.checked);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Profile
        </Typography>

        {/* User's Name */}
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          {user.firstName} {user.lastName}
        </Typography>

        {/* Email Field */}
        <Typography
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
        >
          {user.email}
        </Typography>

        {/* Phone Field */}
        <Typography
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="role"
          label="role Number"
          type="role"
          id="role"
          autoComplete="current-role"
        >
          Role:
          {user.role}
        </Typography>

        {/* Notification Preference */}
        <FormControlLabel
          control={
            <Switch
              checked={isNotified}
              onChange={handleNotificationChange}
              name="receiveNotifications"
            />
          }
          label="Receiving Notifications?"
        />
      </Box>
    </Container>
  );
}
