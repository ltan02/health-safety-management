import {Grid, Box, CardActionArea, CardMedia, CardContent, Typography, Card} from "@mui/material";
import * as React from "react";

const reportCard = (
    <Card sx={{ maxWidth: 500, maxHeight:450}}>
        <CardActionArea>
            <CardMedia
                component="img"
                height="140"
                image="/static/images/cards/contemplative-reptile.jpg"
                alt="analytical graph"
            />
            <CardContent>
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
function ReportOverview() {
    return (
        <div>
            <h1>Overview</h1>
            <Grid container sx={{p:2}}>
                <Grid item xs={6}>
                    {reportCard}
                </Grid>
                <Grid item xs={6}>
                    {reportCard}
                </Grid>
            </Grid>
            <Grid container sx={{p:2}}>
                <Grid item xs={6}>
                    {reportCard}
                </Grid>
                <Grid item xs={6}>
                    {reportCard}
                </Grid>
            </Grid>
        </div>
    );
}

export default ReportOverview;