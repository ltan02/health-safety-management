package com.teamadc.backend.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmployeeInvolvement {
    private String employeeId;
    private int totalIncidents;
    private int incidentsReported;
    private int incidentsInvolved;

    public EmployeeInvolvement() {
        // Default constructor
    }

    public EmployeeInvolvement(String employeeId, int totalIncidents, int incidentsReported, int incidentsInvolved) {
        this.employeeId = employeeId;
        this.totalIncidents = totalIncidents;
        this.incidentsReported = incidentsReported;
        this.incidentsInvolved = incidentsInvolved;
    }
}
