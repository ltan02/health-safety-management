import { useState, useEffect } from "react";
import { Typography, Select, MenuItem, Checkbox } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import useAxios from "../../hooks/useAxios";

function EmployeeInvolvement() {
    const [selectedDateRange, setSelectedDateRange] = useState(5);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [data, setData] = useState([]);
    const { sendRequest } = useAxios();
    const [userMap, setUserMap] = useState({});
    const [adminSelected, setAdminSelected] = useState(true);
    const [safetyWardenSelected, setSafetyWardenSelected] = useState(true);
    const [employeeSelected, setEmployeeSelected] = useState(true);

    useEffect(() => {
        if (fromDate !== null || toDate !== null) {
            setSelectedDateRange(-1);
        }
    }, [fromDate, toDate]);

    useEffect(() => {
        const getUsers = async () => {
            const response = await sendRequest({ url: "/users", method: "GET" });

            const localUserMap = response.reduce((acc, user) => {
                acc[user.id] = user;
                return acc;
            }, {});

            setUserMap(localUserMap);
        };

        getUsers();
    }, []);

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

            const url = `/reports/employee-involvement?${
                startDate ? `start=${startDate.toISOString()}&` : ""
            }end=${endDate.toISOString()}`;
            const response = await sendRequest({ url, method: "GET" });

            const filteredResponse = response.filter(
                (item) =>
                    (adminSelected && userMap[item.employeeId].role === "ADMIN") ||
                    (safetyWardenSelected && userMap[item.employeeId].role === "SAFETY_WARDEN") ||
                    (employeeSelected && userMap[item.employeeId].role === "EMPLOYEE"),
            );

            const localData = filteredResponse.map((item) => ({
                employeeName: `${userMap[item.employeeId].firstName} ${userMap[item.employeeId].lastName}`,
                incidentsReported: item.incidentsReported,
                incidentsInvolved: item.incidentsInvolved,
            }));

            setData(localData);
        };

        if (Object.keys(userMap).length > 0) {
            getReport();
        }
    }, [selectedDateRange, fromDate, toDate, userMap, adminSelected, safetyWardenSelected, employeeSelected]);

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
                Employee Involvement
            </Typography>
            <Typography sx={{ paddingRight: 5 }}>
                This reporting module offers an insightful analysis of employee involvement in incidents, distinguishing
                between those they&apos;ve reported and those they&apos;ve been involved in. It serves as a crucial tool
                for understanding employee engagement with safety protocols and identifying trends in incident reporting
                and involvement. Enhanced with time period filtering, it allows for a deep dive into data over selected
                intervals, enabling the identification of patterns and the effectiveness of safety training and
                awareness efforts across the organization.
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
                            maxDate={toDate}
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
                            minDate={fromDate}
                        />
                    </LocalizationProvider>
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", marginRight: 20 }}>
                    <Checkbox checked={adminSelected} onChange={() => setAdminSelected((prev) => !prev)} />
                    <p>Admins</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", marginRight: 20 }}>
                    <Checkbox
                        checked={safetyWardenSelected}
                        onChange={() => setSafetyWardenSelected((prev) => !prev)}
                    />
                    <p>Safety Wardens</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", marginRight: 20 }}>
                    <Checkbox checked={employeeSelected} onChange={() => setEmployeeSelected((prev) => !prev)} />
                    <p>Employees</p>
                </div>
            </div>
            <div style={{ width: "100%", height: 500, marginTop: 20 }}>
                <ResponsiveContainer width="90%" height="100%">
                    <BarChart
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
                            dataKey="employeeName"
                            height={60}
                            label={{ value: "Employee Name", position: "insideBottom", offset: 0, dy: -15 }}
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
                        <Bar dataKey="incidentsReported" stackId="a" fill="#8884d8" name="Incidents Reported" />
                        <Bar dataKey="incidentsInvolved" stackId="a" fill="#82ca9d" name="Incidents Involved" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default EmployeeInvolvement;
