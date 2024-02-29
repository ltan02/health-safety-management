package com.teamadc.backend.controller;

import com.teamadc.backend.model.Status;
import com.teamadc.backend.service.StatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/status")
public class StatusController {
    private final StatusService statusService;

    @Autowired
    public StatusController(StatusService statusService) {
        this.statusService = statusService;
    }

    @PostMapping
    public ResponseEntity<Status> createStatus(@RequestBody Status req) {
        Status status = new Status(null, req.getName());
        try {
            Status newStatus = statusService.createOrUpdateStatus(status);
            return ResponseEntity.ok(newStatus);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Status>> getStatusById() {
        try {
            List<Status> statuses = statusService.getStatuses();
            return ResponseEntity.ok(statuses);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{statusId}")
    public ResponseEntity<Status> getStatusById(@PathVariable String statusId) {
        try {
            Status status = statusService.getStatusById(statusId);
            return ResponseEntity.ok(status);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{statusId}")
    public ResponseEntity<Void> deleteStatus(@PathVariable String statusId) {
        try {
            statusService.deleteStatus(statusId);
            return ResponseEntity.ok().build();
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{statusId}")
    public ResponseEntity<Status> updateStatus(@PathVariable String statusId, @RequestBody Status req) {
        try {
            Status existingStatus = statusService.getStatusById(statusId);
            if (existingStatus == null) {
                return ResponseEntity.notFound().build();
            }

            if (req.getName() != null) existingStatus.setName(req.getName());

            Status newStatus = statusService.createOrUpdateStatus(existingStatus);
            return ResponseEntity.ok(newStatus);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
