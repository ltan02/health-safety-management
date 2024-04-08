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
};

function DiscardChangesModal({ open, handleClose, handleDiscardChanges }) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="discard-changes-modal-title"
            aria-describedby="discard-changes-modal-description"
        >
            <Box sx={style}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <WarningIcon sx={{ color: "warning", marginRight: 2 }} />
                    <Typography id="discard-changes-modal-title" variant="h6" component="h2">
                        Are you sure you want to leave?
                    </Typography>
                </div>

                <Typography
                    id="discard-changes-modal-description"
                    sx={{ fontWeight: 400, fontSize: "15px", marginTop: 2 }}
                >
                    You&apos;ll lose any changes you made to your workflow.
                </Typography>

                <div style={{ display: "flex", justifyContent: "end" }}>
                    <Button onClick={handleDiscardChanges} variant="contained" sx={{ mt: 3, mr: 2 }}>
                        Leave
                    </Button>
                    <Button onClick={handleClose} variant="outlined" sx={{ mt: 3 }}>
                        Stay
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}

export default DiscardChangesModal;
