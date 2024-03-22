import React from "react";
import { Box, Paper, TextField, Modal } from "@mui/material";
import FormTab from "./FormTab";
import PreviewForm from "./PreviewForm";
import AddFieldForm from "./AddFieldForm";
import EditFieldForm from "./EditFieldForm";

function FormCustomizationModal({ open, handleClose, fields, updateFieldCoordinate, handleAddNewField, sortedRows, getLastCoordinate, deleteField}) {
  return (
    <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "auto", maxWidth: "90vw", bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: 2 }}>
            <Paper elevation={0} >
                <FormTab labels={["Preview Form", "Customize Fields", "Add Fields"]}>
                    <PreviewForm fields={fields} sortedRows={sortedRows} onClose={handleClose} />
                    <EditFieldForm fields={fields} updateFieldCoordinate={updateFieldCoordinate} sortedRows={sortedRows} deleteField={deleteField} handleClose={handleClose} />
                    <AddFieldForm handleAddNewField={handleAddNewField} getLastCoordinate={getLastCoordinate} />
                </FormTab>
            </Paper>
        </Box>
    </Modal>
  );
}

export default FormCustomizationModal;
