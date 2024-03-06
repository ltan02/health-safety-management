import React, { useCallback, useEffect } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
} from "reactflow";
import "reactflow/dist/style.css";
import useWorkflow from "../../../hooks/useWorkflow";
import AddTransitionModal from "./AddTransitionModal";
import {
  Container,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Box,
  Divider,
} from "@mui/material";

function AdminManagement() {
  const [transitionModalOpen, setTransitionModalOpen] = React.useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const {
    states,
    transitions,
    loading,
    statuses,
    fetchWorkflow,
    updateCoordinate,
    deleteState,
    createTransition,
    deleteTransition,
    discardCallbacks,
    pushCallback,
    applyCallbacks,
    organizeCoordinates,
  } = useWorkflow();


  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleDragEnd = useCallback(
    (_, node) => {
      pushCallback(() => updateCoordinate(node.id, node.position));
    },
    [pushCallback, updateCoordinate]
  );

  const handleEdgesUpdated = useCallback(
    (params) => {
      onConnect(params);
      pushCallback(() => createTransition(params.source, params.target, params?.label));
    },
    [onConnect, pushCallback, createTransition]
  );

  const onEdgeDelete = useCallback(
    (id) => {
      pushCallback(() => deleteTransition(id));
    },
    [deleteTransition, pushCallback]
  );

  const onStateDelete = useCallback(
    (id) => {
      pushCallback(() => deleteState(id));
    },
    [deleteState, pushCallback]
  );
  

  const handleEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes);
      changes.forEach((change) => {
        if (change.type === "remove") {
          onEdgeDelete(change.id);
        }
      });
    },
    [onEdgesChange, onEdgeDelete]
  );

  const handleStatesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      changes.forEach((change) => {
        if (change.type === "remove") {
          onStateDelete(change.id);
        }
      });
    },
    [onEdgesChange, onEdgeDelete]
  );
  const handleDiscardChanges = () => {
    discardCallbacks();
    fetchWorkflow();
  };

  const handleSaveChanges = () => {
    applyCallbacks();
  };

  useEffect(() => {
    setNodes(states);
    setEdges(transitions);
  }, [states, transitions]);

  useEffect(() => {
    fetchWorkflow();
  }, []);

  return (
    <Container>
      <Typography variant="h4" align="left" gutterBottom>
        Workflow
      </Typography>
      <Container
        sx={{ mt: 2, border: "1px solid", width: "1000px", height: "700px" }}
        style={{
          padding: "0px",
        }}
      >
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Grid container spacing={2}>
              {Object.values(statuses).map((status) => (
                <Grid item key={status.name}>
                  <Button onClick={fetchWorkflow} variant="outlined" style={{
                    backgroundColor: status.color,
                  }}>
                    <Typography color="black">{status.name}</Typography>
                  </Button>
                </Grid>
              ))}
              <Grid item>
                <Button onClick={() => setTransitionModalOpen(true)} variant="outlined">
                  <Typography color="black">Transition</Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item>
                <Button onClick={organizeCoordinates} variant="outlined">
                  <Typography color="black">Organize</Typography>
                </Button>
              </Grid>

              <Grid item>
                <Button onClick={handleDiscardChanges} variant="outlined">
                  <Typography color="black">Discard</Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={handleSaveChanges} variant="outlined">
                  <Typography color="black">Update</Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Divider variant="fullWidth" sx={{ mt: 2, mb: 2 }} />

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleStatesChange}
          onEdgesChange={handleEdgesChange}
          onNodeDragStop={handleDragEnd}
          onConnect={handleEdgesUpdated}
          fitView
        >
          <MiniMap />
          <Controls />
        </ReactFlow>
      </Container>
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1500,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <AddTransitionModal open={transitionModalOpen} handleClose={() => setTransitionModalOpen(false)} states = {states} handleFieldSubmit={handleEdgesUpdated} transitions={transitions} />
    </Container>
  );
}

export default AdminManagement;
