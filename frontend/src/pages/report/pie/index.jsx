import { Typography, Container, TextField, Grid } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { data } from "../initialData.js";

const reportCardPieChart = (
    <>
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

function PieReport() {


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
            <h1>Pie Chart</h1>
            {reportCardPieChart}
            </Container>
        </div>
    );
}

export default PieReport;