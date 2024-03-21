import React, { useState } from "react";
import {
  FormControl,
  TextField,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  Button,
  OutlinedInput,
  Chip,
  Grid,
} from "@mui/material";
import { VARIANT_TYPES } from "./form_data";

function AddSelectionField({
  onTitleChange,
  onDescriptionChange,
  onOptionChange,
  onRequiredChange,
}) {
  const [options, setOptions] = useState([{ value: "", label: "" }]);

  const handleAddOption = () => {
    if (options.map((option) => option.value).includes("")) {
      return;
    }
    setOptions(options.concat({ value: "", label: "" }));
    onOptionChange(options);
  };
  const handleOptionChange = (index, newValue) => {
    const newOptions = options.map((option, idx) =>
      idx === index ? { ...option, value: newValue, label: newValue } : option
    );
    setOptions(newOptions);
  };

  const handleRemoveOption = (index) => {
    const filteredOptions = options.filter((_, idx) => idx !== index);
    setOptions(filteredOptions);
  };

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
      <Select fullWidth variant={VARIANT_TYPES.STANDARD} onChange={onRequiredChange} label="Required" defaultValue={false}>
        <MenuItem value={true}>Required</MenuItem>
        <MenuItem value={false}>Optional</MenuItem>
      </Select>
      {options.map((option, index) => (
        <Grid container spacing={1} alignItems="center" key={index}>
          <Grid item xs>
            <TextField
              variant="outlined"
              margin="dense"
              fullWidth
              label={`Option ${index + 1}`}
              value={option.value}
              onChange={(e) => handleOptionChange(index, e.target.value)}
            />
            
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleRemoveOption(index)}
            >
              Remove
            </Button>
          </Grid>
        </Grid>
      ))}
      <Button variant="contained" color="primary" onClick={handleAddOption} style={{ marginTop: '10px' }}>
        Add Option
      </Button>
    </FormControl>
  );
}

export default AddSelectionField;
