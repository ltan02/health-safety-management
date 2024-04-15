import { Box, Modal, Typography, Button } from "@mui/material";
import { useState } from "react";
import PreviewForm from "../form/PreviewForm";
import { set } from "lodash";

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

function AddTaskModal({
  open,
  onClose,
  handleAddTask,
  field,
  sortedRows,
  formName,
}) {
  const [cancelModal, setCancelModal] = useState(false);
  const handleSubmit = (field) => {
    handleAddTask(field);
    onClose();
  };
  const handleClose = () => {
    setCancelModal(true);
    console.log("cancel");
  };
  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
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
          onClose={() => setCancelModal(true)}
          formName={formName}
        />
        <Modal open={cancelModal} onClose={() => setCancelModal(false)}>
          <Box sx={modalStyle}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ mb: 2 }}
            >
              Are you sure you want to cancel?
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setCancelModal(false);
                onClose();
              }}
            >
              Yes
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setCancelModal(false)}
            >
              No
            </Button>
          </Box>
        </Modal>
      </Box>
    </Modal>
  );
}

export default AddTaskModal;
