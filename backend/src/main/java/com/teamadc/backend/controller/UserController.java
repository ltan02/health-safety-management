package com.teamadc.backend.controller;

import com.teamadc.backend.enums.Role;
import com.teamadc.backend.model.User;
import com.teamadc.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable String userId) {
        User user = userService.getUserById(userId);
        return Optional.ofNullable(user)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<User>> getUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) String businessUnit) {
        List<User> users;
        if (role != null) {
            users = userService.getUsersByRole(role);
        } else if (businessUnit != null) {
            users = userService.getUsersByBusinessUnit(businessUnit);
        } else {
            users = userService.getAllUsers();
        }
        return ResponseEntity.ok(users);
    }

}
