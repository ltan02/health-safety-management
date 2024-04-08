import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Link,
  Grid,
  Button,
  Icon,
  IconButton,
  Tooltip,
  Paper,
  Divider,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuthContext } from "../../context/AuthContext";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import InviteUserModal from "../../components/profile/InviteUserModal";
import AddGroupModal from "../../components/profile/AddGroupModal";
import ManageGroupMembersModal from "../../components/profile/ManageGroupMembersModal";
import useAxios from "../../hooks/useAxios";
import DeleteGroupModal from "../../components/profile/DeleteGroupModak";

export default function UserManagement() {
  const { sendRequest } = useAxios();
  const { user } = useAuthContext();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addGroupModalOpen, setAddGroupModalOpen] = useState(false);
  const [editMemberModalOpen, setEditMemberModalOpen] = useState(false);
  const [groups, setGroupData] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    const res = await sendRequest({
      url: "/users",
      method: "GET",
    });
    setEmployees(res);
    console.log(res);
  };

  const fetchGroups = async () => {
    const res = await sendRequest({
      url: `/groups`,
      method: "GET",
    });
    setGroupData(res);
  };

  const removeGroup = async (groupId) => {
    const res = await sendRequest({
      url: `/groups/${groupId}`,
      method: "DELETE",
    });
    setDeleteModalOpen(false);
    fetchGroups();
  };

  useEffect(() => {
    fetchGroups();
    fetchEmployees();
  }, []);

  return (
    <Container maxWidth="md">
      <Typography
        variant="h4"
        fontWeight={700}
        gutterBottom
        align="center"
        mt={5}
      >
        User Management
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Users
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ height: 400, overflowY: "auto", mb: 2 }}>
          {employees.map((employee) => (
            <Box
              key={employee.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                mb: 1,
                backgroundColor: "action.hover",
                borderRadius: 1,
              }}
            >
              <Typography>{`${employee.firstName} ${employee.lastName}`}</Typography>
              <Stack direction="row" spacing={1}>
                <Tooltip title="Edit User">
                  <IconButton
                    onClick={() => setEditMemberModalOpen(true)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete User">
                  <IconButton
                    onClick={() => {setDeleteModalOpen(true)}}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
          ))}
        </Box>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => setAddModalOpen(true)}
        >
          Add New User
        </Button>
      </Paper>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Groups
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {groups.map((group) => (
          <Box
            key={group.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              mb: 1,
              backgroundColor: "action.hover",
              borderRadius: 1,
            }}
          >
            <Typography>{group.name}</Typography>
            <Stack direction="row" spacing={1}>
              <Tooltip title="Edit Group">
                <IconButton
                  onClick={() => setEditMemberModalOpen(true)}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Group">
                <IconButton
                  onClick={() => {setGroupId(group.id); setDeleteModalOpen(true)}}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        ))}
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => setAddGroupModalOpen(true)}
        >
          Add New Group
        </Button>
      </Paper>
      <InviteUserModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
      <AddGroupModal
        open={addGroupModalOpen}
        onClose={() => {
          fetchGroups();
          setAddGroupModalOpen(false);
        }}
        employees={employees}
      />
      {editMemberModalOpen && (
        <ManageGroupMembersModal
          open={editMemberModalOpen}
          onClose={() => {
            fetchGroups();
            setEditMemberModalOpen(false);
          }}
          groupId={groupId}
          employees={employees}
          fetchEmployees={fetchEmployees}
        />
      )}
      {deleteModalOpen && (
        <DeleteGroupModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          groupId={groupId}
          removeGroup={removeGroup}
          groups={groups}
        />
      )}
    </Container>
  );
}
