import React, { useState } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  Typography,
  Grid,
} from "@mui/material";

function AddFiledModal({ handleFieldSubmit, handleClose, open }) {
  const [newField, setNewField] = useState({
    name: "",
    label: "",
    columnWidth: 150,
    type: "text",
  });

  const handleFieldChange = (event) => {
    const tempField = { ...newField };
    tempField[event.target.name] = event.target.value;
    setNewField(tempField);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleFieldSubmit(newField);
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "auto",
    maxWidth: "90vw",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Add New Field
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            name="name"
            label="Field Name"
            fullWidth
            margin="normal"
            value={newField.name}
            onChange={handleFieldChange}
          />
          <TextField
            name="label"
            label="Field Label"
            fullWidth
            margin="normal"
            value={newField.label}
            onChange={handleFieldChange}
          />
          <TextField
            name="columnWidth"
            label="Column Width"
            fullWidth
            type="number"
            margin="normal"
            value={newField.columnWidth}
            onChange={handleFieldChange}
          />
          <Select
            name="type"
            fullWidth
            label="Field Type"
            value={newField.type}
            onChange={handleFieldChange}
            displayEmpty
          >
            <MenuItem value="text">Text Field</MenuItem>
            <MenuItem value="number">Number Field</MenuItem>
            <MenuItem value="datetime-local">Date Time Picker</MenuItem>
            <MenuItem value="date">Date Picker</MenuItem>
            <MenuItem value="time">Time Picker</MenuItem>
            <MenuItem value="file">File Input</MenuItem>
          </Select>
          <Grid container sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
          
          }}>
            <Button type="submit" variant="contained" color="primary">
              Add Field
            </Button>
            <Button variant="contained" color="primary" onClick={handleClose}>
              Cancel
            </Button>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
}
export default AddFiledModal;
