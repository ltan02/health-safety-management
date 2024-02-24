package com.teamadc.backend.repository.impl;

import com.teamadc.backend.model.Incident;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.stereotype.Repository;

@Repository
public class IncidentRepositoryImpl extends AbstractFirestoreRepository<Incident> implements GenericRepository<Incident> {
    public IncidentRepositoryImpl() {
        super(Incident.class);
    }

    @Override
    protected String getCollectionName() {
        return "incidents";
    }
}
