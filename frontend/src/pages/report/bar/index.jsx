import { CardActionArea, CardContent, Typography, Card, Container } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { data } from "../initialData.js";

const reportCardBarChart = (
    <Card sx={{ maxWidth: 500, maxHeight: 450 }}>
        <CardActionArea>
            <CardContent>
                <BarChart
                    xAxis={[{ scaleType: "band", data: ["group A", "group B", "group C"] }]}
                    series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
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