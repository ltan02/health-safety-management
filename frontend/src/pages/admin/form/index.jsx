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
      <TableContainer sx={{ minHeight: "50vh" }}>
        <Table
          aria-label="form table"
          sx={{ width: { xs: "100%", sm: "80vw" } }}
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2">Id</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">Name</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">Author</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">Date Added</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">Last Updated</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formDataList.map((form) => (
              <TableRow key={form.id}>
                <TableCell>
                  <Typography variant="body2" noWrap>
                    {form.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap>
                    {form.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap>
                    {form.author}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap>
                    {new Date(form.dateAdded).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap>
                    {new Date(form.lastUpdated).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <IconButton onClick={()=>handleOpen(form)}>
                  <AddCircleOutlineIcon />
                </IconButton>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <FormCustomizationModal open={open} handleClose={handleClose} form={form} />
    </Container>
  );
}

export default AdminForm;
