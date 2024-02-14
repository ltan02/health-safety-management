package com.teamadc.backend.enums;

public enum Role {
    ADMIN, SAFETY_WARDEN, EMPLOYEE;

    private static final String adminString = "admin";
    private static final String safetyWardenString = "safetyWarden";
    private static final String employeeString = "employee";

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
}
