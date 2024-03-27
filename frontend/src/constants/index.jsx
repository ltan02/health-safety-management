import RedirectButton from "../components/sidebar/RedirectButton";

export const Roles = {
    Admin: "ADMIN",
    SafetyWarden: "SAFETY_WARDEN",
    Employee: "EMPLOYEE",
};

export const PAGE_TYPE = {
    ADMIN: "admin",
    INCIDENT: "incident",
    REPORT: "report",
};

export const PRIVILEGED_SIDEBAR_CONTENTS = {
    [PAGE_TYPE.ADMIN]: {
        ["Workflows"]: <RedirectButton to="/admin/workflow">Workflows</RedirectButton>,
        ["Form Customization"]: <RedirectButton to="/admin/form">Form Customization</RedirectButton>,
        ["Columns and Statuses"]: <RedirectButton to="/admin/status">Columns and Statuses</RedirectButton>,
    },
    [PAGE_TYPE.INCIDENT]: {
        ["Incident Board"]: <RedirectButton to="/">Incident Board</RedirectButton>,
        ["Incident Reports"]: <RedirectButton to="/incidents">Incident Reports</RedirectButton>,
    },
    [PAGE_TYPE.REPORT]: {
        ["Dashboard"]: <RedirectButton to="/report">Dashboard</RedirectButton>,
        ["Bar Chart"]: <RedirectButton to="/report/bar">Bar Chart</RedirectButton>,
        ["Line Chart"]: <RedirectButton to="/report/line">Line Chart</RedirectButton>,
        ["Pie Chart"]: <RedirectButton to="/report/pie">Pie Chart</RedirectButton>,
        ["Scatter Chart"]: <RedirectButton to="/report/scatter">Scatter Chart</RedirectButton>,
    },
};

export const EMPLOYEE_SIDEBAR_CONTENTS = {
    [PAGE_TYPE.INCIDENT]: {
        ["Incident Board"]: <RedirectButton to="/">Incident Board</RedirectButton>,
        ["Incident Reports"]: <RedirectButton to="/incidents">Incident Reports</RedirectButton>,
    },
};

export const COLORS = {
    PRIMARY: "#DEDEDE",
    SECONDARY: "#0055cc",
    TERTIARY: "#0011cc",
    LIGHT: "#f2f2f2",
    DARK: "#333333",
    YELLOW: "#FFB600",
    TANGERINE: "#EB8C00",
    ORANGE: "#D04A02",
    ROSE: "#DB536A",
    RED: "#E0301E",
    BLACK: "#000000",
    DARK_GREY: "#2D2D2D",
    MEDIUM_GREY: "#464646",
    GREY: "#7D7D7D",
    LIGHT_GREY: "#DEDEDE"
};
