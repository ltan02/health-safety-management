import React, { useCallback, useEffect } from "react";
import ReactFlow, { useNodesState, useEdgesState, addEdge, MiniMap, Controls } from "reactflow";
import "reactflow/dist/style.css";
import useWorkflow from "../../../hooks/useWorkflow";
import AddTransitionModal from "./AddTransitionModal";
import AddStateModal from "./AddStateModal";
import { Container, Button, Typography, Grid, CircularProgress, Box, Divider, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import InfoIcon from "@mui/icons-material/Info";
import WorkflowModal from "../../../components/workflows/WorkflowModal";
import AddStatusModal from "../../../components/workflows/AddStatusModal";

function AdminManagement() {
    const [transitionModalOpen, setTransitionModalOpen] = React.useState(false);
    const [stateModalOpen, setStateModalOpen] = React.useState(false);
    const [selectedStatus, setSelectedStatus] = React.useState(null);
    const [workflowModalOpen, setWorkflowModalOpen] = React.useState(false);
    const [addStatusModalOpen, setAddStatusModalOpen] = React.useState(false);
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

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const handleDragEnd = useCallback(
        (_, node) => {
            pushCallback(() => updateCoordinate(node.id, node.position));
        },
        [pushCallback, updateCoordinate],
    );

    const handleEdgesUpdated = useCallback(
        (params) => {
            onConnect(params);
            pushCallback(() => createTransition(params.source, params.target, params?.label));
        },
        [onConnect, pushCallback, createTransition],
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
    }, []);

    const onEdgeDelete = useCallback(
        (id) => {
            pushCallback(() => deleteTransition(id));
        },
        [deleteTransition, pushCallback],
    );

    const onStateDelete = useCallback(
        (id) => {
            pushCallback(() => deleteState(id));
        },
        [deleteState, pushCallback],
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
        [onEdgesChange, onEdgeDelete],
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
        [onEdgesChange, onEdgeDelete],
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
            disableGutters
            style={{
                width: "100vw",
                maxHeight: "100vh",
                height: "calc(100vh - 64px)",
                paddingTop: "20px",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Container
                disableGutters
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    overflow: "hidden",
                    height: "100%",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: 600 }}>
                        Workflow for Incident Reports
                    </Typography>
                    <div style={{ display: "flex" }}>
                        <Button
                            onClick={() => setAddStatusModalOpen(true)}
                            variant="text"
                            style={{
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <AddIcon
                                    sx={{
                                        width: "20px",
                                        height: "20px",
                                        backgroundColor: "#f0f0f0",
                                        borderRadius: "2px",
                                    }}
                                />
                            </Box>
                            <Typography
                                variant="body1"
                                sx={{
                                    mt: 0.5,
                                    fontSize: "12px",
                                    color: "black",
                                }}
                            >
                                Status
                            </Typography>
                        </Button>
                        <Button
                            onClick={() => {}}
                            variant="text"
                            style={{
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <MoveDownIcon
                                    sx={{
                                        width: "20px",
                                        height: "20px",
                                        backgroundColor: "#f0f0f0",
                                        borderRadius: "2px",
                                    }}
                                />
                            </Box>
                            <Typography
                                variant="body1"
                                sx={{
                                    mt: 0.5,
                                    fontSize: "12px",
                                    color: "black",
                                }}
                            >
                                Transition
                            </Typography>
                        </Button>
                        <Button
                            onClick={() => {}}
                            variant="text"
                            style={{
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <ElectricBoltIcon
                                    sx={{
                                        width: "20px",
                                        height: "20px",
                                        backgroundColor: "#f0f0f0",
                                        borderRadius: "2px",
                                    }}
                                />
                            </Box>
                            <Typography
                                variant="body1"
                                sx={{
                                    mt: 0.5,
                                    fontSize: "12px",
                                    color: "black",
                                }}
                            >
                                Rules
                            </Typography>
                        </Button>
                    </div>
                    <div>
                        <Button
                            onClick={() => {}}
                            variant="contained"
                            sx={{
                                height: "32px",
                                fontWeight: 500,
                                color: "#ffffff",
                                paddingX: "10px",
                                fontSize: "14px",
                                marginRight: "10px",
                            }}
                        >
                            Update workflow
                        </Button>
                        <Button
                            onClick={() => {}}
                            variant="text"
                            sx={{
                                height: "32px",
                                fontWeight: 500,
                                color: "#000",
                                paddingX: "10px",
                                fontSize: "14px",
                                backgroundColor: "#ffffff",
                            }}
                        >
                            Discard changes
                        </Button>
                    </div>
                </div>
                <Divider variant="fullWidth" sx={{ my: 2, width: "100vw", borderBottomWidth: 2 }} />
                <div style={{ flexGrow: 1, position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
                    <IconButton
                        aria-label="information"
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            margin: "8px",
                            zIndex: 1000,
                        }}
                        onClick={() => setWorkflowModalOpen(true)}
                    >
                        <InfoIcon />
                    </IconButton>
                    {workflowModalOpen && (
                        <WorkflowModal open={workflowModalOpen} handleClose={() => setWorkflowModalOpen(false)} />
                    )}
                    {addStatusModalOpen && (
                        <AddStatusModal open={addStatusModalOpen} handleClose={() => setAddStatusModalOpen(false)} />
                    )}
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={handleStatesChange}
                        onEdgesChange={handleEdgesChange}
                        onNodeDragStop={handleDragEnd}
                        onConnect={handleEdgesUpdated}
                        fitView
                        style={{ width: "100%", height: "100%" }}
                    >
                        <MiniMap />
                        <Controls />
                    </ReactFlow>
                </div>
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
