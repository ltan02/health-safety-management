import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Box,
  Checkbox,
  Typography,
} from "@mui/material";
import PreviewForm from "./PreviewForm";
import { useAuthContext } from "../../context/AuthContext";
import useForm from "../../hooks/useForm";

export default function DeleteFormModal({
  open,
  handleClose,
  deleteForm,
  form,
}) {
  const { sortedRows, groupedByRows } = useForm();
  const [formName, setFormName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { user } = useAuthContext();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      deleteForm();
      handleClose();
    } catch (error) {
      console.error("Error creating form:", error);
      // Optionally handle the error with a user notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Confirm Delete: {form.name}</DialogTitle>
      <DialogContent dividers style={{ maxWidth: 900, padding: "20px" }}>
        <Typography variant="h6" gutterBottom>
          Are you sure you want to delete this incident form?
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Last added: {form.dateAdded}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Last modified: {form.dateModified}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Preview:
        </Typography>
        <Box
          mb={2}
          border={1}
          borderColor="grey.300"
          borderRadius={2}
          sx={{
            overflow: "auto",
            height: 540,
          }}
        >
          <PreviewForm
            fields={form.fields}
            sortedRows={() => sortedRows(groupedByRows(form.fields))}
            formName={form.name}
            formHeight={50}
          />
        </Box>
        <Typography variant="subtitle1" color="textSecondary">
          This action cannot be undone.
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" fontWeight={600}>
          I understand the consequences of deleting this form.
          <Checkbox
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="secondary"
          autoFocus
          disabled={!isChecked}
        >
          {isLoading ? <CircularProgress size={24} /> : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
