import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import { useState } from "react";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 550,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
    outline: "none",
    display: "flex",
    flexDirection: "column",
};

function AddStatusModal({ open, handleClose, statusName, handleStatusNameChange, handleAddStatus, states }) {
    const [showError, setShowError] = useState(false);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="add-status-modal-title"
            aria-describedby="add-status-modal-description"
        >
            <Box sx={style}>
                <Typography id="add-status-modal-title" variant="h6" component="h2">
                    Add a status
                </Typography>
                <Typography id="add-status-modal-description" variant="body" sx={{ fontSize: "14px" }}>
                    Statuses represent the various stages within your incident report workflow. Each status indicates
                    the current state of an incident report as it progresses through your team&apos;s resolution
                    process. <br />
                    <br />
                    Adding additional statuses allows you to clearly define and track each step of the workflow, from
                    initial report to final resolution. For example, statuses like &quot;Reported&quot;, &quot;In
                    Review&quot;, or &quot;Resolved&quot; can provide immediate insight into the incident&apos;s
                    handling stage.
                </Typography>
                <TextField
                    id="outlined-number"
                    label="Create status"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    sx={{ marginTop: 5 }}
                    value={statusName}
                    onChange={handleStatusNameChange}
                />
                <Typography id="add-status-modal-title" variant="body2" sx={{ fontSize: "12px" }}>
                    Try a name that&apos;s easy to understand e.g. To do
                </Typography>
                {showError && (
                    <Typography variant="body2" sx={{ color: "red", marginTop: "10px" }}>
                        Status already exists. Please try a different name.
                    </Typography>
                )}
                <div style={{ display: "flex", justifyContent: "end" }}>
                    <Button
                        onClick={() => {
                            if (states.some((state) => state.data.label === statusName)) {
                                setShowError(true);
                            } else {
                                handleAddStatus();
                            }
                        }}
                        variant="outlined"
                        sx={{ mt: 2, mr: 2 }}
                        disabled={statusName === ""}
                    >
                        Add
                    </Button>
                    <Button onClick={handleClose} variant="outlined" sx={{ mt: 2 }}>
                        Cancel
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}

export default AddStatusModal;
