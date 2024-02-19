
import React from "react";
import { Box, Modal, Typography, Button } from "@mui/material";
function AddTaskModal({ openModal, handleCloseModal }) {
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        outline: 'none',
      };
  return (
    <Modal open={openModal} onClose={handleCloseModal}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2">
          Add a New Task
        </Typography>
        <Button onClick={handleCloseModal}>Close</Button>
      </Box>
    </Modal>
  );
}

export default AddTaskModal;
