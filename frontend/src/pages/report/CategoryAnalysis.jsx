import { useState, useEffect } from "react";
import { Typography, Select, MenuItem, Checkbox } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
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

function CategoryAnalysis() {
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

            const url = `/reports/category-analysis?${
                startDate ? `start=${startDate.toISOString()}&` : ""
            }end=${endDate.toISOString()}`;
            const response = await sendRequest({ url, method: "GET" });

            if (response) {
                let filteredData = response.filter((item) => item.categoryName !== "");

                if (selectedStatusFilters.length > 0) {
                    filteredData = filteredData.map((category) => {
                        const filteredStatusCounts = category.statusCategoryCounts.filter((status) =>
                            selectedStatusFilters.includes(status.statusId.toString()),
                        );
                        return { ...category, statusCategoryCounts: filteredStatusCounts };
                    });
                }

                const transformedData = filteredData.map((category) => {
                    const categoryData = { categoryName: category.categoryName };
                    category.statusCategoryCounts.forEach((status) => {
                        const statusName = statusMap[status.statusId];
                        if (statusName && selectedStatusFilters.includes(status.statusId.toString())) {
                            categoryData[statusName] = status.count;
                        }
                    });
                    return categoryData;
                });
                
                setData(transformedData);
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

    const colors = statuses.reduce((acc, status) => {
        acc[status.name] = stringToColor(status.id);
        return acc;
    }, {});

    const dateRanges = ["Past Week", "Past 2 Weeks", "Past Month", "Past 3 Months", "Past 6 Months", "All Time"];
    const modernPalette = [
        "rgba(46, 147, 250, 0.7)", // Vibrant Blue with reduced opacity
        "rgba(102, 218, 38, 0.7)", // Lime Green with reduced opacity
        "rgba(255, 193, 7, 0.7)", // Amber with reduced opacity
        "rgba(252, 104, 104, 0.7)", // Soft Red with reduced opacity
        "rgba(64, 86, 244, 0.7)", // Royal Blue with reduced opacity
        "rgba(161, 161, 161, 0.7)", // Grey with reduced opacity
      ];
    

    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <Typography
                style={{ fontSize: "24px", color: "#000", fontWeight: 600, marginBottom: "20px", marginTop: "20px" }}
            >
                Category Analysis
            </Typography>
            <Typography sx={{ paddingRight: 5 }}>
                This visualization showcases the distribution of incidents across various categories illustrating the
                frequency of each incident type. By highlighting the most prevalent categories, it aids in pinpointing
                areas that may benefit from focused preventive strategies. Utilize the date range filter to refine your
                analysis to incidents occurring within selected intervals, facilitating a deeper understanding of
                incident category trends over time.
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
                <ResponsiveContainer width="90%" height={500}>
                    <BarChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="categoryName"
                            height={60}
                            label={{ value: "Category Name", position: "insideBottom", offset: 0, dy: -15 }}
                        />
                        <YAxis
                            label={{
                                value: "Incident Count",
                                angle: -90,
                                position: "insideLeft",
                                textAnchor: "middle",
                                style: { textAnchor: "middle" },
                            }}
                        />
                        <Tooltip />
                        <Legend />
                        {statuses.map((status) => (
                            <Bar key={status.id} dataKey={status.name} stackId="a" fill={colors[status.name]} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default CategoryAnalysis;
