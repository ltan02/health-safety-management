import { useState, useEffect } from "react";
import { Typography, Select, MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PieChart } from "@mui/x-charts";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import useAxios from "../../hooks/useAxios";

function StatusInsights() {
    const [selectedDateRange, setSelectedDateRange] = useState(5);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [data, setData] = useState([]);
    const { sendRequest } = useAxios();

    useEffect(() => {
        if (fromDate !== null || toDate !== null) {
            setSelectedDateRange(-1);
        }
    }, [fromDate, toDate]);

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

            const response = await sendRequest({
                url:
                    "/reports/status?" +
                    (startDate ? `start=${startDate.toISOString()}&` : "") +
                    `end=${endDate.toISOString()}`,
                method: "GET",
                params: {
                    fromDate: fromDate ? fromDate.toISOString() : null,
                    toDate: toDate ? toDate.toISOString() : null,
                },
            });
            setData(response);
        };

        getReport();
    }, [fromDate, toDate, selectedDateRange]);

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
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            <Typography
                style={{ fontSize: "24px", color: "#000", fontWeight: 600, marginBottom: "20px", marginTop: "20px" }}
            >
                Status Insights
            </Typography>
            <Typography>
              Understand 
            </Typography>
            <div style={{ width: "100%", display: "flex" }}>
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
            <PieChart
                series={[
                    {
                        data: data.map((v) => ({ id: v.id, value: v.value, label: v.label })),
                    },
                ]}
                height={350}
            />
        </div>
    );
}

export default StatusInsights;
