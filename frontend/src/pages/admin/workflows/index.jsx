import { useEffect, useState } from "react";
import { Container, Typography, Button, Box, CircularProgress } from "@mui/material";
import useWorkflow from "../../../hooks/useWorkflow";
import { useAuthContext } from "../../../context/AuthContext";
import ReactFlow, { Controls, useNodesState, useEdgesState } from "reactflow";
import "reactflow/dist/style.css";
import { isPrivileged } from "../../../utils/permissions";
import CustomEdge from "../../../components/workflows/CustomEdge";
import AdminManagement from "../management";

const edgeTypes = {
    customEdge: CustomEdge,
};

export default function AdminWorkflow() {
    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);
    const { user } = useAuthContext();
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { states, transitions, fetchWorkflow } = useWorkflow();

    useEffect(() => {
        setNodes(states);
        setEdges(transitions);
    }, [setEdges, setNodes, states, transitions]);

    useEffect(() => {
        const getWorkflow = async () => {
            try {
                setIsLoading(true);
                await fetchWorkflow();
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (fetchWorkflow) {
            getWorkflow();
        }
    }, [fetchWorkflow]);

    return (
        <>
            <Container
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 5,
                    width: "90%",
                    height: "85vh",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        justifyContent: "start",
                        width: "100%",
                        marginBottom: "20px",
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: 15 }}>
                        <Typography variant="h4" fontWeight={600}>
                            Workflow Management
                        </Typography>
                        {isPrivileged(user?.role) && (
                            <Button onClick={() => setEditModalOpen(true)} variant="contained" sx={{ mr: 2 }}>
                                Edit workflow
                            </Button>
                        )}
                    </div>
                    <Typography variant="body" fontWeight={400}>
                        Use workflow management to define how incident reports move between statuses.
                    </Typography>
                </div>
                <div style={{ overflow: "hidden", width: "100%", height: "100%" }}>
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
            </Container>
            {editModalOpen && (
                <AdminManagement
                    open={editModalOpen}
                    handleClose={async () => {
                        setEditModalOpen(false);
                        try {
                            setIsLoading(true);
                            await fetchWorkflow();
                        } catch (error) {
                            console.error(error);
                        } finally {
                            setIsLoading(false);
                        }
                    }}
                />
            )}
            {isLoading && (
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
                        backgroundColor: "rgba(0, 0, 0, 0)",
                        zIndex: 1500,
                    }}
                >
                    <CircularProgress />
                </Box>
            )}
        </>
    );
}
