package com.teamadc.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;
import com.teamadc.backend.enums.EmployeeIncidentStatus;
import com.teamadc.backend.enums.SafetyWardenIncidentStatus;

import java.util.*;

public class Incident {
    @DocumentId
    private String id;

    private String incidentDate;
    private String incidentCategory;
    private String reporter;
    private List<String> employeesInvolved;
    private Map<String, Object> customFields;
    private EmployeeIncidentStatus employeeIncidentStatus;
    private SafetyWardenIncidentStatus safetyWardenIncidentStatus;
    private List<Comment> comments;
    private Date createdAt;
    private Date lastUpdatedAt;

    public Incident() {}

    public Incident(String id, String incidentDate, String incidentCategory, String reporter, List<String> employeesInvolved, EmployeeIncidentStatus employeeIncidentStatus, SafetyWardenIncidentStatus safetyWardenIncidentStatus, List<Comment> comments) {
        this.id = id;
        this.incidentDate = incidentDate;
        this.incidentCategory = incidentCategory;
        this.reporter = reporter;
        this.employeesInvolved = employeesInvolved;
        this.customFields = new HashMap<>();
        this.employeeIncidentStatus = employeeIncidentStatus;
        this.safetyWardenIncidentStatus = safetyWardenIncidentStatus;
        this.comments = comments;
        this.createdAt = new Date();
        this.lastUpdatedAt = new Date();
    }

    public Incident(String id, String incidentDate, String incidentCategory, String reporter, List<String> employeesInvolved) {
        this.id = id;
        this.incidentDate = incidentDate;
        this.incidentCategory = incidentCategory;
        this.reporter = reporter;
        this.employeesInvolved = employeesInvolved;
        this.customFields = new HashMap<>();
        this.employeeIncidentStatus = EmployeeIncidentStatus.REPORT_SUBMITTED;
        this.safetyWardenIncidentStatus = SafetyWardenIncidentStatus.PENDING_REVIEW;
        this.comments = new ArrayList<>();
        this.createdAt = new Date();
        this.lastUpdatedAt = new Date();
    }

    public Incident(String id, String incidentDate, String incidentCategory, String reporter, List<String> employeesInvolved, Map<String, Object> customFields, EmployeeIncidentStatus employeeIncidentStatus, SafetyWardenIncidentStatus safetyWardenIncidentStatus, List<Comment> comments) {
        this.id = id;
        this.incidentDate = incidentDate;
        this.incidentCategory = incidentCategory;
        this.reporter = reporter;
        this.employeesInvolved = employeesInvolved;
        this.customFields = customFields;
        this.employeeIncidentStatus = employeeIncidentStatus;
        this.safetyWardenIncidentStatus = safetyWardenIncidentStatus;
        this.comments = comments;
        this.createdAt = new Date();
        this.lastUpdatedAt = new Date();
    }

    public EmployeeIncidentStatus getEmployeeIncidentStatus() {
        return this.employeeIncidentStatus;
    }

    public void setEmployeeIncidentStatus(EmployeeIncidentStatus employeeIncidentStatus) {
        this.lastUpdatedAt = new Date();
        this.employeeIncidentStatus = employeeIncidentStatus;
    }

    public SafetyWardenIncidentStatus getSafetyWardenIncidentStatus() {
        return this.safetyWardenIncidentStatus;
    }

    public void setSafetyWardenIncidentStatus(SafetyWardenIncidentStatus safetyWardenIncidentStatus) {
        this.lastUpdatedAt = new Date();
        this.safetyWardenIncidentStatus = safetyWardenIncidentStatus;
    }

    public List<Comment> getComments() {
        return this.comments;
    }

    public void setComments(List<Comment> comments) {
        this.lastUpdatedAt = new Date();
        this.comments = comments;
    }

    public void setId(String id) {
        this.lastUpdatedAt = new Date();
        this.id = id;
    }

    public String getId() {
        return this.id;
    }

    public String getReporter() {
        return this.reporter;
    }

    public void setReporter(String reporter) {
        this.lastUpdatedAt = new Date();
        this.reporter = reporter;
    }

    public List<String> getEmployeesInvolved() {
        return this.employeesInvolved;
    }

    public void setEmployeesInvolved(List<String> employeesInvolved) {
        this.lastUpdatedAt = new Date();
        this.employeesInvolved = employeesInvolved;
    }

    public void setIncidentDate(String incidentDate) {
        this.lastUpdatedAt = new Date();
        this.incidentDate = incidentDate;
    }

    public String getIncidentDate() {
        return this.incidentDate;
    }

    public void setIncidentCategory(String incidentCategory) {
        this.lastUpdatedAt = new Date();
        this.incidentCategory = incidentCategory;
    }

    public String getIncidentCategory() {
        return this.incidentCategory;
    }

    public Map<String, Object> getCustomFields() {
        return this.customFields;
    }

    public void setCustomFields(Map<String, Object> customFields) {
        this.lastUpdatedAt = new Date();
        this.customFields = customFields;
    }

    public void setCustomField(String fieldName, Object data) {
        this.lastUpdatedAt = new Date();
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
        this.lastUpdatedAt = new Date();
        this.customFields.clear();
    }

    public void deleteCustomField(String fieldName) {
        this.lastUpdatedAt = new Date();
        this.customFields.remove(fieldName);
    }

    public Date getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.lastUpdatedAt = new Date();
        this.createdAt = createdAt;
    }

    public Date getLastUpdatedAt() {
        return this.lastUpdatedAt;
    }

    public void setLastUpdatedAt(Date lastUpdatedAt) {
        this.lastUpdatedAt = lastUpdatedAt;
    }

}
