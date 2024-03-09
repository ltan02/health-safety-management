import { Box, Typography, Avatar } from "@mui/material";

export default function Profile({ user }) {
    const getInitials = (firstName, lastName) => {
        return `${firstName[0]}${lastName[0]}`;
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ bgcolor: "#DB536A", width: "30px", height: "30px", fontSize: "14px" }}>{getInitials(user.firstName, user.lastName)}</Avatar>
            <Typography variant="body2">{`${user.firstName} ${user.lastName}`}</Typography>
        </Box>
    );
}
