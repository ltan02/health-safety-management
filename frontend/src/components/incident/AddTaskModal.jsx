import { Box, Modal } from "@mui/material";
import PreviewForm from "../form/PreviewForm";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "auto",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 7,
    borderRadius: 2,
    overflow: "auto",
    maxHeight: "90%",
    display: "flex",
    flexDirection: "column",
};

function AddTaskModal({ open, onClose, handleAddTask, field, sortedRows, formName }) {
    const handleSubmit = (field) => {
        handleAddTask(field);
        onClose();
    };
    return (
        <Modal
            open={open}
            onClose={() => {
                onClose();
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                {/*<Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>*/}
                {/*    Report New Incident*/}
                {/*</Typography>*/}
                <PreviewForm
                    fields={field}
                    sortedRows={sortedRows}
                    handleSubmit={handleSubmit}
                    onClose={onClose}
                    formName={formName}
                />
            </Box>
        </Modal>
    );
}

export default AddTaskModal;
