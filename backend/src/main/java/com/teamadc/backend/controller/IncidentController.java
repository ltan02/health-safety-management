package com.teamadc.backend.controller;

import com.teamadc.backend.dto.request.CommentRequest;
import com.teamadc.backend.dto.request.CustomFieldRequest;
import com.teamadc.backend.dto.request.IncidentRequest;
import com.teamadc.backend.dto.request.MigrateIncidentRequest;
import com.teamadc.backend.dto.response.BasicIncidentResponse;
import com.teamadc.backend.model.Comment;
import com.teamadc.backend.model.Incident;
import com.teamadc.backend.model.StatusHistory;
import com.teamadc.backend.service.CommentService;
import com.teamadc.backend.service.IncidentService;
import com.teamadc.backend.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@CrossOrigin
@RequestMapping("/incidents")
public class IncidentController {

    private final IncidentService incidentService;
    private final CommentService commentService;

    private static final Logger logger = LoggerFactory.getLogger(IncidentController.class);

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
    public ResponseEntity<List<BasicIncidentResponse>> getIncidents(@RequestParam Optional<String> all) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String uid = (String) authentication.getPrincipal();

        try {
            List<Incident> incidents;
            if (all.orElse("false").equals("true")) {
                incidents = incidentService.getIncidents();
            } else {
                incidents = incidentService.getIncidents(uid);
            }

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

    @PutMapping("/{incidentId}/fields")
    public ResponseEntity<Incident> updateCustomFields(@PathVariable String incidentId, @RequestBody IncidentRequest request ) {
        try {
            List<CustomFieldRequest> customFieldsRequest = request.getCustomFields();
            Incident updatedIncident = incidentService.updateCustomFields(incidentId, customFieldsRequest);
            return ResponseEntity.ok(updatedIncident);
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

    @PostMapping("/{incidentId}/reporter/{reporterId}")
    public ResponseEntity<Incident> updateReporter(@PathVariable String incidentId, @PathVariable String reporterId) {
        try {
            logger.debug("Updating reporter for incident " + incidentId + " to " + reporterId);
            Incident incident = incidentService.updateReporter(incidentId, reporterId);
            return ResponseEntity.ok(incident);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{incidentId}/category")
    public ResponseEntity<Incident> updateCategory(@PathVariable String incidentId, @RequestBody IncidentRequest request) {
        try {
            Incident incident = incidentService.updateCategory(incidentId, request.getIncidentCategory());
            return ResponseEntity.ok(incident);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{incidentId}/date")
    public ResponseEntity<Incident> updateDate(@PathVariable String incidentId, @RequestBody IncidentRequest request) {
        try {
            Incident incident = incidentService.updateDate(incidentId, request.getIncidentDate());
            return ResponseEntity.ok(incident);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{incidentId}/employees_involved")
    public ResponseEntity<Incident> updateEmployeesInvolved(@PathVariable String incidentId, @RequestBody IncidentRequest request) {
        try {
            Incident incident = incidentService.updateEmployeesInvolved(incidentId, request.getEmployeesInvolved());
            return ResponseEntity.ok(incident);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/migrate")
    public ResponseEntity<Void> migrateIncidents(@RequestBody MigrateIncidentRequest request) {
        try {
            incidentService.migrateIncidents(request.getFromStatusId(), request.getToStatusId());
            return ResponseEntity.ok().build();
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
