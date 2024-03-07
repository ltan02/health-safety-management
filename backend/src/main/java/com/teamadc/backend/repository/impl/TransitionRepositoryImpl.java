package com.teamadc.backend.repository.impl;

import com.teamadc.backend.model.Transition;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.stereotype.Repository;

@Repository
public class TransitionRepositoryImpl extends AbstractFirestoreRepository<Transition> implements GenericRepository<Transition> {
    public TransitionRepositoryImpl() {
        super(Transition.class);
    }

    @Override
    protected String getCollectionName() {
        return "transition";
    }
}
