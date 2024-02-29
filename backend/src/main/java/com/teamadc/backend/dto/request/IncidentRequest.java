package com.teamadc.backend.dto.request;

import com.teamadc.backend.enums.EmployeeIncidentStatus;
import com.teamadc.backend.enums.SafetyWardenIncidentStatus;
import com.teamadc.backend.model.Comment;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class IncidentRequest {
    private String id;

    private String incidentDate;

    private String incidentCategory;

    private String reporter;

    private List<String> employeesInvolved;

    private List<CustomFieldRequest> customFields;

    private String statusId;

    private List<Comment> comments;

    public IncidentRequest() {}

    public IncidentRequest(String incidentDate, String incidentCategory, String reporter, List<String> employeesInvolved, List<CustomFieldRequest> customFields, String statusId, List<Comment> comments) {
        this.incidentDate = incidentDate;
        this.incidentCategory = incidentCategory;
        this.reporter = reporter;
        this.employeesInvolved = employeesInvolved;
        this.customFields = customFields;
        this.statusId = statusId;
        this.comments = comments;
    }

    public IncidentRequest(String id, String incidentDate, String incidentCategory, String reporter, List<String> employeesInvolved, List<CustomFieldRequest> customFields, String statusId, List<Comment> comments) {
        this.id = id;
        this.incidentDate = incidentDate;
        this.incidentCategory = incidentCategory;
        this.reporter = reporter;
        this.employeesInvolved = employeesInvolved;
        this.customFields = customFields;
        this.statusId = statusId;
        this.comments = comments;
    }
}
