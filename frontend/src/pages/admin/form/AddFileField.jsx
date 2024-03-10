import React from 'react';
import { FormControl, TextField, Typography } from '@mui/material';
import { VARIANT_TYPES } from './initial_form';

function AddFileField({
  type,
  onTitleChange,
  onDescriptionChange,
}) {
  return (
    <FormControl fullWidth margin="normal">
      <TextField
        onChange={onTitleChange}
        variant={VARIANT_TYPES.STANDARD}
        placeholder="Title"
        required
        margin="dense"
        fullWidth
        label="Title"
      />
      <TextField
        onChange={onDescriptionChange}
        variant={VARIANT_TYPES.STANDARD}
        placeholder="Description (optional)"
        margin="dense"
        fullWidth
        label="Description"
      />
      <TextField
        placeholder={`${type.charAt(0).toUpperCase() + type.slice(1)} type field`}
        variant={VARIANT_TYPES.OUTLINED}
        margin="dense"
        fullWidth
        InputProps={{
          readOnly: true,
        }}
        type='file'
        disabled
        helperText={`This is a preview of a ${type} field.`}
      />
    </FormControl>
  );
}

export default AddFileField;
