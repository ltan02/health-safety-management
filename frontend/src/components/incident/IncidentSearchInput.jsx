import { TextField } from "@mui/material";

function IncidentSearchInput({ onSearch }) {
    const handleChange = (event) => {
        onSearch(event.target.value);
    };

    return (
        <TextField
            fullWidth
            variant="outlined"
            placeholder="Search tasks..."
            onChange={handleChange}
        />
    );
}

export default IncidentSearchInput;