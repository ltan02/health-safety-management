import { useState } from "react";
import { Button, Modal, Box, TextField, Select, MenuItem } from "@mui/material";
const initialFields = [
    { name: "title", label: "Title", columnWidth: 300, type: "text" },
    { name: "reporter", label: "Reported By", columnWidth: 200, type: "text" },
    { name: "employeesInvolved", label: "Employees Involved", columnWidth: 800, type: "text" },
];
function AdminForm() {
    const [open, setOpen] = useState(false);
    const [newField, setNewField] = useState({ name: "", label: "", columnWidth: 150, type: "text" });
    const [fields, setFields] = useState(initialFields);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleFieldChange = (event) => {
        setNewField({
            ...newField,
            [event.target.name]: event.target.value,
        });
    };

    const handleFieldSubmit = (event) => {
        event.preventDefault();
        addField(newField);
        setNewField({ name: "", label: "", columnWidth: 150, type: "text" });
        handleClose();
    };

    const addField = (field) => {
        setFields([...fields, field]);
    };

    const removeField = (fieldName) => {
        setFields(fields.filter((field) => field.name !== fieldName));
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
        <div>
            <Button onClick={handleOpen}>Add Field</Button>
            <Box>
                {fields.map((field, index) => {
                    return (
                        <div key={index}>
                            <TextField name={field.name} label={field.label} type={field.type} />
                            <Button onClick={() => removeField(field.name)}>Delete Field</Button>
                        </div>
                    );
                })}
            </Box>

            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <form onSubmit={handleFieldSubmit}>
                        <TextField name="name" label="Field Name" value={newField.name} onChange={handleFieldChange} />
                        <TextField
                            name="label"
                            label="Field Label"
                            value={newField.label}
                            onChange={handleFieldChange}
                        />
                        <TextField
                            name="columnWidth"
                            label="Column Width"
                            value={newField.columnWidth}
                            onChange={handleFieldChange}
                        />
                        <div />
                        <Select name="type" label="Field Type" value={newField.type} onChange={handleFieldChange}>
                            <MenuItem value={"text"}>Text Field</MenuItem>
                            <MenuItem value={"number"}>Number Field</MenuItem>
                            <MenuItem value={"datetime-local"}>Date Time Picker</MenuItem>
                            <MenuItem value={"date"}>Date Picker</MenuItem>
                            <MenuItem value={"time"}>Time Picker</MenuItem>
                            <MenuItem value={"file"}>File Input</MenuItem>
                        </Select>
                        <div />
                        <Button type="submit" variant="contained" color="primary">
                            Add Field
                        </Button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}

export default AdminForm;
