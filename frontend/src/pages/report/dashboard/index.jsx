import { useState } from "react";
import ChatIcon from "@mui/icons-material/Chat";
import { Box, Grid, Fab } from "@mui/material";
import { BarChart, LineChart, SparkLineChart, PieChart, ScatterChart } from "@mui/x-charts";
import { scatterPlotData } from "../initialData.js";
import Chatbot from "../../../components/report/Chatbot.jsx";

function ReportDashboard() {
    const [chatbotVisible, setChatbotVisible] = useState(false);
    const toggleChatbot = () => {
        setChatbotVisible(!chatbotVisible);
    };

    return (
        <div>
            <h1>Dashboard Reports</h1>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <BarChart
                        xAxis={[{ scaleType: "band", data: ["group A", "group B", "group C"] }]}
                        series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
                        height={350}
                    />
                </Grid>
                <Grid item xs={4}>
                    <LineChart
                        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                        series={[
                            {
                                data: [2, 5.5, 2, 8.5, 1.5, 5],
                            },
                        ]}
                        height={350}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Box sx={{ flexGrow: 1 }}>
                        <SparkLineChart data={[3, -10, -2, 5, 7, -2, 4, 6]} height={100} area />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <SparkLineChart data={[3, -10, -2, 5, 7, -2, 4, 6]} height={350} curve="natural" area />
                    </Box>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <BarChart
                        series={[
                            { data: [3, 4, 1, 6, 5], stack: "A", label: "Series A1" },
                            { data: [4, 3, 1, 5, 8], stack: "A", label: "Series A2" },
                            { data: [4, 2, 5, 4, 1], stack: "B", label: "Series B1" },
                            { data: [2, 8, 1, 3, 1], stack: "B", label: "Series B2" },
                            { data: [10, 6, 5, 8, 9], label: "Series C1" },
                        ]}
                        height={350}
                    />
                </Grid>
                <Grid item xs={4}>
                    <ScatterChart
                        height={350}
                        series={[
                            {
                                label: "Series A",
                                data: scatterPlotData.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
                            },
                            {
                                label: "Series B",
                                data: scatterPlotData.map((v) => ({ x: v.x1, y: v.y2, id: v.id })),
                            },
                        ]}
                    />
                </Grid>
                <Grid item xs={4}>
                    <PieChart
                        series={[
                            {
                                data: [
                                    { id: 0, value: 10, label: "series A" },
                                    { id: 1, value: 15, label: "series B" },
                                    { id: 2, value: 20, label: "series C" },
                                ],
                                innerRadius: 60,
                                outerRadius: 100,
                            },
                        ]}
                        height={350}
                    />
                </Grid>
            </Grid>
            <Fab
                color="primary"
                aria-label="chat"
                sx={{ position: "fixed", bottom: 16, right: 16 }}
                onClick={toggleChatbot}
            >
                <ChatIcon />
            </Fab>
            {chatbotVisible && (
                <div
                    style={{
                        position: "fixed",
                        bottom: 80,
                        right: 80,
                        zIndex: 1500,
                        display: chatbotVisible ? "block" : "none",
                    }}
                >
                    <Chatbot />
                </div>
            )}
        </div>
    );
}

export default ReportDashboard;
