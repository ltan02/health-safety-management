import { Modal, Box, Typography, Button } from "@mui/material";

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
    height: "50%",
};

function AddStatusModal({ open, handleClose }) {
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
                <div style={{ display: "flex", justifyContent: "end" }}>
                    <Button onClick={handleClose} variant="outlined" sx={{ mt: 2 }}>
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
