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
            }}
            onClick={handleClick}
        >
            <Typography fontSize={"1.2rem"}>{children}</Typography>
        </Button>
    );
};

export default RedirectButton;
