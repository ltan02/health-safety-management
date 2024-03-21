import { useRef, useEffect, useState } from "react";
import { TextField, Box, MenuItem, MenuList, Typography, Paper } from "@mui/material";

function useOutsideClickDetector(ref, onOutsideClick) {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                onOutsideClick();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, onOutsideClick]);
}

function IncidentSearchInput({ onSearch, handleOpenModal }) {
    const [searchMode, setSearchMode] = useState(false);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const wrapperRef = useRef(null);
    useOutsideClickDetector(wrapperRef, () => setSearchMode(false));

    const handleChange = (event) => {
        if (!event.target.value || event.target.value === "") {
            setSearchMode(false);
        } else {
            const tasks = onSearch(event.target.value);
            setFilteredTasks(tasks);
            setSearchMode(true);
        }
    };

    return (
        <Box ref={wrapperRef}>
            <TextField fullWidth variant="outlined" placeholder="Search tasks..." onChange={handleChange} />
            {searchMode && (
                <Paper
                    elevation={3}
                    sx={{
                        position: "absolute",
                        width: "100%",
                        maxHeight: "300px",
                        overflow: "auto",
                        mt: 1,
                        zIndex: 1,
                    }}
                >
                    <MenuList>
                        {filteredTasks.map((task) => (
                            <MenuItem
                                key={task.id}
                                onClick={() => {
                                    setSearchMode(false);
                                    handleOpenModal(task);
                                }}
                                sx={{
                                    justifyContent: "flex-start",
                                    borderBottom: "1px solid #e0e0e0",
                                }}
                            >
                                <Typography noWrap>
                                    {task.incidentCategory} on {task.incidentDate}
                                </Typography>
                            </MenuItem>
                        ))}
                    </MenuList>
                </Paper>
            )}
        </Box>
    );
}

export default IncidentSearchInput;
