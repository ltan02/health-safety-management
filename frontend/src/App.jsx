import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/global/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Root from "./routes/root";
import Admin from "./pages/admin";
import Incident from "./pages/incident";
import Report from "./pages/report";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="admin" element={<Admin />} />
          <Route path="incident" element={<Incident />} />
          <Route path="report" element={<Report />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
