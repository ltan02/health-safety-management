package com.teamadc.backend.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;
import com.teamadc.backend.dto.response.AuthResponse;
import com.teamadc.backend.enums.Role;
import com.teamadc.backend.model.User;
import com.teamadc.backend.repository.UserRepository;
import com.teamadc.backend.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

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

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username);

        List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));

        return new org.springframework.security.core.userdetails.User(user.getEmail(), "{noop}", authorities);
    }

    public AuthResponse registerUser(String email, String password, String firstName, String lastName, Role userRole) throws FirebaseAuthException {
        logger.info("Attempting to register a new user with email: {}", email);

        UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(email)
                .setPassword(password);
        UserRecord userRecord = FirebaseAuth.getInstance().createUser(request);

        User newUser = new User(userRecord.getUid(), email, userRole, "test", firstName, lastName);
        userRepository.save(newUser);

        String accessToken = jwtUtil.generateAccessToken(userRecord.getUid(), newUser.getRole().toString(), newUser.getBusinessUnit(), newUser.getFirstName(), newUser.getLastName());
        String refreshToken = jwtUtil.generateRefreshToken(userRecord.getUid());

        logger.info("Successfully registered user with UID: {}", userRecord.getUid());
        return new AuthResponse(accessToken, refreshToken);
    }

    public AuthResponse refreshAccessToken(String refreshToken) throws Exception {
        String userId;
        try {
            userId = jwtUtil.decodeToken(refreshToken).getSubject();
        } catch (Exception e) {
            throw new Exception("Invalid refresh token.", e);
        }

        User user = userRepository.findById(userId);
        String newAccessToken = jwtUtil.generateAccessToken(user.getId(), user.getRole().toString(), user.getBusinessUnit(), user.getFirstName(), user.getLastName());
        String newRefreshToken = jwtUtil.generateRefreshToken(user.getId());

        return new AuthResponse(newAccessToken, newRefreshToken);
    }

    public AuthResponse loginUser(String idToken) throws Exception {
        FirebaseToken decodedToken = firebaseService.verifyToken(idToken);

        if (decodedToken == null) {
            logger.debug("Decoded token is null");
            throw new IllegalArgumentException("Failed to decode token");
        }

        String userId = decodedToken.getUid();
        User user = userRepository.findById(userId);

        String accessToken = jwtUtil.generateAccessToken(userId, user.getRole().toString(), user.getBusinessUnit(), user.getFirstName(), user.getLastName());
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
