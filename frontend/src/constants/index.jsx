import RedirectButton from "../components/sidebar/RedirectButton";
import RoleSwitchModal from "../components/sidebar/RoleSwitchModal";

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
        ["Workflows"]: <RedirectButton to="/workflow">Workflows</RedirectButton>,
        ["Form Customization"]: <RedirectButton to="/form">Form Customization</RedirectButton>,
        ["Columns and Statuses"]: <RedirectButton to="/status">Columns and Statuses</RedirectButton>,
        ["Workflow Management"]: <RedirectButton to="/management">Workflow Management</RedirectButton>,
    },
    [PAGE_TYPE.INCIDENT]: {
        ["Incident Board"]: <RedirectButton to="/">Incident Board</RedirectButton>,
        ["Incident Reports"]: <RedirectButton to="/incidents">Incident Reports</RedirectButton>,
    },
    [PAGE_TYPE.REPORT]: {
        ["Role"]: <RoleSwitchModal>Role</RoleSwitchModal>,
        ["Overview"]: <RedirectButton to="/report">Overview</RedirectButton>,
        ["Dashboard"]: <RedirectButton to="/report/dashboard">Dashboard</RedirectButton>
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
