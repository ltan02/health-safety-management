import React from "react";
import { Box, Paper, TextField, Modal } from "@mui/material";
import FormTab from "./FormTab";
import PreviewForm from "./PreviewForm";
import AddFieldForm from "./AddFieldForm";

function FormCustomizationModal({ open, handleClose }) {
  return (
    <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "auto", maxWidth: "90vw", bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: 2 }}>
            <Paper elevation={3} sx={{ width: "80vw" }}>
                <FormTab labels={["Preview", "Customize", "Edit"]}>
                    <PreviewForm />
                    <AddFieldForm />
                    <PreviewForm />
                </FormTab>
            </Paper>
        </Box>
    </Modal>
  );
}

export default FormCustomizationModal;
