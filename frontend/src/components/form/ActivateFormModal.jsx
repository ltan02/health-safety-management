import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Typography,
} from "@mui/material";

export default function AddFormModal({
  open,
  handleClose,
  toggleForm,
  activeForm,
  selectedForm,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleActivateForm = async () => {
    setIsLoading(true);
    try {
      await toggleForm();
      handleClose();
    } catch (error) {
      console.error("Error creating form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Activate Form: <strong>{selectedForm?.name}</strong>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" gutterBottom>
          Activating this form will result in the inactivation of the currently
          active form: <strong>{activeForm?.name}</strong>. Do you want to
          proceed?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleActivateForm}
          variant="contained"
          color="primary"
          autoFocus
        >
          {isLoading ? <CircularProgress size={24} /> : "Activate"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
