import { useCallback, useEffect } from "react";
import ReactFlow, { useNodesState, useEdgesState, addEdge } from "reactflow";
import "reactflow/dist/style.css";
import useAxios from "../../../hooks/useAxios";
import useGraph from "../../../hooks/useGraph";

import { Container } from "@mui/material";

function AdminManagement() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const {
    states,
    flows,
    fetchGraph,
    updateCoordinate,
    createFlow,
    deleteFlow,
  } = useGraph();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleDragEnd = (_, node) => {
    updateCoordinate(node.id, node.position);
  };

  const handleEdgesUpdated = (params) => {
    onConnect(params);
    createFlow(params.source, params.target);
  };

  const onEdgeDelete = useCallback((id) => {
    deleteFlow(id);
  }, [deleteFlow]);


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
        onEdgesChange={handleEdgesChange}
        onNodeDragStop={handleDragEnd}
        onConnect={handleEdgesUpdated}
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
