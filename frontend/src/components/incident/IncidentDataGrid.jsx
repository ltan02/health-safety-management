import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const CustomToolbar = ({ value, onChange, clearSearch }) => (
    <div style={{ padding: "8px" }}>
        <TextField
            variant="outlined"
            size="small"
            value={value}
            onChange={onChange}
            placeholder="Search..."
            InputProps={{
                startAdornment: <SearchIcon fontSize="small" />,
                endAdornment: (
                    <IconButton
                        title="Clear"
                        aria-label="Clear"
                        size="large"
                        onClick={clearSearch}
                        style={{ visibility: value ? "visible" : "hidden" }}
                    >
                        <ClearIcon fontSize="small" />
                    </IconButton>
                ),
            }}
        />
    </div>
);

const IncidentDataGrid = ({ rows, columns, onRowClick }) => {
    const [searchText, setSearchText] = useState("");
    const [filteredRows, setFilteredRows] = useState(rows);

    useEffect(() => {
        if (searchText && searchText !== "") {
            const searchRegex = new RegExp(searchText, "i");
            setFilteredRows(rows.filter((row) => searchRegex.test(row.incidentId.toString())));
        } else {
            setFilteredRows(rows);
        }
    }, [rows, searchText]);

    const handleSearchChange = (event) => setSearchText(event.target.value);
    const clearSearch = () => setSearchText("");

    return (
        <DataGrid
            disableColumnFilter={true}
            rows={filteredRows}
            columns={columns}
            slots={{ Toolbar: CustomToolbar }}
            slotProps={{
                toolbar: {
                    value: searchText,
                    onChange: handleSearchChange,
                    clearSearch: clearSearch,
                },
            }}
            getRowId={(row) => row.id}
            autoHeight
            disableSelectionOnClick
            onRowClick={onRowClick}
            sx={{ borderTopWidth: "3px", fontSize: "14px" }}
        />
    );
};

export default IncidentDataGrid;
