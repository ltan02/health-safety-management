import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Root from "./routes/root";
import Admin from "./pages/admin";
import Incident from "./pages/incident";
import Report from "./pages/report";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/incident",
    element: <Incident />,
  },
  {
    path: "/report",
    element: <Report />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);