import React from "react";

import Typography from "@mui/material/Typography";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  OutlinedInput,
  Chip,
  
} from "@mui/material";

import AddInputField from "./AddInputField";
import AddSelectionField from "./AddSelectionField";
import AddFileField from "./AddFileField";

export const FIELD_TYPES = {
  TEXT_FIELD: "text",
  TEXT_BOX: "text-box",
  NUMBER_FIELD: "number",
  DATETIME_LOCAL: "datetime-local",
  SELECTION_MULTI: "selection-multi",
  SELECTION_SINGLE: "selection-single",
  FILE_ATTACHMENT: "file",
  EMPTY: "empty",
  //   DESCRIPTION: "description",
  // HEADING_1: "heading-1",
  // HEADING_2: "heading-2",
  // HEADING_3: "heading-3",
};

export const FIELD_DATA = {
  [FIELD_TYPES.TEXT_FIELD]: {
    id: FIELD_TYPES.TEXT_FIELD,
    label: "Text Field",
    description: "A single line of text",
  },
  [FIELD_TYPES.TEXT_BOX]: {
    id: FIELD_TYPES.TEXT_BOX,
    label: "Text Box",
    description: "A multi-line text input",
  },
  [FIELD_TYPES.NUMBER_FIELD]: {
    id: FIELD_TYPES.NUMBER_FIELD,
    label: "Number Field",
    description: "A number input",
  },
  [FIELD_TYPES.DATETIME_LOCAL]: {
    id: FIELD_TYPES.DATETIME_LOCAL,
    label: "Date and Time",
    description: "A date and time input",
  },
  [FIELD_TYPES.SELECTION_MULTI]: {
    id: FIELD_TYPES.SELECTION_MULTI,
    label: "Multi-Select",
    description: "Select multiple options",
  },
  [FIELD_TYPES.SELECTION_SINGLE]: {
    id: FIELD_TYPES.SELECTION_SINGLE,
    label: "Single-Select",
    description: "Select a single option",
  },
  [FIELD_TYPES.FILE_ATTACHMENT]: {
    id: FIELD_TYPES.FILE_ATTACHMENT,
    label: "File Attachment",
    description: "Upload a file",
  },
};

export const VARIANT_TYPES = {
  OUTLINED: "outlined",
  STANDARD: "standard",
  TEXT: "text",
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

export const FIELD_ADD_FORM = {
  [FIELD_TYPES.TEXT_FIELD]: ({onTitleChange, onDescriptionChange, onPlaceHolderChange, onRequiredChange})=> (
    <AddInputField type={FIELD_TYPES.TEXT_FIELD} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} onPlaceHolderChange={onPlaceHolderChange} onRequiredChange={onRequiredChange}/>
  ),
  [FIELD_TYPES.TEXT_BOX]: ({onTitleChange, onDescriptionChange, onPlaceHolderChange, onRequiredChange})=> (
    <AddInputField type={FIELD_TYPES.TEXT_BOX} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} onPlaceHolderChange={onPlaceHolderChange} onRequiredChange={onRequiredChange}/>
  ),
  [FIELD_TYPES.NUMBER_FIELD]: ({onTitleChange, onDescriptionChange, onPlaceHolderChange, onRequiredChange})=> (
    <AddInputField type={FIELD_TYPES.NUMBER_FIELD} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} onPlaceHolderChange={onPlaceHolderChange} onRequiredChange={onRequiredChange}/>
  ),
  [FIELD_TYPES.DATETIME_LOCAL]: ({onTitleChange, onDescriptionChange, onPlaceHolderChange, onRequiredChange})=> (
    <AddInputField type={FIELD_TYPES.DATETIME_LOCAL} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} onPlaceHolderChange={onPlaceHolderChange} onRequiredChange={onRequiredChange}/>
  ),
  [FIELD_TYPES.SELECTION_MULTI]: ({onTitleChange, onDescriptionChange, onOptionChange})=> (
    <AddSelectionField type={FIELD_TYPES.SELECTION_MULTI} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} onOptionChange={onOptionChange}/>
  ),
  [FIELD_TYPES.SELECTION_SINGLE]: ({onTitleChange, onDescriptionChange, onOptionChange})=> (
    <AddSelectionField type={FIELD_TYPES.SELECTION_SINGLE} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} onOptionChange={onOptionChange}/>
  ),
  [FIELD_TYPES.FILE_ATTACHMENT]: ({onTitleChange, onDescriptionChange, onPlaceHolderChange, onRequiredChange})=> (
    <AddFileField type={FIELD_TYPES.FILE_ATTACHMENT} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} onPlaceHolderChange={onPlaceHolderChange} onRequiredChange={onRequiredChange}/>

  )
}
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
  {
    id: 4,
    type: FIELD_TYPES.SELECTION_MULTI,
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

export const DEFAULT_DATA_SECOND = [
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
];

export const FIELD_DATA_LIST = [
  {
    "id": "0",
    "formData": DEFAULT_DATA,
    "name": "Incident Form",
    "author": "Admin",
    "dateAdded": "2022-10-31",
    "lastUpdated": "2022-10-31",
  },
  {
    "id": "1",
    "formData": DEFAULT_DATA_SECOND,
    "name": "Incident Form2",
    "author": "something",
    "dateAdded": "2022-10-31",
    "lastUpdated": "2022-10-31",
  }
]
