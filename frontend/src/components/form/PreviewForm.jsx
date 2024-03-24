import { useState } from "react";
import { Container, Typography, Button, Grid, Divider } from "@mui/material";
import { FIELD_TYPES } from "./form_data";
import { FIELD_ELEMENT } from "./form_elements";

function PreviewForm({ fields, sortedRows, handleSubmit, onClose }) {
  const [fieldsData, setFieldsData] = useState({});

  const handleChange = (event, field) => {
    const { name, value } = event.target;
    const isMultiSelect = field.type === FIELD_TYPES.SELECTION_MULTI;
    if (isMultiSelect) {
      const newValue = typeof value === "string" ? value.split(",") : value;
      const duplicates = findDuplicateIndexes(newValue);
      if (duplicates.length > 0) {
        duplicates.forEach((index) => {
          newValue.splice(index, 1);
        });
      }
      setFieldsData((prevData) => ({
        ...prevData,
        [name]: newValue,
      }));
    } else {
      setFieldsData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  function findDuplicateIndexes(arr) {
    const seen = new Map();
    const duplicates = [];

    arr.forEach((item, index) => {
      if (seen.has(item)) {
        duplicates.push(index);
      } else {
        seen.set(item, index);
      }
    });

    return duplicates;
  }

  const pushSubmitButton = (event) => {
    event.preventDefault();
    if (handleSubmit) {
      handleSubmit(fieldsData);
    } else {
      alert("Preview Form does not submit data.");
    }
    pushCloseButton();
  };

  const pushCloseButton = () => {
    setFieldsData({});
    if (onClose) {
      onClose();
    }
  };

  const isRequiredFieldFilled = () => {
    const requiredFields = sortedRows().map((row) =>
      row.fields.filter((field) => field.props.required)
    );
    return requiredFields.every((fields) =>
      fields.every((field) => fieldsData[field.props.name])
    );
  };

  return (
    <Container style={{ height: "80vh", width: "80vh", overflow: "auto" }}>
      <Typography
        variant="h4"
        align="left"
        fontWeight={500}
        sx={{ marginTop: 5 }}
      >
        Incident Report Form
      </Typography>
      <Divider sx={{ my: 2 }} color="primary" />
      <form onSubmit={pushSubmitButton}>
        <Grid container alignItems="top">
          {sortedRows().map((row, rowIndex) => (
            <Grid container spacing={2} key={rowIndex} alignItems="center">
              {row.fields.map((fieldData) => {
                const FieldComponent = FIELD_ELEMENT[fieldData.type];
                if (!FieldComponent) {
                  console.error("Missing FieldComponent:", fieldData);
                  return null;
                }
                return (
                  <Grid item md={12} key={fieldData.id} sx={{ my: 2 }} style={{ paddingLeft: 0}}>
                    <Container
                      sx={{
                        display: "flex",
                        justifyContent: "start",
                      }}
                    >
                      <FieldComponent
                        {...fieldData.props}
                        value={
                          fieldData.type === FIELD_TYPES.SELECTION_MULTI
                            ? fieldsData[fieldData.props.name] ?? []
                            : fieldsData[fieldData.props.name] ?? ""
                        }
                        onChange={(e) => handleChange(e, fieldData)}
                      />
                    </Container>
                  </Grid>
                );
              })}
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={2} alignItems="top">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3, position: "fixed", bottom: "10px", right: "10px" }}
            disabled={!isRequiredFieldFilled()}
          >
            Submit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 3, position: "fixed", bottom: "10px", right: "100px" }}
            onClick={pushCloseButton}
          >
            Cancel
          </Button>
        </Grid>
      </form>
    </Container>
  );
}

export default PreviewForm;
