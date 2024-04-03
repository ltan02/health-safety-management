package com.teamadc.backend.controller;

import com.teamadc.backend.dto.response.StatusResponse;
import com.teamadc.backend.model.Incident;
import com.teamadc.backend.model.Status;
import com.teamadc.backend.service.IncidentService;
import com.teamadc.backend.service.StatusService;
import com.teamadc.backend.service.UserService;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.logging.Logger;

@RestController
@RequestMapping("/status")
public class StatusController {
    private static final org.slf4j.Logger logger = LoggerFactory.getLogger(UserService.class);

    private final StatusService statusService;
    private final IncidentService incidentService;

    @Autowired
    public StatusController(StatusService statusService, IncidentService incidentService) {
        this.statusService = statusService;
        this.incidentService = incidentService;
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
    public ResponseEntity<List<StatusResponse>> getStatuses() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String uid = (String) authentication.getPrincipal();

        try {
            List<Status> statuses = statusService.getStatuses();

            List<StatusResponse> statusResponses = statuses.stream().map(status -> {
                try {
                    List<Incident> incidents = incidentService.getIncidentsByStatusId(uid, status.getId());
                    return new StatusResponse(status.getId(), status.getName(), incidents.size());
                } catch (InterruptedException | ExecutionException e) {
                    return null;
                }
            }).toList();

            return ResponseEntity.ok(statusResponses);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{statusId}")
    public ResponseEntity<StatusResponse> getStatusById(@PathVariable String statusId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String uid = (String) authentication.getPrincipal();

        try {
            logger.error("statusId: " + statusId);
            Status status = statusService.getStatusById(statusId);

            List<Incident> incidents = incidentService.getIncidentsByStatusId(uid, statusId);
            StatusResponse statusResponse = new StatusResponse(status.getId(), status.getName(), incidents.size());

            return ResponseEntity.ok(statusResponse);
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
