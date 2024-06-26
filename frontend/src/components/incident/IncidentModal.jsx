import { useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";

function IncidentModal({ open, onClose, onSubmit, fields }) {
    // Form state and handlers
    const [formState, setFormState] = useState(fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {}));

    const handleInputChange = (event) => {
        setFormState({
            ...formState,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(formState);
        setFormState(fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {}));
    };

    // Modal style
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <form onSubmit={handleSubmit}>
                    {fields.map((field, index) => {
                        return (
                            <TextField
                                key={index}
                                name={field.name}
                                label={field.label}
                                value={formState[field.name]}
                                type={field.type}
                                onChange={handleInputChange}
                            />
                        );
                    })}

                    <Button type="submit" variant="contained" color="primary">
                        Add Incident
                    </Button>
                </form>
            </Box>
        </Modal>
    );
}

export default IncidentModal;
