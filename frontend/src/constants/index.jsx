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
        ["Workflows"]: "/admin/workflow",
        ["Form Customization"]: "/admin/form",
        ["Columns and Statuses"]: "/admin/status",
    },
    [PAGE_TYPE.INCIDENT]: {
        ["Incident Board"]: "/",
        ["Incident Reports"]: "/incidents",
    },
    [PAGE_TYPE.REPORT]: {
        ["Dashboard"]: "/report",
        ["Bar Chart"]: "/report/bar",
        ["Line Chart"]: "/report/line",
        ["Pie Chart"]: "/report/pie",
        ["Scatter Chart"]: "/report/scatter",
    },
};

export const EMPLOYEE_SIDEBAR_CONTENTS = {
    [PAGE_TYPE.INCIDENT]: {
        ["Incident Board"]: "/",
        ["Incident Reports"]: "/incidents",
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
