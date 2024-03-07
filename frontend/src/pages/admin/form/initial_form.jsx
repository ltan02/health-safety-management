import React from "react";

import Typography from "@mui/material/Typography";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

export const FIELD_TYPES = {
  TEXT_FIELD: "text",
  TEXT_BOX: "text-box",
  NUMBER_FIELD: "number",
  DATETIME_LOCAL: "datetime-local",
  SELECTION_MULTI: "selection-multi",
  SELECTION_SINGLE: "selection-single",
  FILE_ATTACHMENT: "file",
  //   DESCRIPTION: "description",
  // HEADING_1: "heading-1",
  // HEADING_2: "heading-2",
  // HEADING_3: "heading-3",
};

export const VARIANT_TYPES = {
  OUTLINED: "outlined",
  STANDARD: "standard",
  FILLED: "filled",
  LABEL: "h7",
  BODY: "body2",
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
    <FormControl fullWidth {...props}>
      <Typography variant={VARIANT_TYPES.LABEL}>{label}</Typography>
      <Typography variant={VARIANT_TYPES.BODY}>{description}</Typography>
      <TextField
        onChange={onChange}
        name={name}
        required={required}
        placeholder={placeholder}
        variant={VARIANT_TYPES.OUTLINED}
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
      <Typography variant={VARIANT_TYPES.BODY}>{description}</Typography>
      <TextField
        onChange={onChange}
        name={name}
        required={required}
        placeholder={placeholder}
        multiline
        rows={rows}
        variant={VARIANT_TYPES.OUTLINED}
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
      <Typography variant={VARIANT_TYPES.BODY}>{description}</Typography>
      <TextField
        {...props}
        type="number"
        name={name}
        required={required}
        onChange={onChange}
        variant={VARIANT_TYPES.OUTLINED}
      />
    </FormControl>
  ),
  [FIELD_TYPES.DATETIME_LOCAL]: ({
    label,
    description,
    onChange,
    value,
    ...props
  }) => (
    <FormControl fullWidth {...props}>
      <Typography variant={VARIANT_TYPES.LABEL}>{label}</Typography>
      <Typography variant={VARIANT_TYPES.BODY}>{description}</Typography>
      <TextField
        {...props}
        type="datetime-local"
        onChange={onChange}
        value={value}
        variant={VARIANT_TYPES.OUTLINED}
      />
    </FormControl>
  ),
  [FIELD_TYPES.SELECTION_MULTI]: ({
    label,
    description,
    options,
    onChange,
    value,
    ...props
  }) => (
    <FormControl fullWidth {...props}>
      <Typography variant={VARIANT_TYPES.LABEL}>{label}</Typography>
      <Typography variant={VARIANT_TYPES.BODY}>{description}</Typography>
      <InputLabel id="multi-select-label">{label}</InputLabel>
      <Select
        labelId="multi-select-label"
        multiple
        value={value}
        onChange={onChange}
        renderValue={(selected) => selected.join(", ")}
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
    ...props
  }) => (
    <FormControl fullWidth {...props}>
      <Typography variant={VARIANT_TYPES.LABEL}>{label}</Typography>
      <Typography variant={VARIANT_TYPES.BODY}>{description}</Typography>
      <Select
        labelId="single-select-label"
        value={value}
        onChange={onChange}
        name={name}
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
      <TextField {...props} type="file" variant={VARIANT_TYPES.OUTLINED} />
    </FormControl>
  ),
};
export const DEFAULT_DATA = [
  {
    id: 1,
    type: FIELD_TYPES.DATETIME_LOCAL,
    props: {
      label: "Time Of Incident",
      name: "time_of_incident",
      required: true,
    },
    coordinate: { x: 0, y: 0 },
  },
  {
    id: 2,
    type: FIELD_TYPES.TEXT_BOX,
    props: {
      label: "Location",
      name: "location",
      required: true,
      placeholder: "Warehouse, Office etc.",
      description: "The location in which the incident took place",
    },
    coordinate: { x: 0, y: 1 },
  },
  {
    id: 3,
    type: FIELD_TYPES.TEXT_BOX,
    props: {
      label: "Employee",
      name: "employee",
      required: true,
      description: "The employee involved in the incident",
    },
    coordinate: { x: 0, y: 2 },
  },
  // For 'Involvement Type', assuming you want to create radio buttons
  {
    id: 4,
    type: FIELD_TYPES.SELECTION_SINGLE,
    props: {
      label: "Involvement Type",
      name: "involvement_type",
      description: "The type of involvement in the incident",
      options: [
        { label: "Please select an option", value: "" },
        { label: "Employee", value: "employee" },
        { label: "Contractor", value: "contractor" },
        { label: "Other", value: "other" },
      ],
    },
    coordinate: { x: 0, y: 3 },
  },
  {
    id: 5,
    type: FIELD_TYPES.TEXT_BOX,
    props: {
      label: "Witnesses",
      name: "witnesses",
      required: false,
      placeholder: "Witnesses of the incident",
    },
    coordinate: { x: 0, y: 4 },
  },
  {
    id: 6,
    type: FIELD_TYPES.TEXT_BOX,
    props: {
      label: "Injury",
      name: "injury",
      rows: 3,
      required: false,
      placeholder: "Bruised shin etc.",
    },
    coordinate: { x: 0, y: 5 },
  },
  {
    id: 7,
    type: FIELD_TYPES.TEXT_BOX,
    props: {
      label: "Description of the incident",
      name: "description",
      rows: 3,
      required: false,
    },
    coordinate: { x: 1, y: 0 },
  },
  {
    id: 8,
    type: FIELD_TYPES.SELECTION_SINGLE,
    props: {
      label: "Category",
      name: "category",
      required: true,
      options: [
        { value: "", label: "Please select an option" },
        { value: "minor", label: "Minor" },
        { value: "major", label: "Major" },
        // Add other categories as needed
      ],
      defaultValue: "", // Default to 'Please select an option'
    },
    coordinate: { x: 1, y: 1 },
  },
  {
    id: 9,
    type: FIELD_TYPES.TEXT_BOX,
    props: {
      label: "Actions Taken",
      name: "actions_taken",
      required: false,
      placeholder: "First aid was applied etc.",
    },
    coordinate: { x: 1, y: 2 },
  },
  {
    id: 10,
    type: FIELD_TYPES.TEXT_BOX,
    props: {
      label: "Existing Barriers",
      name: "existing_barriers",
      required: false,
      placeholder: "i.e., weekly cleaning of floors in the office.",
    },
    coordinate: { x: 1, y: 4 },
  },
  {
    id: 11,
    type: FIELD_TYPES.TEXT_BOX,
    props: {
      label: "Preventative Measures",
      name: "preventative_measures",
      rows: 3,
      required: false,
      placeholder: "i.e., weekly cleaning of floors in the office.",
    },
    coordinate: { x: 1, y: 3 },
  },
];
