import { Modal, Box, Typography, Button } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

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

function ConfirmDeleteIncidentModal({ open, handleClose, handleDelete }) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="save-changes-modal-title"
            aria-describedby="save-changes-modal-description"
        >
            <Box sx={style}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <ErrorIcon sx={{ color: "#C9372C", marginRight: 2 }} />
                    <Typography id="save-changes-modal-title" variant="h6" component="h2">
                        Delete incident?
                    </Typography>
                </div>

                <Typography
                    id="save-changes-modal-description"
                    sx={{ fontWeight: 400, fontSize: "15px", marginTop: 2 }}
                >
                    You&apos;re about to permanently delete this issue, its comments and attachments, and all of its
                    data.
                    <br />
                    <br />
                    If you&apos;re not sure, you can resolve or close this issue instead.
                </Typography>

                <div style={{ display: "flex", justifyContent: "end" }}>
                    <Button onClick={handleClose} variant="outlined" sx={{ mt: 3 }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        sx={{ mt: 3, ml: 2, backgroundColor: "#C9372C", color: "#FFF" }}
                    >
                        Delete
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}

export default ConfirmDeleteIncidentModal;
