package com.teamadc.backend.repository.impl;

import com.teamadc.backend.model.Status;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.stereotype.Repository;

@Repository
public class StatusRepositoryImpl extends AbstractFirestoreRepository<Status> implements GenericRepository<Status> {
    public StatusRepositoryImpl() {
        super(Status.class);
    }

    @Override
    protected String getCollectionName() {
        return "status";
    }
}
