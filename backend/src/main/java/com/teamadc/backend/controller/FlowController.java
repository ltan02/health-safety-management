package com.teamadc.backend.controller;

import com.teamadc.backend.model.Flow;
import com.teamadc.backend.service.FlowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/flow")
public class FlowController {
    private final FlowService flowService;

    @Autowired
    public FlowController(FlowService flowService) {
        this.flowService = flowService;
    }

    @PostMapping
    public ResponseEntity<Flow> createFlow(@RequestBody Flow req) {
        Flow flow = new Flow(null, req.getName(), req.getTo(), req.getFrom());
        try {
            Flow newFlow = flowService.createOrUpdateFlow(flow);
            return ResponseEntity.ok(newFlow);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Flow>> getFlowById() {
        try {
            List<Flow> flows = flowService.getFlows();
            return ResponseEntity.ok(flows);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{flowId}")
    public ResponseEntity<Flow> getFlowById(@PathVariable String flowId) {
        try {
            Flow flow = flowService.getFlowById(flowId);
            return ResponseEntity.ok(flow);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{flowId}")
    public ResponseEntity<Void> deleteFlow(@PathVariable String flowId) {
        try {
            flowService.deleteFlow(flowId);
            return ResponseEntity.ok().build();
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{flowId}")
    public ResponseEntity<Flow> updateFlow(@PathVariable String flowId, @RequestBody Flow req) {
        try {
            Flow existingFlow = flowService.getFlowById(flowId);
            if (existingFlow == null) {
                return ResponseEntity.notFound().build();
            }

            if (req.getName() != null) existingFlow.setName(req.getName());

            Flow newFlow = flowService.createOrUpdateFlow(existingFlow);
            return ResponseEntity.ok(newFlow);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
