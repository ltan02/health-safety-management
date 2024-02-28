import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Container, Typography, Box, Chip, IconButton } from "@mui/material";
import Task from "./Task";
import AddIcon from "@mui/icons-material/Add";
import AddTaskModal from "./AddTaskModal";

function Column({ id, title, tasks, activeId, handleAddTask, employees, onRefresh }) {
    const { setNodeRef } = useDroppable({ id });
    const [openModal, setOpenModal] = useState(false);

    const toggleModal = () => setOpenModal(!openModal);

    return (
        <Container
            ref={setNodeRef}
            sx={{
                bgcolor: "grey.200",
                padding: 2,
                borderRadius: 1,
                minHeight: "100%",
                width: "350px",
                minWidth: "350px",
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
                <Typography variant="h6" fontWeight={600} sx={{ flexGrow: 1 }}>
                    {title} <Chip label={tasks.length} size="small" />
                </Typography>
                <IconButton onClick={toggleModal} color="primary">
                    <AddIcon />
                </IconButton>
            </Box>
            <SortableContext id={id} items={tasks.map((task) => task.id)} strategy={rectSortingStrategy}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {tasks.map((task) => (
                        <Task key={task.id} id={task.id} task={task} />
                    ))}
                </Box>
            </SortableContext>
            <AddTaskModal open={openModal} onClose={toggleModal} columnId={id} handleAddTask={handleAddTask} allEmployees={employees} />
        </Container>
    );
}

export default Column;
