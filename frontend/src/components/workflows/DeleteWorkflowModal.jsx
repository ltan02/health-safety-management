import { Modal, Box, Typography, Button } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 350,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
    outline: "none",
    height: "17.5%",
};

function DeleteWorkflowModal({ open, handleClose, handleDeleteWorkflow }) {
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
                        Are you sure you want to delete?
                    </Typography>
                </div>

                <Typography
                    id="delete-workflow-modal-description"
                    sx={{ fontWeight: 400, fontSize: "15px", marginTop: 2 }}
                >
                    You will not be able to recover the workflow once it is deleted.
                </Typography>

                <div style={{ display: "flex", justifyContent: "end" }}>
                    <Button onClick={handleDeleteWorkflow} variant="contained" sx={{ mt: 3, mr: 2 }}>
                        Delete
                    </Button>
                    <Button onClick={handleClose} variant="outlined" sx={{ mt: 3 }}>
                        Cancel
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}

export default DeleteWorkflowModal;
