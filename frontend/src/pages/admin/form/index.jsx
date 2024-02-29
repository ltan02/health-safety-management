import React, { useState } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { styled } from "@mui/material/styles";
import AddFiledModal from "./AddFieldModal";

const initialFields = [
  { name: "title", label: "Title", columnWidth: 300, type: "text" },
  { name: "reporter", label: "Reported By", columnWidth: 200, type: "text" },
  {
    name: "employeesInvolved",
    label: "Employees Involved",
    columnWidth: 800,
    type: "text",
  },
  { name: "description", label: "Description", columnWidth: 800, type: "text" },
  { name: "category", label: "Category", columnWidth: 200, type: "text" },
  {
    name: "actionsTaken",
    label: "Actions Taken",
    columnWidth: 800,
    type: "text",
  },
  {
    name: "existingBarriers",
    label: "Existing Barriers",
    columnWidth: 800,
    type: "text",
  },
  {
    name: "preventativeMeasures",
    label: "Preventative Measures",
    columnWidth: 800,
    type: "text",
  },
];

function AdminForm() {
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState(initialFields);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFieldSubmit = (newField) => {
    addField(newField);
    handleClose();
  };

  const addField = (field) => {
    setFields([...fields, field]);
  };

  const removeField = (fieldName) => {
    setFields(fields.filter((field) => field.name !== fieldName));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom align="center">
        Admin Form Customization
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <IconButton color="primary" onClick={handleOpen}>
          <AddCircleOutlineIcon />
        </IconButton>
      </Box>
      <Grid container spacing={2}>
        {fields.map((field, index) => (
          <Grid item key={index}>
            <TextField
              fullWidth
              name={field.name}
              label={field.label}
              type={field.type}
              variant="outlined"
            />
            <IconButton color="error" onClick={() => removeField(field.name)}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        ))}
      </Grid>

      <AddFiledModal
        handleFieldSubmit={handleFieldSubmit}
        handleClose={handleClose}
        open={open}
      />
    </Container>
  );
}

export default AdminForm;
