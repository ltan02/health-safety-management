package com.teamadc.backend.controller;

import com.google.firebase.auth.FirebaseAuthException;
import com.teamadc.backend.dto.request.AuthRequest;
import com.teamadc.backend.model.User;
import com.teamadc.backend.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody AuthRequest request) {
        try {
            User response = userService.registerUser(request.getEmail(), request.getPassword(), request.getFirstName(), request.getLastName(), request.getRole());
            return ResponseEntity.ok(response);
        } catch (FirebaseAuthException | InterruptedException | ExecutionException e) {
            logger.debug(String.format("Registration failed for user with email: %s. Error: %s", request.getEmail(), e));
            return ResponseEntity.internalServerError().build();
        }
    }
}
