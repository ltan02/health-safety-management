import React, { useState } from "react";
import {
    Box,
    Container,
    TextField,
    Typography,
    Switch,
    FormControlLabel, Link, Grid,
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
      <Container component="main" maxWidth="xs" style = {{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "5%",
    }}>
      <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "solid 4px #EB8C00",
            borderRadius: 2,
            padding: 5,
            width: "90%",
        }}
      >
        <Typography component="h1" variant="h5" fontWeight={600}>
          Profile
        </Typography>
        {/* User's Name */}
          <Grid
              container
              alignItems="center"
              sx={{ justifyContent: "space-between", mt: 5 }}
          >
              <Typography
                  color="secondary"
                  variant = "h6"
                  sx={{
                      display: "flex",
                      alignItems: "center",
                      }}
                  >
                  First Name
              </Typography>
              <Typography
                  color="secondary.light"
                  variant = "h6"
                  sx={{
                      display: "flex",
                      alignItems: "center",
                  }}
              >
                  {user.firstName}
              </Typography>
          </Grid>
          <Grid
              container
              alignItems="center"
              sx={{ justifyContent: "space-between", mt: 5 }}
          >
              <Typography
                  color="secondary"
                  variant = "h6"
                  sx={{
                      display: "flex",
                      alignItems: "center",
                  }}
              >
                  Last Name
              </Typography>
              <Typography
                  color="secondary.light"
                  variant = "h6"
                  sx={{
                      display: "flex",
                      alignItems: "center",
                  }}
              >
                  {user.lastName}
              </Typography>
          </Grid>


        {/* Email Field */}
          <Grid
              container
              alignItems="center"
              sx={{ justifyContent: "space-between", mt: 5 }}
          >
              <Typography
                  color="secondary"
                  variant = "h6"
                  sx={{
                      display: "flex",
                      alignItems: "center",
                  }}
              >
                  Email Address
              </Typography>
              <Typography
                  color="secondary.light"
                  variant = "h6"
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  sx={{
                      display: "flex",
                      alignItems: "center",
                  }}
              >
                  {user.email}
              </Typography>
          </Grid>

        {/* Phone Field */}
          <Grid
              container
              alignItems="center"
              sx={{ justifyContent: "space-between", mt: 5 }}
          >
              <Typography
                  color="secondary"
                  variant = "h6"
                  sx={{
                      display: "flex",
                      alignItems: "center",
                  }}
              >
                  Role
              </Typography>
              <Typography
                  color="secondary.light"
                  variant = "h6"
                  name="role"
                  label="role Number"
                  type="role"
                  id="role"
                  autoComplete="current-role"
                  sx={{
                      display: "flex",
                      alignItems: "center",
                  }}
              >
                  {user.role}
              </Typography>
          </Grid>
          <Grid
              container
              alignItems="center"
              sx={{ justifyContent: "space-between", mt: 5 }}
          >
              <FormControlLabel
                  label={<Typography fontSize={16} color="secondary" >Would you like to receive Notifications?</Typography>}
                  labelPlacement="start"
                  sx={{mt: 4,}}
                  control={
                      <Switch
                          checked={isNotified}
                          onChange={handleNotificationChange}
                          name="receiveNotifications"

                      />
                  }
              />
          </Grid>
        {/* Notification Preference */}
      </Box>
    </Container>
  );
}
