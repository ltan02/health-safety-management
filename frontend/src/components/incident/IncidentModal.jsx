import React, { useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

function IncidentModal({ open, onClose, onSubmit }) {
  // Form state and handlers
  const [formState, setFormState] = useState({
    id: '',
    datetime: '',
    location: '',
    reportedBy: '',
    employeesInvolved: '',
    injury: '',
    description: '',
    category: '',
    actionsTaken: '',
    existingBarriers: '',
    preventiveMeasures: ''
  });

  const handleInputChange = (event) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value
    });
  };

  const handleDateChange = (value) => {
    setFormState({
      ...formState,
      ["datetime"]: value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formState);
    setFormState({
      id: '',
      datetime: '',
      location: '',
      reportedBy: '',
      employeesInvolved: '',
      injury: '',
      description: '',
      category: '',
      actionsTaken: '',
      existingBarriers: '',
      preventiveMeasures: ''
    });
  };

  // Modal style
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };


  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
      <form onSubmit={handleSubmit}>
            <TextField
              name="id"
              label="Incident ID"
              value={formState.id}
              onChange={handleInputChange}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                name="datetime"
                label="Date Time"
                value={formState.datetime}
                onChange={handleDateChange}
              />
            </LocalizationProvider>
            <TextField
              name="location"
              label="Location"
              value={formState.location}
              onChange={handleInputChange}
            />
            <TextField
              name="reportedBy"
              label="Reported By"
              value={formState.reportedBy}
              onChange={handleInputChange}
            />
            <TextField
              name="employeesInvolved"
              label="Employees Involved"
              value={formState.employeesInvolved}
              onChange={handleInputChange}
            />
            <TextField
              name="injury"
              label="Injury"
              value={formState.injury}
              onChange={handleInputChange}
            />
            <TextField
              name="description"
              label="description"
              value={formState.description}
              onChange={handleInputChange}
            />
            <TextField
              name="category"
              label="category"
              value={formState.category}
              onChange={handleInputChange}
            />
            <TextField
              name="actionsTaken"
              label="Actions Taken"
              value={formState.actionsTaken}
              onChange={handleInputChange}
            />
            <TextField
              name="existingBarriers"
              label="Existing Barriers"
              value={formState.existingBarriers}
              onChange={handleInputChange}
            />
            <TextField
              name="preventiveMeasures"
              label="Preventive Measures"
              value={formState.preventiveMeasures}
              onChange={handleInputChange}
            />

            <Button type="submit" variant="contained" color="primary">
              Add Incident
            </Button>
          </form>
      </Box>
    </Modal>
  );
}

export default IncidentModal;