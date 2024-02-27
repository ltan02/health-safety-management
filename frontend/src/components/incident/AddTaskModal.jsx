import { useState } from "react";
import { Box, Modal, Typography, TextField, Button, Stack } from "@mui/material";

function AddTaskModal({ open, onClose, column, handleAddTask }) {
    const [title, setTitle] = useState("");
    const [assignee, setAssignee] = useState("");
    const [deadline, setDeadline] = useState("");
    const [description, setDescription] = useState("");

    const handleAdd = () => {
        handleAddTask({
            title,
            assignee,
            deadline,
            description,
            column,
        });
        resetFields();
        onClose();
    };

    const resetFields = () => {
        setTitle("");
        setAssignee("");
        setDeadline("");
        setDescription("");
    };

    return (
        <Modal
            open={open}
            onClose={() => {
                resetFields();
                onClose();
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                    Add a New Task
                </Typography>
                <Stack spacing={2}>
                    <TextField
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        label="Assignee"
                        value={assignee}
                        onChange={(e) => setAssignee(e.target.value)}
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        label="Deadline"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                    />
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                        <Button variant="outlined" onClick={onClose}>
                            Close
                        </Button>
                        <Button variant="contained" onClick={handleAdd}>
                            Add Task
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </Modal>
    );
}

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

export default AddTaskModal;
