
import { PieChart, BarChart, LineChart, ScatterChart } from "@mui/x-charts";
import { Typography, Container, TextField, Grid, Select, MenuItem } from "@mui/material";
import { categoryReports, dateReports, locationReports, statusReports} from "../../pages/report/initialData.js";
import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios.js";

function ReportChart({type}) {
    const { sendRequest, loading } = useAxios();
    const [report, setReport] = useState(categoryReports);
    const [field, setField] = useState("category");
    const handleFieldChange = (event) => {
        setField(event.target.value);
    };


    useEffect(() => {
        const response = Promise.all([sendRequest({
            url: `/reports/${field}`,
        })]);
        response.then((e) => {
            console.log(e[0]);
            setReport(e[0]);
        }).catch(console.error);
    }, [field]);

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
                    <TextField type="datetime-local"/>
                </Grid>
                <Grid>
                    <Typography gutterBottom variant="h8"> End: </Typography>
                    <TextField type="datetime-local"/>
                </Grid>
            </Container>
        </div>
    );
}

export default ReportChart;