package com.teamadc.backend.controller;

import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.List;

import com.teamadc.backend.model.User;
import com.teamadc.backend.model.Group;

import com.teamadc.backend.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/groups")
public class GroupController {
    private final GroupService groupService;

    @Autowired
    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @PostMapping
    public ResponseEntity<Group> createOrUpdateGroup(@RequestBody Group group) {

        try {
            Group newGroup = groupService.createOrUpdateGroup(group);
            return ResponseEntity.ok(newGroup);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{groupId}")
    public ResponseEntity<Group> updateGroup(@PathVariable String groupId, @RequestBody Group req) {
        try {
            Group existingGroup = groupService.getGroupById(groupId);
            if (existingGroup == null) {
                return ResponseEntity.notFound().build();
            }

            Group newGroup = new Group(groupId, req.getName(), req.getDescription(), req.getMembers());

            Group updatedGroup = groupService.createOrUpdateGroup(newGroup);
            return ResponseEntity.ok(updatedGroup);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<Group> getGroupById(@PathVariable String groupId) {
        try {
            Group group = groupService.getGroupById(groupId);
            return Optional.ofNullable(group)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Group>> getGroups() {
        List<Group> groups;
        try {
            groups = groupService.getGroups();
            return ResponseEntity.ok(groups);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{groupId}")
    public ResponseEntity<Void> deleteGroup(@PathVariable String groupId) {
        try {

            groupService.deleteGroup(groupId);
            return ResponseEntity.noContent().build();
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{groupId}/members")
    public ResponseEntity<Group> getMembers(@PathVariable String groupId) {
        try {
            Group group = groupService.getGroupById(groupId);
            return ResponseEntity.ok(group);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    @PutMapping("/{groupId}/members")
    public ResponseEntity<Group> addMembers(@PathVariable String groupId, @RequestBody List<String> memberId) {
        try {
            Group group = groupService.addMembers(groupId, memberId);
            return ResponseEntity.ok(group);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }


    @PutMapping("/{groupId}/members/{memberId}")
    public ResponseEntity<Group> addMember(@PathVariable String groupId, @PathVariable String memberId) {
        try {
            Group group = groupService.addMember(groupId, memberId);
            return ResponseEntity.ok(group);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    

    @DeleteMapping("/{groupId}/members/{memberId}")
    public ResponseEntity<Group> removeMember(@PathVariable String groupId, @PathVariable String memberId) {
        try {
            Group group = groupService.removeMember(groupId, memberId);
            return ResponseEntity.ok(group);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }


}
