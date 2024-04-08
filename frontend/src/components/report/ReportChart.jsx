import { PieChart, BarChart, LineChart, ScatterChart } from "@mui/x-charts";
import {
  Typography,
  Container,
  TextField,
  Grid,
  Select,
  MenuItem,
  Card,
  CardActionArea,
  CardContent,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios.js";
import { categoryReports } from "../../pages/report/initialData.js";

function ReportChart({
  type,
  locked,
  data,
  height,
  width,
  handleSubmit,
}) {
  const { sendRequest } = useAxios();
  const [report, setReport] = useState(categoryReports);
  const [reportType, setReportType] = useState({});
  const [field, setField] = useState(data.field);
  const [startDate, setStartDate] = useState(data.start);
  const [endDate, setEndDate] = useState(data.end);

  useEffect(() => {
    setEndDate(data.end);
    setStartDate(data.start);
    setField(data.field);
    getReportAPI(data.field, data.start, data.end);
  }, [data]);

  useEffect(() => {
    getReportAPI(data.field, data.start, data.end);
  }, []);

  const handleFieldChange = (event) => {
    if (typeof handleSubmit === "function")
      handleSubmit(event.target.value, startDate, endDate);
    setField(event.target.value);
    getReportAPI(event.target.value, startDate, endDate);
  };
  const handleStartChange = (event) => {
    const newStartDate = event.target.value;
    if (endDate && new Date(newStartDate) >= new Date(endDate)) {
      alert("Start date must be before end date.");
      return;
    }
    if (typeof handleSubmit === "function")
      handleSubmit(field, newStartDate, endDate);
    setStartDate(newStartDate);
    getReportAPI(field, newStartDate, endDate);
  };

  const handleEndChange = (event) => {
    const newEndDate = event.target.value;
    if (startDate && new Date(newEndDate) <= new Date(startDate)) {
      alert("End date must be after start date.");
      return;
    }
    if (typeof handleSubmit === "function")
      handleSubmit(field, startDate, newEndDate);
    setEndDate(newEndDate);
    getReportAPI(field, startDate, newEndDate);
  };

  const modernPalette = [
    "rgba(46, 147, 250, 0.7)", // Vibrant Blue with reduced opacity
    "rgba(102, 218, 38, 0.7)", // Lime Green with reduced opacity
    "rgba(255, 193, 7, 0.7)", // Amber with reduced opacity
    "rgba(252, 104, 104, 0.7)", // Soft Red with reduced opacity
    "rgba(64, 86, 244, 0.7)", // Royal Blue with reduced opacity
    "rgba(161, 161, 161, 0.7)", // Grey with reduced opacity
  ];

  const BarChartCard = (
    <>
      <BarChart
        dataset={report}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "label",
            tick: { fontSize: "14px", fontFamily: "Arial, sans-serif" },
          },
        ]}
        series={[{ dataKey: "value", color: modernPalette[0] }]}
        height={height}
        width={width}
        // Styling properties
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        barSize={20}
        style={{ fontFamily: "Arial, sans-serif" }}
      />
    </>
  );

  const LineChartCard = (
    <>
      <LineChart
        xAxis={[
          {
            data: report.map((v) => v.label),
            scaleType: "point",
            tick: { fontSize: "14px", fontFamily: "Arial, sans-serif" },
          },
        ]}
        series={[
          {
            data: report.map((v) => v.value),
            stroke: modernPalette[2],
            strokeWidth: 2,
            pointStyle: { fill: modernPalette[2] },
          },
        ]}
        height={height}
        width={width}
        // Additional styling
        style={{ fontFamily: "Arial, sans-serif" }}
        curve="curveMonotoneX" // Smooth the line
      />
    </>
  );

  const ScatterChartCard = (
    <>
      <ScatterChart
        height={height}
        width={width}
        series={[
          {
            data: report.map((v) => ({ x: v.id, y: v.value, id: v.id })),
            fill: modernPalette[2],
          },
        ]}
        // Styling options
        style={{ fontFamily: "Arial, sans-serif" }}
        pointSize={10}
        pointStyle={{ stroke: "#fff", strokeWidth: 2 }}
      />
    </>
  );

  const PieChartCard = (
    <>
      <PieChart
        series={[
          {
            data: report.map((v, index) => ({
              id: v.id,
              value: v.value,
              label: v.label,
              color: modernPalette[index % modernPalette.length],
            })),
            highlightScope: { faded: "global", highlighted: "item" },
            faded: { innerRadius: 10, additionalRadius: -10, color: "gray" },
            outerRadius: '75%',
            cx: '66%',
            cy: '35%'
          },
        ]}
        height={height+15}
        width={width}
        innerRadius={60}
        outerRadius={150}
        slotProps={{
          legend: {
            direction: 'row',
            position: { vertical: 'bottom', horizontal: 'middle' },
            padding: 0,
            labelStyle: {
              position: "outside",
              fill: "#333",
              fontSize: "65%",
              fontFamily: "Arial, sans-serif",
            }
          }
        }}
        style={{ fontFamily: "Arial, sans-serif", fontSize: "10px" }}
      />
    </>
);

  const customize = (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" margin="dense">
            <InputLabel id="field-select-label">Select Field</InputLabel>
            <Select
              labelId="field-select-label"
              id="field-select"
              value={field}
              onChange={handleFieldChange}
              label="Select Field"
            >
              <MenuItem value="category">Category</MenuItem>
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="status">Status</MenuItem>
              <MenuItem value="reporter">Reporter</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Typography gutterBottom variant="h6" component="div">
            Select Date Range
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Start"
            type="datetime-local"
            defaultValue={startDate}
            onChange={handleStartChange}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            margin="dense"
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="End"
            type="datetime-local"
            defaultValue={endDate}
            onChange={handleEndChange}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            margin="dense"
          />
        </Grid>
      </Grid>
    </div>
  );
  const uppercase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const chartDataByType = (type, field) => {
    switch (type) {
      case "Bar":
        return {
          color: "rgba(46, 147, 250, 0.2)", // A warm orange
          // title: "Number of Tickets by " + uppercase(field),
          title: data.name,
        };
      case "Line":
        return {
          color: "rgba(102, 218, 38, 0.2)", // A deep teal
          // title: "Number of Tickets by " + uppercase(field),
          title: data.name,
        };
      case "Scatter":
        return {
          color: "rgba(255, 193, 7, 0.2)", // A light orange
          // title: "Number of Tickets by " + uppercase(field),
          title: data.name,
        };
      case "Pie":
        return {
          color: "rgba(252, 104, 104, 0.2)", // A deep teal
          // title: "Number of Tickets by " + uppercase(field),
          title: data.name,
        };
      default:
        return "rgba(64, 86, 244, 0.7)"; // A light grey for defaults
    }
  };

  return (
    <div>
      <Card>
        <CardActionArea
          sx={{ backgroundColor: chartDataByType(type, field).color }}
        >
          <Typography
            variant="h6"
            component="h6"
            style={{ padding: "10px" }}
            fontFamily={"Arial, sans-serif"}
            fontWeight={600}
            color={"grey.800"}
          >
            {chartDataByType(type, field).title}
          </Typography>
        </CardActionArea>
        <Divider />
        <CardContent>
          <Container
            maxWidth="md"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {type === "Bar" && BarChartCard}
            {type === "Line" && LineChartCard}
            {type === "Scatter" && ScatterChartCard}
            {type === "Pie" && PieChartCard}
            {!locked && customize}
          </Container>
        </CardContent>
      </Card>
    </div>
  );

  function getReportAPI(value, start, end) {
    let url = `/reports/${value}`;

    const params = [];
    if (start) params.push(`start=${start}`);
    if (end) params.push(`end=${end}`);
    if (params.length > 0) {
      url += "?" + params.join("&");
    }

    // Send the request and handle the response
    const response = Promise.all([sendRequest({ url })]);
    response
      .then((e) => {
        if (e[0].length === 0) {
          setReport([{ id: 0, label: "No Data", value: 0 }]);
        } else {
          setReport(e[0]);
        }
        setReportType({ type: value, start: start, end: end });
      })
      .catch((e) => {
        console.error(e[0]);
      });
    response
      .then((e) => {
        if (e[0].length === 0) {
          setReport([{ id: 0, label: "No Data", value: 0 }]);
        } else {
          setReport(e[0]);
        }
      })
      .catch((e) => {
        console.error(e[0]);
      });
  }
}

export default ReportChart;
