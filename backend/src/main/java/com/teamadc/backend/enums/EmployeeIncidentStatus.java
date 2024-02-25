package com.teamadc.backend.enums;

public enum EmployeeIncidentStatus {
    REPORT_SUBMITTED, REVIEW_NEEDED, REVISIONS_IN_PROGRESS, REVIEW_COMPLETED;

    private static final String reportSubmittedString = "REPORT_SUBMITTED";
    private static final String reviewNeededString = "REVIEW_NEEDED";
    private static final String revisionsInProgressString = "REVISIONS_IN_PROGRESS";
    private static final String reviewCompletedString = "REVIEW_COMPLETED";

    @Override
    public String toString() {
        return switch (this) {
            case REPORT_SUBMITTED -> reportSubmittedString;
            case REVIEW_NEEDED -> reviewNeededString;
            case REVISIONS_IN_PROGRESS -> revisionsInProgressString;
            case REVIEW_COMPLETED -> reviewCompletedString;
        };
    }

    public static EmployeeIncidentStatus stringToStatus(String statusStr) {
        if (statusStr == null) {
            throw new IllegalArgumentException("Status string cannot be null");
        }
        return switch (statusStr) {
            case reportSubmittedString -> REPORT_SUBMITTED;
            case reviewNeededString -> REVIEW_NEEDED;
            case revisionsInProgressString -> REVISIONS_IN_PROGRESS;
            case reviewCompletedString -> REVIEW_COMPLETED;
            default -> throw new IllegalArgumentException("Invalid status string");
        };
    }
}
