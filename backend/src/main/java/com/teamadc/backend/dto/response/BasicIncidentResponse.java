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
    private String statusId;

    public BasicIncidentResponse() {}

    public BasicIncidentResponse(String id, String incidentDate, String incidentCategory, String reporter, List<String> employeesInvolved, String statusId) {
        this.id = id;
        this.incidentDate = incidentDate;
        this.incidentCategory = incidentCategory;
        this.reporter = reporter;
        this.employeesInvolved = employeesInvolved;
        this.statusId = statusId;
    }

}
