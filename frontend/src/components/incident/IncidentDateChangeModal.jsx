import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
export default function IncidentDateChangeModal({
  open,
  onClose,
  loading,
  date,
  updateDate,
}) {
  const [newDate, setNewDate] = useState(date);
  const handleSubmit = () => {
    updateDate(newDate);
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Change Date
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Save"}
            </Button>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </Box>
        <Box sx={{ mb: 2, overflow: "auto", maxHeight: 180 }}>
          <TextField
            fullWidth
            type="datetime-local"
            variant="outlined"
            defaultValue={date}
            onChange={(e) => setNewDate(e.target.value)}
          />
        </Box>
      </Box>
    </Modal>
  );
}
