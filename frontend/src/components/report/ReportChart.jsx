
import { PieChart, BarChart, LineChart, ScatterChart } from "@mui/x-charts";
import { Typography, Container, TextField, Grid, Select, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios.js";
import { categoryReports } from "../../pages/report/initialData.js";

function ReportChart({type, locked, data, height, width, handleSubmit}) {
    const { sendRequest, loading } = useAxios();
    const [report, setReport] = useState(categoryReports);
    const [field, setField] = useState(data.field);
    const [startDate, setStartDate] = useState(data.start);
    const [endDate, setEndDate] = useState(data.end);

    useEffect(() => {
        setEndDate(data.end);
        setStartDate(data.start);
        setField(data.field);
        getReportAPI(data.field, data.start, data.end);
    }, [data]);

    useEffect(() => {
        getReportAPI(data.field, data.start, data.end);
    }, []);

    const handleFieldChange = (event) => {
        if (typeof handleSubmit === 'function')
            handleSubmit(event.target.value, startDate, endDate);
        setField(event.target.value);
        getReportAPI(event.target.value, startDate, endDate);
    };
    const handleStartChange = (event) => {
        if (typeof handleSubmit === 'function')
            handleSubmit(field, event.target.value, endDate);
        setStartDate(event.target.value);
        getReportAPI(field, event.target.value, endDate);
    };

    const handleEndChange = (event) => {
        if (typeof handleSubmit === 'function')
            handleSubmit(field, startDate, event.target.value);
        setEndDate(event.target.value);
        getReportAPI(field, startDate, event.target.value);
    };

    const BarChartCard = (
        <>
          <h1>Bar Chart</h1>
            <BarChart
                    dataset={report}
                    xAxis={[{ scaleType: "band", dataKey: 'label'}]}
                    series={[{ dataKey: 'value'}]}
                    height={height}
                    width={width}
            />
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
                    height={height}
                    width={width}
                />
        </>
    );

    const ScatterChartCard = (
        <>
            <h1>Scatter Chart</h1>
            <ScatterChart
                    height={height}
                    width={width}
                    series={[
                        {
                            data: report.map((v) => ({ x: v.id, y: v.value, id: v.id })),

                        },
                    ]}
            />
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
                    height={height}
                    width={width}
                />
        </>
    );

    const customize = (
        <>
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
                        onChange={handleStartChange}
                    />
                </Grid>
                <Grid>
                    <Typography gutterBottom variant="h8"> End: </Typography>
                    <TextField type="datetime-local"
                        value={endDate}
                        onChange={handleEndChange}
                    />
                </Grid>
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
                {!locked && customize}
            </Container>
        </div>
    );

    function getReportAPI(value, start, end) {  
        let url = `/reports/${value}`;

        const params = [];
        if (start) params.push(`start=${start}`);
        if (end) params.push(`end=${end}`);
        if (params.length > 0) {
            url += '?' + params.join('&');
        }

        // Send the request and handle the response
        const response = Promise.all([sendRequest({ url })]);
        response.then((e) => {
            if (e[0].length === 0) {
                setReport([{ id: 0, label: "No Data", value: 0 }]);
            } else {
                console.log(e[0]);
                setReport(e[0]);
            }
        }).catch((e) => {
            console.error(e[0]);
        });
    }
    
}

export default ReportChart;