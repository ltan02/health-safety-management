import React, { useState } from "react";
import { Button, Modal, Box, TextField } from "@mui/material";

function IncidentForm({fields, setFields}) {

  const [open, setOpen] = useState(false);
  const [newField, setNewField] = useState({ name: '', label: '', columnWidth:   150, type: 'text' });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFieldChange = (event) => {
    setNewField({
      ...newField,
      [event.target.name]: event.target.value
    });
  };

  const handleFieldSubmit = (event) => {
    event.preventDefault();
    addField(newField);
    setNewField({ name: '', label: '', columnWidth:   150, type: 'text' });
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
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width:   400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow:   24,
    p:   4,
  };

  return (
    <div>
      <Button onClick={handleOpen}>Add Field</Button>
      <Box>
        {fields.map((field, index) => (
          <div key={index}>
            <TextField
              name={field.name}
              label={field.label}
            />
            <Button onClick={() => removeField(field.name)}>
              Delete Field
            </Button>
          </div>
        ))}  
      </Box>
          
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <form onSubmit={handleFieldSubmit}>
            <TextField
              name="name"
              label="Field Name"
              value={newField.name}
              onChange={handleFieldChange}
            />
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
            <TextField
              name="type"
              label="Field Type"
              value={newField.type}
              onChange={handleFieldChange}
            />
            <Button type="submit" variant="contained" color="primary">
              Add Field
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default IncidentForm;
