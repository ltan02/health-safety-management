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
        ["Workflows"]: <RedirectButton to="/workflows">Workflows</RedirectButton>,
        ["Report Board"]: <RedirectButton to="/">Report Board</RedirectButton>,
        // ["Columns and Statuses"]: <RedirectButton to="/status">Columns and Statuses</RedirectButton>,
        // ["Workflow Management"]: <RedirectButton to="/management">Workflow Management</RedirectButton>,
    },
    [PAGE_TYPE.INCIDENT]: {
        ["Incident Board"]: <RedirectButton to="/incident">Incident Board</RedirectButton>,
        ["Form Customization"]: <RedirectButton to="/incident/form">Form Customization</RedirectButton>,
    },
    [PAGE_TYPE.REPORT]: {
        ["Role"]: <RoleSwitchModal>Role</RoleSwitchModal>,
        ["Report Board"]: <RedirectButton to="/report">Report Board</RedirectButton>,
        ["Overview"]: <RedirectButton to="/report/overview">Overview</RedirectButton>,
        ["Dashboard"]: <RedirectButton to="/report/dashboard">Dashboard</RedirectButton>,
        ["Past Reports"]: <RedirectButton to="/report/past">Past Reports</RedirectButton>,
    },
};

export const EMPLOYEE_SIDEBAR_CONTENTS = {
    [PAGE_TYPE.INCIDENT]: {
        ["Incident Board"]: <RedirectButton to="/">Incident Board</RedirectButton>,
        ["Form Customization"]: <RedirectButton to="/form">Form Customization</RedirectButton>,
    },
};

export const COLORS = {
    PRIMARY: "#DEDEDE",
    SECONDARY: "#0055cc",
    TERTIARY: "#0011cc",
    LIGHT: "#f2f2f2",
    DARK: "#333333",
};
