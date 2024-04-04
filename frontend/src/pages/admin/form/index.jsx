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
  CircularProgress,
  Button,
  Box,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import ModeEditIcon from "@mui/icons-material/ModeEdit";
import FormCustomizationModal from "../../../components/form/FormCustomizationModal";
import useForm from "../../../hooks/useForm";
import AddFormModal from "../../../components/form/AddFormModal";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteFormModal from "../../../components/form/DeleteFormModal";
import ActivateFormModal from "../../../components/form/ActivateFormModal";

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
    loading,
    updateFormName,
    createNewForm,
    deleteForm,
    toggleForm,
  } = useForm();
  const [fields, setFields] = useState({});
  const [selectingForm, setSelectingForm] = useState({});

  const [open, setOpen] = useState(false);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [openDeleteForm, setOpenDeleteForm] = useState(false);
  const [openActiveForm, setOpenActiveForm] = useState(false);

  const handleEditModalOpen = (form) => {
    setSelectingForm(form);
    setOpen(true);
    setFields(form.fields);
  };

  const handleEditModalClose = () => {
    setOpen(false);
    setFields({});
  };

  const handleDeleteModalOpen = (form) => {
    setOpenDeleteForm(true);
    setSelectingForm(form);
  };

  const handleActivateModalOpen = (form) => {
    setOpenActiveForm(true);
    setSelectingForm(form);
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
    return sortedRows(groupedByRows(fields, 1));
  };

  const handleDeleteField = async (fieldId) => {
    await deleteField(selectingForm.id, fieldId);
    await fetchForms();
  };

  const handleUpdateField = async (fieldData) => {
    await updateField(selectingForm.id, fieldData);
    await fetchForms();
  };

  const handleUpdateFormName = async (formName) => {
    await updateFormName(selectingForm.id, formName);
    await fetchForms();
  };

  const handleCreateForm = async (form) => {
    await createNewForm(form);
    await fetchForms();
  };

  const openCreateFormModal = () => {
    setOpenCreateForm(true);
  };

  const handleDeleteForm = async () => {
    await deleteForm(selectingForm.id);
    await fetchForms();
    setSelectingForm({});
  };

  const handleActiveForm = async () => {
    await toggleForm(selectingForm.id);
    await fetchForms();
    setSelectingForm({});
  };

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
      );
    }
  }, [forms]);

  return (
    <Container sx={{ mt: 4 }}>
      <AddFormModal
        open={openCreateForm}
        handleClose={() => setOpenCreateForm(false)}
        createNewForm={handleCreateForm}
      />

      <DeleteFormModal
        open={openDeleteForm}
        handleClose={() => setOpenDeleteForm(false)}
        deleteForm={handleDeleteForm}
        form={selectingForm}
      />
      <ActivateFormModal
        open={openActiveForm}
        handleClose={() => setOpenActiveForm(false)}
        toggleForm={handleActiveForm}
        activeForm={Object.values(forms).find((form) => form.active)}
        selectedForm={selectingForm}
      />
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
              <TableCell align="center">
                <Typography variant="subtitle2">In Use</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="subtitle2">Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(forms).map((formId) => (
              <TableRow
                key={forms[formId].id}
                hover
                style={{
                  backgroundColor: forms[formId].active ? "#E8F5E9" : "inherit",
                }}
              >
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
                <TableCell align="center">
                  {forms[formId].active ? (
                    <Tooltip title="Active Form" arrow>
                      <CheckCircleIcon color="success" />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Inactive Form" arrow>
                      <IconButton
                        size="small"
                        onClick={() => handleActivateModalOpen(forms[formId])}
                      >
                        <CancelIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => handleEditModalOpen(forms[formId])}
                  >
                    <Tooltip title="Edit Form" arrow>
                      <ModeEditIcon />
                    </Tooltip>
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() => handleDeleteModalOpen(forms[formId])}
                  >
                    <Tooltip title="Delete Form" arrow>
                      <DeleteIcon />
                    </Tooltip>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CircularProgress
        sx={{
          display: loading ? "flex" : "none",
          mr: "auto",
          ml: "auto",
          mt: 5,
        }}
      />

      <FormCustomizationModal
        open={open}
        updateFieldCoordinate={handleUpdateCoordinate}
        handleClose={handleEditModalClose}
        fields={fields}
        handleAddNewField={handleAddNewField}
        sortedRows={handleSort}
        getLastCoordinate={() => getLastCoordinate(fields)}
        deleteField={handleDeleteField}
        updateField={handleUpdateField}
        formName={selectingForm.name}
        updateFormName={handleUpdateFormName}
        deleteForm={handleDeleteForm}
      />
      <Box sx={{ display: "flex", justifyContent: "right", mt: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={openCreateFormModal}
        >
          Add New Form
        </Button>
      </Box>
    </Container>
  );
}

export default AdminForm;
