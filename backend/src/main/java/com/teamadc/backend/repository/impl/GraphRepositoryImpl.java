package com.teamadc.backend.repository.impl;

import com.teamadc.backend.model.Graph;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.stereotype.Repository;

@Repository
public class GraphRepositoryImpl extends AbstractFirestoreRepository<Graph> implements GenericRepository<Graph> {
    public GraphRepositoryImpl() {
        super(Graph.class);
    }

    @Override
    protected String getCollectionName() {
        return "Graphs";
    }
}
