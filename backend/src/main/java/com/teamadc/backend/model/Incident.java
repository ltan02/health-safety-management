package com.teamadc.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;
import com.teamadc.backend.enums.EmployeeIncidentStatus;
import com.teamadc.backend.enums.SafetyWardenIncidentStatus;
import lombok.Getter;
import lombok.Setter;

import java.util.*;

@Setter
@Getter
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
