package com.teamadc.backend.controller;

import com.teamadc.backend.dto.request.CustomFieldRequest;
import com.teamadc.backend.dto.request.IncidentRequest;
import com.teamadc.backend.model.Incident;
import com.teamadc.backend.service.IncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/incidents")
public class IncidentController {

    @Autowired
    private IncidentService incidentService;

    @PostMapping
    public ResponseEntity<Incident> createIncident(@RequestBody IncidentRequest request) {
        List<CustomFieldRequest> customFieldsRequest = request.getCustomFields();
        Incident incident = new Incident(null, request.getTimestamp(), request.getIncidentCategory(), request.getReporter(), request.getEmployeesInvolved());

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
    public ResponseEntity<List<Incident>> getIncidents() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String uid = (String) authentication.getPrincipal();

        try {
            List<Incident> incidents = incidentService.getIncidents(uid);
            return ResponseEntity.ok(incidents);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{incidentId}")
    public ResponseEntity<Incident> updateIncident(@PathVariable String incidentId, @RequestBody IncidentRequest request) {
        List<CustomFieldRequest> customFieldsRequest = request.getCustomFields();
        Incident incident = new Incident(incidentId, request.getTimestamp(), request.getIncidentCategory(), request.getReporter(), request.getEmployeesInvolved());

        for (CustomFieldRequest field : customFieldsRequest) {
            incident.setCustomField(field.getFieldName(), field.getValue());
        }

        try {
            Incident updatedIncident = incidentService.createOrUpdateIncident(incident);
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


}
