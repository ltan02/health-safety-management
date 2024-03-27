import { useEffect } from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { PAGE_TYPE, PRIVILEGED_SIDEBAR_CONTENTS, EMPLOYEE_SIDEBAR_CONTENTS } from "../../constants/index.jsx";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { isPrivileged } from "../../utils/permissions.js";
import { Typography } from "@mui/material";
import ViewWeekOutlinedIcon from "@mui/icons-material/ViewWeekOutlined";
import { useNavigate } from "react-router-dom";

function Sidebar({ isOpen, drawerWidth, handleSidebarToggle }) {
    const toggleDrawer = (open) => () => handleSidebarToggle(open);
    const { user } = useAuthContext();
    const [pageType, setPageType] = useState(PAGE_TYPE.INCIDENT);
    let location = useLocation();
    let history = useNavigate();

    const routes = isPrivileged(user.role)
        ? PRIVILEGED_SIDEBAR_CONTENTS[pageType]
        : EMPLOYEE_SIDEBAR_CONTENTS[pageType];

    useEffect(() => {
        const path = location.pathname.split("/")[1];
        if (isPrivileged(user.role)) {
            if (Object.values(PAGE_TYPE).includes(path)) {
                setPageType(path);
            }
            if (path === "") {
                setPageType(PAGE_TYPE.INCIDENT);
            }
        } else {
            setPageType(PAGE_TYPE.INCIDENT);
        }
    }, [location]);

    const renderList = (items) => (
        <List container direction="column" justifyContent={"center"} alignContent={"center"}>
            {Object.keys(items).map((id) => (
                <div key={id} style={{ display: "flex", paddingLeft: 2, paddingRight: 2, backgroundColor: "#d5d5d5" }}>
                    <ViewWeekOutlinedIcon />
                    <Typography variant="body2">{items[id]}</Typography>
                </div>
            ))}
        </List>
    );

    return (
        <Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Button onClick={toggleDrawer(!isOpen)} sx={{ position: "absolute", top: "50%" }}>
                    {isOpen ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
                </Button>
            </Box>
            <SwipeableDrawer
                ModalProps={{ keepMounted: true }}
                anchor="left"
                open={isOpen}
                onOpen={toggleDrawer(true)}
                onClose={toggleDrawer(false)}
                variant="persistent"
                sx={{
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: "column",
                        top: "64px",
                    },
                }}
            >
                <IconButton
                    onClick={toggleDrawer(!isOpen)}
                    sx={{
                        marginLeft: "auto",
                    }}
                >
                    {isOpen ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
                </IconButton>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "start",
                        alignContent: "start",
                        alignItems: "start",
                        height: "60%",
                        paddingX: "10px"
                    }}
                >
                    <Button onClick={() => history("/")} sx={{ paddingLeft: "17px", paddingY: "8px", paddingRight: "8px", display: "flex", alignItems: "start", justifyContent: "start", width: "100%" }}>
                        <ViewWeekOutlinedIcon sx={{ fontSize: 24, marginRight: "10px", color: "#000" }} />
                        <span>
                            <Typography style={{ fontSize: "16px", fontWeight: 400, color: "#000" }}>Board</Typography>
                        </span>
                    </Button>
                </Box>
            </SwipeableDrawer>
        </Box>
    );
}

export default Sidebar;
