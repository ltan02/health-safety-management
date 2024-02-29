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
        ["Workflows"]: <RedirectButton to="/">Workflows</RedirectButton>,
        ["Form Customization"]: <RedirectButton to="/form">Form Customization</RedirectButton>,
        ["Columns and Statuses"]: <RedirectButton to="/status">Columns and Statuses</RedirectButton>,
        ["Workflow Management"]: <RedirectButton to="/management">Workflow Management</RedirectButton>,
    },
    [PAGE_TYPE.INCIDENT]: {
        ["Incident Board"]: <RedirectButton to="/incident">Incident Board</RedirectButton>,
        ["Incident Reports"]: <RedirectButton to="/incident/report">Incident Reports</RedirectButton>,
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
        ["Incident Reports"]: <RedirectButton to="/report">Incident Reports</RedirectButton>,
    },
};

export const COLORS = {
    PRIMARY: "#DEDEDE",
    SECONDARY: "#0055cc",
    TERTIARY: "#0011cc",
    LIGHT: "#f2f2f2",
    DARK: "#333333",
};
