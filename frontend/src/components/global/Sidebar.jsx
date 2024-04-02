import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { isPrivileged } from "../../utils/permissions.js";
import { Divider, Typography, alpha } from "@mui/material";
import ViewWeekOutlinedIcon from "@mui/icons-material/ViewWeekOutlined";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import { useNavigate } from "react-router-dom";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SchemaOutlinedIcon from "@mui/icons-material/SchemaOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import InsertChartOutlinedRoundedIcon from "@mui/icons-material/InsertChartOutlinedRounded";
import ScatterPlotOutlinedIcon from "@mui/icons-material/ScatterPlotOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import PieChartOutlinedIcon from "@mui/icons-material/PieChartOutlined";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import CorporateFareOutlinedIcon from "@mui/icons-material/CorporateFareOutlined";
import DynamicFormOutlinedIcon from "@mui/icons-material/DynamicFormOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";

function Sidebar({ isOpen, drawerWidth, handleSidebarToggle }) {
    const toggleDrawer = (open) => () => handleSidebarToggle(open);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [hoveringReports, setHoveringReports] = useState(false);
    const [hoveringWorkflows, setHoveringWorkflows] = useState(false);
    const [hoveringCustomizations, setHoveringCustomizations] = useState(false);
    const [hoveringSidebar, setHoveringSidebar] = useState(false);
    const [hoveringBack, setHoveringBack] = useState(false);
    const { user } = useAuthContext();
    let location = useLocation();
    let history = useNavigate();

    return (
        <Box
            onMouseEnter={() => setHoveringSidebar(true)}
            onMouseLeave={() => setHoveringSidebar(false)}
            sx={{ width: 240, position: "relative" }}
        >
            {/* {hoveringSidebar && sidebarOpen && (
                <div
                    onMouseEnter={() => setHoveringBack(true)}
                    onMouseLeave={() => setHoveringBack(false)}
                    style={{
                        position: "absolute",
                        top: "20px",
                        left: "211px",
                        border: hoveringBack ? 0 : "1px solid #44546F",
                        borderRadius: "50%",
                        width: "18px",
                        height: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 2,
                        backgroundColor: hoveringBack ? "#EB8C00" : "#fff",
                        cursor: "pointer",
                    }}
                >
                    <ChevronLeftOutlinedIcon
                        sx={{ fontSize: "18px", fontWeight: 600, color: hoveringBack ? "#FFF" : "#000" }}
                    />
                </div>
            )} */}
            <SwipeableDrawer
                ModalProps={{ keepMounted: true }}
                anchor="left"
                open={isOpen}
                onOpen={toggleDrawer(true)}
                onClose={toggleDrawer(false)}
                variant="persistent"
                sx={{
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: "column",
                        top: "64px",
                        zIndex: 1,
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "start",
                        alignContent: "start",
                        alignItems: "start",
                        height: "60%",
                        paddingX: "10px",
                        marginTop: "50px",
                    }}
                >
                    {(location.pathname === "/" || location.pathname === "/incidents") && (
                        <>
                            <Typography
                                sx={{ fontWeight: 700, fontSize: "11px", marginLeft: "17px", marginBottom: "5px" }}
                            >
                                INCIDENT MANAGEMENT
                            </Typography>
                            <Button
                                onClick={() => history("/")}
                                sx={{
                                    paddingLeft: "17px",
                                    paddingY: "8px",
                                    paddingRight: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "start",
                                    width: "100%",
                                    "&:hover": {
                                        backgroundColor: alpha("#EB8C00", 0.2),
                                    },
                                    backgroundColor: location.pathname === "/" ? alpha("#EB8C00", 0.2) : "transparent",
                                }}
                            >
                                <ViewWeekOutlinedIcon
                                    sx={{
                                        fontSize: 24,
                                        marginRight: "10px",
                                        color: location.pathname === "/" ? "#D04A02" : "#000",
                                    }}
                                />
                                <span>
                                    <Typography
                                        style={{
                                            fontSize: "14px",
                                            fontWeight: 400,
                                            color: location.pathname === "/" ? "#D04A02" : "#000",
                                        }}
                                    >
                                        Board
                                    </Typography>
                                </span>
                            </Button>
                            <Button
                                onClick={() => history("/incidents")}
                                sx={{
                                    paddingLeft: "17px",
                                    paddingY: "8px",
                                    paddingRight: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "start",
                                    width: "100%",
                                    "&:hover": {
                                        backgroundColor: alpha("#EB8C00", 0.2),
                                    },
                                    backgroundColor:
                                        location.pathname === "/incidents" ? alpha("#EB8C00", 0.2) : "transparent",
                                }}
                            >
                                <DnsOutlinedIcon
                                    sx={{
                                        fontSize: 24,
                                        marginRight: "10px",
                                        color: location.pathname === "/incidents" ? "#D04A02" : "#000",
                                    }}
                                />
                                <span>
                                    <Typography
                                        style={{
                                            fontSize: "14px",
                                            fontWeight: 400,
                                            color: location.pathname === "/incidents" ? "#D04A02" : "#000",
                                        }}
                                    >
                                        Incidents
                                    </Typography>
                                </span>
                            </Button>
                            {isPrivileged(user.role) && (
                                <>
                                    <Button
                                        onClick={() => {
                                            history("/report");
                                            setHoveringReports(false);
                                        }}
                                        sx={{
                                            paddingLeft: "17px",
                                            paddingY: "8px",
                                            paddingRight: "8px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "100%",
                                            "&:hover": {
                                                backgroundColor: alpha("#EB8C00", 0.2),
                                            },
                                            backgroundColor:
                                                location.pathname === "/report" ? alpha("#EB8C00", 0.2) : "transparent",
                                        }}
                                        onMouseEnter={() => setHoveringReports(true)}
                                        onMouseLeave={() => setHoveringReports(false)}
                                    >
                                        <div style={{ display: "flex" }}>
                                            <QueryStatsOutlinedIcon
                                                sx={{
                                                    fontSize: 24,
                                                    marginRight: "10px",
                                                    color: location.pathname === "/report" ? "#D04A02" : "#000",
                                                }}
                                            />
                                            <span>
                                                <Typography
                                                    style={{
                                                        fontSize: "14px",
                                                        fontWeight: 400,
                                                        color: location.pathname === "/report" ? "#D04A02" : "#000",
                                                    }}
                                                >
                                                    Reports
                                                </Typography>
                                            </span>
                                        </div>
                                        {hoveringReports && (
                                            <div
                                                style={{
                                                    borderRadius: "50%",
                                                    width: "20px",
                                                    height: "20px",
                                                    backgroundColor: "#2d2d2d",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <ArrowForwardIcon sx={{ fontSize: 16, color: "#fff" }} />
                                            </div>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            history("/admin/workflow");
                                            setHoveringWorkflows(false);
                                        }}
                                        sx={{
                                            paddingLeft: "17px",
                                            paddingY: "8px",
                                            paddingRight: "8px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "100%",
                                            "&:hover": {
                                                backgroundColor: alpha("#EB8C00", 0.2),
                                            },
                                            backgroundColor:
                                                location.pathname === "/admin/workflow"
                                                    ? alpha("#EB8C00", 0.2)
                                                    : "transparent",
                                        }}
                                        onMouseEnter={() => setHoveringWorkflows(true)}
                                        onMouseLeave={() => setHoveringWorkflows(false)}
                                    >
                                        <div style={{ display: "flex" }}>
                                            <SchemaOutlinedIcon
                                                sx={{
                                                    fontSize: 24,
                                                    marginRight: "10px",
                                                    color: location.pathname === "/admin/workflow" ? "#D04A02" : "#000",
                                                }}
                                            />
                                            <span>
                                                <Typography
                                                    style={{
                                                        fontSize: "14px",
                                                        fontWeight: 400,
                                                        color:
                                                            location.pathname === "/admin/workflow"
                                                                ? "#D04A02"
                                                                : "#000",
                                                    }}
                                                >
                                                    Workflows
                                                </Typography>
                                            </span>
                                        </div>
                                        {hoveringWorkflows && (
                                            <div
                                                style={{
                                                    borderRadius: "50%",
                                                    width: "20px",
                                                    height: "20px",
                                                    backgroundColor: "#2d2d2d",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <ArrowForwardIcon sx={{ fontSize: 16, color: "#fff" }} />
                                            </div>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            history("/admin/form");
                                            setHoveringCustomizations(false);
                                        }}
                                        sx={{
                                            paddingLeft: "17px",
                                            paddingY: "8px",
                                            paddingRight: "8px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "100%",
                                            "&:hover": {
                                                backgroundColor: alpha("#EB8C00", 0.2),
                                            },
                                            backgroundColor:
                                                location.pathname === "/admin/form"
                                                    ? alpha("#EB8C00", 0.2)
                                                    : "transparent",
                                        }}
                                        onMouseEnter={() => setHoveringCustomizations(true)}
                                        onMouseLeave={() => setHoveringCustomizations(false)}
                                    >
                                        <div style={{ display: "flex" }}>
                                            <SettingsOutlinedIcon
                                                sx={{
                                                    fontSize: 24,
                                                    marginRight: "10px",
                                                    color: location.pathname === "/admin/form" ? "#D04A02" : "#000",
                                                }}
                                            />
                                            <span>
                                                <Typography
                                                    style={{
                                                        fontSize: "14px",
                                                        fontWeight: 400,
                                                        color: location.pathname === "/admin/form" ? "#D04A02" : "#000",
                                                    }}
                                                >
                                                    Customizations
                                                </Typography>
                                            </span>
                                        </div>
                                        {hoveringCustomizations && (
                                            <div
                                                style={{
                                                    borderRadius: "50%",
                                                    width: "20px",
                                                    height: "20px",
                                                    backgroundColor: "#2d2d2d",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <ArrowForwardIcon sx={{ fontSize: 16, color: "#fff" }} />
                                            </div>
                                        )}
                                    </Button>
                                </>
                            )}
                        </>
                    )}
                    {location.pathname.split("/")[1] === "report" && (
                        <>
                            <Button
                                onClick={() => {
                                    history("/");
                                    setHoveringCustomizations(false);
                                    setHoveringReports(false);
                                    setHoveringWorkflows(false);
                                }}
                                sx={{
                                    paddingLeft: "17px",
                                    paddingY: "8px",
                                    paddingRight: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    "&:hover": {
                                        backgroundColor: alpha("#EB8C00", 0.2),
                                    },
                                    marginBottom: "8px",
                                }}
                                onMouseEnter={() => setHoveringReports(true)}
                                onMouseLeave={() => setHoveringReports(false)}
                            >
                                <div style={{ display: "flex" }}>
                                    <div
                                        style={{
                                            borderRadius: "50%",
                                            width: "20px",
                                            height: "20px",
                                            backgroundColor: "#2d2d2d",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginRight: "10px",
                                        }}
                                    >
                                        <ArrowBackIcon sx={{ fontSize: 16, color: "#fff" }} />
                                    </div>
                                    <span>
                                        <Typography
                                            style={{
                                                fontSize: "14px",
                                                fontWeight: 400,
                                                color: "#000",
                                            }}
                                        >
                                            Back to board
                                        </Typography>
                                    </span>
                                </div>
                            </Button>
                            <Divider
                                style={{
                                    width: "100%",
                                    marginRight: "8px",
                                    color: "#44546F",
                                    borderBottomWidth: "2px",
                                }}
                            />
                            <Typography
                                sx={{
                                    fontWeight: 600,
                                    fontSize: "14px",
                                    marginLeft: "17px",
                                    marignBottom: "8px",
                                    marginTop: "12px",
                                }}
                            >
                                Reports
                            </Typography>
                            <Button
                                onClick={() => history("/report")}
                                sx={{
                                    marginTop: "8px",
                                    paddingLeft: "17px",
                                    paddingY: "8px",
                                    paddingRight: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "start",
                                    width: "100%",
                                    "&:hover": {
                                        backgroundColor: alpha("#EB8C00", 0.2),
                                    },
                                    backgroundColor:
                                        location.pathname === "/report" ? alpha("#EB8C00", 0.2) : "transparent",
                                }}
                            >
                                <DashboardOutlinedIcon
                                    sx={{
                                        fontSize: 24,
                                        marginRight: "10px",
                                        color: location.pathname === "/report" ? "#D04A02" : "#000",
                                    }}
                                />
                                <span>
                                    <Typography
                                        style={{
                                            fontSize: "14px",
                                            fontWeight: 400,
                                            color: location.pathname === "/report" ? "#D04A02" : "#000",
                                        }}
                                    >
                                        Dashboard
                                    </Typography>
                                </span>
                            </Button>
                            <Button
                                onClick={() => history("/report/status-insights")}
                                sx={{
                                    paddingLeft: "17px",
                                    paddingY: "8px",
                                    paddingRight: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "start",
                                    width: "100%",
                                    "&:hover": {
                                        backgroundColor: alpha("#EB8C00", 0.2),
                                    },
                                    backgroundColor:
                                        location.pathname === "/report/status-insights" ? alpha("#EB8C00", 0.2) : "transparent",
                                }}
                            >
                                <TimelineOutlinedIcon
                                    sx={{
                                        fontSize: 24,
                                        marginRight: "10px",
                                        color: location.pathname === "/report/status-insights" ? "#D04A02" : "#000",
                                    }}
                                />
                                <span>
                                    <Typography
                                        style={{
                                            fontSize: "14px",
                                            fontWeight: 400,
                                            color: location.pathname === "/report/status-insights" ? "#D04A02" : "#000",
                                        }}
                                    >
                                        Status Insights
                                    </Typography>
                                </span>
                            </Button>
                            <Button
                                onClick={() => history("/report/bar")}
                                sx={{
                                    paddingLeft: "17px",
                                    paddingY: "8px",
                                    paddingRight: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "start",
                                    width: "100%",
                                    "&:hover": {
                                        backgroundColor: alpha("#EB8C00", 0.2),
                                    },
                                    backgroundColor:
                                        location.pathname === "/report/bar" ? alpha("#EB8C00", 0.2) : "transparent",
                                }}
                            >
                                <InsertChartOutlinedRoundedIcon
                                    sx={{
                                        fontSize: 24,
                                        marginRight: "10px",
                                        color: location.pathname === "/report/bar" ? "#D04A02" : "#000",
                                    }}
                                />
                                <span>
                                    <Typography
                                        style={{
                                            fontSize: "14px",
                                            fontWeight: 400,
                                            color: location.pathname === "/report/bar" ? "#D04A02" : "#000",
                                        }}
                                    >
                                        Bar Chart
                                    </Typography>
                                </span>
                            </Button>
                            <Button
                                onClick={() => history("/report/scatter")}
                                sx={{
                                    paddingLeft: "17px",
                                    paddingY: "8px",
                                    paddingRight: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "start",
                                    width: "100%",
                                    "&:hover": {
                                        backgroundColor: alpha("#EB8C00", 0.2),
                                    },
                                    backgroundColor:
                                        location.pathname === "/report/scatter" ? alpha("#EB8C00", 0.2) : "transparent",
                                }}
                            >
                                <ScatterPlotOutlinedIcon
                                    sx={{
                                        fontSize: 24,
                                        marginRight: "10px",
                                        color: location.pathname === "/report/scatter" ? "#D04A02" : "#000",
                                    }}
                                />
                                <span>
                                    <Typography
                                        style={{
                                            fontSize: "14px",
                                            fontWeight: 400,
                                            color: location.pathname === "/report/scatter" ? "#D04A02" : "#000",
                                        }}
                                    >
                                        Scatter Plot
                                    </Typography>
                                </span>
                            </Button>
                            <Button
                                onClick={() => history("/report/line")}
                                sx={{
                                    paddingLeft: "17px",
                                    paddingY: "8px",
                                    paddingRight: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "start",
                                    width: "100%",
                                    "&:hover": {
                                        backgroundColor: alpha("#EB8C00", 0.2),
                                    },
                                    backgroundColor:
                                        location.pathname === "/report/line" ? alpha("#EB8C00", 0.2) : "transparent",
                                }}
                            >
                                <TimelineOutlinedIcon
                                    sx={{
                                        fontSize: 24,
                                        marginRight: "10px",
                                        color: location.pathname === "/report/line" ? "#D04A02" : "#000",
                                    }}
                                />
                                <span>
                                    <Typography
                                        style={{
                                            fontSize: "14px",
                                            fontWeight: 400,
                                            color: location.pathname === "/report/line" ? "#D04A02" : "#000",
                                        }}
                                    >
                                        Line Graph
                                    </Typography>
                                </span>
                            </Button>
                            <Button
                                onClick={() => history("/report/pie")}
                                sx={{
                                    paddingLeft: "17px",
                                    paddingY: "8px",
                                    paddingRight: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "start",
                                    width: "100%",
                                    "&:hover": {
                                        backgroundColor: alpha("#EB8C00", 0.2),
                                    },
                                    backgroundColor:
                                        location.pathname === "/report/pie" ? alpha("#EB8C00", 0.2) : "transparent",
                                }}
                            >
                                <PieChartOutlinedIcon
                                    sx={{
                                        fontSize: 24,
                                        marginRight: "10px",
                                        color: location.pathname === "/report/pie" ? "#D04A02" : "#000",
                                    }}
                                />
                                <span>
                                    <Typography
                                        style={{
                                            fontSize: "14px",
                                            fontWeight: 400,
                                            color: location.pathname === "/report/pie" ? "#D04A02" : "#000",
                                        }}
                                    >
                                        Pie Chart
                                    </Typography>
                                </span>
                            </Button>
                        </>
                    )}
                    {location.pathname.split("/")[1] === "admin" &&
                        (location.pathname.split("/")[2] === "workflow" ||
                            location.pathname.split("/")[2] === "status") && (
                            <>
                                <Button
                                    onClick={() => {
                                        history("/");
                                        setHoveringCustomizations(false);
                                        setHoveringReports(false);
                                        setHoveringWorkflows(false);
                                    }}
                                    sx={{
                                        paddingLeft: "17px",
                                        paddingY: "8px",
                                        paddingRight: "8px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        width: "100%",
                                        "&:hover": {
                                            backgroundColor: alpha("#EB8C00", 0.2),
                                        },
                                        marginBottom: "8px",
                                    }}
                                    onMouseEnter={() => setHoveringReports(true)}
                                    onMouseLeave={() => setHoveringReports(false)}
                                >
                                    <div style={{ display: "flex" }}>
                                        <div
                                            style={{
                                                borderRadius: "50%",
                                                width: "20px",
                                                height: "20px",
                                                backgroundColor: "#2d2d2d",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginRight: "10px",
                                            }}
                                        >
                                            <ArrowBackIcon sx={{ fontSize: 16, color: "#fff" }} />
                                        </div>
                                        <span>
                                            <Typography
                                                style={{
                                                    fontSize: "14px",
                                                    fontWeight: 400,
                                                    color: "#000",
                                                }}
                                            >
                                                Back to board
                                            </Typography>
                                        </span>
                                    </div>
                                </Button>
                                <Divider
                                    style={{
                                        width: "100%",
                                        marginRight: "8px",
                                        color: "#44546F",
                                        borderBottomWidth: "2px",
                                    }}
                                />
                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: "14px",
                                        marginLeft: "17px",
                                        marignBottom: "8px",
                                        marginTop: "12px",
                                    }}
                                >
                                    Workflows
                                </Typography>
                                <Button
                                    onClick={() => history("/admin/workflow")}
                                    sx={{
                                        marginTop: "8px",
                                        paddingLeft: "17px",
                                        paddingY: "8px",
                                        paddingRight: "8px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "start",
                                        width: "100%",
                                        "&:hover": {
                                            backgroundColor: alpha("#EB8C00", 0.2),
                                        },
                                        backgroundColor:
                                            location.pathname === "/admin/workflow"
                                                ? alpha("#EB8C00", 0.2)
                                                : "transparent",
                                    }}
                                >
                                    <ManageSearchOutlinedIcon
                                        sx={{
                                            fontSize: 24,
                                            marginRight: "10px",
                                            color: location.pathname === "/admin/workflow" ? "#D04A02" : "#000",
                                        }}
                                    />
                                    <span>
                                        <Typography
                                            style={{
                                                fontSize: "14px",
                                                fontWeight: 400,
                                                color: location.pathname === "/admin/workflow" ? "#D04A02" : "#000",
                                            }}
                                        >
                                            Management
                                        </Typography>
                                    </span>
                                </Button>
                                <Button
                                    onClick={() => history("/admin/status")}
                                    sx={{
                                        paddingLeft: "17px",
                                        paddingY: "8px",
                                        paddingRight: "8px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "start",
                                        width: "100%",
                                        "&:hover": {
                                            backgroundColor: alpha("#EB8C00", 0.2),
                                        },
                                        backgroundColor:
                                            location.pathname === "/admin/status"
                                                ? alpha("#EB8C00", 0.2)
                                                : "transparent",
                                    }}
                                >
                                    <CorporateFareOutlinedIcon
                                        sx={{
                                            fontSize: 24,
                                            marginRight: "10px",
                                            color: location.pathname === "/admin/status" ? "#D04A02" : "#000",
                                        }}
                                    />
                                    <span>
                                        <Typography
                                            style={{
                                                fontSize: "14px",
                                                fontWeight: 400,
                                                color: location.pathname === "/admin/status" ? "#D04A02" : "#000",
                                            }}
                                        >
                                            Columns and statuses
                                        </Typography>
                                    </span>
                                </Button>
                            </>
                        )}
                    {location.pathname.split("/")[1] === "admin" &&
                        !(
                            location.pathname.split("/")[2] === "workflow" ||
                            location.pathname.split("/")[2] === "status"
                        ) && (
                            <>
                                <Button
                                    onClick={() => {
                                        history("/");
                                        setHoveringCustomizations(false);
                                        setHoveringReports(false);
                                        setHoveringWorkflows(false);
                                    }}
                                    sx={{
                                        paddingLeft: "17px",
                                        paddingY: "8px",
                                        paddingRight: "8px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        width: "100%",
                                        "&:hover": {
                                            backgroundColor: alpha("#EB8C00", 0.2),
                                        },
                                        marginBottom: "8px",
                                    }}
                                    onMouseEnter={() => setHoveringReports(true)}
                                    onMouseLeave={() => setHoveringReports(false)}
                                >
                                    <div style={{ display: "flex" }}>
                                        <div
                                            style={{
                                                borderRadius: "50%",
                                                width: "20px",
                                                height: "20px",
                                                backgroundColor: "#2d2d2d",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginRight: "10px",
                                            }}
                                        >
                                            <ArrowBackIcon sx={{ fontSize: 16, color: "#fff" }} />
                                        </div>
                                        <span>
                                            <Typography
                                                style={{
                                                    fontSize: "14px",
                                                    fontWeight: 400,
                                                    color: "#000",
                                                }}
                                            >
                                                Back to board
                                            </Typography>
                                        </span>
                                    </div>
                                </Button>
                                <Divider
                                    style={{
                                        width: "100%",
                                        marginRight: "8px",
                                        color: "#44546F",
                                        borderBottomWidth: "2px",
                                    }}
                                />
                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: "14px",
                                        marginLeft: "17px",
                                        marignBottom: "8px",
                                        marginTop: "12px",
                                    }}
                                >
                                    Customizations
                                </Typography>
                                <Button
                                    onClick={() => history("/admin/form")}
                                    sx={{
                                        marginTop: "8px",
                                        paddingLeft: "17px",
                                        paddingY: "8px",
                                        paddingRight: "8px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "start",
                                        width: "100%",
                                        "&:hover": {
                                            backgroundColor: alpha("#EB8C00", 0.2),
                                        },
                                        backgroundColor:
                                            location.pathname === "/admin/form" ? alpha("#EB8C00", 0.2) : "transparent",
                                    }}
                                >
                                    <DynamicFormOutlinedIcon
                                        sx={{
                                            fontSize: 24,
                                            marginRight: "10px",
                                            color: location.pathname === "/admin/form" ? "#D04A02" : "#000",
                                        }}
                                    />
                                    <span>
                                        <Typography
                                            style={{
                                                fontSize: "14px",
                                                fontWeight: 400,
                                                color: location.pathname === "/admin/form" ? "#D04A02" : "#000",
                                            }}
                                        >
                                            Form customization
                                        </Typography>
                                    </span>
                                </Button>
                            </>
                        )}
                </Box>
            </SwipeableDrawer>
        </Box>
    );
}

export default Sidebar;
