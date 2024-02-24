package com.teamadc.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Incident {
    @DocumentId
    private String id;

    private String timestamp;
    private String incidentCategory;
    private String reporter;
    private List<String> employeesInvolved;
    private Map<String, Object> customFields;

    public Incident() {}

    public Incident(String id, String timestamp, String incidentCategory, String reporter, List<String> employeesInvolved) {
        this.id = id;
        this.timestamp = timestamp;
        this.incidentCategory = incidentCategory;
        this.reporter = reporter;
        this.employeesInvolved = employeesInvolved;
        this.customFields = new HashMap<>();
    }

    public Incident(String id, String timestamp, String incidentCategory, String reporter, List<String> employeesInvolved, Map<String, Object> customFields) {
        this.id = id;
        this.timestamp = timestamp;
        this.incidentCategory = incidentCategory;
        this.reporter = reporter;
        this.employeesInvolved = employeesInvolved;
        this.customFields = customFields;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getId() {
        return this.id;
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

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getTimestamp() {
        return this.timestamp;
    }

    public void setIncidentCategory(String incidentCategory) {
        this.incidentCategory = incidentCategory;
    }

    public String getIncidentCategory() {
        return this.incidentCategory;
    }

    public Map<String, Object> getCustomFields() {
        return this.customFields;
    }

    public void setCustomFields(Map<String, Object> customFields) {
        this.customFields = customFields;
    }

    public void setCustomField(String fieldName, Object data) {
        if (this.customFields.containsKey(fieldName)) {
            this.customFields.replace(fieldName, data);
        } else {
            this.customFields.put(fieldName, data);
        }
    }

    public Object getCustomField(String fieldName) throws RuntimeException {
        if (this.customFields.containsKey(fieldName)) {
            return this.customFields.get(fieldName);
        }
        throw new RuntimeException(String.format("%s not found in custom fields", fieldName));
    }

    public void resetCustomFields() {
        this.customFields.clear();
    }

    public void deleteCustomField(String fieldName) {
        this.customFields.remove(fieldName);
    }

}
