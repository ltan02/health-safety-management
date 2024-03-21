package com.teamadc.backend.controller;

import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import com.teamadc.backend.model.Workflow;
import com.teamadc.backend.model.Transition;
import com.teamadc.backend.service.WorkflowService;
import com.teamadc.backend.model.Coordinate;
import com.teamadc.backend.model.State;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/workflows")
public class WorkflowController {
    private final WorkflowService workflowService;

    @Autowired
    public WorkflowController(WorkflowService workflowService) {
        this.workflowService = workflowService;
    }

    @PostMapping
    public ResponseEntity<Workflow> createOrUpdateWorkflow() {
        Workflow workflow = new Workflow();
        try {
            Workflow newWorkflow = workflowService.createOrUpdateWorkflow(workflow);
            return ResponseEntity.ok(newWorkflow);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{workflowId}")
    public ResponseEntity<Workflow> updateWorkflow(@PathVariable String workflowId, @RequestBody Workflow req) {
        try {
            Workflow existingWorkflow = workflowService.getWorkflowById(workflowId);
            if (existingWorkflow == null) {
                return ResponseEntity.notFound().build();
            }

            Workflow newWorkflow = new Workflow(workflowId, req.getName(), req.getActive(), req.getStateIds(), req.getTransitionIds(), req.getBoardId(), req.getLastUpdated());

            Workflow updatedWorkflow = workflowService.createOrUpdateWorkflow(newWorkflow);
            return ResponseEntity.ok(updatedWorkflow);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Workflow>> getAllWorkflows() {
        try {
            List<Workflow> workflows = workflowService.getWorkflows();
            return ResponseEntity.ok(workflows);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Only one workflow can be active at a time
    @GetMapping("/active")
    public ResponseEntity<?> getActiveWorkflows() {
        try {
            Optional<Workflow> activeWorkflow = workflowService.getWorkflows().stream()
                    .filter(Workflow::getActive)
                    .findFirst();

            if (activeWorkflow.isPresent()) {
                return ResponseEntity.ok(activeWorkflow.get());
            } else {
                return ResponseEntity.ok("No active workflows");
            }
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{workflowId}")
    public  ResponseEntity<Workflow> getWorkflowById(@PathVariable String workflowId) {
        try {
            Workflow workflow = workflowService.getWorkflowById(workflowId);
            return  ResponseEntity.ok(workflow);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
