import React, { useCallback, useEffect } from "react";
import ReactFlow, { useNodesState, useEdgesState, addEdge, MiniMap, Controls } from "reactflow";
import "reactflow/dist/style.css";
import useWorkflow from "../../../hooks/useWorkflow";
import AddTransitionModal from "../../../components/workflows/AddTransitionModal";
import { Container, Button, Typography, CircularProgress, Box, Divider, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import InfoIcon from "@mui/icons-material/Info";
import WorkflowModal from "../../../components/workflows/WorkflowModal";
import AddStatusModal from "../../../components/workflows/AddStatusModal";
import CustomEdge from "../../../components/workflows/CustomEdge";

const edgeTypes = {
    customEdge: CustomEdge,
};

function AdminManagement() {
    const [workflowModalOpen, setWorkflowModalOpen] = React.useState(false);
    const [addStatusModalOpen, setAddStatusModalOpen] = React.useState(false);
    const [statusName, setStatusName] = React.useState("");
    const [addTransitionModalOpen, setAddTransitionModalOpen] = React.useState(false);
    const [transitionName, setTransitionName] = React.useState("");
    const [fromStatusNames, setFromStatusNames] = React.useState(null);
    const [toStatusNames, setToStatusNames] = React.useState(null);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);
    const { states, transitions, loading, fetchWorkflow, updateCoordinate, addState, deleteState, createTransition } =
        useWorkflow();

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const handleDragEnd = useCallback(
        (_, node) => {
            updateCoordinate(node.id, node.position);
        },
        [updateCoordinate],
    );

    const handleEdgesUpdated = useCallback(
        (params) => {
            onConnect(params);
            createTransition(params.source, params.target, params?.label);
        },
        [onConnect, createTransition],
    );

    const onStateDelete = useCallback(
        (id) => {
            deleteState(id);
        },
        [deleteState],
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
        [onNodesChange, onStateDelete],
    );

    const handleStatusNameChange = (event) => {
        setStatusName(event.target.value);
    };

    const handleAddStatus = () => {
        addState(statusName);
        setAddStatusModalOpen(false);
        setStatusName("");
    };

    const handleAddTransition = () => {
        createTransition(fromStatusNames, toStatusNames, transitionName);
        setAddTransitionModalOpen(false);
        setFromStatusNames(null);
        setToStatusNames(null);
        setTransitionName("");
    };

    const handleTransitionNameChange = (event) => {
        setTransitionName(event.target.value);
    };

    const handleFromStatusChange = (event) => {
        setFromStatusNames(event.target.value);
    };

    const handleToStatusChange = (event) => {
        setToStatusNames(event.target.value);
    };

    useEffect(() => {
        setNodes(states);
        setEdges(transitions);
    }, [setEdges, setNodes, states, transitions]);

    useEffect(() => {
        fetchWorkflow();
    }, [fetchWorkflow]);

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
                            onClick={() => setAddTransitionModalOpen(true)}
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
                        {/* <Button
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
                        </Button> */}
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
                        <AddStatusModal
                            open={addStatusModalOpen}
                            handleClose={() => {
                                setAddStatusModalOpen(false);
                                setStatusName("");
                            }}
                            statusName={statusName}
                            handleStatusNameChange={handleStatusNameChange}
                            handleAddStatus={handleAddStatus}
                        />
                    )}
                    {addTransitionModalOpen && (
                        <AddTransitionModal
                            open={addTransitionModalOpen}
                            handleClose={() => {
                                setAddTransitionModalOpen(false);
                                setFromStatusNames(null);
                                setToStatusNames(null);
                                setTransitionName("");
                            }}
                            statuses={states}
                            transitionName={transitionName}
                            handleTransitionNameChange={handleTransitionNameChange}
                            handleAddTransition={handleAddTransition}
                            fromStatusNames={fromStatusNames}
                            handleFromStatusChange={handleFromStatusChange}
                            toStatusNames={toStatusNames}
                            handleToStatusChange={handleToStatusChange}
                        />
                    )}
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        edgeTypes={edgeTypes}
                        onNodesChange={handleStatesChange}
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
        </Container>
    );
}

export default AdminManagement;
