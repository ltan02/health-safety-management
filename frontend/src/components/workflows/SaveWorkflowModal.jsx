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
    height: "15%",
};

function SaveWorkflowModal({ open, handleClose, handleSaveChanges }) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="save-changes-modal-title"
            aria-describedby="save-changes-modal-description"
        >
            <Box sx={style}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <WarningIcon sx={{ color: "warning", marginRight: 2 }} />
                    <Typography id="save-changes-modal-title" variant="h6" component="h2">
                        Save workflow for incident reports
                    </Typography>
                </div>

                <Typography
                    id="save-changes-modal-description"
                    sx={{ fontWeight: 400, fontSize: "15px", marginTop: 2 }}
                >
                    Changes to this workflow will apply to all the incident reports.
                </Typography>

                <div style={{ display: "flex", justifyContent: "end" }}>
                    <Button onClick={handleSaveChanges} variant="contained" sx={{ mt: 3, mr: 2 }}>
                        Save
                    </Button>
                    <Button onClick={handleClose} variant="outlined" sx={{ mt: 3 }}>
                        Cancel
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}

export default SaveWorkflowModal;
