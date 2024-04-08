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
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
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
          border: "solid 4px #EB8C00",
          borderRadius: 2,
          padding: 5,
          width: "90%",
          backgroundColor: "white",
        }}
      >
        <Typography component="h1" variant="h5" fontWeight={600}>
          <Box display="flex" alignItems="center" sx={{ color: "#464646" }}>
            User Management
          </Box>
        </Typography>
        <Button
          variant={"contained"}
          sx={{ borderRadius: 5, mt: 2, paddingInline: 8, color: "white" }}
          size={"large"}
          onClick={() => setAddModalOpen(true)}
        >
          + Add New User
        </Button>

        <Button
          variant={"contained"}
          sx={{ borderRadius: 5, mt: 2, paddingInline: 8, color: "white" }}
          size={"large"}
          onClick={() => setAddGroupModalOpen(true)}
        >
          + Add New Group
        </Button>

        <Box
          sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
          width={"100%"}
        >
          {groups?.map((group) => (
            <Box
              key={group.id}
              sx={{
                p: 2,
                display: "flex",
                alignContent: "center",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                borderRadius: "8px",
                ":hover": {
                  boxShadow: "0 6px 10px rgba(0,0,0,0.15)",
                },
                cursor: "pointer",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" >
                {group.name}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Tooltip title="Edit Group">
                  <IconButton
                    onClick={() => {
                      setGroupId(group.id);
                      setEditMemberModalOpen(true);
                    }}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Group">
                  <IconButton
                    onClick={() => {
                      setGroupId(group.id);
                      setDeleteModalOpen(true);
                    }}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
          ))}
        </Box>
      </Box>

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
        employees={[[]]}
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
          groups={groups}
          removeGroup={removeGroup}
        />
      )}
    </Container>
  );
}
