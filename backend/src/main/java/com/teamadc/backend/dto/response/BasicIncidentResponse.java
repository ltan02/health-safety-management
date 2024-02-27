package com.teamadc.backend.dto.response;

import com.teamadc.backend.enums.EmployeeIncidentStatus;
import com.teamadc.backend.enums.SafetyWardenIncidentStatus;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class BasicIncidentResponse {

    private String id;
    private String incidentDate;
    private String incidentCategory;
    private String reporter;
    private List<String> employeesInvolved;
    private EmployeeIncidentStatus employeeIncidentStatus;
    private SafetyWardenIncidentStatus safetyWardenIncidentStatus;

    public BasicIncidentResponse() {}

    public BasicIncidentResponse(String id, String incidentDate, String incidentCategory, String reporter, List<String> employeesInvolved, EmployeeIncidentStatus employeeIncidentStatus, SafetyWardenIncidentStatus safetyWardenIncidentStatus) {
        this.id = id;
        this.incidentDate = incidentDate;
        this.incidentCategory = incidentCategory;
        this.reporter = reporter;
        this.employeesInvolved = employeesInvolved;
        this.employeeIncidentStatus = employeeIncidentStatus;
        this.safetyWardenIncidentStatus = safetyWardenIncidentStatus;
    }

}
