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

function AddSelectionField({
  onTitleChange,
  onDescriptionChange,
  onOptionChange,
  onRequiredChange,
  initialTitle,
  initialDescription,
  initialOptions =[{ value: "", label: "" }],
  initialRequired,
}) {
  const { sendRequest } = useAxios();
  const [options, setOptions] = useState(initialOptions);
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) {
      setOptions([{ value: "", label: "" }]);
    } else {
      fetchEmployees()
    }
  };

  const handleAddOption = () => {
    if (options.map((option) => option.value).includes("")) {
      return;
    }
    setOptions(options.concat({ value: "", label: "" }));
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
      return { value: employee.id, label: employee.firstName +" " + employee.lastName };
    });
    setOptions(employees);
  };

  const fetchCategories = async () => {
    // const response = await sendRequest({
    //   url: "/users",
    //   method: "GET",
    // });
    // const employees = response.map((employee) => {
    //   return { value: employee.id, label: employee.firstName };
    // });
    // setOptions(employees);
  };

  useEffect(() => {
    const filteredOptions = options.filter((option) => option.value !== "");
    onOptionChange(filteredOptions);
  }, [options]);

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
        defaultValue={initialTitle}
      />
      <TextField
        onChange={onDescriptionChange}
        variant={VARIANT_TYPES.STANDARD}
        placeholder="Description (optional)"
        margin="dense"
        fullWidth
        label="Description"
        defaultValue={initialDescription}
      />
      <Select
        fullWidth
        variant={VARIANT_TYPES.STANDARD}
        onChange={onRequiredChange}
        label="Required"
        defaultValue={initialRequired}
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
