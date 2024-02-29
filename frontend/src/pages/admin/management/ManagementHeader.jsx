import React from "react";
import { Box, Grid, Button, Typography, Container, Chip } from "@mui/material";

function ManagementHeader({ columns }) {
  return (
    <Container elevation={3} sx={{ p: 2, mb: 2 }}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12} container justifyContent="space-around">
          {columns.map((column, index) => (
            <Button key={index} variant="outlined" style={{
                border:"none"
            }}>
              <Grid>
                <Chip label={"+"} backgroundColor={"black"} />
                <Typography variant="p" display="block" color={"black"}>
                  {column.title}
                </Typography>
              </Grid>
            </Button>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
}

export default ManagementHeader;
