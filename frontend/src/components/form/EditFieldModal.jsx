import React, { useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Container,
  Grid,
} from "@mui/material";
import { useState } from "react";
import { FIELD_TYPES, VARIANT_TYPES } from "./form_data";
import { FIELD_ADD_FORM } from "./add_elements";
function EditFieldModal({
  open,
  setOpen,
  onHandleEdit,
  fieldData,
  fieldsData,
}) {
  const [title, setTitle] = useState(
    fieldData.props.label ? fieldData.props.label : ""
  );
  const [description, setDescription] = useState(
    fieldData.props.description ? fieldData.props.description : ""
  );
  const [select, setSelect] = useState(fieldData.type);
  const [required, setRequired] = useState(
    fieldData.props.required ? fieldData.props.required : false
  );
  const [options, setOptions] = useState(
    fieldData.props.options ? fieldData.props.options : []
  );
  const [placeholder, setPlaceholder] = useState(
    fieldData.props.placeholder ? fieldData.props.placeholder : ""
  );

  const [aiField, setAiField] = useState(
    fieldData.type === FIELD_TYPES.AI_TEXT ? fieldData.aiField : null
  );

  useEffect(() => {
    setTitle(fieldData.props.label);
    setDescription(fieldData.props.description);
    setSelect(fieldData.type);
    setRequired(fieldData.props.required);
    setOptions(fieldData.props.options);
    setPlaceholder(fieldData.props.placeholder);
    setAiField(
      fieldData.type === FIELD_TYPES.AI_TEXT ? fieldData.aiField : null
    );
  }, [fieldData]);

  const handleEdit = () => {
    if (title === "") {
      alert("Title is required");
      return;
    }
    onHandleEdit({
      label: title,
      description: description,
      type: select,
      required: required,
      options: options,
      placeholder: placeholder,
      aiField:
        fieldData.type === FIELD_TYPES.AI_TEXT
          ? { prompt: aiField.prompt, referenceId: aiField.referenceId }
          : null,
    });
    setOpen(false);
  };

  const reset = () => {
    setTitle(fieldData.props.label);
    setDescription(fieldData.props.description);
    setSelect(fieldData.type);
    setRequired(fieldData.props.required);
    setOptions(fieldData.props.options);
    setPlaceholder(fieldData.props.placeholder);
    setAiField(
      fieldData.type === FIELD_TYPES.AI_TEXT ? fieldData.aiField : null
    );
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };
  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition>
      <Container
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h5" fontWeight={500} align="center">
          Edit Field
        </Typography>
        {FIELD_ADD_FORM[select] ? (
          <>
            {FIELD_ADD_FORM[select]({
              onTitleChange: (e) => setTitle(e.target.value),
              onDescriptionChange: (e) => setDescription(e.target.value),
              onOptionChange: (option) => setOptions(option),
              onRequiredChange: (e) => setRequired(e.target.value),
              onPlaceHolderChange: (e) => setPlaceholder(e.target.value),
              onPromptChange: (e) =>
                setAiField({ ...aiField, prompt: e.target.value }),
              onReferenceFieldChange: (e) =>
                setAiField({ ...aiField, referenceId: e.target.value }),
              initialDescription: description,
              initialTitle: title,
              initialOptions: options,
              initialRequired: required,
              initialPlaceholder: placeholder,
              initialPrompt:
                fieldData.type === FIELD_TYPES.AI_TEXT ? aiField.prompt : "",
              initialReferenceField:
                fieldData.type === FIELD_TYPES.AI_TEXT
                  ? aiField.referenceId
                  : "",
              currentFields: fieldsData,
            })}
          </>
        ) : (
          <Typography
            variant="h6"
            align="center"
            fontWeight={600}
            sx={{ my: 5 }}
          >
            Select Field Type
          </Typography>
        )}
        <Box border={1} borderColor="grey.500" borderRadius={2} p={2} m={2}>
          <FormControl fullWidth>
            <Typography variant={VARIANT_TYPES.LABEL}>{title}</Typography>
            <Typography variant={VARIANT_TYPES.BODY}>
              {description} {required ? "(Required)" : "(Optional)"}
            </Typography>
            {select === FIELD_TYPES.SELECTION_SINGLE ||
            select === FIELD_TYPES.SELECTION_MULTI ? (
              <Select value={""} required={required}>
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            ) : select === FIELD_TYPES.FILE_ATTACHMENT ? (
              <TextField
                variant={VARIANT_TYPES.OUTLINED}
                margin="dense"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                type="file"
                disabled
                helperText={`This is a preview of a ${select} field.`}
              />
            ) : (
              <TextField
                placeholder={placeholder}
                disabled
                margin="dense"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                rows={3}
                helperText={`This is a preview of a ${select} field.`}
              />
            )}
          </FormControl>
        </Box>
        <Grid container justifyContent={"space-between"}>
          <Button variant="contained" color="primary" onClick={handleEdit}>
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Grid>
      </Container>
    </Modal>
  );
}

export default EditFieldModal;
