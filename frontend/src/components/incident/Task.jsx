import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Card, CardContent, Typography, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import DateRangeIcon from "@mui/icons-material/DateRange";

function Task({ id, task }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        boxShadow: 3,
        borderRadius: 2,
        opacity: isDragging ? 0 : 1,
        cursor: "pointer",
    };

    const borderCompletion = 90;

    return (
        <Card sx={style} id={task.id} ref={setNodeRef} {...attributes} {...listeners}>
            <CardContent>
                <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    fontWeight={600}
                    fontSize={20}
                    sx={{ color: "#3a3a3a" }}
                >
                    {task.title}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <IconButton size="small">
                            <AccountCircleIcon />
                        </IconButton>
                        <Typography variant="body2" sx={{ color: "#4a4a4a" }}>
                            {task.reporterName}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <IconButton size="small">
                            {borderCompletion > 100 ? (
                                <LocalFireDepartmentIcon sx={{ color: "red" }} />
                            ) : (
                                <DateRangeIcon />
                            )}
                        </IconButton>
                        <Typography variant="body2" sx={{ color: borderCompletion > 90 ? "red" : "black" }}>
                            {"Scheduled Date Here"}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default Task;
