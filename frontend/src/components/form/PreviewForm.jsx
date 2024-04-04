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
  disableSubmit,
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
      obj.props.required
        ? obj.props.name in fieldsData && fieldsData[obj.props.name] !== ""
        : true
    );
    return allRequiredPresent;
  };

  const findFieldDetails = (fieldId) => {
    return fields.filter((field) => fieldId.includes(field.id));
  };

  const fillFieldBaseOnPrompt = async (fieldData, referenceField) => {
    try {
      const res = await sendAIRequest({
        url: "/generate",
        method: "POST",
        body: {
          prompt:
            "THE RESPONSE WILL BE PLANE TEXT. DO NOT WRITE IN MARKDOWN. DO NOT BE REPETITIVE" +
            fieldData.aiField.prompt +
            ". GENERATE THE RESPONSE BASE ON: " +
            referenceField.map((field) => "[" + fieldsData[field.props.name]) +
            "], " +
            "'",
        },
      });
      setFieldsData((prevData) => ({
        ...prevData,
        [fieldData.props.name]: res.response,
      }));
      console.log("AI response:", res);
    } catch (error) {
      console.error("Error filling field based on prompt:", error);
    }
  };
  useEffect(() => {
    setFilledRequired(isRequiredFieldFilled());
  }, [fieldsData]);

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
                  return <></>;
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
                            : fieldData.type === FIELD_TYPES.CATEGORY
                            ? aiCategrory
                            : fieldData.type === FIELD_TYPES.AI_TEXT
                            ? {
                                referenceField: findFieldDetails(
                                  fieldData.aiField.referenceId
                                ),
                                prompt: fieldData.aiField.prompt,
                                generated: fieldsData[fieldData.props.name]
                                  ? fieldsData[fieldData.props.name]
                                  : "",
                              }
                            : fieldsData[fieldData.props.name]
                        }
                        onChange={(e) => handleChange(e, fieldData)}
                        onClick={
                          fieldData.type === FIELD_TYPES.AI_TEXT
                            ? () =>
                                fillFieldBaseOnPrompt(
                                  fieldData,
                                  findFieldDetails(
                                    fieldData.aiField.referenceId
                                  )
                                )
                            : fieldData.type === FIELD_TYPES.CATEGORY
                            ? onCategorySearch
                            : null
                        }
                        loading={aiLoading + ""}
                      />
                    </Container>
                  </Grid>
                );
              })}
            </Grid>
          ))}
        </Grid>
        <Grid
          container
          spacing={2}
          alignItems="top"
          display={disableSubmit ? "none" : "flex"}
        >
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
