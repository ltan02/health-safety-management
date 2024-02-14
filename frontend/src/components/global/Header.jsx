import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const directTo = (path) => () => {
    navigate(path);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary" maxWidth>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AppName
          </Typography>
          <Container
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6rem",
            }}
            style={{ padding: "0px" }}
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
          <Button color="inherit">Login</Button>
          <Button color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
