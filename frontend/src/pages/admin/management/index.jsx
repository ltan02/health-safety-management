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
import AddStateModal from "./AddStateModal";
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
  const [stateModalOpen, setStateModalOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const {
    states,
    transitions,
    loading,
    statuses,
    fetchWorkflow,
    updateCoordinate,
    createState,
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
      pushCallback(() =>
        createTransition(params.source, params.target, params?.label)
      );
    },
    [onConnect, pushCallback, createTransition]
  );

  const handleStateModalOpen = (status) => {
    setStateModalOpen(true);
    setSelectedStatus({
      id: status,
      name: statuses[status].name,
      color: statuses[status].color,
    });
  };

  const handleStateUpdated = useCallback((name) => {
    const newState = {
      id: `temp-${Date.now()}`,
      data: { label: name },
      position: { x: 0, y: 0 },
      style: {
        backgroundColor: selectedStatus.color,
        fontWeight: "bold",
        border: `solid 2px ${selectedStatus.color}`,
      },
    };
    setNodes([...nodes, newState]);
    pushCallback(() => createState(name, selectedStatus.id, newState.position));
  });

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
    <Container
      maxWidth="false"
      disableGutters
      style={{ height: "100vh", display: "flex", flexDirection: "column", paddingBottom: "50px"}}
    >
      <Typography
        variant="h4"
        align="left"
        gutterBottom
        sx={{ margin: "20px" }}
      >
        Workflow
      </Typography>
      <Container
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          border: "1px solid",
          padding: "20px",
          overflow: "hidden",
        }}
      >
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={12} md={12}>
            <Grid container spacing={2}>
              {Object.values(statuses).map((status, index) => (
                <Grid item key={status.name}>
                  <Button
                    onClick={() =>
                      handleStateModalOpen(Object.keys(statuses)[index])
                    }
                    variant="contained"
                    sx={{
                      backgroundColor: status.color,
                      "&:hover": {
                        backgroundColor: status.color,
                      },
                    }}
                  >
                    <Typography>{status.name}</Typography>
                  </Button>
                </Grid>
              ))}
              <Grid item>
                <Button
                  onClick={() => setTransitionModalOpen(true)}
                  variant="contained"
                >
                  <Typography>Transition</Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={organizeCoordinates} variant="contained">
                  <Typography>Organize</Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={handleDiscardChanges} variant="contained">
                  <Typography>Discard</Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={handleSaveChanges} variant="contained">
                  <Typography>Update</Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ flexGrow: 1, position: "relative" }}>
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
        </Box>
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
      <AddTransitionModal
        open={transitionModalOpen}
        handleClose={() => setTransitionModalOpen(false)}
        states={states}
        handleFieldSubmit={handleEdgesUpdated}
        transitions={transitions}
      />
      <AddStateModal
        open={stateModalOpen}
        handleClose={() => setStateModalOpen(false)}
        handleFieldSubmit={handleStateUpdated}
        selectedStatus={selectedStatus}
      />
    </Container>
  );
}

export default AdminManagement;
