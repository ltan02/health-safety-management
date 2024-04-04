import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Typography,
} from "@mui/material";
import { VARIANT_TYPES } from "./form_data";
import { useState } from "react";

function AddInputField({
  onTitleChange,
  onDescriptionChange,
  onPlaceHolderChange,
  onRequiredChange,
  initialTitle,
  initialDescription,
  initialPlaceHolder,
  onReferenceFieldChange,
  onPromptChange,
  initialRequired,
  currentFields,
  initialPrompt,
  initialReferenceField,
}) {
  let textFields = [];
  textFields = currentFields.filter((field) => field.type === "text-box");
  return (
    <Box margin="normal" sx={{ gap: 1 }}>
      <TextField
        onChange={onTitleChange}
        variant={VARIANT_TYPES.STANDARD}
        placeholder="Title"
        required
        margin="dense"
        fullWidth
        label="Title"
        defaultValue={initialTitle}
      />
      <TextField
        onChange={onDescriptionChange}
        variant={VARIANT_TYPES.STANDARD}
        placeholder="Description (optional)"
        margin="dense"
        fullWidth
        label="Description (optional)"
        defaultValue={initialDescription}
      />
      <TextField
        onChange={onPlaceHolderChange}
        variant={VARIANT_TYPES.STANDARD}
        placeholder="Placeholder (optional)"
        margin="dense"
        fullWidth
        label="Placeholder (optional)"
        defaultValue={initialPlaceHolder}
      />
      <Box sx={{ marginTop: 2 }}>
        <InputLabel id="reference-field">Reference Field</InputLabel>
        <Select
          fullWidth
          variant={VARIANT_TYPES.STANDARD}
          label="Reference Field"
          placeholder="Reference Field"
          sx={{ marginTop: 2 }}
          id="reference-field"
          onChange={(e) => onReferenceFieldChange(e.target.value)}
          defaultValue={initialReferenceField}
          required
        >
          {textFields.map((field) => (
            <MenuItem key={field.id} value={field.id}>
              <Typography variant={VARIANT_TYPES.LABEL} fontWeight={600}>
                {field.props.label}
              </Typography>

              {/* <Typography variant={VARIANT_TYPES.BODY}>
                {field.props.description.split(" ").slice(0, 30).join(" ")}
                ...
              </Typography> */}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <TextField
        variant={VARIANT_TYPES.STANDARD}
        label="Prompt"
        multiline
        rows={3}
        onChange={onPromptChange}
        fullWidth
        required
        defaultValue={initialPrompt}
      />
      <Select
        fullWidth
        variant={VARIANT_TYPES.STANDARD}
        onChange={onRequiredChange}
        label="Required"
        defaultValue={true}
        sx={{ marginTop: 2 }}
      >
        <MenuItem value={true}>Required</MenuItem>
        <MenuItem value={false}>Optional</MenuItem>
      </Select>
    </Box>
  );
}

export default AddInputField;
