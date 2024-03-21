import { Modal, Box, Typography, Button } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
    outline: "none",
    height: "17.5%",
};

function ActiveWorkflowModal({ open, handleClose, handleSetActive }) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="delete-workflow-modal-title"
            aria-describedby="delete-workflow-modal-description"
        >
            <Box sx={style}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <WarningIcon sx={{ color: "warning", marginRight: 2 }} />
                    <Typography id="delete-workflow-modal-title" variant="h6" component="h2">
                        Are you sure you want to set active?
                    </Typography>
                </div>

                <Typography
                    id="delete-workflow-modal-description"
                    sx={{ fontWeight: 400, fontSize: "15px", marginTop: 2 }}
                >
                    All incomplete incident reports will move to the starting status of this workflow.
                </Typography>

                <div style={{ display: "flex", justifyContent: "end" }}>
                    <Button onClick={handleSetActive} variant="contained" sx={{ mt: 3, mr: 2 }}>
                        Confirm
                    </Button>
                    <Button onClick={handleClose} variant="outlined" sx={{ mt: 3 }}>
                        Cancel
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}

export default ActiveWorkflowModal;
