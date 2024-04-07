import {
  Container,
  Typography,
  Button,
  Grid,
  Divider,
  Box,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import useAxios from "../../hooks/useAxios";

export default function AddGroupModal({ open, onClose }) {
  const [groupName, setGroupName] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [description, setDescription] = useState("");
  const {sendRequest, loading } = useAxios();

  const handleGroupNameChange = (event) => {
    setGroupName(event.target.value);
  };


  const handleSubmit = async () => {
    console.log(groupName);
    const res = await sendRequest({
      url: "/groups",
      method: "POST",
      body: {
        name: groupName,
      },
    });

    console.log(res);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-group-modal-title"
      aria-describedby="add-group-modal-description"
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
            Create New Group
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="group-name"
              label="Group Name"
              name="groupName"
              autoFocus
              value={groupName}
              onChange={handleGroupNameChange}
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Create Group"}
            </Button>
          </Box>
        </Box>
      </Container>
    </Modal>
  );
}
