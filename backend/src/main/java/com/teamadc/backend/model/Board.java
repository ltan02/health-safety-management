package com.teamadc.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Board {
    @DocumentId
    private String id;
    private String name;
    private boolean isActive;
    private List<String> adminColumnIds;
    private List<String> employeeColumnIds;
    private List<String> statusIds;
    private String workflowId;

    public Board() {}

    public Board(String id, String name, boolean isActive, List<String> adminColumnIds, List<String> employeeColumnIds, List<String> statusIds, String workflowId) {
        this.id = id;
        this.name = name;
        this.isActive = isActive;
        this.adminColumnIds = adminColumnIds;
        this.employeeColumnIds = employeeColumnIds;
        this.statusIds = statusIds;
        this.workflowId = workflowId;
    }

    public Board(String name, boolean isActive, List<String> adminColumnIds, List<String> employeeColumnIds, List<String> statusIds, String workflowId) {
        this.name = name;
        this.isActive = isActive;
        this.adminColumnIds = adminColumnIds;
        this.employeeColumnIds = employeeColumnIds;
        this.statusIds = statusIds;
        this.workflowId = workflowId;
    }

}
