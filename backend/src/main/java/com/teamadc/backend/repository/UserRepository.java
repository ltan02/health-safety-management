package com.teamadc.backend.repository;

import com.teamadc.backend.enums.Role;
import com.teamadc.backend.model.User;

import java.util.List;

public interface UserRepository {
    void save(User user);
    User findById(String id);
    List<User> findAll();
    List<User> findByRole(Role role);
    List<User> findByBusinessUnit(String businessUnit);
    User findByEmail(String email);
}
