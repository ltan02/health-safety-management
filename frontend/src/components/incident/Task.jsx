import { Card, CardContent, Typography, CardActionArea, Menu, MenuItem, TextField, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Profile from "../users/Profile";
import useAxios from "../../hooks/useAxios";
import { useAuthContext } from "../../context/AuthContext";
import { isPrivileged } from "../../utils/permissions";
import CircularProgress from "@mui/material/CircularProgress";

function Task({ task, handleOpenModal, employees = [], onRefresh, handleIncidentUpdateFromTask, columnId }) {
    const { sendRequest, loading } = useAxios();

    const [openReviewModal, setOpenReviewModal] = useState(false);
    const [searchEmployee, setSearchEmployee] = useState("");
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [reviewer, setReviewer] = useState(task.reviewer);
    const { user } = useAuthContext();

    const [anchorEl, setAnchorEl] = useState(null);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task?.id });

    const handleOpenReviewModal = (e) => {
        if (!isPrivileged(user.role)) {
            return;
        }
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
        setOpenReviewModal(true);
    };

    const handleFilterEmployees = (e) => {
        setSearchEmployee(e.target.value);
    };

    const handleOpen = () => {
        if (openReviewModal) {
            return;
        }
        handleOpenModal(task);
    };

    useEffect(() => {
        setFilteredEmployees(
            employees
                .filter((employee) => isPrivileged(employee?.role))
                .filter((employee) => employee.id !== task.reviewer?.id)
                .filter(
                    (employee) =>
                        employee.firstName.toLowerCase().includes(searchEmployee.toLowerCase()) ||
                        employee.lastName.toLowerCase().includes(searchEmployee.toLowerCase()),
                ),
        );
    }, [searchEmployee]);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        boxShadow: 3,
        borderRadius: 2,
        opacity: isDragging ? 0 : 1,
        cursor: "pointer",
    };

    const handleSelectReviewer = async (employee) => {
        try {
            setOpenReviewModal(false);
            setSearchEmployee("");
            setAnchorEl(null);
            handleIncidentUpdateFromTask({ ...task, reviewer: employee }, columnId);
            await sendRequest({
                url: `/incidents/${task.id}/reviewer/${employee.id}`,
                method: "POST",
            });
            await onRefresh();

            setReviewer(employee);
        } catch (e) {
            console.error("Error selecting reviewer: ", e);
        }
    };

    return (
        <Card
            sx={{
                ...style,
                boxShadow: 3,
                // "&:hover": {
                //   boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
                // },
                transition: "0.3s",
            }}
            id={task.id}
            ref={setNodeRef}
            {...attributes}
            {...listeners}
        >
            <CardActionArea sx={{ p: 0 }}>
                <CardContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: "100%",
                    }}
                    onClick={handleOpen}
                >
                    <Typography
                        gutterBottom
                        component="div"
                        color="primary.text"
                        sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: "2",
                            WebkitBoxOrient: "vertical",
                            fontSize: 14,
                        }}
                    >
                        {task.customFields?.description && task.customFields?.description.length > 0
                            ? task.customFields?.description
                            : `${task.incidentCategory} on ${
                                  new Date(task.incidentDate).toLocaleDateString().split("T")[0]
                              }`}
                    </Typography>

                    <div style={{ flexGrow: 1 }}></div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="caption" color="secondary.dark" fontWeight={700}>
                            {task.incidentDate.split("T")[0]}
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                "&:hover": {
                                    boxShadow: isPrivileged(user.role) ? 5 : 0,
                                    transition: "0.3s",
                                },
                            }}
                            borderRadius={10}
                            onClick={handleOpenReviewModal}
                        >
                            <Profile user={reviewer} style={{ cursor: "pointer", elevation: 2 }} />
                        </Box>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={openReviewModal}
                            onClose={() => setOpenReviewModal(false)}
                        >
                            <TextField
                                label="Search"
                                variant="outlined"
                                value={searchEmployee}
                                onChange={handleFilterEmployees}
                                onKeyDown={(e) => e.stopPropagation()}
                                size="small"
                                sx={{ m: 1 }}
                            />
                            {filteredEmployees.map((employee) => (
                                <MenuItem key={employee.id} onClick={() => handleSelectReviewer(employee)}>
                                    {loading ? (
                                        <CircularProgress size={20} />
                                    ) : (
                                        <>
                                            <Profile user={employee} />
                                            <Typography variant="body1" sx={{ ml: 1 }}>
                                                {employee.firstName} {employee.lastName}
                                            </Typography>
                                        </>
                                    )}
                                </MenuItem>
                            ))}
                        </Menu>
                    </div>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default Task;
