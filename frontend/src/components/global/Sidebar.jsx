import { useEffect } from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Typography from "@mui/material/Typography";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  PAGE_TYPE,
  PRIVILEGED_SIDEBAR_CONTENTS,
  EMPLOYEE_SIDEBAR_CONTENTS,
} from "../../constants/index.jsx";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { isPrivileged } from "../../utils/permissions.js";

function Sidebar({ isOpen, drawerWidth, handleSidebarToggle }) {
  const toggleDrawer = (open) => () => handleSidebarToggle(open);
  const { user } = useAuthContext();
  const [pageType, setPageType] = useState(PAGE_TYPE.INCIDENT);
  let location = useLocation();

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        <AccountCircleIcon
          style={{
            fontSize: 84,
            padding: "0px",
          }}
        />
        <Typography variant="h6">{user?.email ?? "Anonymous User"}</Typography>
      </Box>
      <List
        sx={{
          display: "flex",
          flexDirection: "column",
          // gap: "2rem",
          width: drawerWidth,
        }}
      >
        {Object.keys(items).map((id) => (
          <div key={id}>{items[id]}</div>
        ))}
      </List>
    </Box>
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
          role="presentation"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
            padding: "2rem",
          }}
        >
          {isPrivileged(user.role)
            ? renderList(PRIVILEGED_SIDEBAR_CONTENTS[pageType])
            : renderList(EMPLOYEE_SIDEBAR_CONTENTS[pageType])}
        </Box>
      </SwipeableDrawer>
    </Box>
  );
}

export default Sidebar;
