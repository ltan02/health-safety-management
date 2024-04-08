import { useEffect, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  CircularProgress,
  Typography,
  MenuList,
  MenuItem,
  Paper,
  Grid,
  IconButton,
} from "@mui/material";
import useAxios from "../../hooks/useAxios";
import Profile from "../users/Profile";
import ClearIcon from "@mui/icons-material/Clear";

export default function EmployeesInvolveEditModal({
  open,
  onClose,
  employees,
  setEmployees,
  involvedEmployees,
  handleFilterEmployees,
  search = "",
  handleOpenEmployeesListModal,
  handleAddEmployee,
  loading,
}) {
  const [selectedEmployees, setSelectedEmployees] = useState(involvedEmployees);
  const [visibleEmployees, setVisibleEmployees] = useState([]);

  const handleSelect = (employee) => {
    const index = selectedEmployees.findIndex((e) => e.id === employee.id);
    if (index === -1) {
      setSelectedEmployees([...selectedEmployees, employee]);
    } else {
      setSelectedEmployees(
        selectedEmployees.filter((e) => e.id !== employee.id)
      );
    }
  };

  const handleSubmit =  async () => {
    await handleAddEmployee(selectedEmployees);

    onClose();
  };

  const handleSearch = (e) => {
    handleFilterEmployees(e);
    // handleOpenEmployeesListModal({ e, privileged: false });
  };

  const handleClose = () => {
    setSelectedEmployees(involvedEmployees);
    onClose();
  };

  useEffect(() => {

    if (search === "") {
      setVisibleEmployees([]);
    } else {
      const nonInvolvedEmployees = employees.filter(
        (employee) =>
          !involvedEmployees.some((involved) => involved.id === employee.id)
      );

      setVisibleEmployees(nonInvolvedEmployees);
    }
  }, [employees]);

  useEffect(() => {
    setSelectedEmployees(involvedEmployees);
  }, [involvedEmployees]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          borderRadius: 2, // Added rounded corners
          boxShadow: 24,
          p: 4,
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Employees Involved
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
              {
                loading ? <CircularProgress size={24} /> : "Save"
              }
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 2, overflow: "auto", maxHeight: 180 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {selectedEmployees.map((employee) => (
                <Grid item xs={6} key={employee.id}>
                  <ListItem
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleSelect(employee)}
                      >
                        <ClearIcon />
                      </IconButton>
                    }
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Profile user={employee} />{" "}
                    {/* Assuming Profile is a custom component */}
                    <ListItemText
                      primary={`${employee.firstName} ${employee.lastName}`}
                    />
                  </ListItem>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        <Box>
          <TextField
            fullWidth
            variant="outlined"
            color="primary"
            label="Search Employees"
            onChange={handleSearch}
            sx={{ mb: 2 }}
          />

          {search !== "" && (
            <Paper elevation={3} sx={{ maxHeight: 300, overflow: "auto" }}>
              <MenuList sx={{ overflow: "auto", maxHeight: 150 }}>
                {visibleEmployees.map((employee) => (
                  <MenuItem
                    key={employee.id}
                    onClick={() => handleSelect(employee)}
                  >
                    <Typography noWrap>
                      {employee.firstName} {employee.lastName}
                    </Typography>
                  </MenuItem>
                ))}
                {visibleEmployees.length === 0 && (
                  <MenuItem>
                    <Typography>No employees found</Typography>
                  </MenuItem>
                )}
              </MenuList>
            </Paper>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
