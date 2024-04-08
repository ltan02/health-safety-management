package com.teamadc.backend.controller;

import com.teamadc.backend.model.Invitation;
import com.teamadc.backend.service.InvitationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/invitations")
public class InvitationController {
    private final InvitationService invitationService;

    @Autowired
    public InvitationController(InvitationService invitationService) {
        this.invitationService = invitationService;
    }

    @PostMapping
    public ResponseEntity<Invitation> createInvitation(@RequestBody Invitation req) {
        try {
            Invitation invitation = invitationService.createOrUpdateInvitation(req);
            return ResponseEntity.ok(invitation);
        } catch (InterruptedException | java.util.concurrent.ExecutionException e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{invitationId}")
    public ResponseEntity<Invitation> getInvitation(@PathVariable String invitationId) {
        try {
            Invitation invitation = invitationService.getInvitationById(invitationId);
            return ResponseEntity.ok(invitation);
        } catch (InterruptedException | java.util.concurrent.ExecutionException e) {
            return ResponseEntity.status(500).build();
        }
    }

}
