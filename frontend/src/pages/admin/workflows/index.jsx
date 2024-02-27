import { useEffect, useState } from "react";
import { Box, TextField, Container, Typography, Paper } from "@mui/material";
import WorkflowTab from "./WorkflowTab";
import Workflow from "./Workflow";

export default function AdminWorkflow() {
    const [tasks, setTasks] = useState([]);
    const [activeTasks, setActiveTasks] = useState([]);
    const [inactiveTasks, setInactiveTasks] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        setTasks([]);
    }, []);

    useEffect(() => {
        const filteredTasks = search ? tasks.filter((task) => task.title.toLowerCase().includes(search)) : tasks;
        // setActiveTasks(filteredTasks.filter((task) => task.status !== STATE.INACTIVE));
        // setInactiveTasks(filteredTasks.filter((task) => task.status === STATE.INACTIVE));
    }, [tasks, search]);

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
                    <TextField fullWidth onChange={handleSearch} value={search} placeholder="Search tasks..." />
                </Box>
                <WorkflowTab labels={["Active", "Inactive"]}>
                    <Workflow tasks={activeTasks} sx={{ py: 2 }} />
                    <Workflow tasks={inactiveTasks} sx={{ py: 2 }} />
                </WorkflowTab>
            </Paper>
        </Container>
    );
}
