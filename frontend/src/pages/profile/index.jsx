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

export default function ProfilePage() {
  // State for managing the switch (notification preference)
  const { sendRequest, loading } = useAxios();
  const { user } = useAuthContext();
  const [isNotified, setIsNotified] = useState(false);
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

  const handleNotificationChange = (event) => {
    setIsNotified(event.target.checked);
  };

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
            <AccountCircleIcon fontSize={"large"} sx={{ marginRight: 1 }} />
            Profile
          </Box>
        </Typography>
        {/* User's Name */}
        <Grid
          container
          alignItems="center"
          sx={{ justifyContent: "space-between", mt: 5 }}
        >
          <Typography
            color="secondary"
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            First Name
          </Typography>
          <Typography
            color="secondary.light"
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {user.firstName}
          </Typography>
        </Grid>
        <Grid
          container
          alignItems="center"
          sx={{ justifyContent: "space-between", mt: 5 }}
        >
          <Typography
            color="secondary"
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            Last Name
          </Typography>
          <Typography
            color="secondary.light"
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {user.lastName}
          </Typography>
        </Grid>

        {/* Email Field */}
        <Grid
          container
          alignItems="center"
          sx={{ justifyContent: "space-between", mt: 5 }}
        >
          <Typography
            color="secondary"
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            Email Address
          </Typography>
          <Typography
            color="secondary.light"
            variant="h6"
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {user.email}
          </Typography>
        </Grid>

        {/* Phone Field */}
        <Grid
          container
          alignItems="center"
          sx={{ justifyContent: "space-between", mt: 5 }}
        >
          <Typography
            color="secondary"
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            Role
          </Typography>
          <Typography
            color="secondary.light"
            variant="h6"
            name="role"
            label="role Number"
            type="role"
            id="role"
            autoComplete="current-role"
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {user.role}
          </Typography>
        </Grid>
        <Grid
          container
          alignItems="center"
          sx={{ justifyContent: "space-between", mt: 1 }}
        >
          <FormControlLabel
            label={
              <Typography fontSize={16} color="secondary">
                Would you like to receive Notifications?
              </Typography>
            }
            labelPlacement="start"
            sx={{ mt: 2 }}
            control={
              <Switch
                checked={isNotified}
                onChange={handleNotificationChange}
                name="receiveNotifications"
              />
            }
          />
        </Grid>
        <Button
          variant={"contained"}
          sx={{ borderRadius: 5, mt: 2, paddingInline: 8, color: "white" }}
          size={"large"}
          startIcon={<HomeIcon />}
          href="/"
        >
          Home
        </Button>
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
