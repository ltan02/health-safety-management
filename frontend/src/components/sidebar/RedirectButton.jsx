import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import {matchPath} from "react-router-dom";


const RedirectButton = ({ to, children }) => {
  let history = useNavigate();

  const availablePaths = ["/admin/workflows", "/admin/report", "/admin/status", "/admin/management"]

  const handleClick = () => {
    if (availablePaths.includes(to)) {
      history(to);
    }
  };

  return (
    <Button
      variant="contained"
      sx={{
        width: "100%",
      }}
      onClick={handleClick}
    >
      <Typography fontSize={"1.2rem"}>{children}</Typography>
    </Button>
  );
};

export default RedirectButton;
