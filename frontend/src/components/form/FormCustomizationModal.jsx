import React from "react";
import { Box, Paper, TextField, Modal } from "@mui/material";
import FormTab from "./FormTab";
import PreviewForm from "./PreviewForm";
import AddFieldForm from "./AddFieldForm";
import EditFieldForm from "./EditFieldForm";

function FormCustomizationModal({
  open,
  handleClose,
  fields,
  updateFieldCoordinate,
  handleAddNewField,
  sortedRows,
  getLastCoordinate,
  deleteField,
  updateField,
  formName,
  updateFormName,
}) {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "90vw",
          maxHeight: "90vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2, paddingBottom: 7
        }}
      >
        <Paper elevation={0}>
          <FormTab labels={["Preview Form", "Customize Fields", "Add Fields"]} > 
            <PreviewForm
              fields={fields}
              sortedRows={sortedRows}
              onClose={handleClose}
              formName={formName}
            />
            <EditFieldForm
              fields={fields}
              updateFieldCoordinate={updateFieldCoordinate}
              sortedRows={sortedRows}
              deleteField={deleteField}
              handleClose={handleClose}
              updateField={updateField}
              formName={formName}
              updateFormName={updateFormName}
            />
            <AddFieldForm
              handleAddNewField={handleAddNewField}
              getLastCoordinate={getLastCoordinate}
              currentFields={fields}
            />
          </FormTab>
        </Paper>
      </Box>
    </Modal>
  );
}

export default FormCustomizationModal;
