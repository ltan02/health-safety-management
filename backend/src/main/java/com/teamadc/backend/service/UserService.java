package com.teamadc.backend.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import com.teamadc.backend.enums.Role;
import com.teamadc.backend.model.User;
import com.teamadc.backend.repository.GenericRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Service
public class UserService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final GenericRepository<User> userRepository;

    @Autowired
    public UserService(GenericRepository<User> userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            List<User> users = userRepository.findAll();
            User user = users.stream().filter(u -> u.getEmail().equals(username)).findAny().orElse(null);
            if (user == null) {
                return null;
            }

            List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));

            return new org.springframework.security.core.userdetails.User(user.getEmail(), "{noop}", authorities);
        } catch (InterruptedException | ExecutionException e) {
            return null;
        }
    }

    public User registerUser(String email, String password, String firstName, String lastName, Role userRole) throws FirebaseAuthException, InterruptedException, ExecutionException {
        logger.info("Attempting to register a new user with email: {}", email);

        UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(email)
                .setPassword(password);
        UserRecord userRecord = FirebaseAuth.getInstance().createUser(request);

        User newUser = new User(userRecord.getUid(), email, userRole, "test", firstName, lastName);
        userRepository.save(newUser);

        logger.info("Successfully registered user with UID: {}", userRecord.getUid());
        return newUser;
    }

    public User getUserById(String userId) throws InterruptedException, ExecutionException {
        Optional<User> userOptional = Optional.ofNullable(userRepository.findById(userId));
        return userOptional.orElse(null);
    }

    public List<User> getAllUsers() throws InterruptedException, ExecutionException {
        return userRepository.findAll();
    }

    public List<User> getUsersByRole(Role role) throws InterruptedException, ExecutionException {
        List<User> users = userRepository.findAll();
        return users.stream().filter(user -> user.getRole() == role).toList();
    }

    public List<User> getUsersByBusinessUnit(String businessUnit) throws InterruptedException, ExecutionException {
        List<User> users = userRepository.findAll();
        return users.stream().filter(user -> user.getBusinessUnit().equals(businessUnit)).toList();
    }

}
