import { useEffect } from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Typography from "@mui/material/Typography";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { PAGE_TYPE, SIDEBAR_CONTENTS, COLORS } from "../../constants";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";

function Sidebar({ isOpen, drawerWidth, handleSidebarToggle }) {
  const toggleDrawer = (open) => () => handleSidebarToggle(open);
  const [user] = useAuthContext();
  const [pageType, setPageType] = useState(PAGE_TYPE.ADMIN);
  let location = useLocation();

  useEffect(() => {
    setPageType(location.pathname.substring(1));
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
        <Typography fontSize={"1.5rem"}>{user.user?.email ?? 'Anonymous User'}</Typography>
      </Box>
      <List
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          width: "240px",
        }}
      >
        {items.map((text) => (
          <Button
            variant="contained"
            key={text}
            sx={{
              width: "100%",
            }}
          >
            <Typography fontSize={"1.2rem"}>{text}</Typography>
          </Button>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <IconButton onClick={toggleDrawer(!isOpen)}>
        {isOpen ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
      </IconButton>
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
          {renderList(SIDEBAR_CONTENTS[pageType] ?? SIDEBAR_CONTENTS[PAGE_TYPE.ADMIN])}
        </Box>
      </SwipeableDrawer>
    </Box>
  );
}

export default Sidebar;
