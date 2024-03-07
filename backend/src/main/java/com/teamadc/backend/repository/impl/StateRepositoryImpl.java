package com.teamadc.backend.repository.impl;

import com.teamadc.backend.model.State;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.stereotype.Repository;

@Repository
public class StateRepositoryImpl extends AbstractFirestoreRepository<State> implements GenericRepository<State> {
    public StateRepositoryImpl() {
        super(State.class);
    }

    @Override
    protected String getCollectionName() {
        return "state";
    }
}
