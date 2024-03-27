import React, { useCallback, useEffect } from "react";
import ReactFlow, { useNodesState, useEdgesState, MiniMap, Controls } from "reactflow";
import "reactflow/dist/style.css";
import useWorkflow from "../../../hooks/useWorkflow";
import AddTransitionModal from "../../../components/workflows/AddTransitionModal";
import { Button, Typography, CircularProgress, Box, Divider, IconButton, Modal } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import InfoIcon from "@mui/icons-material/Info";
import WorkflowModal from "../../../components/workflows/WorkflowModal";
import AddStatusModal from "../../../components/workflows/AddStatusModal";
import CustomEdge from "../../../components/workflows/CustomEdge";
import DiscardChangesModal from "../../../components/workflows/DiscardChangesModal";
import CloseIcon from "@mui/icons-material/Close";
import SaveWorkflowModal from "../../../components/workflows/SaveWorkflowModal";

const edgeTypes = {
    customEdge: CustomEdge,
};

function AdminManagement({ open, handleClose }) {
    const [workflowModalOpen, setWorkflowModalOpen] = React.useState(false);
    const [addStatusModalOpen, setAddStatusModalOpen] = React.useState(false);
    const [statusName, setStatusName] = React.useState("");
    const [addTransitionModalOpen, setAddTransitionModalOpen] = React.useState(false);
    const [transitionName, setTransitionName] = React.useState("");
    const [fromStatusNames, setFromStatusNames] = React.useState(null);
    const [toStatusNames, setToStatusNames] = React.useState(null);
    const [discardChangesModalOpen, setDiscardChangesModalOpen] = React.useState(false);
    const [saveChangesModalOpen, setSaveChangesModalOpen] = React.useState(false);
    const [selectedNode, setSelectedNode] = React.useState(null);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);
    const {
        states,
        transitions,
        loading,
        fetchWorkflow,
        updateCoordinate,
        addState,
        deleteState,
        createTransition,
        discardChanges,
        saveChanges,
    } = useWorkflow();

    const onConnect = useCallback(
        (params) => {
            setFromStatusNames(states.find((state) => params.source === state.id));
            setToStatusNames(states.find((state) => params.target === state.id));
            setAddTransitionModalOpen(true);
        },
        [states],
    );

    const handleDragEnd = useCallback(
        (_, node) => {
            updateCoordinate(node.id, node.position);
        },
        [updateCoordinate],
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

    const handleEdgesUpdated = useCallback(
        (params) => {
            onConnect(params);
            createTransition(params.source, params.target, params?.label);
        },
        [onConnect, createTransition],
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

    const handleDiscardChanges = () => {
        discardChanges();
        setDiscardChangesModalOpen(false);
        handleClose();
    };

    useEffect(() => {
        setNodes(states);
        setEdges(transitions);
    }, [setEdges, setNodes, states, transitions]);

    useEffect(() => {
        fetchWorkflow();
    }, [fetchWorkflow]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="view-workflow-modal-title"
            aria-describedby="view-workflow-modal-description"
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "100vw",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    borderRadius: 1,
                    outline: "none",
                    height: "100vh",
                    paddingTop: 2,
                }}
            >
                <Box
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
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: 10,
                        }}
                    >
                        <div style={{ display: "flex" }}>
                            <CloseIcon
                                onClick={() => setDiscardChangesModalOpen(true)}
                                style={{ cursor: "pointer", marginRight: "20px", marginLeft: 20 }}
                            />
                            <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: 600 }}>
                                Workflow for Incident Reports
                            </Typography>
                        </div>
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
                                onClick={() => setSaveChangesModalOpen(true)}
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
                                onClick={() => setDiscardChangesModalOpen(true)}
                                variant="text"
                                sx={{
                                    height: "32px",
                                    fontWeight: 500,
                                    color: "#000",
                                    paddingX: "10px",
                                    fontSize: "14px",
                                    backgroundColor: "#ffffff",
                                    marginRight: 5,
                                }}
                            >
                                Discard changes
                            </Button>
                        </div>
                    </div>
                    <Divider variant="fullWidth" sx={{ my: 2, width: "100vw", borderBottomWidth: 2 }} />
                    <div
                        style={{ flexGrow: 1, position: "relative", overflow: "hidden", width: "100%", height: "100%" }}
                    >
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
                                statuses={states.filter((state) => state.data.label !== "START")}
                                transitionName={transitionName}
                                handleTransitionNameChange={handleTransitionNameChange}
                                handleAddTransition={handleAddTransition}
                                fromStatusNames={fromStatusNames}
                                handleFromStatusChange={handleFromStatusChange}
                                toStatusNames={toStatusNames}
                                handleToStatusChange={handleToStatusChange}
                            />
                        )}
                        {discardChangesModalOpen && (
                            <DiscardChangesModal
                                open={discardChangesModalOpen}
                                handleClose={() => setDiscardChangesModalOpen(false)}
                                handleDiscardChanges={handleDiscardChanges}
                            />
                        )}
                        {saveChangesModalOpen && (
                            <SaveWorkflowModal
                                open={saveChangesModalOpen}
                                handleClose={() => setSaveChangesModalOpen(false)}
                                handleSaveChanges={() => {
                                    saveChanges();
                                    setSaveChangesModalOpen(false);
                                    handleClose();
                                }}
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
                            onSelectionChange={(elements) => setSelectedNode(elements?.nodes?.[0] || null)}
                        >
                            <MiniMap />
                            <Controls />
                        </ReactFlow>
                    </div>
                </Box>
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
            </Box>
        </Modal>
    );
}

export default AdminManagement;
