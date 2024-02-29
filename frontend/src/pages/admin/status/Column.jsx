import { useEffect, useState, useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Container, TextField, Typography, Box, Chip, IconButton, Modal, Button } from "@mui/material";
import Task from "./Task";
import EditIcon from "@mui/icons-material/Edit";

function Column({ id, title, tasks, handleRenameColumn }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    const [currentTitle, setTitle] = useState(title);
    const [isEditing, setIsEditing] = useState(false);
    const [hover, setHover] = useState(false);
    const inputRef = useRef(null);

    const changeName = (e) => {
        setTitle(e.target.value);
    };

    const handleOpenEditModal = () => setIsEditing(true);
    const handleCloseEditModal = () => setIsEditing(false);

    const handleSaveEdit = () => {
        if (currentTitle !== title) {
            handleRenameColumn(id, currentTitle);
        }
        handleCloseEditModal();
    };

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    return (
        <Container
            ref={setNodeRef}
            sx={{
                bgcolor: !isOver ? "grey.200" : "white",
                padding: 2,
                borderRadius: 1,
                height: "600px",
                width: "300px",
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
                <Box
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    <Typography variant="body1">{title}</Typography>
                    {!isEditing && hover && (
                        <IconButton size="small" onClick={handleOpenEditModal}>
                            <EditIcon />
                        </IconButton>
                    )}
                    <Chip label={tasks.length} size="small" />
                </Box>
            </Box>
            <SortableContext items={tasks.map((task) => task.id)} strategy={rectSortingStrategy}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {tasks.map((task) => (
                        <Task key={task.id} id={task.id} task={task} />
                    ))}
                </Box>
            </SortableContext>
            <Modal
                open={isEditing}
                onClose={handleCloseEditModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Edit Column Name
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={currentTitle}
                        onChange={changeName}
                        inputRef={inputRef}
                    />
                    <Button onClick={handleSaveEdit} variant="contained" color="primary">
                        Save
                    </Button>
                </Box>
            </Modal>
        </Container>
    );
}

export default Column;
