
import { PieChart, BarChart, LineChart, ScatterChart } from "@mui/x-charts";
import { Typography, Container, TextField, Grid, Select, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios.js";
import { categoryReports } from "../../pages/report/initialData.js";

function ReportChart({type}) {
    const { sendRequest, loading } = useAxios();
    const [report, setReport] = useState(categoryReports);
    const [field, setField] = useState("category");
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const handleFieldChange = (event) => {
        setField(event.target.value);
        getReportAPI(event.target.value);
    };

    useEffect(() => {
        getReportAPI(field);
    }, [startDate, endDate]);

    const BarChartCard = (
        <>
          <h1>Bar Chart</h1>
            <BarChart
                    dataset={report}
                    xAxis={[{ scaleType: "band", dataKey: 'label'}]}
                    series={[{ dataKey: 'value'}]}
                    height={350}
            />
            <Typography gutterBottom variant="h5" component="div">
                Bar Chart
            </Typography>  
        </>
    );
    
    const LineChartCard = (
        <>
            <h1>Line Chart</h1>
            <LineChart
                    xAxis={[{ data: report.map((v) => v.label), 
                        scaleType: "point"}]}
                    series={[
                        {
                            data: report.map((v) => v.value),
                        },
                    ]}
                    height={350}
                />
            <Typography gutterBottom variant="h5" component="div">
                Line Chart
            </Typography>
        </>
    );

    const ScatterChartCard = (
        <>
            <h1>Scatter Chart</h1>
            <ScatterChart
                    height={350}
                    series={[
                        {
                            data: report.map((v) => ({ x: v.id, y: v.value, id: v.id })),

                        },
                    ]}
            />
            <Typography gutterBottom variant="h5" component="div">
                Scatter Plot
            </Typography>
        </>
    );

    const PieChartCard = (
        <>
            <h1>Pie Chart</h1>
            <PieChart
                    series={[
                        {
                            data: report.map((v) => ({ id: v.id, value: v.value, label: v.label }))
                        },
                    ]}
                    height={350}
                />
                <Typography gutterBottom variant="h5" component="div">
                    Pie Chart
                </Typography>
        </>
    );


    return (
        <div>
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
            
                {type === 'Bar' && BarChartCard}
                {type === 'Line' && LineChartCard}
                {type === 'Scatter' && ScatterChartCard}
                {type === 'Pie' && PieChartCard}
                <Typography gutterBottom variant="h7"> Select Field </Typography>
                <Select
                    value={field}
                    onChange={handleFieldChange}
                >
                    <MenuItem value={'category'}>Category</MenuItem>
                    <MenuItem value={'date'}>Date</MenuItem>
                    <MenuItem value={'status'}>Status</MenuItem>
                    <MenuItem value={'reporter'}>Reporter</MenuItem>
                </Select>
                <Typography gutterBottom variant="h7"> Select Date Range </Typography>
                <Grid>
                    <Typography gutterBottom variant="h8"> Start: </Typography>
                    <TextField type="datetime-local" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </Grid>
                <Grid>
                    <Typography gutterBottom variant="h8"> End: </Typography>
                    <TextField type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </Grid>
            </Container>
        </div>
    );

    function getReportAPI(value) {
        let url = `/reports/${value}`;

        const params = [];
        if (startDate) params.push(`start=${startDate}`);
        if (endDate) params.push(`end=${endDate}`);
        if (params.length > 0) {
            url += '?' + params.join('&');
        }

        // Send the request and handle the response
        const response = Promise.all([sendRequest({ url })]);
        response.then((e) => {
            if (e[0].length === 0) {
                setReport([{ id: 0, label: "No Data", value: 0 }]);
            } else {
                setReport(e[0]);
            }
        }).catch((e) => {
            console.error(e[0]);
        });
    }
    
}

export default ReportChart;