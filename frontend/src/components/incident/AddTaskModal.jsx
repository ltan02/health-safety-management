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

function AddTaskModal({ open, onClose, handleAddTask, allEmployees }) {
    const [timeOfIncident, setTimeOfIncident] = useState("");
    const [location, setLocation] = useState("");
    const [employeesInvolved, setEmployeesInvolved] = useState([]);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [actionsTaken, setActionsTaken] = useState("");
    const [existingBarriers, setExistingBarriers] = useState("");
    const [preventativeMeasures, setPreventativeMeasures] = useState("");

    const categories = ["Category 1", "Category 2", "Category 3"];

    const handleAdd = () => {
        handleAddTask({
            timeOfIncident,
            location,
            employeesInvolved,
            description,
            category,
            actionsTaken,
            existingBarriers,
            preventativeMeasures,
        });
        resetFields();
        onClose();
    };

    const resetFields = () => {
        setTimeOfIncident("");
        setLocation("");
        setEmployeesInvolved([]);
        setDescription("");
        setCategory("");
        setActionsTaken("");
        setExistingBarriers("");
        setPreventativeMeasures("");
    };

    const handleChangeMultiple = (event) => {
        const value = event.target.value;
        setEmployeesInvolved(typeof value === "string" ? value.split(",") : value);
    };

    return (
        <Modal
            open={open}
            onClose={() => {
                resetFields();
                onClose();
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                    Report New Incident
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={2}>
                            <TextField
                                label="Time of Incident"
                                type="datetime-local"
                                InputLabelProps={{ shrink: true }}
                                value={timeOfIncident}
                                onChange={(e) => setTimeOfIncident(e.target.value)}
                                fullWidth
                                variant="outlined"
                            />
                            <TextField
                                label="Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                fullWidth
                                variant="outlined"
                            />
                            <FormControl fullWidth>
                                <InputLabel id="employee-select-label">Employees Involved</InputLabel>
                                <Select
                                    labelId="employee-select-label"
                                    multiple
                                    value={employeesInvolved}
                                    onChange={handleChangeMultiple}
                                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                            {selected.map((value) => {
                                                const employee = allEmployees.find((e) => e.id === value);
                                                return (
                                                    <Chip
                                                        key={value}
                                                        label={
                                                            employee
                                                                ? `${employee.firstName} ${employee.lastName}`
                                                                : "Unknown"
                                                        }
                                                    />
                                                );
                                            })}
                                        </Box>
                                    )}
                                >
                                    {allEmployees.map((employee) => (
                                        <MenuItem key={employee.id} value={employee.id}>
                                            <Checkbox checked={employeesInvolved.indexOf(employee.id) > -1} />
                                            {`${employee.firstName} ${employee.lastName}`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                sx={largeTextFieldStyle}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={2}>
                            <FormControl fullWidth>
                                <InputLabel id="category-select-label">Category</InputLabel>
                                <Select
                                    labelId="category-select-label"
                                    value={category}
                                    label="Category"
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Actions Taken"
                                value={actionsTaken}
                                onChange={(e) => setActionsTaken(e.target.value)}
                                fullWidth
                                multiline
                                rows={2}
                                variant="outlined"
                                sx={largeTextFieldStyle}
                            />
                            <TextField
                                label="Existing Barriers"
                                value={existingBarriers}
                                onChange={(e) => setExistingBarriers(e.target.value)}
                                fullWidth
                                multiline
                                rows={2}
                                variant="outlined"
                                sx={largeTextFieldStyle}
                            />
                            <TextField
                                label="Preventative Measures"
                                value={preventativeMeasures}
                                onChange={(e) => setPreventativeMeasures(e.target.value)}
                                fullWidth
                                multiline
                                rows={2}
                                variant="outlined"
                                sx={largeTextFieldStyle}
                            />
                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                <Button variant="outlined" onClick={onClose}>
                                    Close
                                </Button>
                                <Button variant="contained" onClick={handleAdd}>
                                    Report Incident
                                </Button>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
}

export default AddTaskModal;
