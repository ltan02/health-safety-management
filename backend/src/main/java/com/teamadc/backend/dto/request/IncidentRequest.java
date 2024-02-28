package com.teamadc.backend.dto.request;

import com.teamadc.backend.enums.EmployeeIncidentStatus;
import com.teamadc.backend.enums.SafetyWardenIncidentStatus;
import com.teamadc.backend.model.Comment;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
public class IncidentRequest {
    @Setter
    private String id;

    @Setter
    private String incidentDate;

    @Setter
    private String incidentCategory;

    @Setter
    private String reporter;

    @Setter
    private List<String> employeesInvolved;

    @Setter
    private List<CustomFieldRequest> customFields;

    private EmployeeIncidentStatus employeeIncidentStatus;

    private SafetyWardenIncidentStatus safetyWardenIncidentStatus;

    @Setter
    private List<Comment> comments;

    public IncidentRequest() {}

    public IncidentRequest(String incidentDate, String incidentCategory, String reporter, List<String> employeesInvolved, List<CustomFieldRequest> customFields, String employeeIncidentStatus, String safetyWardenIncidentStatus, List<Comment> comments) {
        this.incidentDate = incidentDate;
        this.incidentCategory = incidentCategory;
        this.reporter = reporter;
        this.employeesInvolved = employeesInvolved;
        this.customFields = customFields;
        this.employeeIncidentStatus = EmployeeIncidentStatus.stringToStatus(employeeIncidentStatus);
        this.safetyWardenIncidentStatus = SafetyWardenIncidentStatus.stringToStatus(safetyWardenIncidentStatus);
        this.comments = comments;
    }

    public IncidentRequest(String id, String incidentDate, String incidentCategory, String reporter, List<String> employeesInvolved, List<CustomFieldRequest> customFields, String employeeIncidentStatus, String safetyWardenIncidentStatus, List<Comment> comments) {
        this.id = id;
        this.incidentDate = incidentDate;
        this.incidentCategory = incidentCategory;
        this.reporter = reporter;
        this.employeesInvolved = employeesInvolved;
        this.customFields = customFields;
        this.employeeIncidentStatus = EmployeeIncidentStatus.stringToStatus(employeeIncidentStatus);
        this.safetyWardenIncidentStatus = SafetyWardenIncidentStatus.stringToStatus(safetyWardenIncidentStatus);
        this.comments = comments;
    }

    public void setEmployeeIncidentStatus(String employeeIncidentStatus) {
        this.employeeIncidentStatus = EmployeeIncidentStatus.stringToStatus(employeeIncidentStatus);
    }

    public void setSafetyWardenIncidentStatus(String safetyWardenIncidentStatus) {
        this.safetyWardenIncidentStatus = SafetyWardenIncidentStatus.stringToStatus(safetyWardenIncidentStatus);
    }
}
