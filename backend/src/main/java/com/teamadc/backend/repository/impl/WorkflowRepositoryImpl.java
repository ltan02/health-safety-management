package com.teamadc.backend.repository.impl;

import com.teamadc.backend.model.Workflow;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.stereotype.Repository;

@Repository
public class WorkflowRepositoryImpl extends AbstractFirestoreRepository<Workflow> implements GenericRepository<Workflow> {
    public WorkflowRepositoryImpl() {
        super(Workflow.class);
    }

    @Override
    protected String getCollectionName() {
        return "workflows";
    }
}
