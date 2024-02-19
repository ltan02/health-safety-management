import React, { useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

function IncidentModalPreview({ fields }) {
  return (
      <Box>
          {fields.map((field, index) => (
            <TextField
              key={index}
              name={field.name}
              label={field.label}
            />
          ))} 
      </Box>
  );
}

export default IncidentModalPreview;