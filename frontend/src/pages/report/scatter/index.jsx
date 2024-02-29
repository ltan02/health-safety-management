import { CardActionArea, CardContent, Typography, Card, Container } from "@mui/material";
import { ScatterChart } from "@mui/x-charts";
import { data } from "../initialData.js";

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

function ScatterReport() {


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
            <h1>Scatter Chart</h1>
            {reportCardScatterChart}
            </Container>
        </div>
    );
}

export default ScatterReport;