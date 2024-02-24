package com.teamadc.backend.dto.request;

import java.util.List;

public class IncidentRequest {
    private String id;
    private String timestamp;
    private String incidentCategory;
    private String reporter;
    private List<String> employeesInvolved;
    private List<CustomFieldRequest> customFields;

    public IncidentRequest() {}

    public IncidentRequest(String timestamp, String incidentCategory, String reporter, List<String> employeesInvolved, List<CustomFieldRequest> customFields) {
        this.timestamp = timestamp;
        this.incidentCategory = incidentCategory;
        this.reporter = reporter;
        this.employeesInvolved = employeesInvolved;
        this.customFields = customFields;
    }

    public IncidentRequest(String id, String timestamp, String incidentCategory, String reporter, List<String> employeesInvolved, List<CustomFieldRequest> customFields) {
        this.id = id;
        this.timestamp = timestamp;
        this.incidentCategory = incidentCategory;
        this.reporter = reporter;
        this.employeesInvolved = employeesInvolved;
        this.customFields = customFields;
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

    public String getTimestamp() {
        return this.timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
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
