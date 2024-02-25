import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { IconButton, TextField } from "@mui/material";

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
                            style={{ visibility: value ? "visible" : "hidden" }}
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

function IncidentDataGrid({ rows, onSelectionModelChange, fields }) {
    // Search Handlers
    const [searchText, setSearchText] = useState("");
    const [filteredRows, setFilteredRows] = useState(rows);

    useEffect(() => {
        setFilteredRows(rows);
    }, [rows]);

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
        const searchRegex = new RegExp(event.target.value, "i");
        const newFilteredRows = rows.filter((row) => searchRegex.test(row.id.toString()));
        setFilteredRows(newFilteredRows);
    };

    const clearSearch = () => {
        setSearchText("");
        setFilteredRows(rows);
    };

    const columns = fields.map((field) => ({
        field: field.name,
        headerName: field.label,
        width: field.columnWidth,
    }));

    return (
        <DataGrid
            checkboxSelection
            rows={filteredRows}
            columns={columns}
            onRowSelectionModelChange={onSelectionModelChange}
            slots={{
                toolbar: CustomToolbar,
            }}
            getRowId={(row) => row?.id}
            slotProps={{
                toolbar: {
                    value: searchText,
                    onChange: handleSearchChange,
                    clearSearch: clearSearch,
                },
            }}
        />
    );
}

export default IncidentDataGrid;
