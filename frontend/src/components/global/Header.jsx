import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Card } from "@mui/material";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import logo from "../../assets/react.svg";
import Profile from "../users/Profile";

function Header() {
    const { user, signOut } = useAuthContext();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileClose = () => {
        setAnchorEl(null);
    };

    const profileOpen = Boolean(anchorEl);
    const id = profileOpen ? "profile-popover" : undefined;

    const handleLogout = async () => {
        signOut();
        navigate("/");
    };

    return (
        <AppBar color="primary" elevation={0}>
            <Toolbar
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor: "white",
                    borderBottom: "2px solid #E0E0E0",
                    zIndex: 5,
                }}
            >
                <img src={logo} alt="logo" style={{ height: "3rem", width: "auto", paddingLeft: "15px" }}></img>
                <Button sx={{ borderRadius: "50%" }} aria-describedby={id} onClick={handleProfileClick}>
                    <Profile user={user} />
                </Button>
                <Popover
                    id={id}
                    open={profileOpen}
                    anchorEl={anchorEl}
                    onClose={handleProfileClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                >
                    <Card sx={{ width: 250, alignItems: "start" }}>
                        <Box sx={{ p: 2 }}>
                            <Typography color="primary" sx={{ fontWeight: 700, fontSize: "11px" }}>
                                ACCOUNT
                            </Typography>
                            <div style={{ display: "flex", alignItems: "center", rowGap: "8px", marginTop: "8px" }}>
                                <Profile user={user} />
                                <div style={{ marginLeft: "8px" }}>
                                    <Typography variant="body" sx={{ fontWeight: 400, fontSize: "14px" }}>
                                        {user.firstName} {user.lastName}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        component="p"
                                        sx={{ color: "text.secondary", fontWeight: 400, fontSize: "11px" }}
                                    >
                                        {user.email}
                                    </Typography>
                                </div>
                            </div>
                        </Box>
                        <Divider />
                        <Button
                            onClick={handleLogout}
                            sx={{ width: "100%", padding: "10px 16px", justifyContent: "start" }}
                        >
                            Log out
                        </Button>
                    </Card>
                </Popover>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
