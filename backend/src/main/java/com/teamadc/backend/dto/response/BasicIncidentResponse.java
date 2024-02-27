package com.teamadc.backend.dto.response;

import com.teamadc.backend.enums.EmployeeIncidentStatus;
import com.teamadc.backend.enums.SafetyWardenIncidentStatus;

import java.util.List;

public class BasicIncidentResponse {

    private String id;
    private String title;
    private String reporter;
    private List<String> employeesInvolved;
    private EmployeeIncidentStatus employeeIncidentStatus;
    private SafetyWardenIncidentStatus safetyWardenIncidentStatus;

    public BasicIncidentResponse() {}

    public BasicIncidentResponse(String id, String title, String reporter, List<String> employeesInvolved, EmployeeIncidentStatus employeeIncidentStatus, SafetyWardenIncidentStatus safetyWardenIncidentStatus) {
        this.id = id;
        this.title = title;
        this.reporter = reporter;
        this.employeesInvolved = employeesInvolved;
        this.employeeIncidentStatus = employeeIncidentStatus;
        this.safetyWardenIncidentStatus = safetyWardenIncidentStatus;
    }

    public EmployeeIncidentStatus getEmployeeIncidentStatus() {
        return employeeIncidentStatus;
    }

    public void setEmployeeIncidentStatus(EmployeeIncidentStatus employeeIncidentStatus) {
        this.employeeIncidentStatus = employeeIncidentStatus;
    }

    public SafetyWardenIncidentStatus getSafetyWardenIncidentStatus() {
        return safetyWardenIncidentStatus;
    }

    public void setSafetyWardenIncidentStatus(SafetyWardenIncidentStatus safetyWardenIncidentStatus) {
        this.safetyWardenIncidentStatus = safetyWardenIncidentStatus;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getReporter() {
        return this.reporter;
    }

    public void setReporter(String reporter) {
        this.reporter = reporter;
    }

    public List<String> getEmployeesInvolved() {
        return this.employeesInvolved;
    }

    public void setEmployeesInvolved(List<String> employeesInvolved) {
        this.employeesInvolved = employeesInvolved;
    }

}
