package com.teamadc.backend.controller;

import com.teamadc.backend.model.State;
import com.teamadc.backend.service.StateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("/states")
public class StateController {
    private final StateService stateService;

    @Autowired
    public StateController(StateService stateService) {
        this.stateService = stateService;
    }

    @PostMapping
    public ResponseEntity<State> createState(@RequestBody State req) {
        State state = new State(null, req.getName(), req.getCoordinates(), req.getStatusId());
        try {
            State newState = stateService.createOrUpdateState(state);
            return ResponseEntity.ok(newState);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<State>> getStateById() {
        try {
            List<State> states = stateService.getStates();
            return ResponseEntity.ok(states);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{stateId}")
    public ResponseEntity<State> getStateById(@PathVariable String stateId) {
        try {
            State state = stateService.getStateById(stateId);
            return ResponseEntity.ok(state);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{stateId}")
    public ResponseEntity<Void> deleteState(@PathVariable String stateId) {
        try {
            stateService.deleteState(stateId);
            return ResponseEntity.ok().build();
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{stateId}")
    public ResponseEntity<State> updateState(@PathVariable String stateId, @RequestBody State req) {
        try {
            State existingState = stateService.getStateById(stateId);
            if (existingState == null) {
                return ResponseEntity.notFound().build();
            }

            if (req.getName() != null) existingState.setName(req.getName());

            State newState = stateService.createOrUpdateState(existingState);
            return ResponseEntity.ok(newState);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{stateId}")
    public ResponseEntity<State> updateCoordinate(@PathVariable String stateId, @RequestBody State req) {
        try {
            State existingState = stateService.getStateById(stateId);
            if (existingState == null) {
                return ResponseEntity.notFound().build();
            }

            existingState.setCoordinates(req.getCoordinates());
            existingState.setName(req.getName());
            existingState.setStatusId(req.getStatusId());

            State newState = stateService.createOrUpdateState(existingState);
            return ResponseEntity.ok(newState);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
