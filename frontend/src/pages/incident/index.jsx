import React, { useState } from "react";
import { Button } from "@mui/material";
import { initialData } from "./initialData";
import IncidentModal from "../../components/incident/IncidentModal";
import IncidentDataGrid from "../../components/incident/IncidentDataGrid";

function Incident({fields}) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState(initialData); 

  const [selectedRows, setSelectedRows] = useState([]);
  
  // Modal and DataGrid handlers
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSelectionModelChange = (newSelection) => { 
    setSelectedRows(newSelection);
  };
  const deleteSelectedRows = () => { 
    const newRows = rows.filter(row => !selectedRows.includes(row.id));
    setRows(newRows); 
  };



  return (
    <>
      <Button onClick={handleOpen}>Add</Button>
      <IncidentModal
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        fields={fields}
      />
      <Button onClick={deleteSelectedRows} disabled={selectedRows.length ===  0}>
        Remove
      </Button>
      <IncidentDataGrid
        rows={rows}
        onSelectionModelChange={handleSelectionModelChange}
        fields={fields}
      />
    </>
  );

  function handleSubmit(newRow) {
    setRows([...rows, newRow]);
    handleClose();
  }
}

export default Incident;