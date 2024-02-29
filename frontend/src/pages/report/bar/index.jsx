import { Typography, Container, TextField, Grid } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { data } from "../initialData.js";

const reportCardBarChart = (
    <>
    <BarChart
                    xAxis={[{ scaleType: "band", data: ["group A", "group B", "group C"] }]}
                    series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
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

function BarReport() {


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
            <h1>Bar Chart</h1>
            {reportCardBarChart}
            </Container>
        </div>
    );
}

export default BarReport;