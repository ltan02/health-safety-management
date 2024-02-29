import { useCallback } from "react";
import ReactFlow, { useNodesState, useEdgesState, addEdge } from "reactflow";
import "reactflow/dist/style.css";

import { Container } from "@mui/material";
const initialNodes = [
    {
        id: "Submitted",
        position: { x: 0, y: 0 },
        data: { label: "Submitted" },
    },
    {
        id: "Awaiting Action",
        position: { x: 0, y: 100 },
        data: { label: "Awaiting Action" },
    },
    {
        id: "Under Review",
        position: { x: 0, y: 200 },
        data: { label: "Under Review" },
    },
    {
        id: "Completed",
        position: { x: 0, y: 300 },
        data: { label: "Completed" },
    },
];

const initialEdges = [
    { id: "e1", source: "Submitted", target: "Awaiting Action" },
    { id: "e2", source: "Awaiting Action", target: "Under Review" },
];

function AdminManagement() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    return (
        <Container style={{ width: "800px", height: "700px" }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                {/* <MiniMap />
        <Controls />
        <Background /> */}
            </ReactFlow>
        </Container>
    );
}

export default AdminManagement;
