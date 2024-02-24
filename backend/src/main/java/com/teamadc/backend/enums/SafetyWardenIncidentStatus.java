package com.teamadc.backend.enums;

public enum SafetyWardenIncidentStatus {
    PENDING_REVIEW, COMMENTS_ADDRESSED, COMPLETED_REPORTS;

    private static final String pendingReviewString = "PENDING_REVIEW";
    private static final String commentsAddressedString = "COMMENTS_ADDRESSED";
    private static final String completedReportsString = "COMPLETED_REPORTS";

    @Override
    public String toString() {
        return switch (this) {
            case PENDING_REVIEW -> pendingReviewString;
            case COMMENTS_ADDRESSED -> commentsAddressedString;
            case COMPLETED_REPORTS -> completedReportsString;
        };
    }

    public static SafetyWardenIncidentStatus stringToStatus(String statusStr) {
        if (statusStr == null) {
            throw new IllegalArgumentException("Status string cannot be null");
        }
        return switch (statusStr) {
            case pendingReviewString -> PENDING_REVIEW;
            case commentsAddressedString -> COMMENTS_ADDRESSED;
            case completedReportsString -> COMPLETED_REPORTS;
            default -> throw new IllegalArgumentException("Invalid status string");
        };
    }
}
