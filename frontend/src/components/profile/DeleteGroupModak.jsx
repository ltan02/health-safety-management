import React from "react";
import { Modal, Container, Box, Typography, Button } from "@mui/material";
import { useAuthContext } from "../../context/AuthContext";
import { useState } from "react";
export default function DeleteGroupModal({
  open,
  onClose,
  groupId,
  groups,
  removeGroup,
}) {
    console.log(groups);
    console.log(groupId);
  const groupData = groups.find((group) => group.id === groupId);
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="delete-group-modal-title"
      aria-describedby="delete-group-modal-description"
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
          <Typography
            component="h1"
            variant="h5"
            style={{ marginBottom: "20px" }}
          >
            Are you sure you want to delete the group {groupData.name}?
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              style={{ marginRight: "10px" }}
              onClick={() => removeGroup(groupId)}
            >
              Delete
            </Button>
            <Button variant="contained" color="primary" onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Container>
    </Modal>
  );
}
