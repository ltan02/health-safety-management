package com.teamadc.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;
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
    private String statusId;
    private List<Comment> comments;
    private Date createdAt;
    private Date lastUpdatedAt;
    private String reviewer;

    public Incident() {}

    public Incident(String id, String incidentDate, String incidentCategory, String reporter, List<String> employeesInvolved, String statusId, List<Comment> comments) {
        this.id = id;
        this.incidentDate = incidentDate;
        this.incidentCategory = incidentCategory;
        this.reporter = reporter;
        this.employeesInvolved = employeesInvolved;
        this.customFields = new HashMap<>();
        this.statusId = statusId;
        this.comments = comments;
        this.createdAt = new Date();
        this.lastUpdatedAt = new Date();
    }

    public Incident(String id, String incidentDate, String incidentCategory, String reporter, List<String> employeesInvolved, String statusId) {
        this.id = id;
        this.incidentDate = incidentDate;
        this.incidentCategory = incidentCategory;
        this.reporter = reporter;
        this.employeesInvolved = employeesInvolved;
        this.customFields = new HashMap<>();
        this.statusId = statusId;
        this.comments = new ArrayList<>();
        this.createdAt = new Date();
        this.lastUpdatedAt = new Date();
    }

    public Incident(String id, String incidentDate, String incidentCategory, String reporter, List<String> employeesInvolved, Map<String, Object> customFields, String statusId, List<Comment> comments) {
        this.id = id;
        this.incidentDate = incidentDate;
        this.incidentCategory = incidentCategory;
        this.reporter = reporter;
        this.employeesInvolved = employeesInvolved;
        this.customFields = customFields;
        this.statusId = statusId;
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
