import { useState, useEffect } from "react";
import { Typography, Select, MenuItem, Checkbox } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import useAxios from "../../hooks/useAxios";
import { useBoard } from "../../context/BoardContext";

function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
}

function StatusInsights() {
    const [selectedDateRange, setSelectedDateRange] = useState(5);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [data, setData] = useState([]);
    const { statuses } = useBoard();
    const [statusMap, setStatusMap] = useState({});
    const { sendRequest } = useAxios();
    const [selectedStatusFilters, setSelectedStatusFilters] = useState([]);

    const renderStatusCheckboxes = () => (
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            {statuses.map((status) => (
                <div key={status.id} style={{ display: "flex", alignItems: "center", marginRight: 20 }}>
                    <Checkbox
                        sx={{
                            color: stringToColor(status.id),
                            "&.Mui-checked": {
                                color: stringToColor(status.id),
                            },
                        }}
                        checked={selectedStatusFilters.includes(status.id.toString())}
                        onChange={() => {
                            const statusId = status.id.toString();
                            setSelectedStatusFilters((prev) =>
                                prev.includes(statusId) ? prev.filter((id) => id !== statusId) : [...prev, statusId],
                            );
                        }}
                    />
                    <p>{status.name}</p>
                </div>
            ))}
        </div>
    );

    useEffect(() => {
        if (fromDate !== null || toDate !== null) {
            setSelectedDateRange(-1);
        }
    }, [fromDate, toDate]);

    useEffect(() => {
        if (statuses) {
            const tempStatusMap = {};
            statuses.forEach((status) => {
                tempStatusMap[status.id] = status.name;
            });
            setStatusMap(tempStatusMap);
        }
        setSelectedStatusFilters(statuses.map((status) => status.id.toString()));
    }, [statuses]);

    useEffect(() => {
        const getReport = async () => {
            const currentDate = new Date();
            let startDate = null;
            let endDate = new Date();

            if (selectedDateRange === -1) {
                if (fromDate !== null) {
                    startDate = fromDate;
                }

                if (toDate !== null) {
                    endDate = toDate;
                }
            } else if (selectedDateRange === 0) {
                startDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
            } else if (selectedDateRange === 1) {
                startDate = new Date(currentDate.setDate(currentDate.getDate() - 14));
            } else if (selectedDateRange === 2) {
                startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
            } else if (selectedDateRange === 3) {
                startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 3));
            } else if (selectedDateRange === 4) {
                startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 6));
            }

            const url = `/reports/status-insights?${
                startDate ? `start=${startDate.toISOString()}&` : ""
            }end=${endDate.toISOString()}`;
            const response = await sendRequest({ url, method: "GET" });

            if (response) {
                const normalizedData = response
                    .filter((item) => selectedStatusFilters.includes(item.statusId.toString()))
                    .map((item) => ({
                        ...item,
                        date: item.date.split("T")[0],
                        statusName: statusMap[item.statusId],
                    }))
                    .sort((a, b) => a.date.localeCompare(b.date));

                const transformedData = {};
                normalizedData.forEach(({ statusName, percentage, date }) => {
                    if (!transformedData[date]) transformedData[date] = { date };
                    transformedData[date][statusName] = (transformedData[date][statusName] || 0) + percentage;
                });

                const chartData = Object.values(transformedData);

                setData(chartData);
            }
        };

        if (Object.keys(statusMap).length) {
            getReport();
        }
    }, [selectedDateRange, fromDate, toDate, statusMap, selectedStatusFilters]);

    const handleDateRangeChange = (event) => {
        const newValue = Number(event.target.value);
        setSelectedDateRange(newValue);

        if (newValue !== -1) {
            setFromDate(null);
            setToDate(null);
        }
    };

    const dateRanges = ["Past Week", "Past 2 Weeks", "Past Month", "Past 3 Months", "Past 6 Months", "All Time"];

    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <Typography
                style={{ fontSize: "24px", color: "#000", fontWeight: 600, marginBottom: "20px", marginTop: "20px" }}
            >
                Status Insights
            </Typography>
            <Typography sx={{ paddingRight: 5 }}>
                This graph displays the cumulative percentage of incidents in each status by day, providing a clear view
                of incident distribution and trends over time. Use the date range filter to zoom in on incidents created
                within specific periods, helping you understand how incident statuses evolve.
            </Typography>
            <div style={{ width: "100%", display: "flex", marginTop: 10 }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Typography style={{ fontSize: "14px", fontWeight: 600, color: "#626f86" }}>Date filter</Typography>
                    <Select
                        labelId="date-select-label"
                        id="date-select"
                        value={selectedDateRange >= 0 ? selectedDateRange.toString() : ""}
                        onChange={handleDateRangeChange}
                        sx={{ width: "140px", height: "40px", fontSize: "14px" }}
                        displayEmpty
                        renderValue={(selected) => (selected !== "" ? dateRanges[selected] : "Custom dates")}
                    >
                        {dateRanges.map((dateRange, index) => (
                            <MenuItem key={index} value={index} sx={{ fontSize: "14px" }}>
                                {dateRange}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", marginLeft: "20px" }}>
                    <Typography style={{ fontSize: "14px", fontWeight: 600, color: "#626f86" }}>From date</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            slotProps={{ textField: { size: "small", fontSize: "14px" } }}
                            value={fromDate}
                            onChange={(newValue) => setFromDate(newValue)}
                        />
                    </LocalizationProvider>
                </div>
                <div style={{ display: "flex", flexDirection: "column", marginLeft: "20px" }}>
                    <Typography style={{ fontSize: "14px", fontWeight: 600, color: "#626f86" }}>To date</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            slotProps={{ textField: { size: "small", fontSize: "14px" } }}
                            value={toDate}
                            onChange={(newValue) => setToDate(newValue)}
                        />
                    </LocalizationProvider>
                </div>
            </div>
            {renderStatusCheckboxes()}
            <div style={{ width: "100%", height: 500, marginTop: 20 }}>
                <ResponsiveContainer width="90%" height="100%">
                    <AreaChart
                        width={850}
                        height={550}
                        data={data}
                        margin={{ top: 30, right: 30, left: 10, bottom: 0 }}
                    >
                        <defs>
                            {statuses.map((status) => (
                                <linearGradient key={status.id} id={`color${status.id}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={stringToColor(status.id)} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={stringToColor(status.id)} stopOpacity={0} />
                                </linearGradient>
                            ))}
                        </defs>
                        <XAxis dataKey="date" />
                        <YAxis
                            domain={[0, 100]}
                            allowDataOverflow
                            label={{
                                value: "Percentage of All Incidents",
                                angle: -90,
                                position: "insideLeft",
                                textAnchor: "middle",
                                style: { textAnchor: "middle" },
                            }}
                        />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        {statuses.map((status) => (
                            <Area
                                key={status.id}
                                type="monotone"
                                dataKey={status.name}
                                stackId="1"
                                stroke={stringToColor(status.id)}
                                fillOpacity={1}
                                fill={`url(#color${status.id})`}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default StatusInsights;
