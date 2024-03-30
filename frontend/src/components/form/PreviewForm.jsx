import { useEffect, useState } from "react";
import { Container, Typography, Button, Grid, Divider } from "@mui/material";
import { FIELD_TYPES } from "./form_data";
import useAxios from "../../hooks/useAxios";
import { FIELD_ELEMENT } from "./form_elements";

function PreviewForm({
  fields,
  sortedRows,
  handleSubmit,
  onClose,
  formName,
  formHeight,
}) {
  const [fieldsData, setFieldsData] = useState({});
  const { sendAIRequest, aiLoading } = useAxios();
  const [aiCategrory, setAICategory] = useState("");
  const [filledRequired, setFilledRequired] = useState(false);

  const formHeightStyle = {
    height: formHeight ? formHeight + "vh" : "80vh",
    width: "80vh",
    overflow: "auto",
  };

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

  const onCategorySearch = async () => {
    const res = await sendAIRequest({
      url: "/categorize/",
      method: "POST",
      body: {
        incident: fieldsData.description,
      },
    });
    setAICategory(res.response);
    setFieldsData((prevData) => ({
      ...prevData,
      category: res.response,
    }));
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
    const allRequiredPresent = fields.every((obj) =>
      obj.props.required ? obj.props.name in fieldsData : true
    );
    return allRequiredPresent;
  };

  useEffect(() => {
    setFilledRequired(isRequiredFieldFilled());
  }, [fieldsData]);

  useEffect(() => {
    console.log(fields);
    const dateFields = fields.filter((field) => field.type === FIELD_TYPES.DATETIME_LOCAL);
    dateFields.forEach((field) => {
      setFieldsData((prevData) => ({
        ...prevData,
        [field.props.name]: new Date().toISOString().split("T")[0],
      }));
    });
    console.log(dateFields)
  }, []);

  return (
    <Container style={formHeightStyle}>
      <Typography
        variant="h4"
        align="left"
        fontWeight={500}
        sx={{ marginTop: 5 }}
      >
        {formName}
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
                  <Grid
                    item
                    md={12}
                    key={fieldData.id}
                    sx={{ my: 2 }}
                    style={{ paddingLeft: 0 }}
                  >
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
                            : fieldData.type === FIELD_TYPES.SELECTION_SINGLE
                            ? fieldsData[fieldData.props.name]
                            : aiCategrory
                        }
                        onChange={(e) => handleChange(e, fieldData)}
                        // onDescriptionChange={(e) => onDescriptionChange(e, fieldData)}
                        onClick={onCategorySearch}
                        loading={aiLoading + ""}
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
            disabled={!filledRequired}
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
