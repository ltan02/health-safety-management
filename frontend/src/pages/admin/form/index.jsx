import React, { useEffect, useState } from "react";
import {
  Container,
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

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FormCustomizationModal from "../../../components/form/FormCustomizationModal";
import useForm from "../../../hooks/useForm";

function AdminForm() {
  const {
    fetchForms,
    forms,
    updateAllFieldCoordinates,
    addField,
    sortedRows,
    groupedByRows,
    getLastCoordinate,
    deleteField,
    updateField,
  } = useForm();
  const [fields, setFields] = useState({});
  const [selectingForm, setSelectingForm] = useState({});

  const [open, setOpen] = useState(false);

  const handleOpen = (form) => {
    setSelectingForm(form);
    setOpen(true);
    setFields(form.fields);
  };

  const handleClose = () => {
    setOpen(false);
    setFields({});
  };

  const handleUpdateCoordinate = async (fieldsData) => {
    await updateAllFieldCoordinates(selectingForm.id, fieldsData);
    await fetchForms();
  };

  const handleAddNewField = async (fieldData) => {
    await addField(selectingForm.id, fieldData);
    await fetchForms();
  };

  const handleSort = () => {
    return sortedRows(groupedByRows(fields));
  };
  
  const handleDeleteField = async (fieldId) => { 
    await deleteField(selectingForm.id, fieldId);
    await fetchForms();
  }

  const handleUpdateField = async (fieldData) => {
    await updateField(selectingForm.id, fieldData);
    await fetchForms();
  }

  useEffect(() => {
    fetchForms();
  }, []);

  useEffect(() => {
    setFields(selectingForm.fields);
  }, [selectingForm]);

  useEffect(() => {
    if (selectingForm.id) {
      setSelectingForm(
        Object.values(forms).find((form) => form.id === selectingForm.id)
      )
    }
  }, [forms]);

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
                    onClick={() => {
                      handleOpen(forms[formId]);
                    }}
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
        updateField={handleUpdateField}
      />
    </Container>
  );
}

export default AdminForm;
