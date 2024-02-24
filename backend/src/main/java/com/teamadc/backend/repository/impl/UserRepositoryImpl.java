package com.teamadc.backend.repository.impl;

import com.teamadc.backend.model.User;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepositoryImpl extends AbstractFirestoreRepository<User> implements GenericRepository<User> {
    public UserRepositoryImpl() {
        super(User.class);
    }

    @Override
    protected String getCollectionName() {
        return "users";
    }
}
