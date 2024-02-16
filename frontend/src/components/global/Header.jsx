import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";

function Header() {
  const drawerWidth = 300;
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Assuming you want the sidebar to be closed initially

  const directTo = (path) => () => {
    navigate(path);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Sidebar
            drawerWidth={drawerWidth}
            isOpen={sidebarOpen}
            handleSidebarToggle={setSidebarOpen} // Assuming Sidebar manages its own open/close state
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              flexGrow: 1,
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                // TODO: comment  this if we don't want to push the header to the right when the sidebar is open
                marginLeft: sidebarOpen ? `${drawerWidth}px` : "0",
                transition: "margin 300ms ease-out",
              }}
            >
              AppName
            </Typography>
            <Container
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "2rem",
                padding: "0px",
              }}
            >
              <Button color="inherit" onClick={directTo("/admin")}>
                Admin
              </Button>
              <Button color="inherit" onClick={directTo("/incident")}>
                Incident
              </Button>
              <Button color="inherit" onClick={directTo("/report")}>
                Report
              </Button>
            </Container>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button color="inherit">Login</Button>
            <Button color="inherit">Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
