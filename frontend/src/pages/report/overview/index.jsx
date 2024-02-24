import {Grid, Box, CardActionArea, CardContent, Typography, Card} from "@mui/material";
import * as React from "react";
import {BarChart, LineChart, PieChart, ScatterChart} from "@mui/x-charts";
import { useNavigate } from 'react-router-dom';
import { data } from "../initialData.js";


const reportCardBarChart = (
    <Card sx={{ maxWidth: 500, maxHeight:450}}>
        <CardActionArea>
            <CardContent>
                <BarChart
                    xAxis={[{scaleType: 'band', data: ['group A', 'group B', 'group C']}]}
                    series={[{data: [4, 3, 5]}, {data: [1, 6, 3]}, {data: [2, 5, 6]}]}
                    height={350}
                />
                <Typography gutterBottom variant="h5" component="div">
                    Graph
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
    <Card sx={{ maxWidth: 500, maxHeight:450}}>
        <CardActionArea>
            <CardContent>
                <LineChart
                    xAxis={[{data: [1, 2, 3, 5, 8, 10]}]}
                    series={[
                        {
                            data: [2, 5.5, 2, 8.5, 1.5, 5],
                        },
                    ]}
                    height={350}
                />
                <Typography gutterBottom variant="h5" component="div">
                    Graph
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
    <Card sx={{ maxWidth: 500, maxHeight:450}}>
        <CardActionArea>
            <CardContent>
                <ScatterChart
                    height={350}
                    series={[
                        {
                            label: 'Series A',
                            data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
                        },
                        {
                            label: 'Series B',
                            data: data.map((v) => ({ x: v.x1, y: v.y2, id: v.id })),
                        },
                    ]}
                />
                <Typography gutterBottom variant="h5" component="div">
                    Graph
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
    <Card sx={{ maxWidth: 500, maxHeight:450}}>
        <CardActionArea>
            <CardContent>
                <PieChart
                    series={[
                        {
                            data: [
                                { id: 0, value: 10, label: 'series A' },
                                { id: 1, value: 15, label: 'series B' },
                                { id: 2, value: 20, label: 'series C' },
                            ],
                            innerRadius: 60,
                            outerRadius: 100
                        },
                    ]}
                    height={350}
                />
                <Typography gutterBottom variant="h5" component="div">
                    Graph
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
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate('/report/dashboard');
    };


    return (
        <div>
            <h1>Overview</h1>
            <Grid container sx={{p:2}}>
                <Grid item xs={6}
                      sx={{display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%'}}
                      onClick={handleCardClick}>
                    {reportCardBarChart}
                </Grid>
                <Grid item xs={6}
                      sx={{display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '100%'}}
                      onClick={handleCardClick}>
                    {reportCardLineChart}
                </Grid>
            </Grid>
            <Grid container sx={{p:2}}>
                <Grid item xs={6}
                      sx={{display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '100%'}}
                      onClick={handleCardClick}>
                    {reportCardScatterChart}
                </Grid>
                <Grid item xs={6}
                      sx={{display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '100%'}}
                      onClick={handleCardClick}>
                    {reportCardPieChart}
                </Grid>
            </Grid>
        </div>
    );
}

export default ReportOverview;

