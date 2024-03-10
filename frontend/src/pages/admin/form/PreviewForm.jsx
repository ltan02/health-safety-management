import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Grid } from '@mui/material';
import { FIELD_ELEMENT, FIELD_TYPES } from './initial_form';

function PreviewForm({ form = `default-form-id` }) {
  const [formData, setFormData] = useState({});

  const groupedByRows = form["formData"].reduce((acc, field) => {
    const { y } = field.coordinate;
    if (!acc[y]) {
      acc[y] = [];
    }
    acc[y].push(field);
    return acc;
  }, {});

  const sortedRows = Object.keys(groupedByRows)
    .sort((a, b) => a - b)
    .map(y => ({
      row: y,
      fields: groupedByRows[y].sort((a, b) => a.coordinate.x - b.coordinate.x),
    }));

  const handleChange = (event, field) => {
    const { name, value } = event.target;
    const isMultiSelect = field.type === FIELD_TYPES.SELECTION_MULTI;
    if (isMultiSelect) {
      const newValue = typeof value === 'string' ? value.split(',') : value;
      const duplicates = findDuplicateIndexes(newValue);
      if (duplicates.length > 0) {
        duplicates.forEach((index) => {
          newValue.splice(index, 1);
        })
      }
      setFormData(prevData => ({
        ...prevData,
        [name]: newValue,
      }));
    } else {
      setFormData(prevData => ({
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

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
  };

  return (
    <Container
      style={{
        height: '700px',
        width: '700px',
        overflow: 'auto',
      }}
    >
      <Typography variant="h6" align="center" sx={{ my: 5 }}>
        {form.name}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="top">
          {sortedRows.map((row, rowIndex) => (
            <Grid container spacing={2} key={rowIndex} alignItems="center">
              {row.fields.map((fieldData) => {
                const FieldComponent = FIELD_ELEMENT[fieldData.type];
                if (!FieldComponent) {
                  console.error('Missing FieldComponent:', fieldData);
                  return null;
                }
                return (
                  <Grid item xs={12} sm={6} key={fieldData.id}>
                    <FieldComponent
                      {...fieldData.props}
                      value={fieldData.type === FIELD_TYPES.SELECTION_MULTI ? formData[fieldData.props.name] ?? [] : formData[fieldData.props.name] ?? ''}
                      onChange={(e) => handleChange(e, fieldData)}
                      style={{ padding: '10px 0px' }}
                    />
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
            sx={{ mt: 3, display: 'block', ml: 'auto', mr: 'auto' }}
          >
            Submit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 3, display: 'block', ml: 'auto', mr: 'auto' }}
            onClick={() => setFormData({})} // Assuming you want to clear the form or take some action on cancel
          >
            Cancel
          </Button>
        </Grid>
      </form>
    </Container>
  );
}

export default PreviewForm;
