import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Card, CardContent, Typography, IconButton } from "@mui/material";
import DragHandleIcon from "@mui/icons-material/DragHandle"; // Make sure to import the correct drag handle icon
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import DateRangeIcon from "@mui/icons-material/DateRange";

function Task({ id, task }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const borderCompletion = 90;

    const dateFormatter = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}/${d.getMonth()}/${d.getDate()}`;
    };

    return (
        <Card
            sx={{ boxShadow: 3, borderRadius: 2, opacity: isDragging ? 0 : 1 }}
            id={task.id}
            ref={setNodeRef}
            style={style}
        >
            <CardContent>
                <Box sx={{ gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}>
                        <Box sx={{ cursor: isDragging ? "grabbing" : "grab" }} {...attributes} {...listeners}>
                            <DragHandleIcon />
                        </Box>
                    </Box>
                    <Typography
                        gutterBottom
                        variant="h7"
                        component="div"
                        fontWeight={600}
                        fontSize={20}
                        sx={{ color: "#3a3a3a" }}
                    >
                        {task.title}
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <IconButton size="small">
                            <AccountCircleIcon />
                        </IconButton>
                        <Typography variant="body2" sx={{ color: "#4a4a4a" }}>
                            {task.assignee}
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
                            {dateFormatter(task.deadline)}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default Task;
