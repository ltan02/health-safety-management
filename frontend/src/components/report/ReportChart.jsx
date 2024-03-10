
import { PieChart, BarChart, LineChart, ScatterChart } from "@mui/x-charts";
import { Typography, Container, TextField, Grid, Select, MenuItem } from "@mui/material";
import { categoryReports, dateReports, locationReports, statusReports} from "../../pages/report/initialData.js";
import { useState } from "react";

function ReportChart({type}) {
    const [field, setField] = useState('Category');
    const [report, setReport] = useState(categoryReports);
    const handleFieldChange = (event) => {
        setField(event.target.value);
        switch(event.target.value) {
            case 'Category': 
                setReport(categoryReports);
                break;
            case 'Date':
                setReport(dateReports);
                break;
            case 'Location':
                setReport(locationReports);
                break;
            case 'Status':
                setReport(statusReports);
                break;
            default:
                setReport(categoryReports);
                break;
        }
    };

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
                    <MenuItem value={'Category'}>Category</MenuItem>
                    <MenuItem value={'Date'}>Date</MenuItem>
                    <MenuItem value={'Location'}>Location</MenuItem>
                    <MenuItem value={'Status'}>Status</MenuItem>
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