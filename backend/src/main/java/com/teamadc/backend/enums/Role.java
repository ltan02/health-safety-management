package com.teamadc.backend.enums;

public enum Role {
    ADMIN, SAFETY_WARDEN, EMPLOYEE;

    private static final String adminString = "ADMIN";
    private static final String safetyWardenString = "SAFETY_WARDEN";
    private static final String employeeString = "EMPLOYEE";

    @Override
    public String toString() {
        return switch (this) {
            case ADMIN -> adminString;
            case SAFETY_WARDEN -> safetyWardenString;
            case EMPLOYEE -> employeeString;
        };
    }

    public static Role stringToRole(String roleStr) {
        if (roleStr == null) {
            throw new IllegalArgumentException("Role string cannot be null");
        }
        return switch (roleStr) {
            case adminString -> ADMIN;
            case safetyWardenString -> SAFETY_WARDEN;
            case employeeString -> EMPLOYEE;
            default -> throw new IllegalArgumentException("Invalid role string");
        };
    }

    public static String stringToStringRole(String roleStr) {
        if (roleStr == null) {
            throw new IllegalArgumentException("Role string cannot be null");
        }
        return switch (roleStr) {
            case adminString -> adminString;
            case safetyWardenString -> safetyWardenString;
            case employeeString -> employeeString;
            default -> throw new IllegalArgumentException("Invalid role string");
        };
    }
}
