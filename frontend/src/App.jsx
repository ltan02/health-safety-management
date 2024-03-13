import { lazy, Suspense } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Header from "./components/global/Header";
import { COLORS } from "./constants/index.jsx";
import { useAuthContext } from "./context/AuthContext.jsx";
import { isPrivileged } from "./utils/permissions.js";
import { BoardProvider } from "./context/BoardContext.jsx";

const Incident = lazy(() => import("./pages/incident"));
const Login = lazy(() => import("./pages/login"));
const AdminWorkflow = lazy(() => import("./pages/admin/workflows/index.jsx"));
const AdminManagement = lazy(() => import("./pages/admin/management/index.jsx"));
const AdminStatus = lazy(() => import("./pages/admin/status/index.jsx"));
const AdminForm = lazy(() => import("./pages/admin/form/index.jsx"));
const ReportOverview = lazy(() => import("./pages/report/index.jsx"));
const ReportDashboard = lazy(() => import("./pages/report/dashboard/index.jsx"));
const IncidentReport = lazy(() => import("./pages/incident/report/index.jsx"));
const BarReport = lazy(() => import("./pages/report/bar/index.jsx"));
const LineReport = lazy(() => import("./pages/report/line/index.jsx"));
const PieReport = lazy(() => import("./pages/report/pie/index.jsx"));
const ScatterReport = lazy(() => import("./pages/report/scatter/index.jsx"));

const theme = createTheme({
    typography: {
        button: {
            textTransform: "none",
        },
        fontFamily: "Roboto",
    },
    palette: {
        primary: {
            light: COLORS.LIGHT, //set these later
            main: COLORS.PRIMARY,
            dark: COLORS.DARK,
            contrastText: "black",
        },
        secondary: {
            light: "#DEDEDE", //set these later
            main: "#7D7D7D",
            dark: "#464646",
        },
    },
});

function App() {
    const { isUserLoggedIn, user } = useAuthContext();

    const getRoutesForRole = () => {
        const routes = !isUserLoggedIn() ? (
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        ) : (
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    {isPrivileged(user.role) ? (
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
                                <Route path="bar" element={<BarReport />} />
                                <Route path="scatter" element={<ScatterReport />} />
                                <Route path="line" element={<LineReport />} />
                                <Route path="pie" element={<PieReport />} />
                                <Route path="dashboard" element={<ReportDashboard />} />
                            </Route>
                        </>
                    ) : (
                        <>
                            <Route index element={<Incident />} />
                            <Route path="/report" element={<IncidentReport />} />
                        </>
                    )}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        );

        return <BoardProvider>{routes}</BoardProvider>;
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
