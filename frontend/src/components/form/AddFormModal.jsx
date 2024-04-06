import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Checkbox,
  Typography,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { useAuthContext } from "../../context/AuthContext";

export default function AddFormModal({ open, handleClose, createNewForm }) {
  const [formName, setFormName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [isAiChecked, setIsAiChecked] = useState(false);
  const { user } = useAuthContext();

  const handleCreateForm = async () => {
    setIsLoading(true);
    try {
      await createNewForm(
        { name: formName, author: user, description: description },
        isAiChecked
      );
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
          required
          margin="dense"
        />
        <TextField
          label="Description"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={4}
          placeholder="Enter a description for the form. Based on the description, fields will be automatically generated if AI is enabled."
          margin="dense"
        />
        <Grid container spacing={2} alignItems="center" sx={{ mt: 2, mb: 2 }}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isAiChecked}
                  onChange={(e) => setIsAiChecked(e.target.checked)}
                  color="primary"
                />
              }
              label="Use AI to generate fields based on the description."
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleCreateForm}
          variant="contained"
          color="primary"
          disabled={isLoading || !formName}
        >
          {isLoading ? <CircularProgress size={24} /> : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
