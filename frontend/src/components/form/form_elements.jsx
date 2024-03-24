import React from "react";
import {
  FormControl,
  TextField,
  Typography,
  Select,
  MenuItem,
  Chip,
  Box,
  Tooltip,
} from "@mui/material";

import styled from "@emotion/styled";

import { useDropzone } from 'react-dropzone';
import { FIELD_TYPES, VARIANT_TYPES } from "./form_data";

const FileDropzone = (props) => {
  const {getRootProps, getInputProps} = useDropzone({
    onDrop: (acceptedFiles) => {
      //handle file upload
    },
  });

  return (
    <Box {...getRootProps()} style={{ border: '1px solid orange', textAlign: 'center', opacity: 0.5, borderRadius: 5 }}>
      <input {...getInputProps()} />
      <Typography sx={{
        color: 'orange',
        fontSize: '1rem',
        padding: '20px',
        cursor: 'pointer',
      }} variant={VARIANT_TYPES.BODY}>+</Typography>
    </Box>
  );
};


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
    <FormControl fullWidth {...props} style={{minHeight: 100}}>
      <Typography fontWeight={600} variant={VARIANT_TYPES.LABEL}>
        {label}
        {required ? "*" : ""}
      </Typography>
      <Typography variant={VARIANT_TYPES.BODY}> {description} </Typography>
      <TextField
        onChange={onChange}
        name={name}
        required={required}
        placeholder={placeholder}
        variant={VARIANT_TYPES.STANDARD}
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
    <FormControl fullWidth {...props} >
      <Typography fontWeight={600} variant={VARIANT_TYPES.LABEL}>
        {label}
        {required ? "*" : ""}
      </Typography>
      <Typography variant={VARIANT_TYPES.BODY}>{description}</Typography>
      <TextField
        onChange={onChange}
        name={name}
        required={required}
        placeholder={placeholder}
        multiline
        rows={rows}
        variant={VARIANT_TYPES.STANDARD}
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
      <Typography fontWeight={600} variant={VARIANT_TYPES.LABEL}>
        {label}
        {required ? "*" : ""}
      </Typography>
      <Typography variant={VARIANT_TYPES.BODY}>{description}</Typography>
      <TextField
        {...props}
        type="number"
        name={name}
        required={required}
        onChange={onChange}
        variant={VARIANT_TYPES.STANDARD}
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
      <Typography fontWeight={600} variant={VARIANT_TYPES.LABEL}>
        {label}
        {required ? "*" : ""}
      </Typography>
      <Typography variant={VARIANT_TYPES.BODY}>{description}</Typography>
      <TextField
        {...props}
        type="datetime-local"
        onChange={onChange}
        required={required}
        value={value}
        variant={VARIANT_TYPES.STANDARD}
        disabled={props.disabled}
        style={{
          paddingLeft: 0,
          marginTop: 35,
        }}
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
    <FormControl fullWidth {...props} variant={VARIANT_TYPES.STANDARD} margin="normal">
      <Typography  fontWeight={600} variant={VARIANT_TYPES.LABEL} gutterBottom>
        {label}
        {required ? "*" : ""}
      </Typography>
      <Typography variant={VARIANT_TYPES.BODY} gutterBottom>
        {description}
      </Typography>
      <Select
        labelId="multi-select-label"
        name={name}
        multiple
        value={value}
        onChange={onChange}
        required={required}
        // input={<OutlinedInput label={label} />}
        renderValue={(selected) => (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip
                key={value}
                label={
                  options.find((option) => option.value === value)?.label ||
                  value
                }
              />
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
    <FormControl fullWidth {...props} variant={VARIANT_TYPES.STANDARD} margin="normal">
      <Typography fontWeight={600} variant={VARIANT_TYPES.LABEL}>
        {label}
        {required ? "*" : ""}
      </Typography>
      <Typography variant={VARIANT_TYPES.BODY}>{description}</Typography>
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
      <Typography variant={VARIANT_TYPES.LABEL} fontWeight={600}>
        {label}
      </Typography>
      <Typography variant={VARIANT_TYPES.BODY}>{description}</Typography>
      <FileDropzone
        {...props}
        disabled={props.disabled}
      />
    </FormControl>
  ),
  [FIELD_TYPES.EMPTY]: () => <></>,
};
