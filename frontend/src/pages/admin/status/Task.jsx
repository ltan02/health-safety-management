import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
} from "@mui/material";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { initialTasks } from "../initial_tasks";

function Task({ id, task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, // Adjusted for visual feedback during drag
  };

  const dateFormatter = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`; // Corrected month indexing
  };

  const getTasksByStatus = (status) =>
    initialTasks.filter((t) => t.status === status);

  return (
    <Card
      sx={{ m: 1, boxShadow: 3, borderRadius: 2 }} // Adjusted margins and styling
      id={task.id}
      ref={setNodeRef}
      style={style}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent:"center", alignItems: "center", gap: 1 }}>
          <Chip label={`${task.status}`} variant="outlined" />
          <Typography variant="p" >
            {getTasksByStatus(task.status).length} Issues
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default Task;
