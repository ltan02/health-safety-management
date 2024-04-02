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
  FormControl,
} from "@mui/material";
import { FIELD_DATA, FIELD_TYPES, VARIANT_TYPES } from "./form_data";
import { CircularProgress } from "@mui/material";

import { FIELD_ADD_FORM } from "./add_elements";
import { set } from "lodash";

function AddFieldForm({ handleAddNewField, getLastCoordinate }) {
  const [fieldType, setFieldType] = useState([]);
  const [placeholder, setPlaceholder] = useState("");
  const [fieldTitle, setFieldTitle] = useState("");
  const [fieldDescription, setFieldDescription] = useState("");
  const [options, setOptions] = useState([]);
  const [required, setRequired] = useState(true);
  const [select, setSelect] = useState("text");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFieldType(Object.values(FIELD_DATA));
  }, []);

  const handleSubmit = async (event) => {
    setIsLoading(true);
    try {
      event.preventDefault();
      if (fieldTitle === "") {
        alert("Title is required");
        return;
      }

      if (
        select === FIELD_TYPES.SELECTION_SINGLE ||
        select === FIELD_TYPES.SELECTION_MULTI
      ) {
        if (options.length === 0) {
          alert("Options are required for selection field");
          return;
        }
        if (options.includes("")) {
          alert("Options cannot be empty");
          return;
        }
      }

      const lastCoordinate = getLastCoordinate();
      if (lastCoordinate.x === 0) {
        lastCoordinate.x = 1;
      } else {
        lastCoordinate.x = 0;
        lastCoordinate.y += 1;
      }

      const newField = {
        name: fieldTitle,
        type: select,
        props: {
          label: fieldTitle,
          name: fieldTitle.toLowerCase().replace(" ", "_"),
          required: required,
          placeholder: placeholder,
          description: fieldDescription,
          options: options,
        },
        coordinate: lastCoordinate,
      };
      await handleAddNewField(newField);
    } catch (error) {
      console.error("Error adding new field:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container style={{ height: "80vh", width: "80vh", overflow: "auto" }}>
      <Typography variant="h6" fontWeight={600} align="left" sx={{ my: 5 }}>
        Select Field Type
      </Typography>
      <Select
        labelId="field-select-label"
        value={select}
        onChange={(e) => setSelect(e.target.value)}
        fullWidth
      >
        {Object.keys(FIELD_DATA).map((key) => (
          <MenuItem key={key} value={key}>
            {FIELD_DATA[key].label}
          </MenuItem>
        ))}
      </Select>
      {FIELD_ADD_FORM[select] && (
        <Typography variant="h6" fontWeight={600} align="left" sx={{ marginTop: 5 }}>
          Customize Field
        </Typography>
      )}
      <Container
        sx={{
          marginBottom: "10px",
        }}
        style={{
          paddingLeft: "0px",
          paddingRight: "0px",
        }}
      >
        {FIELD_ADD_FORM[select] ? (
          <>
            {FIELD_ADD_FORM[select]({
              onTitleChange: (e) => setFieldTitle(e.target.value),
              onDescriptionChange: (e) => setFieldDescription(e.target.value),
              onOptionChange: (option) => setOptions(option),
              onRequiredChange: (e) => setRequired(e.target.value),
              onPlaceHolderChange: (e) => setPlaceholder(e.target.value),
            })}
          </>
        ) : (
          <></>
        )}
        {FIELD_ADD_FORM[select] && (
          <Typography variant="h6" fontWeight={600} align="left" sx={{ marginTop: 5 }}>
            Preview Field
          </Typography>
        )}
        {FIELD_ADD_FORM[select] && (
          <Box border={1} borderColor="grey.500" borderRadius={2} p={5} marginTop={2}>
            <FormControl fullWidth>
              <Typography variant={VARIANT_TYPES.LABEL} fontWeight={600}>
                {fieldTitle} {required ? "*" : ""}
              </Typography>
              <Typography variant={VARIANT_TYPES.BODY}>
                {fieldDescription}
              </Typography>
              {select === FIELD_TYPES.SELECTION_SINGLE ||
              select === FIELD_TYPES.SELECTION_MULTI ? (
                <Select value={""} required={required}>
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              ) : select === FIELD_TYPES.TEXT_BOX ? (
                <TextField
                  variant={VARIANT_TYPES.OUTLINED}
                  margin="dense"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  multiline
                  rows={3}
                  disabled
                  helperText={`This is a preview of a ${select} field.`}
                />
              ) : (
                <TextField
                  placeholder={placeholder}
                  disabled
                  margin="dense"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  rows={3}
                  helperText={`This is a preview of a ${select} field.`}
                />
              )}
            </FormControl>
          </Box>
        )}
      </Container>
      <Button
        onClick={handleSubmit}
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : "Create"}
      </Button>
    </Container>
  );
}
export default AddFieldForm;
