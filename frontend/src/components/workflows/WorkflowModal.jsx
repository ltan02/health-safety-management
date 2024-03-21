import { Modal, Box, Typography, Button, Divider } from "@mui/material";
import addStatusImage from "../../assets/addStatus.png";
import addTransitionImage from "../../assets/addTransition.png";
import editStatusImage from "../../assets/editStatus.png";

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
    height: "85%",
};

function WorkflowModal({ open, handleClose }) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="workflow-modal-title"
            aria-describedby="workflow-modal-description"
        >
            <Box sx={style}>
                <Typography id="workflow-modal-title" variant="h6" component="h2">
                    How to use the workflow diagram
                </Typography>
                <Box sx={{ width: "100%", height: "85%", overflowY: "scroll", marginTop: 2 }}>
                    <div style={{ display: "flex", marginTop: 2 }}>
                        <img src={addStatusImage} alt="addStatus" style={{ width: "100px", marginRight: 5 }} />
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <Typography id="workflow-modal-description" sx={{ fontWeight: 550, fontSize: "14px" }}>
                                Add a status
                            </Typography>
                            <ul style={{ fontSize: "14px", marginLeft: 50, marginTop: 10 }}>
                                <li>A modal will appear with information to fill out</li>
                            </ul>
                        </div>
                    </div>
                    <div style={{ display: "flex", marginTop: 2 }}>
                        <img src={addTransitionImage} alt="addTransition" style={{ width: "100px", marginRight: 5 }} />
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <Typography id="workflow-modal-description" sx={{ fontWeight: 550, fontSize: "14px" }}>
                                Add a transition
                            </Typography>
                            <ul style={{ fontSize: "14px", marginLeft: 50, marginTop: 10 }}>
                                <li>Use the toolbar or drag from the port of one status to another.</li>
                            </ul>
                        </div>
                    </div>
                    <div style={{ display: "flex", marginTop: 2 }}>
                        <img src={editStatusImage} alt="editStatus" style={{ width: "90px", height: "30px", marginRight: 15 }} />
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <Typography id="workflow-modal-description" sx={{ fontWeight: 550, fontSize: "14px" }}>
                                Edit a status or transition
                            </Typography>
                            <ul style={{ fontSize: "14px", marginLeft: 50, marginTop: 10 }}>
                                <li>
                                    To edit a status or transition, select it and change its details on the right panel.
                                </li>
                                <li>
                                    To delete a status or transition, select it on the workflow diagram and press{" "}
                                    <kbd>Delete</kbd>.
                                </li>
                            </ul>
                        </div>
                    </div>
                </Box>
                <Divider />
                <div style={{ display: "flex", justifyContent: "end" }}>
                    <Button onClick={handleClose} variant="outlined" sx={{ mt: 2 }}>
                        Close
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}

export default WorkflowModal;
