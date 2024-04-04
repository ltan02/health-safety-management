import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function StatusModal({ isStatusModalOpen, toggleStatusModal }) {
    return (
        <Modal
            open={isStatusModalOpen}
            onClose={toggleStatusModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    height: 150,
                    bgcolor: "white",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "flex-end",
                        bgcolor: "#FFB600",
                    }}
                >
                    <IconButton onClick={toggleStatusModal}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        padding: 2,
                        alignItems: "center",
                    }}
                >
                    <Typography variant="body1" align="center">
                        Status was successfully changed!
                    </Typography>
                    <Box sx={{ display: "inline-block", mt: 2, alignItems: "center" }}>
                        <Button variant="contained" onClick={toggleStatusModal} sx={{ borderRadius: 10 }}>
                            Close
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}
