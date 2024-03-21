import { useEffect, useState } from "react";
import { Box, TextField, Container, Typography, Paper } from "@mui/material";
import useWorkflow from "../../../hooks/useWorkflow";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

export default function AdminWorkflow() {
    const [activeTasks, setActiveTasks] = useState([]);
    const [inactiveTasks, setInactiveTasks] = useState([]);
    const [search, setSearch] = useState("");
    const { fetchAllWorkflows, workflows } = useWorkflow();

    useEffect(() => {
        fetchAllWorkflows();
    }, []);

    useEffect(() => {
        const filteredWorkflows = workflows.filter((workflow) => workflow.name.toLowerCase().includes(search));
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

    return (
        <Container
            maxWidth="md"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                mt: 5,
                width: "90%",
            }}
        >
            <Typography variant="h4" fontWeight={600} gutterBottom>
                Workflow Management
            </Typography>
            <Paper elevation={3} sx={{ width: "90vw" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                    <TextField fullWidth onChange={handleSearch} value={search} placeholder="Search workflows..." />
                </Box>
                <Typography variant="h6" sx={{ mb: 2, ml: 2 }}>
                    Active Workflows
                </Typography>
                <TableContainer component={Paper}>
                    <Table aria-label="active workflows table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Included in Projects</TableCell>
                                <TableCell>Included in Workflow Schemes</TableCell>
                                <TableCell>Last Updated</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {activeTasks.map((workflow) => (
                                <TableRow key={workflow.id}>
                                    <TableCell>{formatName(workflow.name)}</TableCell>
                                    <TableCell>NOT IN USE</TableCell>
                                    <TableCell>NOT IN USE</TableCell>
                                    <TableCell>{new Date(workflow.lastUpdated).toLocaleDateString()}</TableCell>
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
                                <TableCell>Title</TableCell>
                                <TableCell>Included in Projects</TableCell>
                                <TableCell>Included in Workflow Schemes</TableCell>
                                <TableCell>Last Updated</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {inactiveTasks.map((workflow) => (
                                <TableRow key={workflow.id}>
                                    <TableCell>{formatName(workflow.name)}</TableCell>
                                    <TableCell>NOT IN USE</TableCell>
                                    <TableCell>NOT IN USE</TableCell>
                                    <TableCell>{new Date(workflow.lastUpdated).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
}
