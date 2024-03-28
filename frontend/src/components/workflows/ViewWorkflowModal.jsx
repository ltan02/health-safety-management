import { useEffect } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import ReactFlow, { Controls, useNodesState, useEdgesState } from "reactflow";
import "reactflow/dist/style.css";
import useWorkflow from "../../hooks/useWorkflow";
import CustomEdge from "../../components/workflows/CustomEdge";

const edgeTypes = {
    customEdge: CustomEdge,
};

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
    outline: "none",
    height: "90%",
};

function ViewWorkflowModal({ open, handleClose, handleEdit }) {
    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);

    const { states, transitions, fetchWorkflow } = useWorkflow();

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
            <Box sx={style}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography id="view-workflow-modal-title" variant="h6" component="h2">
                        Workflow
                    </Typography>
                    <div style={{ display: "flex" }}>
                        <Button onClick={handleEdit} variant="contained" sx={{ mr: 2 }}>
                            Edit workflow
                        </Button>
                        <Button onClick={handleClose} variant="outlined">
                            Close
                        </Button>
                    </div>
                </div>

                <div style={{ flexGrow: 1, position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodesDraggable={false}
                        elementsSelectable={false}
                        panOnScroll={true}
                        edgesFocusable={false}
                        edgeTypes={edgeTypes}
                        fitView
                    >
                        <Controls showFitView={false} showInteractive={false} position="bottom-right" />
                    </ReactFlow>
                </div>
            </Box>
        </Modal>
    );
}

export default ViewWorkflowModal;
