import React from 'react';
import { FormControl, TextField, Typography, Select, MenuItem, OutlinedInput, Chip } from '@mui/material';
import { FIELD_TYPES, VARIANT_TYPES } from './form_data';
export const FIELD_ELEMENT = {
  [FIELD_TYPES.TEXT_FIELD]: ({
    label,
    name,
    required,
    placeholder,
    description,
    onChange,
    ...props
  }) => (
    <FormControl fullWidth {...props}>
      <Typography variant={VARIANT_TYPES.LABEL}>{label}</Typography>
      <Typography variant={VARIANT_TYPES.BODY}> {description} {required ? "(Required)" : "(Optional)"}</Typography>
      <TextField
        onChange={onChange}
        name={name}
        required={required}
        placeholder={placeholder}
        variant={VARIANT_TYPES.OUTLINED}
        disabled={props.disabled}
      />
    </FormControl>
  ),
  [FIELD_TYPES.TEXT_BOX]: ({
    label,
    name,
    required,
    placeholder,
    description,
    onChange,
    rows = 3,
    ...props
  }) => (
    <FormControl fullWidth {...props}>
      <Typography variant={VARIANT_TYPES.LABEL}>{label}</Typography>
      <Typography variant={VARIANT_TYPES.BODY}>{description}{required ? "(Required)" : "(Optional)"}</Typography>
      <TextField
        onChange={onChange}
        name={name}
        required={required}
        placeholder={placeholder}
        multiline
        rows={rows}
        variant={VARIANT_TYPES.OUTLINED}
        disabled={props.disabled}
      />
    </FormControl>
  ),
  [FIELD_TYPES.NUMBER_FIELD]: ({
    label,
    name,
    required,
    description,
    onChange,
    ...props
  }) => (
    <FormControl fullWidth {...props}>
      <Typography variant={VARIANT_TYPES.LABEL}>{label}</Typography>
      <Typography variant={VARIANT_TYPES.BODY}>{description}{required ? "(Required)" : "(Optional)"}</Typography>
      <TextField
        {...props}
        type="number"
        name={name}
        required={required}
        onChange={onChange}
        variant={VARIANT_TYPES.OUTLINED}
        disabled={props.disabled}
      />
    </FormControl>
  ),
  [FIELD_TYPES.DATETIME_LOCAL]: ({
    label,
    description,
    onChange,
    value,
    required,
    ...props
  }) => (
    <FormControl fullWidth {...props}>
      <Typography variant={VARIANT_TYPES.LABEL}>{label}</Typography>
      <Typography variant={VARIANT_TYPES.BODY}>{description}{required ? "(Required)" : "(Optional)"}</Typography>
      <TextField
        {...props}
        type="datetime-local"
        onChange={onChange}
        required={required}
        value={value}
        variant={VARIANT_TYPES.OUTLINED}
        disabled={props.disabled}
      />
    </FormControl>
  ),
  [FIELD_TYPES.SELECTION_MULTI]: ({
    label,
    description,
    options,
    onChange,
    value,
    name,
    required,
    ...props
  }) => (
    <FormControl fullWidth {...props} variant="outlined" margin="normal">
      <Typography variant={VARIANT_TYPES.LABEL} gutterBottom>{label}</Typography>
      <Typography variant={VARIANT_TYPES.BODY} gutterBottom>{description}{required ? "(Required)" : "(Optional)"}</Typography>
      <Select
        labelId="multi-select-label"
        name={name}
        multiple
        value={value}
        onChange={onChange}
        required={required}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={options.find(option => option.value === value)?.label || value} />
            ))}
          </div>
        )}
        disabled={props.disabled}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 224,
              width: 250,
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  ),
  [FIELD_TYPES.SELECTION_SINGLE]: ({
    label,
    description,
    options,
    onChange,
    value,
    name,
    required,
    ...props
  }) => (
    <FormControl fullWidth {...props}>
      <Typography variant={VARIANT_TYPES.LABEL}>{label}</Typography>
      <Typography variant={VARIANT_TYPES.BODY}>{description}{required ? "(Required)" : "(Optional)"}</Typography>
      <Select
        labelId="single-select-label"
        value={value}
        onChange={onChange}
        name={name}
        disabled={props.disabled}
        required={required}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  ),
  [FIELD_TYPES.FILE_ATTACHMENT]: ({ label, description, ...props }) => (
    <FormControl fullWidth {...props}>
      <Typography variant={VARIANT_TYPES.LABEL}>{label}</Typography>
      <Typography variant={VARIANT_TYPES.BODY}>{description}</Typography>
      <TextField
        {...props}
        type="file"
        variant={VARIANT_TYPES.OUTLINED}
        disabled={props.disabled}
      />
    </FormControl>
  ),
  [FIELD_TYPES.EMPTY]: () => <></>,
  
};
