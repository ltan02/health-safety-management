import { Typography, Container, TextField, Grid } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { data } from "../initialData.js";

const reportCardLineChart = (
    <>
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
        Scatter Plot
    </Typography>
    <Typography variant="body2" color="text.secondary">
        This interactive graph provides an in-depth overview of proportion of the incident for this quarter
        and the potential of future risk by leveraging a comprehensive dataset from firebase.
    </Typography>
    <Typography gutterBottom variant="h7"> Select Date Range </Typography>
    <Grid>
        <Typography gutterBottom variant="h8"> Start: </Typography>
        <TextField type="datetime-local"/>
    </Grid>
    <Grid>
        <Typography gutterBottom variant="h8"> End: </Typography>
        <TextField type="datetime-local"/>
    </Grid>
</>
);

function LineReport() {


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
            <h1>Line Chart</h1>
            {reportCardLineChart}
            </Container>
        </div>
    );
}

export default LineReport;