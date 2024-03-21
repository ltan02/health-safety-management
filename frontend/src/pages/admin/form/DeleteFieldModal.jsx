import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

function DeleteFieldModal({ open, setOpen, onHandleDelete }) {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="delete-confirmation-modal"
      aria-describedby="delete-confirmation-modal-description"
      closeAfterTransition
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
        <Typography
          id="delete-confirmation-modal"
          variant="h6"
          component="h2"
          align="center"
          gutterBottom
        >
          Are you sure you want to delete this field?
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            mt: 3,
          }}
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={onHandleDelete}>
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default DeleteFieldModal;
