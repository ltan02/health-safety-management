import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";

const RedirectButton = ({ to, children }) => {
    let history = useNavigate();

    const handleClick = () => {
        history(to);
    };

    return (
        <Button
            variant="contained"
            sx={{
                width: "100%",
                backgroundColor: "white",
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
