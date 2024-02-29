import { CardActionArea, CardContent, Typography, Card, Container } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { data } from "../initialData.js";

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