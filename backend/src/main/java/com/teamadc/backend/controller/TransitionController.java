package com.teamadc.backend.controller;

import com.teamadc.backend.model.Transition;
import com.teamadc.backend.service.TransitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/transitions")
public class TransitionController {
    private final TransitionService transitionService;

    @Autowired
    public TransitionController(TransitionService transitionService) {
        this.transitionService = transitionService;
    }

    @GetMapping
    public ResponseEntity<List<Transition>> getTransitions() {
        try {
            List<Transition> transitions = transitionService.getTransitions();
            return ResponseEntity.ok(transitions);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{transitionId}")
    public ResponseEntity<Transition> getTransitionById(@PathVariable String transitionId) {
        try {
            Transition transition = transitionService.getTransitionById(transitionId);
            return ResponseEntity.ok(transition);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{transitionId}")
    public ResponseEntity<Void> deleteTransition(@PathVariable String transitionId) {
        try {
            transitionService.deleteTransition(transitionId);
            return ResponseEntity.ok().build();
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<Transition> createTransition(@RequestBody Transition req) {
        Transition transition = new Transition(null, req.getFromStateId(), req.getToStateId(), req.getLabel(), req.getRules(), req.getType());
        try {
            Transition newTransition = transitionService.createOrUpdateTransition(transition);
            return ResponseEntity.ok(newTransition);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{transitionId}")
    public ResponseEntity<Transition> updateTransition(@PathVariable String transitionId, @RequestBody Transition transition) {
        try {
            Transition newTransition = transitionService.createOrUpdateTransition(transition);
            return ResponseEntity.ok(newTransition);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
