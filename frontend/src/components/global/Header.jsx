import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { Card } from "@mui/material";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { isPrivileged } from "../../utils/permissions";
import pwcLogo from "../../assets/pwcLogo.svg";
import Profile from "../users/Profile";
import Sidebar from "./Sidebar";

function Header() {
    const { user, signOut } = useAuthContext();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const drawerWidth = 240;
    const [sidebarOpen, setSidebarOpen] = useState(false);

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

    const directTo = (path) => () => {
        navigate(path);
    };

    return (
        <AppBar position="static" color="primary">
            <Toolbar
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor: "white",
                }}
            >
                <Sidebar drawerWidth={drawerWidth} isOpen={sidebarOpen} handleSidebarToggle={setSidebarOpen} />
                <img src={pwcLogo} alt="logo" style={{ height: "3rem", width: "auto", paddingLeft: "15px" }}></img>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexGrow: 1,
                    }}
                >
                    {/* <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                // TODO: comment  this if we don't want to push the header to the right when the sidebar is open
                                marginLeft: sidebarOpen ? `${drawerWidth}px` : "0",
                                transition: "margin 300ms ease-out",
                            }}
                        >
                            AppName
                        </Typography> */}
                    {isPrivileged(user.role) && (
                        <Container
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "2rem",
                                padding: "0px",
                            }}
                        >
                            <Button
                                color="inherit"
                                onClick={directTo("/")}
                                sx={{
                                    "&:hover": { borderBottom: "3px solid" },
                                    padding: "0.9rem",
                                    marginTop: "0.5rem",
                                }}
                            >
                                Admin
                            </Button>
                            <Button
                                color="inherit"
                                onClick={directTo("/incident")}
                                sx={{
                                    "&:hover": { borderBottom: "3px solid" },
                                    padding: "0.9rem",
                                    marginTop: "0.5rem",
                                }}
                            >
                                Incident
                            </Button>
                            <Button
                                color="inherit"
                                onClick={directTo("/report")}
                                sx={{
                                    "&:hover": { borderBottom: "3px solid" },
                                    padding: "0.9rem",
                                    marginTop: "0.5rem",
                                }}
                            >
                                Report
                            </Button>
                        </Container>
                    )}
                </Box>
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
