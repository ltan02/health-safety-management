import { useCallback, useEffect } from "react";
import ReactFlow, { useNodesState, useEdgesState, addEdge } from "reactflow";
import "reactflow/dist/style.css";
import useAxios from "../../../hooks/useAxios";
import useGraph from "../../../hooks/useGraph";

import { Container } from "@mui/material";

function AdminManagement() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { states, flows, fetchGraph } = useGraph();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    const fetchData = async () => {
      await fetchGraph();
    };
    fetchData();
  }, []);

  useEffect(() => {
    setNodes(states);
    setEdges(flows);
  }, [states, flows]);

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
