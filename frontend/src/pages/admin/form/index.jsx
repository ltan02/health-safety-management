import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  Container,
  Grid,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { styled } from "@mui/material/styles";
import FormCustomizationModal from "./FormCustomizationModal";
import { FIELD_DATA_LIST } from "./initial_form";

function AdminForm() {
  const [formDataList, setFormDataList] = useState([]);
  const [form, setForm] = useState(null);

  const [open, setOpen] = useState(false);

  const handleOpen = (form) => {
    setForm(form);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setFormDataList(FIELD_DATA_LIST);
  }, []);
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "75vh", overflow: "auto" }}
      >
        <Table stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2">Id</Typography>
              </TableCell>
              <TableCell align="left">
                <Typography variant="subtitle2">Name</Typography>
              </TableCell>
              <TableCell align="left">
                <Typography variant="subtitle2">Author</Typography>
              </TableCell>
              <TableCell align="left">
                <Typography variant="subtitle2">Date Added</Typography>
              </TableCell>
              <TableCell align="left">
                <Typography variant="subtitle2">Last Updated</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2">Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formDataList.map((form) => (
              <TableRow key={form.id} hover>
                <TableCell component="th" scope="row">
                  <Typography variant="body2">{form.id}</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="body2">{form.name}</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="body2">{form.author}</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="body2">
                    {new Date(form.dateAdded).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="body2">
                    {new Date(form.lastUpdated).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpen(form)}>
                    <AddCircleOutlineIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <FormCustomizationModal
        open={open}
        handleClose={handleClose}
        form={form}
      />
    </Container>
  );
}

export default AdminForm;
