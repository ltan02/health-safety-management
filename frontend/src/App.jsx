import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/global/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Root from "./routes/root";
import Admin from "./pages/admin";
import Incident from "./pages/incident";
import Report from "./pages/report";
import Login from "./pages/login";
import { COLORS } from "./constants/index.jsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "./context/AuthContext.jsx";
import AdminWorkflow from "./pages/admin/workflows/index.jsx";
import AdminManagement from "./pages/admin/management/index.jsx";
import AdminReport from "./pages/admin/report/index.jsx";
import AdminStatus from "./pages/admin/status/index.jsx";

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
      contrastText: "black"
    },
    secondary: {
      light: "#DEDEDE", //set these later
      main: "#7D7D7D",
      dark: "#464646",
    },
  },
});

function App() {
  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <Header />
            <Routes>
              <Route path="/" element={<Root />} />
              <Route path="admin">
                <Route index element={<Admin />} />
                <Route path="workflows" element={<AdminWorkflow />} />
                <Route path="management" element={<AdminManagement />} />
                <Route path="report" element={<AdminReport />} />
                <Route path="status" element={<AdminStatus />} />
              </Route>
              <Route path="incident" element={<Incident />} />
              <Route path="report" element={<Report />} />
              <Route path="login" element={<Login />} />
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
