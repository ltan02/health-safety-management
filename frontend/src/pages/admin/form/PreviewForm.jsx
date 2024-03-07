import { Container, Typography, Button, Grid } from "@mui/material";
import { useState } from "react";
import { FIELD_ELEMENT, FIELD_TYPES, DEFAULT_DATA } from "./initial_form";

function PreviewForm() {
  // Using useState to handle form data
  const [formData, setFormData] = useState({});

  // Function to handle input changes and update state
  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(event);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData); // This is where you would typically send the data to a server
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h6" align="center" sx={{ my: 5 }}>
        Incident Report Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="top">
          {DEFAULT_DATA.map((fieldData) => {
            const FieldComponent = FIELD_ELEMENT[fieldData.type];
            if (!FieldComponent) {
              console.error("Missing FieldComponent:", fieldData);
            }
            return (
              <Grid item xs={12} sm={4} key={fieldData.id}>
                <FieldComponent
                  {...fieldData.props}
                  value={formData[fieldData.props.name] || ""}
                  onChange={handleChange}
                />
              </Grid>
            );
          })}
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3, display: "block", ml: "auto", mr: "auto" }}
        >
          Submit
        </Button>
      </form>
    </Container>
  );
}

export default PreviewForm;
