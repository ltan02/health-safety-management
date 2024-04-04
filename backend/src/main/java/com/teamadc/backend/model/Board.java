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
    private String activeWorkflowId;
    private List<String> workflowIds;

    public Board() {}

    public Board(String id, String name, boolean isActive, List<String> adminColumnIds, List<String> employeeColumnIds, List<String> statusIds, String activeWorkflowId, List<String> workflowIds) {
        this.id = id;
        this.name = name;
        this.isActive = isActive;
        this.adminColumnIds = adminColumnIds;
        this.employeeColumnIds = employeeColumnIds;
        this.statusIds = statusIds;
        this.activeWorkflowId = activeWorkflowId;
        this.workflowIds = workflowIds;
    }

    public Board(String name, boolean isActive, List<String> adminColumnIds, List<String> employeeColumnIds, List<String> statusIds, String activeWorkflowId, List<String> workflowIds) {
        this.name = name;
        this.isActive = isActive;
        this.adminColumnIds = adminColumnIds;
        this.employeeColumnIds = employeeColumnIds;
        this.statusIds = statusIds;
        this.activeWorkflowId = activeWorkflowId;
        this.workflowIds = workflowIds;
    }

}
