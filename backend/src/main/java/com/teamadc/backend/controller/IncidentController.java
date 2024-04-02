package com.teamadc.backend.controller;

import com.teamadc.backend.dto.request.CommentRequest;
import com.teamadc.backend.dto.request.CustomFieldRequest;
import com.teamadc.backend.dto.request.IncidentRequest;
import com.teamadc.backend.dto.response.BasicIncidentResponse;
import com.teamadc.backend.model.Comment;
import com.teamadc.backend.model.Incident;
import com.teamadc.backend.model.StatusHistory;
import com.teamadc.backend.service.CommentService;
import com.teamadc.backend.service.IncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/incidents")
public class IncidentController {

    private final IncidentService incidentService;
    private final CommentService commentService;

    @Autowired
    public IncidentController(IncidentService incidentService, CommentService commentService) {
        this.incidentService = incidentService;
        this.commentService = commentService;
    }

    @PostMapping
    public ResponseEntity<Incident> createIncident(@RequestBody IncidentRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String uid = (String) authentication.getPrincipal();

        List<CustomFieldRequest> customFieldsRequest = request.getCustomFields();
        List<StatusHistory> statusHistory = new ArrayList<>();
        statusHistory.add(new StatusHistory(request.getStatusId(), uid, new Date()));
        Incident incident = new Incident(null, request.getIncidentDate(), request.getIncidentCategory(), request.getReporter(), request.getEmployeesInvolved(), request.getStatusId(), new ArrayList<Comment>(), statusHistory);

        for (CustomFieldRequest field : customFieldsRequest) {
            incident.setCustomField(field.getFieldName(), field.getValue());
        }

        try {
            Incident newIncident = incidentService.createOrUpdateIncident(incident);
            return ResponseEntity.ok(newIncident);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<BasicIncidentResponse>> getIncidents() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String uid = (String) authentication.getPrincipal();

        try {
            List<Incident> incidents = incidentService.getIncidents(uid);

            List<BasicIncidentResponse> response = new ArrayList<>();
            for (Incident incident : incidents) {
                response.add(new BasicIncidentResponse(incident.getId(), incident.getIncidentDate(), incident.getIncidentCategory(), incident.getReporter(), incident.getEmployeesInvolved(), incident.getStatusId(), incident.getReviewer()));
            }

            return ResponseEntity.ok(response);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{incidentId}")
    public ResponseEntity<Incident> updateIncident(@PathVariable String incidentId, @RequestBody IncidentRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String uid = (String) authentication.getPrincipal();

        try {
            Incident existingIncident = incidentService.getIncidentById(incidentId);
            if (existingIncident == null) {
                return ResponseEntity.notFound().build();
            }

            if (request.getIncidentDate() != null) existingIncident.setIncidentDate(request.getIncidentDate());
            if (request.getIncidentCategory() != null) existingIncident.setIncidentCategory(request.getIncidentCategory());
            if (request.getReporter() != null) existingIncident.setReporter(request.getReporter());
            if (request.getEmployeesInvolved() != null) existingIncident.setEmployeesInvolved(request.getEmployeesInvolved());
            if (request.getStatusId() != null) {
                existingIncident.setStatusId(request.getStatusId());
                List<StatusHistory> statusHistory = existingIncident.getStatusHistory();

                if (statusHistory == null) statusHistory = new ArrayList<>();

                statusHistory.add(new StatusHistory(request.getStatusId(), uid, new Date()));
                existingIncident.setStatusHistory(statusHistory);
            }
            if (request.getComments() != null) existingIncident.setComments(request.getComments());

            existingIncident.setLastUpdatedAt(new Date());

            if (request.getCustomFields() != null) {
                for (CustomFieldRequest field : request.getCustomFields()) {
                    existingIncident.setCustomField(field.getFieldName(), field.getValue());
                }
            }

            Incident updatedIncident = incidentService.createOrUpdateIncident(existingIncident);
            return ResponseEntity.ok(updatedIncident);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{incidentId}")
    public ResponseEntity<Incident> deleteIncident(@PathVariable String incidentId) {
        try {
            incidentService.deleteIncident(incidentId);
            return ResponseEntity.noContent().build();
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{incidentId}")
    public ResponseEntity<Incident> getIncident(@PathVariable String incidentId) {
        try {
            Incident incident = incidentService.getIncidentById(incidentId);
            return ResponseEntity.ok(incident);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{incidentId}/comments")
    public ResponseEntity<Incident> addComment(@PathVariable String incidentId, @RequestBody CommentRequest commentReq) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String uid = (String) authentication.getPrincipal();

        try {
            Comment comment = new Comment(null, uid, commentReq.getContent());
            Incident incident = incidentService.addComment(incidentId, comment);
            commentService.createOrUpdateComment(comment);
            return ResponseEntity.ok(incident);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{incidentId}/comments/{commentId}")
    public ResponseEntity<Incident> deleteComment(@PathVariable String incidentId, @PathVariable String commentId) {
        try {
            Incident incident = incidentService.deleteComment(incidentId, commentId);
            commentService.deleteComment(commentId);
            return ResponseEntity.ok(incident);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{incidentId}/reviewer/{reviewerId}")
    public ResponseEntity<Incident> assignReviewer(@PathVariable String incidentId, @PathVariable String reviewerId) {
        try {
            Incident incident = incidentService.assignReviewer(incidentId, reviewerId);
            return ResponseEntity.ok(incident);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{incidentId}/reviewer")
    public ResponseEntity<Incident> removeReviewer(@PathVariable String incidentId) {
        try {
            Incident incident = incidentService.removeReviewer(incidentId);
            return ResponseEntity.ok(incident);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/reviewer/{reviewerId}")
    public ResponseEntity<List<Incident>> getIncidentsByReviewer(@PathVariable String reviewerId) {
        try {
            List<Incident> incidents = incidentService.getIncidentsByReviewer(reviewerId);
            return ResponseEntity.ok(incidents);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
