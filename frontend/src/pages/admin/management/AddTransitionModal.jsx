import React, { useState } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  Typography,
  Grid,
} from "@mui/material";

function AddTransitionModal({ handleFieldSubmit, handleClose, open, states, transitions }) {
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ name, from, to });
    handleFieldSubmit({
      label: name,
      source: from.id,
      target: to.id,
      type: "smoothstep",
    });
    setName("");
    setFrom("");
    setTo("");
    handleClose();
  };

  
  const findStateById = (id) => states.find((state) => state.id === id) || {};

  const isStateAlreadyConnected = (from, to) => {
    console.log(transitions)
    return transitions.some(
      (transition) =>
        transition.source === from.id && transition.target === to.id || transition.source === to.id && transition.target === from.id
    );
  };

  const style = {
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

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom component="h2">
          Add New Transition
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            required
            fullWidth
            id="name"
            label="Transition Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Select
            displayEmpty
            fullWidth
            value={from.id || ""}
            onChange={(e) => setFrom(findStateById(e.target.value))}
          >
            {states.map((state) => (
              <MenuItem
                key={state.id}
                value={state.id}
                disabled={state.id === to.id || isStateAlreadyConnected(state, to)}
              >
                {state.data.label}
              </MenuItem>
            ))}
          </Select>
          <Select
            displayEmpty
            fullWidth
            value={to.id || ""}
            onChange={(e) => setTo(findStateById(e.target.value))}
            margin="normal"
          >
            {states.map((state) => (
              <MenuItem
                key={state.id}
                value={state.id}
                disabled={state.id === from.id || isStateAlreadyConnected(from, state)}
              >
                {state.data.label}
              </MenuItem>
            ))}
          </Select>
          <Grid container sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
          
          }}>
            <Grid item>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Add Transition
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={handleClose}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddTransitionModal;
