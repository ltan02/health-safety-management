package com.teamadc.backend.controller;

import java.util.concurrent.ExecutionException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import com.teamadc.backend.model.Graph;
import com.teamadc.backend.model.Flow;
import com.teamadc.backend.service.GraphService;

import com.teamadc.backend.model.State;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequestMapping("/graphs")
public class GraphController {
    @Autowired
    private final GraphService graphService;

    public GraphController(GraphService graphService) {
        this.graphService = graphService;
    }

    @PostMapping("/create")
    public ResponseEntity<Graph> createOrUpdateGraph() {
        Graph graph = new Graph();
        try {
            Graph newGraph = graphService.createOrUpdateGraph(graph);
            return ResponseEntity.ok(newGraph);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Graph>> getAllGraphs() {
        try {
            List<Graph> graphs = graphService.getGraphs();
            return ResponseEntity.ok(graphs);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{graphId}")
    public  ResponseEntity<Graph> getGraphById(@PathVariable String graphId) {
        try {
            Graph graph = graphService.getGraphById(graphId);
            return  ResponseEntity.ok(graph);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }


    @PostMapping("/{graphId}/addState")
    public ResponseEntity<Graph> addState(@PathVariable String graphId, @RequestBody State request) {
        try {
            graphService.addState(graphId, request.getId());
            return ResponseEntity.ok().build();
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{graphId}/addFlow")
    public ResponseEntity<Graph> addFlow(@PathVariable String graphId, @RequestBody Flow request) {
        try {
            graphService.addFlow(graphId, request.getId());
            return ResponseEntity.ok().build();
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }


    @DeleteMapping("/{graphId}/deleteState/{stateId}")
    public ResponseEntity<Graph> deleteState(@PathVariable String graphId, @PathVariable String stateId) {
        try {
            graphService.deleteState(graphId, stateId);
            return ResponseEntity.ok().build();
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{graphId}/deleteFlow/{flowId}")
    public ResponseEntity<Graph> deleteFlow(@PathVariable String graphId, @PathVariable String flowId) {
        try {
            graphService.deleteFlow(graphId, flowId);
            return ResponseEntity.ok().build();
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    
}
