package com.teamadc.backend.controller;

import com.google.firebase.auth.FirebaseAuthException;
import com.teamadc.backend.dto.AuthRequest;
import com.teamadc.backend.dto.AuthResponse;
import com.teamadc.backend.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {
        try {
            AuthResponse response = userService.registerUser(request.getEmail(), request.getPassword(), request.getRole());
            return ResponseEntity.ok(response);
        } catch (FirebaseAuthException e) {
            logger.debug("Registration failed for user with email: {}. Error: {}", request.getEmail(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/login/{idToken}")
    public ResponseEntity<AuthResponse> login(@PathVariable String idToken) {
        AuthResponse response = userService.loginUser(idToken);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout/{userId}")
    public ResponseEntity<?> logout(@PathVariable String userId) {
        try {
            userService.logoutUser(userId);
            return ResponseEntity.ok().build();
        } catch (FirebaseAuthException e) {
            logger.debug("Log out failed for user with userId: {}. Error: {}", userId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
