import { Grid, CardActionArea, CardContent, Typography, Card, Fab } from "@mui/material";
import { BarChart, LineChart, PieChart, ScatterChart } from "@mui/x-charts";
import { useNavigate } from "react-router-dom";
import { data } from "./initialData.js";
import Chatbot from "../../components/report/Chatbot.jsx";
import ChatIcon from "@mui/icons-material/Chat";
import Draggable from "react-draggable";
import { useState } from "react";

const reportCardBarChart = (
    <Card sx={{ maxWidth: 500, maxHeight: 450 }}>
        <CardActionArea>
            <CardContent>
                <BarChart
                    xAxis={[{ scaleType: "band", data: ["group A", "group B", "group C"] }]}
                    series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
                    height={350}
                />
                <Typography gutterBottom variant="h5" component="div">
                    Bar Graph
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    This interactive graph provides an in-depth overview of proportion of the incident for this quarter
                    and the potential of future risk by leveraging a comprehensive dataset from firebase.
                </Typography>
            </CardContent>
        </CardActionArea>
    </Card>
);

const reportCardLineChart = (
    <Card sx={{ maxWidth: 500, maxHeight: 450 }}>
        <CardActionArea>
            <CardContent>
                <LineChart
                    xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                    series={[
                        {
                            data: [2, 5.5, 2, 8.5, 1.5, 5],
                        },
                    ]}
                    height={350}
                />
                <Typography gutterBottom variant="h5" component="div">
                    Line Graph
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    This interactive graph provides an in-depth overview of proportion of the incident for this quarter
                    and the potential of future risk by leveraging a comprehensive dataset from firebase.
                </Typography>
            </CardContent>
        </CardActionArea>
    </Card>
);

const reportCardScatterChart = (
    <Card sx={{ maxWidth: 500, maxHeight: 450 }}>
        <CardActionArea>
            <CardContent>
                <ScatterChart
                    height={350}
                    series={[
                        {
                            label: "Series A",
                            data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
                        },
                        {
                            label: "Series B",
                            data: data.map((v) => ({ x: v.x1, y: v.y2, id: v.id })),
                        },
                    ]}
                />
                <Typography gutterBottom variant="h5" component="div">
                    Scatter Plot
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    This interactive graph provides an in-depth overview of proportion of the incident for this quarter
                    and the potential of future risk by leveraging a comprehensive dataset from firebase.
                </Typography>
            </CardContent>
        </CardActionArea>
    </Card>
);

const reportCardPieChart = (
    <Card sx={{ maxWidth: 500, maxHeight: 450 }}>
        <CardActionArea>
            <CardContent>
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
                <Typography gutterBottom variant="h5" component="div">
                    Pie Chart
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    This interactive graph provides an in-depth overview of proportion of the incident for this quarter
                    and the potential of future risk by leveraging a comprehensive dataset from firebase.
                </Typography>
            </CardContent>
        </CardActionArea>
    </Card>
);

function ReportOverview() {

    const [chatbotVisible, setChatbotVisible] = useState(false);
    const toggleChatbot = () => {
        setChatbotVisible(!chatbotVisible);
    };
    
    const navigate = useNavigate();

    const handleBarClick = () => {
        navigate("/report/bar");
    };

    const handleScatterClick = () => {
        navigate("/report/scatter");
    };

    const handleLineClick = () => {
        navigate("/report/line");
    };

    const handlePieClick = () => {
        navigate("/report/pie");
    };

    return (
        <div>
            <h1>Overview</h1>
            <Grid container sx={{ p: 2 }}>
                <Grid
                    item
                    xs={6}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}
                    onClick={handleBarClick}
                >
                    {reportCardBarChart}
                </Grid>
                <Grid
                    item
                    xs={6}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}
                    onClick={handleLineClick}
                >
                    {reportCardLineChart}
                </Grid>
            </Grid>
            <Grid container sx={{ p: 2 }}>
                <Grid
                    item
                    xs={6}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}
                    onClick={handleScatterClick}
                >
                    {reportCardScatterChart}
                </Grid>
                <Grid
                    item
                    xs={6}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}
                    onClick={handlePieClick}
                >
                    {reportCardPieChart}
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

      {
        <Draggable>
          <div
            style={{
              position: "fixed",
              top: 50,
              left: 50,
              zIndex: 1500,
              display: chatbotVisible ? "block" : "none",
            }}
          >
            <Chatbot />
          </div>
        </Draggable>
      }
        </div>
    );
}

export default ReportOverview;
