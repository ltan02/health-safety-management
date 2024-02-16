export const PAGE_TYPE = {
  ADMIN: "admin",
  INCIDENT: "incident",
  REPORT: "report",
};

export const SIDEBAR_CONTENTS = {
  [PAGE_TYPE.ADMIN]: [
    "Workflows",
    "Report Board",
    "Columns and Statuses",
    "Workflow Management",
  ],
  [PAGE_TYPE.INCIDENT]: ["Incidents", "Form Customization"],
  [PAGE_TYPE.REPORT]: ["Role", "Overview", "Dashboard", "Past Reports"],
};

export const COLORS = {
  PRIMARY: "#DEDEDE",
  SECONDARY: "#0055cc",
  TERTIARY: "#0011cc",
  LIGHT: "#f2f2f2",
  DARK: "#333333",
};
