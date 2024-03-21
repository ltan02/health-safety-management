import { useEffect, useState } from "react";
import { Box, TextField, Container, Typography, Paper, Button } from "@mui/material";
import useWorkflow from "../../../hooks/useWorkflow";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import DeleteWorkflowModal from "../../../components/workflows/DeleteWorkflowModal";
import useAxios from "../../../hooks/useAxios";
import ActiveWorkflowModal from "../../../components/workflows/ActiveWorkflowModal";

export default function AdminWorkflow() {
    const [activeTasks, setActiveTasks] = useState([]);
    const [inactiveTasks, setInactiveTasks] = useState([]);
    const [search, setSearch] = useState("");
    const [activeModalOpen, setActiveModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const { sendRequest } = useAxios();
    const { fetchAllWorkflows, workflows } = useWorkflow();
    const [workflow, setWorkflow] = useState(null);
    const [activeWorkflow, setActiveWorkflow] = useState(null);

    useEffect(() => {
        fetchAllWorkflows();
    }, []);

    useEffect(() => {
        setActiveWorkflow(workflows.find((workflow) => workflow.active));
    }, [workflows]);

    useEffect(() => {
        const filteredWorkflows = workflows.filter((workflow) =>
            formatName(workflow.name).toLowerCase().includes(search),
        );
        setActiveTasks(filteredWorkflows.filter((task) => task.active));
        setInactiveTasks(filteredWorkflows.filter((task) => !task.active));
    }, [workflows, search]);

    function handleSearch(event) {
        const q = event.target.value.toLowerCase();
        setSearch(q);
    }

    const formatName = (name) => {
        return name
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    const handleSetActive = async () => {
        await sendRequest({
            url: `/workflows/${activeWorkflow.id}`,
            method: "PUT",
            body: {
                ...activeWorkflow,
                active: false,
                lastUpdated: new Date(),
            },
        });

        await sendRequest({
            url: `/workflows/${workflow.id}`,
            method: "PUT",
            body: {
                ...workflow,
                active: true,
                lastUpdated: new Date(),
            },
        });
        fetchAllWorkflows();
        setActiveModalOpen(false);
        setActiveWorkflow(workflow);
        setWorkflow(null);
    };

    const handleView = async () => {};

    const handleDelete = async () => {
        await sendRequest({
            url: `/workflows/${workflow.id}`,
            method: "DELETE",
        });
        fetchAllWorkflows();
        setDeleteModalOpen(false);
        setWorkflow(null);
    };

    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                mt: 5,
                width: "90%",
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
                <Typography variant="h4" fontWeight={600}>
                    Workflow Management
                </Typography>
                <Typography variant="body" fontWeight={400}>
                    Use workflow management to define how incident reports move between statuses. You can create, edit,
                    and delete workflows here. However, only one workflow can be active at a time.
                </Typography>
            </div>
            <Paper elevation={3} sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2, display: "flex" }}>
                    <TextField fullWidth onChange={handleSearch} value={search} placeholder="Search workflows..." />
                    <Button variant="contained" color="primary" sx={{ ml: "50px", width: "180px" }}>
                        Create workflow
                    </Button>
                </Box>
                <Typography variant="h6" sx={{ mb: 2, ml: 2 }}>
                    Active Workflow
                </Typography>
                <TableContainer component={Paper}>
                    <Table aria-label="active workflows table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, width: 300 }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Last Updated</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Set Active</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>View</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {activeTasks.map((workflow) => (
                                <TableRow key={workflow.id}>
                                    <TableCell sx={{ width: 300 }}>{formatName(workflow.name)}</TableCell>
                                    <TableCell>{formatDate(new Date(workflow.lastUpdated))}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" disabled>
                                            Set Active
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => {
                                                setViewModalOpen(true);
                                                setWorkflow(workflow);
                                            }}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => {
                                                setDeleteModalOpen(true);
                                                setWorkflow(workflow);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Typography variant="h6" sx={{ my: 3, ml: 2 }}>
                    Inactive Workflows
                </Typography>
                <TableContainer component={Paper}>
                    <Table aria-label="inactive workflows table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, width: 300 }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Last Updated</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Set Active</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>View</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {inactiveTasks.map((workflow) => (
                                <TableRow key={workflow.id}>
                                    <TableCell sx={{ width: 300 }}>{formatName(workflow.name)}</TableCell>
                                    <TableCell>{formatDate(new Date(workflow.lastUpdated))}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => {
                                                setActiveModalOpen(true);
                                                setWorkflow(workflow);
                                            }}
                                        >
                                            Set Active
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => {
                                                setViewModalOpen(true);
                                                setWorkflow(workflow);
                                            }}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => {
                                                setDeleteModalOpen(true);
                                                setWorkflow(workflow);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            {deleteModalOpen && (
                <DeleteWorkflowModal
                    open={deleteModalOpen}
                    handleClose={() => {
                        setDeleteModalOpen(false);
                        setWorkflow(null);
                    }}
                    handleDeleteWorkflow={handleDelete}
                />
            )}
            {activeModalOpen && (
                <ActiveWorkflowModal
                    open={activeModalOpen}
                    handleClose={() => {
                        setActiveModalOpen(false);
                        setWorkflow(null);
                    }}
                    handleSetActive={handleSetActive}
                />
            )}
        </Container>
    );
}
