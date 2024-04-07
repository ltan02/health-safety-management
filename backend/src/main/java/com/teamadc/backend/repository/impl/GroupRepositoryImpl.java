package com.teamadc.backend.repository.impl;

import com.teamadc.backend.model.Group;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.stereotype.Repository;

@Repository
public class GroupRepositoryImpl extends AbstractFirestoreRepository<Group> implements GenericRepository<Group> {
    public GroupRepositoryImpl() {
        super(Group.class);
    }

    @Override
    protected String getCollectionName() {
        return "groups";
    }
}
