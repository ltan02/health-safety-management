import { useState } from "react";
import {
    Box,
    Modal,
    Typography,
    TextField,
    Button,
    Stack,
    FormControl,
    MenuItem,
    Select,
    InputLabel,
    OutlinedInput,
    Chip,
    Checkbox,
    Grid,
} from "@mui/material";
import PreviewForm from "../form/PreviewForm";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "auto",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    overflow: "auto",
    maxHeight: "90%",
    display: "flex",
    flexDirection: "column",
};

const largeTextFieldStyle = {
    "& .MuiOutlinedInput-root": {
        height: "5em",
    },
};

function AddTaskModal({ open, onClose, handleAddTask, allEmployees, field, sortedRows }) {
    // const [timeOfIncident, setTimeOfIncident] = useState("");
    // const [location, setLocation] = useState("");
    // const [employeesInvolved, setEmployeesInvolved] = useState([]);
    // const [description, setDescription] = useState("");
    // const [category, setCategory] = useState("");
    // const [actionsTaken, setActionsTaken] = useState("");
    // const [existingBarriers, setExistingBarriers] = useState("");
    // const [preventativeMeasures, setPreventativeMeasures] = useState("");

    const handleSubmit = (field) => {
        handleAddTask(field);
        onClose();
    };
    return (
        <Modal
            open={open}
            onClose={() => {
                onClose();
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                    Report New Incident
                </Typography>
                <PreviewForm fields={field} sortedRows={sortedRows} handleSubmit={handleSubmit} onClose={onClose} />
            </Box>
        </Modal>
    );
}

export default AddTaskModal;
