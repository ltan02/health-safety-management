import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Container, Typography, Box, Chip } from "@mui/material";
import Task from "./Task";

function Column({ id, title, tasks, activeId }) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <Container
            ref={setNodeRef}
            sx={{
                bgcolor: "grey.200",
                padding: 2,
                borderRadius: 1,
                minHeight: "100%",
                width: "350px",
                margin: 2,
                boxShadow: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 2,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h6" fontWeight={600}>
                        {title}
                    </Typography>
                    <Chip label={tasks.length} size="small" />
                </Box>
            </Box>
            <SortableContext id={id} items={tasks.map((task) => task.id)} strategy={rectSortingStrategy}>
                <Box sx={{ marginTop: 2 }}>
                    {tasks.map((task) => (
                        <Box key={task.id} sx={{ margin: 1 }}>
                            {task.id === activeId ? (
                                <Task id={task.id} task={task} invisible />
                            ) : (
                                <Task id={task.id} task={task} />
                            )}
                        </Box>
                    ))}
                </Box>
            </SortableContext>
        </Container>
    );
}

export default Column;
