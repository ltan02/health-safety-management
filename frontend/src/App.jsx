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
        if (!isUserLoggedIn()) return <Route path="/" element={<Login />} />;

        const isPrivilegedUser = isUserLoggedIn() && isPrivileged(user.role);
        if (isPrivilegedUser) {
            return (
                <>
                    <Route path="/">
                        <Route index element={<AdminWorkflow />} />
                        <Route path="management" element={<AdminManagement />} />
                        <Route path="form" element={<AdminForm />} />
                        <Route path="status" element={<AdminStatus />} />
                    </Route>
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
        } else {
            return (
                <>
                    <Route index element={<Incident />} />
                    <Route path="/report" element={<IncidentReport />} />
                </>
            );
        }
    };

    return (
        <>
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    {isUserLoggedIn() && <Header />}
                    <Routes>
                        {getRoutesForRole()}
                        <Route path="*" element={<Navigate to={"/"} replace />} />
                    </Routes>
                </ThemeProvider>
            </BrowserRouter>
        </>
    );
}

export default App;
