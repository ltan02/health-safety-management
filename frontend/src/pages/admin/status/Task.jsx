import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Box,
  Card,
  Typography,
  Chip,
} from "@mui/material";

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
    boxShadow: 3,
    opacity: isDragging ? 0 : 1,
    cursor: "pointer",
};

  return (
    <Card
      sx={{ m: 1, boxShadow: 3, borderRadius: 2, padding:0 }}
      id={task.name} 
      ref={setNodeRef} {...attributes} {...listeners}
      style={style}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
          padding: 1,
        }}
      >
        <Chip label={`${task.name}`} variant="outlined" />
        <Typography variant="p">{task.states.length} Issues</Typography>
      </Box>
    </Card>
  );
}

export default Task;
