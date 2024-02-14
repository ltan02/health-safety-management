package com.teamadc.backend.controller;

import com.google.firebase.auth.FirebaseAuthException;
import com.teamadc.backend.dto.request.AuthRequest;
import com.teamadc.backend.dto.response.AuthResponse;
import com.teamadc.backend.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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
            AuthResponse response = userService.registerUser(request.getEmail(), request.getPassword(), request.getFirstName(), request.getLastName(), request.getRole());
            return ResponseEntity.ok(response);
        } catch (FirebaseAuthException e) {
            logger.debug("Registration failed for user with email: {}. Error: {}", request.getEmail(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody Map<String, String> requestPayload) {
        try {
            AuthResponse response = userService.loginUser(requestPayload.get("idToken"));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }

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

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> refreshTokenPayload) {
        String refreshToken = refreshTokenPayload.get("refreshToken");
        if (refreshToken == null || refreshToken.isBlank()) {
            logger.debug("Refresh token is missing or blank");
            return ResponseEntity.badRequest().body("Missing refresh token");
        }

        try {
            AuthResponse response = userService.refreshAccessToken(refreshToken);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.debug("Failed to refresh access token. Error: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("Failed to refresh access token");
        }
    }
}
