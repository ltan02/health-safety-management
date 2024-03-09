import "./App.css";
import Header from "./components/global/Header";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Incident from "./pages/incident";
import Report from "./pages/report";
import Login from "./pages/login";
import { COLORS } from "./constants/index.jsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAuthContext } from "./context/AuthContext.jsx";
import AdminWorkflow from "./pages/admin/workflows/index.jsx";
import AdminManagement from "./pages/admin/management/index.jsx";
import AdminStatus from "./pages/admin/status/index.jsx";
import AdminForm from "./pages/admin/form/index.jsx";
import ReportOverview from "./pages/report/index.jsx";
import ReportDashboard from "./pages/report/dashboard/index.jsx";
import { isPrivileged } from "./utils/permissions.js";
import IncidentReport from "./pages/incident/report/index.jsx";
import BarReport from "./pages/report/bar/index.jsx";
import LineReport from "./pages/report/line/index.jsx";
import PieReport from "./pages/report/pie/index.jsx";
import ScatterReport from "./pages/report/scatter/index.jsx";

import { BoardProvider } from "./context/BoardContext.jsx";

const theme = createTheme({
    typography: {
        button: {
            textTransform: "none",
        },
        fontFamily: "ITC Charter",
    },
    palette: {
        primary: {
            light: COLORS.YELLOW, //set these later
            main: COLORS.TANGERINE,
            dark: COLORS.ORANGE,
            contrastText: COLORS.BLACK,
            rose: COLORS.ROSE,
            red: COLORS.RED
        },
        secondary: {
            light: COLORS.GREY, //set these later
            main: COLORS.MEDIUM_GREY,
            dark: COLORS.DARK_GREY,
            lightest: COLORS.LIGHT_GREY
        },
    },
});

function App() {
    const { isUserLoggedIn, user } = useAuthContext();

    const getRoutesForRole = () => {
        if (!isUserLoggedIn())
            return (
                <Routes>
                    <Route path="/" element={<Login />} />
                </Routes>
            );

        const routesForPrivilegedUser = (
            <>
                <Route path="/" element={<AdminWorkflow />} />
                <Route path="management" element={<AdminManagement />} />
                <Route path="form" element={<AdminForm />} />
                <Route path="status" element={<AdminStatus />} />
                <Route path="incident">
                    <Route index element={<Incident />} />
                    <Route path="report" element={<IncidentReport />} />
                </Route>
                <Route path="report">
                    <Route index element={<ReportOverview />} />
                    <Route path="bar" element={<BarReport/>} />
                    <Route path="scatter" element={<ScatterReport/>} />
                    <Route path="line" element={<LineReport/>} />
                    <Route path="pie" element={<PieReport/>} />
                    <Route path="dashboard" element={<ReportDashboard />} />
                </Route>
            </>
        );

        const routesForRegularUser = (
            <>
                <Route index element={<Incident />} />
                <Route path="/report" element={<IncidentReport />} />
            </>
        );

        const isPrivilegedUser = isPrivileged(user.role);

        return (
            <BoardProvider>
                <Routes>
                    {isPrivilegedUser ? routesForPrivilegedUser : routesForRegularUser}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BoardProvider>
        );
    };

    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                {isUserLoggedIn() && <Header />}
                {getRoutesForRole()}
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
