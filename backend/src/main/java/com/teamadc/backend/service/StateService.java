package com.teamadc.backend.service;

import com.teamadc.backend.model.State;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class StateService {

    private final GenericRepository<State> stateRepository;

    @Autowired
    public StateService(GenericRepository<State> stateRepository) {
        this.stateRepository = stateRepository;
    }

    public State createOrUpdateState(State state) throws InterruptedException, ExecutionException {
        return stateRepository.save(state);
    }

    public void deleteState(String stateId) throws InterruptedException, ExecutionException {
        stateRepository.deleteById(stateId);
    }

    public State getStateById(String stateId) throws InterruptedException, ExecutionException {
        return stateRepository.findById(stateId);
    }

    public List<State> getStates() throws InterruptedException, ExecutionException {
        return stateRepository.findAll();
    }

    public List<String> getStateNamesByIds(List<String> stateIds) throws InterruptedException, ExecutionException {
        List<CompletableFuture<State>> futures = stateIds.stream()
                .map(stateId -> CompletableFuture.supplyAsync(() -> {
                    try {
                        return stateRepository.findById(stateId);
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }))
                .toList();

        return CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
                .thenApply(v -> futures.stream()
                        .map(CompletableFuture::join)
                        .map(State::getName)
                        .collect(Collectors.toList()))
                .get();
    }
}
