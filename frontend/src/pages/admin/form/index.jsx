import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  Container,
  Grid,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { styled } from "@mui/material/styles";
import FormCustomizationModal from "./FormCustomizationModal";
import useForm from "../../../hooks/useForm";

function AdminForm() {
  const {
    fetchForms,
    forms,
    updateFieldCoordinate,
    addField,
    sortedRows,
    groupedByRows,
    getLastCoordinate,
    deleteField,
  } = useForm();
  const [fields, setFields] = useState({});
  const [selectingForm, setSelectingForm] = useState({});

  const [open, setOpen] = useState(false);

  const handleOpen = (fields) => {
    setFields(fields);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdateCoordinate = (fieldId, coordinate) => {
    updateFieldCoordinate(selectingForm.id, fieldId, coordinate);
  };

  const handleAddNewField = (fieldData) => {
    addField(selectingForm.id, fieldData);
  };

  const handleSort = () => {
    return sortedRows(groupedByRows(fields));
  };
  
  const handleDeleteField = (fieldId) => { 
    deleteField(selectingForm.id, fieldId);
  }

  useEffect(() => {
    fetchForms();
  }, []);

  useEffect(() => {
    if (selectingForm.id) {
      handleOpen(selectingForm.fields);
    }
  }, [selectingForm]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "75vh", overflow: "auto" }}
      >
        <Table stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2">Id</Typography>
              </TableCell>
              <TableCell align="left">
                <Typography variant="subtitle2">Name</Typography>
              </TableCell>
              <TableCell align="left">
                <Typography variant="subtitle2">Author</Typography>
              </TableCell>
              <TableCell align="left">
                <Typography variant="subtitle2">Date Added</Typography>
              </TableCell>
              <TableCell align="left">
                <Typography variant="subtitle2">Last Updated</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2">Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(forms).map((formId) => (
              <TableRow key={forms[formId].id} hover>
                <TableCell component="th" scope="row">
                  <Typography variant="body2">{forms[formId].id}</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="body2">{forms[formId].name}</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="body2">
                    {forms[formId].author.firstName}{" "}
                    {forms[formId].author.secondName}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="body2">
                    {new Date(forms[formId].dateAdded).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="body2">
                    {new Date(forms[formId].dateModified).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => setSelectingForm(forms[formId])}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <FormCustomizationModal
        open={open}
        updateFieldCoordinate={handleUpdateCoordinate}
        handleClose={handleClose}
        fields={fields}
        handleAddNewField={handleAddNewField}
        sortedRows={handleSort}
        getLastCoordinate={() => getLastCoordinate(fields)}
        deleteField={handleDeleteField}
      />
    </Container>
  );
}

export default AdminForm;
