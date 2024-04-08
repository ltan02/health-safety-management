package com.teamadc.backend.repository.impl;

import com.google.cloud.firestore.Query;
import com.teamadc.backend.model.Incident;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Repository
public class IncidentRepositoryImpl extends AbstractFirestoreRepository<Incident> implements GenericRepository<Incident> {
    public IncidentRepositoryImpl() {
        super(Incident.class);
    }

    @Override
    protected String getCollectionName() {
        return "incidents";
    }

    @Override
    public Optional<List<Incident>> findAll(Map<String, Object> filters, int page, int size) throws InterruptedException, ExecutionException {
        Query query = firestore.collection(getCollectionName());

        // Apply filters
        for (Map.Entry<String, Object> filter : filters.entrySet()) {
            query = query.whereEqualTo(filter.getKey(), filter.getValue());
        }

        // Apply pagination
        query = query.offset(page * size).limit(size);

        // Execute query and map results to entity list
        List<Incident> incidents = query.get().get().toObjects(Incident.class);
        return Optional.of(incidents);
    }
}
