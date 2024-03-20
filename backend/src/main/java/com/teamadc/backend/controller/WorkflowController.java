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
    @Autowired
    private final WorkflowService workflowService;

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

            Workflow newWorkflow = new Workflow(workflowId, req.getName(), req.getActive(), req.getStateIds(), req.getTransitionIds(), req.getBoardId());

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


//    @PostMapping("/{workflowId}/state")
//    public ResponseEntity<Workflow> addState(@PathVariable String workflowId, @RequestBody State request) {
//        try {
//            workflowService.addState(workflowId, request);
//            return ResponseEntity.ok().build();
//        } catch (InterruptedException | ExecutionException e) {
//            return ResponseEntity.internalServerError().build();
//        }
//    }
//
//    @PutMapping("/{workflowId}/status/{stateId}")
//    public ResponseEntity<Workflow> updateStatus(@PathVariable String workflowId, @PathVariable String stateId, @RequestBody State request) {
//        try {
//            workflowService.updateStatus(workflowId, stateId, request);
//            return ResponseEntity.ok().build();
//        } catch (InterruptedException | ExecutionException e) {
//            return ResponseEntity.internalServerError().build();
//        }
//    }
//
//    @PostMapping("/{workflowId}/transition")
//    public ResponseEntity<Workflow> addTransition(@PathVariable String workflowId, @RequestBody Transition request) {
//        try {
//            workflowService.addTransition(workflowId, request);
//            return ResponseEntity.ok().build();
//        } catch (InterruptedException | ExecutionException e) {
//            return ResponseEntity.internalServerError().build();
//        }
//    }
//
//
//    @DeleteMapping("/{workflowId}/state/{stateId}")
//    public ResponseEntity<Workflow> deleteState(@PathVariable String workflowId, @PathVariable String stateId) {
//        try {
//            workflowService.deleteState(workflowId, stateId);
//            return ResponseEntity.ok().build();
//        } catch (InterruptedException | ExecutionException e) {
//            return ResponseEntity.internalServerError().build();
//        }
//    }
//
//    @DeleteMapping("/{workflowId}/transition/{flowId}")
//    public ResponseEntity<Workflow> deleteTransition(@PathVariable String workflowId, @PathVariable String flowId) {
//        try {
//            workflowService.deleteTransition(workflowId, flowId);
//            return ResponseEntity.ok().build();
//        } catch (InterruptedException | ExecutionException e) {
//            return ResponseEntity.internalServerError().build();
//        }
//    }
//
//    @PutMapping("/{workflowId}/coordinate/{stateId}")
//    public ResponseEntity<Workflow> updateCoordinate(@PathVariable String workflowId, @PathVariable String stateId, @RequestBody Coordinate request) {
//        try {
//            workflowService.updateCoordinate(workflowId, stateId, request);
//            return ResponseEntity.ok().build();
//        } catch (InterruptedException | ExecutionException e) {
//            return ResponseEntity.internalServerError().build();
//        }
//    }
}
