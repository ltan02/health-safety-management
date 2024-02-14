package com.teamadc.backend.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;
import com.teamadc.backend.dto.AuthResponse;
import com.teamadc.backend.enums.Role;
import com.teamadc.backend.model.User;
import com.teamadc.backend.repository.UserRepository;
import com.teamadc.backend.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final FirebaseService firebaseService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Autowired
    public UserService(FirebaseService firebaseService, UserRepository userRepository, JwtUtil jwtUtil) {
        this.firebaseService = firebaseService;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse registerUser(String email, String password, Role userRole) throws FirebaseAuthException {
        logger.info("Attempting to register a new user with email: {}", email);

        UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(email)
                .setPassword(password);
        UserRecord userRecord = FirebaseAuth.getInstance().createUser(request);

        User newUser = new User(userRecord.getUid(), userRole, "test");
        userRepository.save(newUser);

        String accessToken = jwtUtil.generateAccessToken(userRecord.getUid(), newUser.getRole().toString(), newUser.getBusinessUnit());
        String refreshToken = jwtUtil.generateRefreshToken(userRecord.getUid());

        logger.info("Successfully registered user with UID: {}", userRecord.getUid());
        return new AuthResponse(accessToken, refreshToken);
    }

    public AuthResponse loginUser(String idToken) {
        FirebaseToken decodedToken = firebaseService.verifyToken(idToken);
        String userId = decodedToken.getUid();
        User user = userRepository.findById(userId);

        String accessToken = jwtUtil.generateAccessToken(userId, user.getRole().toString(), user.getBusinessUnit());
        String refreshToken = jwtUtil.generateRefreshToken(userId);
        return new AuthResponse(accessToken, refreshToken);
    }

    public void logoutUser(String userId) throws FirebaseAuthException {
        UserRecord userRecord = FirebaseAuth.getInstance().getUser(userId);
        var claims = new HashMap<String, Object>();
        claims.put("forceLogout", true);
        FirebaseAuth.getInstance().setCustomUserClaims(userId, claims);
    }

    public User getUserById(String userId) {
        // Assuming findById returns an Optional<User>
        Optional<User> userOptional = Optional.ofNullable(userRepository.findById(userId));
        return userOptional.orElse(null);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

    public List<User> getUsersByBusinessUnit(String businessUnit) {
        return userRepository.findByBusinessUnit(businessUnit);
    }

}
