package com.teamadc.backend.controller;

import com.teamadc.backend.model.Board;
import com.teamadc.backend.model.Column;
import com.teamadc.backend.model.Incident;
import com.teamadc.backend.service.ColumnService;
import com.teamadc.backend.service.IncidentService;
import com.teamadc.backend.service.StatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/columns")
public class ColumnController {

    private final ColumnService columnService;
    private final IncidentService incidentService;

    @Autowired
    public ColumnController(ColumnService columnService, IncidentService incidentService) {
        this.columnService = columnService;
        this.incidentService = incidentService;
    }

    @PostMapping
    public ResponseEntity<Column> createColumn(@RequestBody Column req) {
        Column column = new Column(null, req.getName(), req.getStatusIds(), req.getOrder());
        try {
            Column newColumn = columnService.createOrUpdateColumn(column);
            return ResponseEntity.ok(newColumn);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Column>> getColumns() {
        try {
            List<Column> columns = columnService.getColumns();
            return ResponseEntity.ok(columns);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{columnId}")
    public ResponseEntity<Column> getColumnById(@PathVariable String columnId) {
        try {
            Column column = columnService.getColumnById(columnId);
            return ResponseEntity.ok(column);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{columnId}")
    public ResponseEntity<Void> deleteColumn(@PathVariable String columnId) {
        try {
            columnService.deleteColumn(columnId);
            return ResponseEntity.ok().build();
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{columnId}")
    public ResponseEntity<Column> updateColumn(@PathVariable String columnId, @RequestBody Column req) {
        try {
            Column existingColumn = columnService.getColumnById(columnId);
            if (existingColumn == null) {
                return ResponseEntity.notFound().build();
            }

            if (req.getName() != null) existingColumn.setName(req.getName());
            if (req.getStatusIds() != null) existingColumn.setStatusIds(req.getStatusIds());
            if (req.getOrder() != -1) existingColumn.setOrder(req.getOrder());

            Column updatedColumn = columnService.createOrUpdateColumn(existingColumn);
            return ResponseEntity.ok(updatedColumn);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{columnId}/incidents")
    public ResponseEntity<List<Incident>> getIncidentsByColumn(@PathVariable String columnId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String uid = (String) authentication.getPrincipal();

        try {
            Column column = columnService.getColumnById(columnId);
            if (column == null) {
                return ResponseEntity.notFound().build();
            }

            List<Incident> incidents = incidentService.getIncidents(uid)
                    .stream()
                    .filter(incident -> column.getStatusIds().contains(incident.getStatusId()))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(incidents);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
