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
import { EMPLOYEE_COLUMNS } from "../../../constants/board";

import { Container } from "@mui/material";
import ManagementHeader from "./ManagementHeader";
let y_coordinate = 0;
const initialNode = {
  id: "start",
  type: "input",
  position: { x: 0, y:0 },
  data: { label: "Start" },
}

const initialNodes = [initialNode, ...EMPLOYEE_COLUMNS.map((item) => {
  return {
    id: item.id,
    position: { x: 0, y: (y_coordinate += 100) },
    data: { label: item.title },
  };
})]

const initialEdges = [
  { id: "e1", source: "start", target: EMPLOYEE_COLUMNS[0].id },
];

function AdminManagement() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  console.log(nodes);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <Container style={{ width: "2000px", height: "600px"}}>
      <ManagementHeader columns={EMPLOYEE_COLUMNS} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </Container>
  );
}

export default AdminManagement;
