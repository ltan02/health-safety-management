package com.teamadc.backend.repository.impl;

import com.teamadc.backend.model.Flow;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.stereotype.Repository;

@Repository
public class FlowRepositoryImpl extends AbstractFirestoreRepository<Flow> implements GenericRepository<Flow> {
    public FlowRepositoryImpl() {
        super(Flow.class);
    }

    @Override
    protected String getCollectionName() {
        return "Flow";
    }
}
