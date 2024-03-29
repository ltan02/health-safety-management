import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useAuthContext } from "../../context/AuthContext";

export default function AddFormModal({ open, handleClose, createNewForm }) {
  const [formName, setFormName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();

  const handleCreateForm = async () => {
    setIsLoading(true);
    try {
      await createNewForm({ name: formName, author: user });
      handleClose();
    } catch (error) {
      console.error("Error creating form:", error);
      // Optionally handle the error with a user notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Form</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Form Name"
          variant="outlined"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          fullWidth
          autoFocus
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" color="primary">
          Cancel
        </Button>
        <Button onClick={handleCreateForm} variant="contained" color="primary">
          {isLoading ? <CircularProgress size={24} /> : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
