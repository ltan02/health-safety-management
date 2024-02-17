import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/global/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Root from "./routes/root";
import Admin from "./pages/admin";
import Incident from "./pages/incident";
import Report from "./pages/report";
import Login from "./pages/login";
import { COLORS } from "./constants";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "./context/AuthContext.jsx";

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
              <Route path="admin" element={<Admin />} />
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
