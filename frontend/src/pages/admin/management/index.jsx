import { useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import {EMPLOYEE_COLUMNS, ADMIN_COLUMNS} from "../../../constants/board";

import { Container } from "@mui/material";
const initialNodes = [
  {
    id: EMPLOYEE_COLUMNS[0].id,
    position: { x: 0, y: 0 },
    data: { label: EMPLOYEE_COLUMNS[0].title },
  },
  {
    id: EMPLOYEE_COLUMNS[1].id,
    position: { x: 0, y: 100 },
    data: { label: EMPLOYEE_COLUMNS[1].title },
  },
  {
    id: EMPLOYEE_COLUMNS[2].id,
    position: { x: 0, y: 200 },
    data: { label: EMPLOYEE_COLUMNS[2].title },
  },
  {
    id: EMPLOYEE_COLUMNS[3].id,
    position: { x: 0, y: 300 },
    data: { label: EMPLOYEE_COLUMNS[3].title },
  },
];

const initialEdges = [
  { id: "e1", source: EMPLOYEE_COLUMNS[0].id, target: EMPLOYEE_COLUMNS[1].id },
  { id: "e2", source: EMPLOYEE_COLUMNS[1].id, target: EMPLOYEE_COLUMNS[2].id },
];

function AdminManagement() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

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
