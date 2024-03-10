import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  Typography,
  Container,
  Grid,
} from "@mui/material";
import { FIELD_ADD_FORM, FIELD_DATA, FIELD_TYPES } from "./initial_form";

function AddFieldForm() {
  const [fieldType, setFieldType] = useState([]);
  const [fieldTitle, setFieldTitle] = useState("");
  const [fieldDescription, setFieldDescription] = useState("");
  const [options, setOptions] = useState([]);
  const [select, setSelect] = useState("text");

  useEffect(() => {
    setFieldType(Object.values(FIELD_DATA));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (fieldTitle === "") {
      alert("Title is required");
      return;
    }
    console.log(FIELD_TYPES.SELECTION_SINGLE )
    console.log("Options: ", options);
    if (select === FIELD_TYPES.SELECTION_SINGLE || select === FIELD_TYPES.SELECTION_MULTI) {
      if (options.length === 0) {
        alert("Options are required for selection field");
        return;
      }
      if (options.includes("")) {
        alert("Options cannot be empty");
        return;
      }
    }
  
    console.log("Field Type: ", select);
    console.log("Field Title: ", fieldTitle);
    console.log("Field Description: ", fieldDescription);
    console.log("Options: ", options);

  };

  return (
    <Container style={{ height: "700px", width: "500px", overflow: "auto" }}>
      <Typography variant="h6" align="center" sx={{ my: 5 }}>
        Select Field Type
      </Typography>
      <Select
        labelId="field-select-label"
        value={select}
        onChange={(e) => setSelect(e.target.value)}
        fullWidth // To make Select take the full width
      >
        {Object.keys(FIELD_DATA).map((key) => (
          <MenuItem key={key} value={key}>
            {FIELD_DATA[key].label}
          </MenuItem>
        ))}
      </Select>
      <Container sx={{
        marginTop: "20px",
        marginBottom: "10px",
      }}>
        {FIELD_ADD_FORM[select] ? (
          <>
            {FIELD_ADD_FORM[select]({
              onTitleChange: (e) => setFieldTitle(e.target.value),
              onDescriptionChange: (e) => setFieldDescription(e.target.value),
              onOptionChange: (option) => setOptions(option),
            })}
          </>
        ) : (
          <Typography variant="h6" align="center" sx={{ my: 5 }}>
            Select Field Type
          </Typography>
        )}
      </Container>
      <Button
        onClick={handleSubmit}
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
      >
        Submit
      </Button>
    </Container>
  );
}
export default AddFieldForm;
