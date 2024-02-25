package com.teamadc.backend.dto.request;

import com.teamadc.backend.enums.EmployeeIncidentStatus;
import com.teamadc.backend.enums.SafetyWardenIncidentStatus;
import com.teamadc.backend.model.Comment;

import java.util.List;

public class IncidentRequest {
    private String id;
    private String incidentDate;
    private String incidentCategory;
    private String reporter;
    private List<String> employeesInvolved;
    private List<CustomFieldRequest> customFields;
    private EmployeeIncidentStatus employeeIncidentStatus;
    private SafetyWardenIncidentStatus safetyWardenIncidentStatus;
    private List<Comment> comments;

    public IncidentRequest() {}

    public IncidentRequest(String incidentDate, String incidentCategory, String reporter, List<String> employeesInvolved, List<CustomFieldRequest> customFields, EmployeeIncidentStatus employeeIncidentStatus, SafetyWardenIncidentStatus safetyWardenIncidentStatus, List<Comment> comments) {
        this.incidentDate = incidentDate;
        this.incidentCategory = incidentCategory;
        this.reporter = reporter;
        this.employeesInvolved = employeesInvolved;
        this.customFields = customFields;
        this.employeeIncidentStatus = employeeIncidentStatus;
        this.safetyWardenIncidentStatus = safetyWardenIncidentStatus;
        this.comments = comments;
    }

    public IncidentRequest(String id, String incidentDate, String incidentCategory, String reporter, List<String> employeesInvolved, List<CustomFieldRequest> customFields, EmployeeIncidentStatus employeeIncidentStatus, SafetyWardenIncidentStatus safetyWardenIncidentStatus, List<Comment> comments) {
        this.id = id;
        this.incidentDate = incidentDate;
        this.incidentCategory = incidentCategory;
        this.reporter = reporter;
        this.employeesInvolved = employeesInvolved;
        this.customFields = customFields;
        this.employeeIncidentStatus = employeeIncidentStatus;
        this.safetyWardenIncidentStatus = safetyWardenIncidentStatus;
        this.comments = comments;
    }

    public EmployeeIncidentStatus getEmployeeIncidentStatus() {
        return this.employeeIncidentStatus;
    }

    public void setEmployeeIncidentStatus(EmployeeIncidentStatus employeeIncidentStatus) {
        this.employeeIncidentStatus = employeeIncidentStatus;
    }

    public SafetyWardenIncidentStatus getSafetyWardenIncidentStatus() {
        return this.safetyWardenIncidentStatus;
    }

    public void setSafetyWardenIncidentStatus(SafetyWardenIncidentStatus safetyWardenIncidentStatus) {
        this.safetyWardenIncidentStatus = safetyWardenIncidentStatus;
    }

    public List<Comment> getComments() {
        return this.comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getIncidentDate() {
        return this.incidentDate;
    }

    public void setIncidentDate(String incidentDate) {
        this.incidentDate = incidentDate;
    }

    public String getIncidentCategory() {
        return this.incidentCategory;
    }

    public void setIncidentCategory(String incidentCategory) {
        this.incidentCategory = incidentCategory;
    }

    public List<CustomFieldRequest> getCustomFields() {
        return this.customFields;
    }

    public void setCustomFields(List<CustomFieldRequest> customFields) {
        this.customFields = customFields;
    }
}
