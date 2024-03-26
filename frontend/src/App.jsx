import { lazy, Suspense } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/system";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Header from "./components/global/Header";
import { COLORS } from "./constants/index.jsx";
import { useAuthContext } from "./context/AuthContext.jsx";
import { isPrivileged } from "./utils/permissions.js";
import { BoardProvider } from "./context/BoardContext.jsx";
import Sidebar from "./components/global/Sidebar";
import { useState } from "react";

const Incident = lazy(() => import("./pages/incident"));
const Login = lazy(() => import("./pages/login"));
const AdminWorkflow = lazy(() => import("./pages/admin/workflows/index.jsx"));
const AdminManagement = lazy(() =>
  import("./pages/admin/management/index.jsx")
);
const AdminStatus = lazy(() => import("./pages/admin/status/index.jsx"));
const AdminForm = lazy(() => import("./pages/admin/form/index.jsx"));
const ReportOverview = lazy(() => import("./pages/report/index.jsx"));
const ReportDashboard = lazy(() =>
  import("./pages/report/dashboard/index.jsx")
);
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
    fontFamily: "Helvetica",
  },
  palette: {
    primary: {
      light: COLORS.YELLOW, //set these later
      main: COLORS.TANGERINE,
      dark: COLORS.ORANGE,
      contrastText: COLORS.BLACK,
      rose: COLORS.ROSE,
      red: COLORS.RED,
    },
    secondary: {
      light: COLORS.GREY, //set these later
      main: COLORS.MEDIUM_GREY,
      dark: COLORS.DARK_GREY,
      lightest: COLORS.LIGHT_GREY,
    },
  },
});

function App() {
  const { isUserLoggedIn, user } = useAuthContext();
  const drawerWidth = 240;
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const getRoutesForRole = () => {
    const routes = !isUserLoggedIn() ? (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    ) : (
      <BoardProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {isPrivileged(user.role) ? (
              <>
                <Route path="admin">
                  <Route path="workflow" element={<AdminWorkflow />} />
                  <Route path="management" element={<AdminManagement />} />
                  <Route path="form" element={<AdminForm />} />
                  <Route path="status" element={<AdminStatus />} />
                </Route>
                <Route path="/">
                  <Route index element={<Incident />} />
                  <Route path="incidents" element={<IncidentReport />} />
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
                <Route path="/incidents" element={<IncidentReport />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BoardProvider>
    );

    return routes;
  };

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Box>
          <Box display="flex">
            {isUserLoggedIn() && <Header />}
          </Box>
          <Box>
            <Sidebar
              drawerWidth={drawerWidth}
              isOpen={sidebarOpen}
              handleSidebarToggle={setSidebarOpen}
            />
            <Box component="main" sx={{ flexGrow: 1, paddingLeft: sidebarOpen ? drawerWidth + "px" : 0 }} style={{
                transition: "padding-left 0.3s ease",
                overflow: "auto",
                marginTop: "4rem",
            }}>
              {getRoutesForRole()}
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
