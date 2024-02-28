import { Box, Modal, Typography, Button } from "@mui/material";
import { TextField } from "@mui/material";
import { useState } from "react";
import { useId } from "react";

function AddTaskModal({ openModal, handleCloseModal, column, handleAddTask }) {
    const [title, setTitle] = useState("");
    const [assignee, setAssignee] = useState("");
    const [deadline, setDeadline] = useState("");
    const [description, setDescription] = useState("");
    const id = useId();

    const handleAdd = () => {
        handleAddTask({
            id,
            title,
            assignee,
            deadline,
            description,
            column,
        });
        handleCloseModal();
    };

    const modalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        outline: "none",
    };
    return (
        <Modal open={openModal} onClose={handleCloseModal}>
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2">
                    Add a New Task
                </Typography>
                <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    label="Assignee"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    value={deadline}
                    type="date"
                    onChange={(e) => setDeadline(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
                <Button onClick={handleAdd}>Add Task</Button>

                <Button onClick={handleCloseModal}>Close</Button>
            </Box>
        </Modal>
    );
}

export default AddTaskModal;
