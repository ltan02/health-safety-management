import { useEffect, useState, useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Container, TextField, Typography, Box, Chip, IconButton, Modal, Button } from "@mui/material";
import Task from "./Task";
import EditIcon from "@mui/icons-material/Edit";

function Column({ id, title, tasks, handleRenameColumn, isOverlayActive, handleDeleteColumn }) {
    const { setNodeRef } = useDroppable({ id });
    const [currentTitle, setCurrentTitle] = useState(title);
    const [isEditing, setIsEditing] = useState(false);
    const [hover, setHover] = useState(false);
    const inputRef = useRef(null);

    const changeName = (e) => {
        setCurrentTitle(e.target.value);
    };

    const handleOpenEditModal = () => setIsEditing(true);
    const handleCloseEditModal = () => {
        setIsEditing(false);
        setHover(false);
    };

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
                position: "relative",
                bgcolor: "grey.200",
                padding: 2,
                borderRadius: 1,
                minHeight: "160px",
                height: "100%",
                width: "300px",
                marginY: 2,
                marginX: 1,
                boxShadow: 2,
                display: "flex",
                flexDirection: "column",
            }}
        >
            {isOverlayActive && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: "rgba(235, 140, 0, 0.1)",
                        zIndex: 1,
                        borderStyle: "solid",
                        borderWidth: 2,
                        borderColor: "#EB8C00",
                        borderRadius: 1,
                    }}
                />
            )}
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
                    <Chip label={tasks.length} size="small" sx={{bgcolor:"#EB8C00", color: "white"}}/>
                </Box>
            </Box>
            {tasks && tasks.length > 0 && (
                <SortableContext items={tasks.map((task) => task.id)} strategy={rectSortingStrategy}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "10%" }}>
                        {tasks.map((task) => (
                            <Task key={task.id} id={task.id} task={task} />
                        ))}
                    </Box>
                </SortableContext>
            )}
            {(!tasks || tasks.length === 0) && (
                <Box
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                    }}
                >
                    <Typography>Drag a status here to assign it to this column.</Typography>
                </Box>
            )}
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
                        Edit column
                    </Typography>
                    <TextField
                        required
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        label="Name"
                        value={currentTitle}
                        onChange={changeName}
                        inputRef={inputRef}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                handleDeleteColumn(id);
                                handleCloseEditModal();
                            }}
                        >
                            Delete column
                        </Button>
                        <div style={{ display: "flex" }}>
                            <Button onClick={handleCloseEditModal} sx={{ marginRight: 1 }}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveEdit}
                                variant="contained"
                                color="primary"
                                disabled={currentTitle === title || currentTitle === ""}
                            >
                                Update
                            </Button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </Container>
    );
}

export default Column;
