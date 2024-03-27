import {useLocation, useNavigate} from "react-router-dom";
import { Button, Typography } from "@mui/material";

const RedirectButton = ({ to, children }) => {
    let history = useNavigate();
    let location = useLocation();

    const handleClick = () => {
        history(to);
    };

    return (
        <Button
            variant="contained"
            sx={{
                width: "100%",
                backgroundColor: location.pathname === to? "primary.light":"white",
                borderRight: location.pathname === to? "7px solid": "0px",
                borderRightColor: location.pathname === to? "primary.dark": "white",
                padding: ".75rem",
                boxShadow: "0px 0px 0px",
                '&:hover': {backgroundColor: "primary.light", borderRight: "7px solid",
                    borderRightColor: "primary.dark"}
            }}
            onClick={handleClick}
        >
            <Typography variant="h6">{children}</Typography>
        </Button>
    );
};

export default RedirectButton;
