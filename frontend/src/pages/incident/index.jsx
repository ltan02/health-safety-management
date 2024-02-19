import React, { useState } from "react";
import { Button, Modal, Box, TextField} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

function Incident() {
  // modal handler
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //modal style
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

  // table rows and cols
  const [rows, setRows] = useState([
    { id: 1000, datetime: 0, location: "", reportedBy: 1223, employeesInvolved: "", 
    injury: "", description: "", category: "", actionsTaken: "", existingBarriers: "", preventiveMeasures: "" },
    { id: 1001, datetime: 0, location: "", reportedBy: 1223, employeesInvolved: "", 
    injury: "", description: "", category: "", actionsTaken: "", existingBarriers: "", preventiveMeasures: "" },
    { id: 1057, datetime: 0, location: "", reportedBy: 1223, employeesInvolved: "", 
    injury: "", description: "", category: "", actionsTaken: "", existingBarriers: "", preventiveMeasures: "" },
    { id: 1207, datetime: 0, location: "", reportedBy: 1223, employeesInvolved: "", 
    injury: "", description: "", category: "", actionsTaken: "", existingBarriers: "", preventiveMeasures: "" },
    { id: 2347, datetime: 0, location: "", reportedBy: 1223, employeesInvolved: "", 
    injury: "", description: "", category: "", actionsTaken: "", existingBarriers: "", preventiveMeasures: "" },
    { id: 6100, datetime: 0, location: "", reportedBy: 1223, employeesInvolved: "", 
    injury: "", description: "", category: "", actionsTaken: "", existingBarriers: "", preventiveMeasures: "" },
  ]);
  
  const columns = [
    {field: 'id', headerName: 'Incident ID', width: 80},
    {field: 'datetime', headerName: 'Date Time', width: 220},
    {field: 'location', headerName: 'Location', width: 150},
    {field: 'reportedBy', headerName: 'Reported By', width: 150},
    {field: 'employeesInvolved', headerName: 'Employees Involved', width: 150},
    {field: 'injury', headerName: 'Injury', width: 150},
    {field: 'description', headerName: 'Description', width: 150},
    {field: 'category', headerName: 'Category', width: 150},
    {field: 'actionsTaken', headerName: 'Actions Taken', width: 150},
    {field: 'existingBarriers', headerName: 'Existing Barriers', width: 150},
    {field: 'preventiveMeasures', headerName: 'Preventive Measures', width: 150},
  ];

  // remove handlers
  const [selectedRows, setSelectedRows] = useState([]);
  
  const handleSelectionModelChange = (newSelection) => {
    setSelectedRows(newSelection);
  };
  
  const deleteSelectedRows = () => {
    const newRows = rows.filter(row => !selectedRows.includes(row.id));
    setRows(newRows);
  }

  //form handlers
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
    const newRow = {
      id: parseInt(formState.id),
      datetime: formState.datetime,
      location: formState.location,
      reportedBy: parseInt(formState.reportedBy),
      employeesInvolved: formState.employeesInvolved,
      injury: formState.injury,
      description: formState.description,
      category: formState.category,
      actionsTaken: formState.actionsTaken,
      existingBarriers: formState.existingBarriers,
      preventiveMeasures: formState.preventiveMeasures
    };
    setRows([...rows, newRow]);
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
    handleClose();
  };

  return (
    <>
      <Button onClick={handleOpen}>Add</Button>
      <Modal
        open={open}
        onClose={handleClose}
      >
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
      <Button onClick={deleteSelectedRows} disabled={selectedRows.length ===  0}>
        Remove
      </Button>
      <DataGrid  
        checkboxSelection  
        rows={rows}  
        columns={columns}  
        onRowSelectionModelChange={handleSelectionModelChange}
      />
    </>
  )
}

export default Incident