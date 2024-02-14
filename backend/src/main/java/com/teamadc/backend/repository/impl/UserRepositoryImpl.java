package com.teamadc.backend.repository.impl;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.teamadc.backend.controller.AuthController;
import com.teamadc.backend.enums.Role;
import com.teamadc.backend.model.User;
import com.teamadc.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class UserRepositoryImpl implements UserRepository {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final Firestore firestore;

    public UserRepositoryImpl(Firestore firestore) {
        this.firestore = firestore;
    }

    @Override
    public void save(User user) {
        firestore.collection("users").document(user.getId()).set(user);
    }

    @Override
    public User findById(String id) {
        DocumentSnapshot document;
        try {
            document = firestore.collection("users").document(id).get().get();
            if (document.exists()) {
                return document.toObject(User.class);
            } else {
                // Handle the case where the user does not exist
                logger.debug("No user found with id: {}", id);
                return null;
            }
        } catch (InterruptedException | ExecutionException e) {
            logger.error("Error occurred when trying to find user with id: {}. Error: {}", id, e);
            return null;
        }
    }

    @Override
    public List<User> findAll() {
        List<User> users = new ArrayList<>();
        ApiFuture<QuerySnapshot> querySnapshot = firestore.collection("users").get();
        try {
            for (DocumentSnapshot doc : querySnapshot.get().getDocuments()) {
                users.add(doc.toObject(User.class));
            }
        } catch (InterruptedException | ExecutionException e) {
            logger.error("Error occurred when trying to find all users. Error: {}", e);
        }
        return users;
    }

    @Override
    public List<User> findByRole(Role role) {
        List<User> users = new ArrayList<>();
        ApiFuture<QuerySnapshot> querySnapshot = firestore.collection("users").whereEqualTo("role", role.name()).get();
        try {
            for (DocumentSnapshot doc : querySnapshot.get().getDocuments()) {
                users.add(doc.toObject(User.class));
            }
        } catch (InterruptedException | ExecutionException e) {
            logger.error("Error occurred when trying to find user by role: {}. Error: {}", role, e);
        }
        return users;
    }

    @Override
    public List<User> findByBusinessUnit(String businessUnit) {
        List<User> users = new ArrayList<>();
        ApiFuture<QuerySnapshot> querySnapshot = firestore.collection("users").whereEqualTo("businessUnit", businessUnit).get();
        try {
            for (DocumentSnapshot doc : querySnapshot.get().getDocuments()) {
                users.add(doc.toObject(User.class));
            }
        } catch (InterruptedException | ExecutionException e) {
            logger.error("Error occurred when trying to find user by business unit: {}. Error: {}", businessUnit, e);
        }
        return users;
    }
}
