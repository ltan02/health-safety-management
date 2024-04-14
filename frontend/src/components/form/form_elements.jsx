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
    Button, IconButton,
} from "@mui/material";

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import styled from "@emotion/styled";

import { useDropzone } from "react-dropzone";
import { FIELD_TYPES, VARIANT_TYPES } from "./form_data";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import InfoIcon from "@mui/icons-material/Info";

const FileDropzone = (props) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      //handle file upload
    },
  });

  return (
    <Box
      {...getRootProps()}
      style={{
        border: "1px solid orange",
        textAlign: "center",
        opacity: 0.5,
        borderRadius: 5,
      }}
    >
      <input {...getInputProps()} />
      <Typography
        sx={{
          color: "orange",
          fontSize: "1rem",
          padding: "20px",
          cursor: "pointer",
        }}
        variant={VARIANT_TYPES.BODY}
      >
        +
      </Typography>
    </Box>
  );
};

export const FIELD_ELEMENT = {
  [FIELD_TYPES.TEXT_BOX]: ({
    label,
    name,
    required,
    placeholder,
    description,
    onChange,
    onClick,
    rows = 3,
    ...props
  }) => (
    <FormControl fullWidth {...props}>
        <Box sx = {{display: "flex", alignItems: "center"}}>
      <Typography fontWeight={600} variant={VARIANT_TYPES.LABEL}>
        {label}
        {required ? "*" : ""}
      </Typography>
            {(description.length>0)? <Tooltip title={description}>
                <IconButton sx={{color: "#FFB600", fontSize: "small"}}>
                    <InfoOutlinedIcon />
                </IconButton>
            </Tooltip>:<></>}
        </Box>
      {/*<Typography variant={VARIANT_TYPES.BODY}>{description}</Typography>*/}
      <TextField
        onChange={onChange}
        name={name}
        required={required}
        placeholder={placeholder}
        multiline
        rows={rows}
        variant={VARIANT_TYPES.STANDARD}
        disabled={props.disabled}
        InputProps={{ sx: { backgroundColor: "rgba(211, 211, 211, 0.5)", color: "black", p: 1 } }}
      />
    </FormControl>
  ),
  [FIELD_TYPES.NUMBER_FIELD]: ({
    label,
    name,
    required,
    description,
    onChange,
    onClick,
    ...props
  }) => (
    <FormControl fullWidth {...props}>
        <Box sx = {{display: "flex", alignItems: "center"}}>
      <Typography fontWeight={600} variant={VARIANT_TYPES.LABEL}>
        {label}
        {required ? "*" : ""}
      </Typography>
            {(description.length>0)? <Tooltip title={description}>
                <IconButton sx={{color: "#FFB600", fontSize: "small"}}>
                    <InfoOutlinedIcon />
                </IconButton>
            </Tooltip>:<></>}
        </Box>
      {/*<Typography variant={VARIANT_TYPES.BODY}>{description}</Typography>*/}
      <TextField
        {...props}
        type="number"
        name={name}
        required={required}
        onChange={onChange}
        variant={VARIANT_TYPES.STANDARD}
        disabled={props.disabled}
        InputProps={{ sx: { backgroundColor: "rgba(211, 211, 211, 0.5)", color: "black", p: 1 } }}
      />
    </FormControl>
  ),
  [FIELD_TYPES.DATETIME_LOCAL]: ({
    label,
    description,
    onChange,
    value,
    required,
    onClick,
    ...props
  }) => (
    <FormControl fullWidth {...props}>
        <Box sx = {{display: "flex", alignItems: "center"}}>
      <Typography fontWeight={600} variant={VARIANT_TYPES.LABEL}>
        {label}
        {required ? "*" : ""}
      </Typography>
            {(description.length>0)? <Tooltip title={description}>
            <IconButton sx={{color: "#FFB600", fontSize: "small"}}>
                <InfoOutlinedIcon />
            </IconButton>
        </Tooltip>:<></>}
        </Box>
      {/*<Typography variant={VARIANT_TYPES.BODY}>{description}</Typography>*/}
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
          marginTop: 5
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
    onClick,
    ...props
  }) => (
    <FormControl
      fullWidth
      {...props}
      variant={VARIANT_TYPES.STANDARD}
      margin="normal"
    >
        <Box sx = {{display: "flex", alignItems: "center"}}>
      <Typography fontWeight={600} variant={VARIANT_TYPES.LABEL} gutterBottom>
        {label}
        {required ? "*" : ""}
      </Typography>
            {(description.length>0)? <Tooltip title={description}>
                <IconButton sx={{color: "#FFB600", fontSize: "small"}}>
                    <InfoOutlinedIcon />
                </IconButton>
            </Tooltip>:<></>}
        </Box>
      {/*<Typography variant={VARIANT_TYPES.BODY} gutterBottom>*/}
      {/*  {description}*/}
      {/*</Typography>*/}
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
    <FormControl
      fullWidth
      {...props}
      variant={VARIANT_TYPES.STANDARD}
      margin="normal"
    >
        <Box sx = {{display: "flex", alignItems: "center"}}>
      <Typography fontWeight={600} variant={VARIANT_TYPES.LABEL}>
        {label}
        {required ? "*" : ""}
      </Typography>
            {(description.length>0)? <Tooltip title={description}>
                <IconButton sx={{color: "#FFB600", fontSize: "small"}}>
                    <InfoOutlinedIcon />
                </IconButton>
            </Tooltip>:<></>}
        </Box>
      {/*<Typography variant={VARIANT_TYPES.BODY}>{description}</Typography>*/}
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
  [FIELD_TYPES.EMPTY]: () => <></>,
  [FIELD_TYPES.DESCRIPTION]: ({
    label,
    name,
    required,
    placeholder,
    description,
    onChange,
    onClick,
    rows = 3,
    ...props
  }) => (
    <FormControl fullWidth {...props}>
        <Box sx = {{display: "flex", alignItems: "center"}}>
      <Typography fontWeight={600} variant={VARIANT_TYPES.LABEL}>
        {label}
        {"*"}
      </Typography>
            {(description.length>0)? <Tooltip title={description}>
                <IconButton sx={{color: "#FFB600", fontSize: "small"}}>
                    <InfoOutlinedIcon />
                </IconButton>
            </Tooltip>:<></>}
        </Box>
      {/*<Typography variant={VARIANT_TYPES.BODY}>{description}</Typography>*/}
      <TextField
        onChange={onChange}
        name={name}
        required={true}
        placeholder={placeholder}
        multiline
        rows={rows}
        variant={VARIANT_TYPES.STANDARD}
        disabled={props.disabled}
        InputProps={{ sx: { backgroundColor: "rgba(211, 211, 211, 0.5)", color: "black", p: 1 } }}
      />
    </FormControl>
  ),
  [FIELD_TYPES.CATEGORY]: ({
    label,
    description,
    value,
    loading,
    onClick,
    disabled,
    ...props
  }) => {
    return (
      <FormControl
        fullWidth
        {...props}
        sx={{
          padding: "16px",
          borderRadius: "8px",
        }}
      >
        <Typography
          variant={VARIANT_TYPES.LABEL}
          fontWeight={700}
          sx={{ marginBottom: "8px" }}
        >
          {label}*
        </Typography>
        <Typography variant={VARIANT_TYPES.BODY} sx={{ marginBottom: "16px" }}>
            AI categorizes incident types, such as workplace injuries or equipment failures, using the incident
            descriptions provided by users
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "8px 12px",
              backgroundColor: "#F5F5F5",
              flexGrow: 1,
            }}
          >
            {loading?.toString() === "false" ? (
              <Tooltip title="AI Selected Category" placement="top">
                <Typography
                  variant={VARIANT_TYPES.BODY}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    py: 2,
                  }}
                  fontWeight={600}
                >
                  {value}
                </Typography>
              </Tooltip>
            ) : (
              <Typography
                sx={{ py: 2 }}
                variant={VARIANT_TYPES.BODY}
                fontWeight={600}
              >
                Loading...
              </Typography>
            )}
          </Box>
          <Tooltip title="Generate Category by AI" placement="top">
            <Button
              disabled={disabled}
              onClick={onClick}
              variant="contained"
              color="primary"
              sx={{ boxShadow: "none", "&:hover": { boxShadow: "none" } }}
            >
              Generate
            </Button>
          </Tooltip>
        </Box>
      </FormControl>
    );
  },
  [FIELD_TYPES.AI_TEXT]: ({
    label,
    name,
    required,
    placeholder,
    description,
    onChange,
    onClick,
    loading,
    rows = 3,
    value,
    ...props
  }) => (
    <FormControl fullWidth {...props}>
        <Box sx = {{display: "flex", alignItems: "center"}}>
      <Typography fontWeight={600} variant={VARIANT_TYPES.LABEL}>
        {label}
        {required ? "*" : ""}
      </Typography>
            {(description.length>0)? <Tooltip title={description}>
                <IconButton sx={{color: "#FFB600", fontSize: "small"}}>
                    <InfoOutlinedIcon />
                </IconButton>
            </Tooltip>:<></>}
        </Box>
      {/*<Typography variant={VARIANT_TYPES.BODY}>{description}</Typography>*/}
      <Tooltip title={`Prompt: "${value.prompt}"`}>
        <TextField
          // onChange={onChange}
          name={name}
          required={required}
          placeholder={`The AI will generate the text for you base on "${value.referenceField
            .map((referenceId) => referenceId.name)
            .join(", ")}"`}
          multiline
          value={value.generated}
          rows={rows}
          variant={VARIANT_TYPES.OUTLINED}
          disabled
          InputProps={{ sx: { backgroundColor: "rgba(211, 211, 211, 0.5)", color: "black", p: 1 } }}
        />
      </Tooltip>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 1 }}
        onClick={onClick}
        disabled={value.isLoading || props.disabled}
      >
        Generate
      </Button>
    </FormControl>
  ),
};
