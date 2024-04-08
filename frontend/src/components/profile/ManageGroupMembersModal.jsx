import {
  Container,
  Typography,
  Button,
  Box,
  Modal,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState, useRef } from "react";
import useAxios from "../../hooks/useAxios";

export default function ManageGroupMembersModal({
  open,
  onClose,
  groupId,
  employees,
  fetchEmployees,
}) {
  const [newMember, setNewMember] = useState("");
  const [members, setMembers] = useState([]);
  const [groupData, setGroupData] = useState({});
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const { sendRequest, loading } = useAxios();
  const [anchorEl, setAnchorEl] = useState(null);
  const inputRef = useRef();

  const handleNewMemberEmailChange = (event) => {
    setNewMember(event.target.value);
    setSearch(event.target.value);
  };

  const clickSearch = () => {
    setAnchorEl(inputRef.current);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const roleName = (role) => {
    switch (role) {
      case "Admin":
        return "ADMIN";
      case "Safety Warden":
        return "SAFETY_WARDEN";
      default:
        return "EMPLOYEE";
    }
  };
  
  const isValidUser = (user) => {
    return employees.find((employee) => employee.email === user);
  };

  const handleAddMember = async () => {
    // Implement the logic to add a new member to the group
    const employeeId = employees.find(
      (employee) => employee.email === newMember
    ).id;
    if (groupData.members.includes(employeeId)) {
      return;
    }
    await sendRequest({
      url: `/groups/${groupId}/members/${employeeId}`,
      method: "PUT",
    });

    const res = await sendRequest({
      url: `/users/${employeeId}/role`,
      method: "PUT",
      body: roleName(groupData.name),
    });
    setNewMember("");
    onClose();
    fetchEmployees();
  };

  const handleRemoveMember = async (memberId) => {
    // Implement the logic to remove a member from the group
    await sendRequest({
      url: `/groups/${groupId}/members/${memberId} `,
      method: "DELETE",
    });
    await sendRequest({
      url: `/users/${memberId}/role`,
      method: "PUT",
      body: "EMPLOYEE",
    });
    setNewMember("");
    fetchEmployees();
    onClose();
  };

  useEffect(() => {
    const currentMembers = groupData.members || [];
    const newMembers = employees.filter(
      (employee) => !currentMembers.includes(employee.id)
    );
    setFilteredEmployees(
      newMembers.filter(
        (employee) =>
          employee.email.toLowerCase().includes(search.toLowerCase()) ||
          `${employee.firstName} ${employee.lastName}`
            .toLowerCase()
            .includes(search.toLowerCase())
      )
    );
  }, [search, employees]);

  useEffect(() => {
    const fetchGroupData = async () => {
      const res = await sendRequest({
        url: `/groups/${groupId}`,
        method: "GET",
      });
      setGroupData(res);
      employees.map((employee) => {
        if (
          res.members.includes(employee.id) &&
          !members.filter((m) => m.id === employee.id).length
        ) {
          setMembers((prevMembers) => [
            ...prevMembers,
            {
              id: employee.id,
              name: `${employee.firstName} ${employee.lastName}`,
              email: employee.email,
            },
          ]);
        }
      });
    };
    fetchGroupData();
  }, [open]);

  const employeeName = (employee) => {
    switch (employee.role) {
      case "ADMIN":
        return `${employee.firstName} ${employee.lastName} - Admin`;
      case "SAFETY_WARDEN":
        return `${employee.firstName} ${employee.lastName} - Safety Warden`;
      case "EMPLOYEE":
        return `${employee.firstName} ${employee.lastName} - Employee`;
      default:
        return `${employee.firstName} ${employee.lastName} - Employee`;
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="manage-group-members-modal-title"
      aria-describedby="manage-group-members-modal-description"
    >
      <Container
        component="main"
        maxWidth="xs"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "5%",
          backgroundColor: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 2,
            padding: 5,
            width: "100%",
            backgroundColor: "white",
          }}
        >
          <Typography component="h1" variant="h5">
            Manage Group Members
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="new-member-email"
              label="New Member Email"
              name="newMember"
              value={newMember}
              onChange={handleNewMemberEmailChange}
              inputRef={inputRef}
            />
            <Button
              type="button"
              fullWidth
              variant="outlined"
              color="primary"
              sx={{ mt: 3 }}
              onClick={clickSearch}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Search Member"}
            </Button>
          </Box>
          <Menu
            id="search-menu"
            anchorEl={inputRef.current}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "new-member-email",
            }}
            disableAutoFocus={true}
          >
            {filteredEmployees.map((employee) => (
              <MenuItem
                key={employee.id}
                onMouseDown={(event) => {
                  event.preventDefault(); // Prevent the menu item from taking focus
                  setNewMember(employee.email);
                  handleMenuClose();
                }}
              >
                {`${employeeName(employee)}`}
              </MenuItem>
            ))}
          </Menu>
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={handleAddMember}
            disabled={loading || !isValidUser(newMember)}
          >
            {loading ? <CircularProgress size={24} /> : "Add Member"}
          </Button>
          <Typography component="h2" variant="h6" sx={{ mt: 4 }}>
            Current Members
          </Typography>
          <List
            dense={true}
            sx={{ width: "100%", maxHeight: 400, overflow: "auto" }}
          >
            {members.map((member) => (
              <ListItem key={member.name}>
                <ListItemText primary={member.name} secondary={member.email} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={loading || roleName(groupData.name) === "EMPLOYEE"}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
    </Modal>
  );
}
