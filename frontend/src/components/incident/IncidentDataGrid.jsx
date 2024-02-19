import { DataGrid } from '@mui/x-data-grid';

function IncidentDataGrid({ rows, onSelectionModelChange }) {
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
      rows={rows}
      columns={columns}
      onRowSelectionModelChange={onSelectionModelChange}
    />
  );
}

export default IncidentDataGrid;