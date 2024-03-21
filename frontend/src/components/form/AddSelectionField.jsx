import React, { useEffect, useState } from "react";
import {
  FormControl,
  TextField,
  Tabs,
  Tab,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { VARIANT_TYPES } from "./form_data";
import useAxios from "../../hooks/useAxios";

const STATE = {
  MANUAL: "Manual",
  AUTOMATIC: "Automatic",
};

function AddSelectionField({
  onTitleChange,
  onDescriptionChange,
  onOptionChange,
  onRequiredChange,
}) {
  const { sendRequest } = useAxios();
  const [options, setOptions] = useState([{ value: "", label: "" }]);
  const [employees, setEmployees] = useState([{ value: "", label: ""}]);
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(newValue);
    if (newValue === 0) {
      setOptions([{ value: "", label: "" }]);
      onOptionChange(options);
    } else {
      onOptionChange(employees);
    }
  };

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

  const handleAddAutoOption = (event) => {
    const newValue = event.target.value;
    // add categories here ??
    if (newValue === "employees") {
      onOptionChange(options);
    }
  };

  const fetchEmployees = async () => {
    const response = await sendRequest({
      url: "/users",
      method: "GET",
    });
    const employees = response.map((employee) => {
      return { value: employee.id, label: employee.firstName };
    });
    setEmployees(employees);
  };

  useEffect(() => {
    fetchEmployees()
  }, []);

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
      <Select
        fullWidth
        variant={VARIANT_TYPES.STANDARD}
        onChange={onRequiredChange}
        label="Required"
        defaultValue={false}
      >
        <MenuItem value={true}>Required</MenuItem>
        <MenuItem value={false}>Optional</MenuItem>
      </Select>

      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="workflow tabs"
      >
        <Tab label="Manual" />
        <Tab label="Automatic" />
      </Tabs>
      {value === 0 && (
        <>
          <Typography variant={VARIANT_TYPES.LABEL} sx={{ mt: 2 }}>
            Please enter the options for the selection field
          </Typography>
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
          <Button variant="contained" color="primary" onClick={handleAddOption}>
            Add Option
          </Button>
        </>
      )}
      {value === 1 && (
        <div>
          <Typography variant={VARIANT_TYPES.LABEL} sx={{ mt: 2 }}>
            Please select the options for the selection field
          </Typography>
          <FormControl fullWidth>
          <Select
            fullWidth
            variant={VARIANT_TYPES.STANDARD}
            onChange={handleAddAutoOption}
            label="Automatic"
            defaultValue={"employees"}
          >
            <MenuItem value={"employees"}>
              Employees
            </MenuItem>
            <MenuItem value={"categories"}>Categories</MenuItem>
          </Select>
          </FormControl>
        </div>
      )}
    </FormControl>
  );
}

export default AddSelectionField;
