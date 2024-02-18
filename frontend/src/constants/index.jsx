import React from "react";
import RedirectButton from "../components/sidebar/RedirectButton";
import RoleSwitchModal from "../components/sidebar/RoleSwitchModal";

export const PAGE_TYPE = {
  ADMIN: "admin",
  INCIDENT: "incident",
  REPORT: "report",
};

export const SIDEBAR_CONTENTS = {
  [PAGE_TYPE.ADMIN]: {
    ["Workflows"]: (
        <RedirectButton to="/admin/workflows">Workflows</RedirectButton>
      ),
      ["Report Board"]: (
        <RedirectButton to="/admin/report">Report Board</RedirectButton>
   ),
    ["Columns and Statuses"]: (
      <RedirectButton to="/admin/status">Columns and Statuses</RedirectButton>
    ),
    ["Workflow Management"]: (
      <RedirectButton to="/admin/management">Workflow Management</RedirectButton>
    ),
  },
  [PAGE_TYPE.INCIDENT]: {
    ["Incident Board"]: (
      <RedirectButton to="/incident">Incident Board</RedirectButton>
    ),
    ["Form Customization"]:(
      <RedirectButton to="/incident/form">Form Customization</RedirectButton>
    )
  },
  [PAGE_TYPE.REPORT]: {
    ["Role"]: (
      <RoleSwitchModal>Role</RoleSwitchModal>
    ),
    ["Report Board"]: (
      <RedirectButton to="/report">Report Board</RedirectButton>
    ),
    ["Overview"]: (
      <RedirectButton to="/report/overview">Overview</RedirectButton>
    ),
    ["Dashboard"]: (
      <RedirectButton to="/report/dashboard">Dashboard</RedirectButton>
    ),
    ["Past Reports"]: (
      <RedirectButton to="/report/past">Past Reports</RedirectButton>
    ),
  },
};

export const COLORS = {
  PRIMARY: "#DEDEDE",
  SECONDARY: "#0055cc",
  TERTIARY: "#0011cc",
  LIGHT: "#f2f2f2",
  DARK: "#333333",
};
