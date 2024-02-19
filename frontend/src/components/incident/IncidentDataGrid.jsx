import React, { useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { IconButton, TextField } from '@mui/material';


// Define a custom toolbar component
function CustomToolbar({ value, onChange, clearSearch }) {

  return (
    <div>
      <TextField
        value={value}
        onChange={onChange}
        placeholder="Search by Incident ID"
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: value ? 'visible' : 'hidden' }}
              onClick={clearSearch}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
      />
    </div>
  );
}

function IncidentDataGrid({ rows, onSelectionModelChange }) {
  // Search Handlers
  const [searchText, setSearchText] = useState('');
  const [filteredRows, setFilteredRows] = useState(rows);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    const searchRegex = new RegExp(event.target.value, 'i');
    const newFilteredRows = rows.filter((row) => searchRegex.test(row.id.toString()));
    setFilteredRows(newFilteredRows);
  };

  const clearSearch = () => {
    setSearchText('');
    setFilteredRows(rows);
  };


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

  return (
    <DataGrid
      checkboxSelection
      rows={filteredRows}
      columns={columns}
      onRowSelectionModelChange={onSelectionModelChange}
      slots={{
        toolbar: CustomToolbar,
      }}
      slotProps={{
        toolbar: {
          value: searchText,
          onChange: handleSearchChange,
          clearSearch: clearSearch,
        },
      }}
    />)
}

export default IncidentDataGrid;