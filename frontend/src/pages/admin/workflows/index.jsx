import { useEffect, useState } from "react";
import { Box, TextField, Container, Typography, Paper } from "@mui/material";
import WorkflowTab from "./WorkflowTab";
import Workflow from "./Workflow";
import useWorkflow from "../../../hooks/useWorkflow";

export default function AdminWorkflow() {
    const [activeTasks, setActiveTasks] = useState([]);
    const [inactiveTasks, setInactiveTasks] = useState([]);
    const [search, setSearch] = useState("");
    const {fetchAllWorkflows, workflows} = useWorkflow();

    useEffect(() => {
        fetchAllWorkflows();
    }, []);

    useEffect(() => {
        setActiveTasks(workflows.filter((task) => task.active));
        setInactiveTasks(workflows.filter((task) => !task.active));
    }, [workflows, search]);

    function handleSearch(event) {
        const q = event.target.value.toLowerCase();
        setSearch(q);
    }

    return (
        <Container
            maxWidth="md"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                mt: 5,
            }}
        >
            <Typography variant="h4" fontWeight={600}>
                Workflow
            </Typography>
            <Paper elevation={3} sx={{ width: "80vw" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                    <TextField fullWidth onChange={handleSearch} value={search} placeholder="Search workflows..." />
                </Box>
                <WorkflowTab labels={["Active", "Inactive"]}>
                    <Workflow workflows={activeTasks} sx={{ py: 2 }} />
                    <Workflow workflows={inactiveTasks} sx={{ py: 2 }} />
                </WorkflowTab>
            </Paper>
        </Container>
    );
}
