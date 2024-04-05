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
import useAxios from "../../../hooks/useAxios";

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
    updateForm
  } = useForm();

  const { sendAIRequest } = useAxios();
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

  const handleCreateForm = async (form, isAiChecked) => {
    try {
    const newForm = await createNewForm(form);
    if (isAiChecked) {

      const newFields = await generateFields(0, newForm);
      if(newFields.length === 0){
        return;
      }
      
      let x = 0;
      let y = 2;
      newFields.forEach((field, index) => {
        newFields[index]["coordinate"] = {
          x: x,
          y: y,
        };
        if(x === 0){
          x = 1;
        } else {
          x = 0;
          y++;
        }
      })

      newForm.fields = [...newForm.fields, ...newFields]
      await updateForm(newForm)
    } 
    } catch (error) {
      console.error("Error creating new form:", error);
    } finally {
      await fetchForms();
    }
  };

  const generateFields = async (count=0, form) => {
    if(count > 3) {
      return [];
    }
    try{
      const newField =
        '\n\n{\n  "fields": [\n    {\n      "name": null,\n      "type": "description",\n      "props": {\n        "label": "Description of the incident",\n        "name": "description",\n        "required": false,\n        "description": "A brief summary outlining the key events and outcomes of the incident.",\n        "options": null\n      }\n    },\n    {\n      "name": null,\n      "type": "datetime-local",\n      "props": {\n        "label": "Time Of Incident",\n        "name": "incidentDate",\n        "required": true,\n        "description": "The precise date and time when the incident took place, in YYYY/MM/DD HH:MM format.",\n        "options": null\n      }\n    },\n    \n    {\n      "name": null,\n      "type": "text-box",\n      "props": {\n        "label": "Actions Taken",\n        "name": "actions_taken",\n        "required": false,\n        "placeholder": "First aid was applied etc.",\n        "description": "Immediate response actions taken following the incident, including first aid or emergency services contacted.",\n        "options": null\n      }\n    },\n    {\n      "name": "Preventive Measures",\n      "type": "text-box",\n      "props": {\n        "label": "Preventive Measures",\n        "name": "preventive_measures",\n        "required": true,\n        "description": "Proposed steps and strategies to prevent similar incidents in the future.",\n        "options": []\n      }\n    },\n    {\n      "name": "Existing Barriers",\n      "type": "text-box",\n      "props": {\n        "label": "Existing Barriers",\n        "name": "existing_barriers",\n        "required": true,\n        "description": "Pre-existing safety measures or protocols in place at the time of the incident.",\n        "options": []\n      }\n    },\n    {\n      "name": null,\n      "type": "selection-single",\n      "props": {\n        "label": "Category",\n        "required": true,\n        "description": "The specific type of incident, such as a workplace injury or equipment failure.",\n        "options": [\n          {\n            "label": "test",\n            "value": "test"\n          },\n          {\n            "label": "Minor",\n            "value": "minor"\n          },\n          {\n            "label": "Major",\n            "value": "major"\n          }\n        ]\n      }\n    }\n  ]\n}\n';
      const res = await sendAIRequest({
        url: "/generate",
        method: "POST",
        body: {
          prompt:
            "Create a list of JSON for Incident Report for the following: [" +
            form.description +
            "]. Generate the VALID JSON by following the data format given. REPLACE the value of name, label, options, description:" +
            newField,
        },
      });
      console.log(res);

      // console.log(extractAndParseJson(res.response));
      const newFields = JSON.parse(res.response)?.fields
      return checkTypeValidity(newFields)
    } catch (error) {
      console.error("Error generating fields:", error);
      return generateFields(count + 1, form);
    }
  };

  const checkTypeValidity = (newFields) => {
    const validType = ["text-box", "selection-single", "selection-multi"];
    const validFields = newFields.filter((field) => validType.includes(field.type));
    return validFields;

  };

  const extractAndParseJson = (inputString) => {
    // Regular expression to find code block with optional 'json' language identifier
    const codeBlockRegex = /```json\s*([\s\S]*?)```/g;

    // Attempt to find and extract JSON string from the input
    const matches = codeBlockRegex.exec(inputString);

    if (matches && matches[1]) {
      // Attempt to parse the extracted JSON string
      try {
        const parsedJson = JSON.parse(matches[1]);
        console.log("Parsed JSON:", parsedJson);
        return parsedJson;
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        return null;
      }
    } else {
      console.error("No JSON found in input string.");
      return null;
    }
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
                    disabled={forms[formId].active}
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
