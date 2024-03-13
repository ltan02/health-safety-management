import React, { useState } from "react";
import { Button, Modal, Box, TextField, Typography, Grid } from "@mui/material";

function AddStateModal({
  handleFieldSubmit,
  handleClose,
  open,
  selectedStatus,
}) {
  const [name, setName] = useState("");

  const handleSubmit = (event, name) => {
    event.preventDefault();
    handleFieldSubmit(name);
    setName("");
    handleClose();
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom component="h2">
          Add {selectedStatus?.name} State
        </Typography>
        <form onSubmit={(event) => handleSubmit(event, name)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="name"
                label="State Name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid container sx={{
              justifyContent: "space-between"
            }}>
              <Grid item>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Add State
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={handleClose}
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
}

export default AddStateModal;
