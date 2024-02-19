import React, { useState } from "react";
import {
  Paper,
  TextField,
} from "@mui/material";

import { DataGrid } from '@mui/x-data-grid';

const rows = [
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
];

const columns = [
  {field: 'id', headerName: 'Incident ID', width: 90},
  {field: 'datetime', headerName: 'Date Time', width: 150},
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

function Incident() {
  return (
    <>
    <DataGrid rows={rows} columns={columns} />
    </>
  )
}

export default Incident