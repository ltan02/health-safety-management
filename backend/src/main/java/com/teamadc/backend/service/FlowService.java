package com.teamadc.backend.service;

import com.teamadc.backend.model.Flow;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class FlowService {

    private final GenericRepository<Flow> flowRepository;

    @Autowired
    public FlowService(GenericRepository<Flow> flowRepository) {
        this.flowRepository = flowRepository;
    }

    public Flow createOrUpdateFlow(Flow flow) throws InterruptedException, ExecutionException {
        return flowRepository.save(flow);
    }

    public void deleteFlow(String flowId) throws InterruptedException, ExecutionException {
        flowRepository.deleteById(flowId);
    }

    public Flow getFlowById(String flowId) throws InterruptedException, ExecutionException {
        return flowRepository.findById(flowId);
    }

    public List<Flow> getFlows() throws InterruptedException, ExecutionException {
        return flowRepository.findAll();
    }

    public List<String> getFlowNamesByIds(List<String> flowIds) throws InterruptedException, ExecutionException {
        List<CompletableFuture<Flow>> futures = flowIds.stream()
                .map(flowId -> CompletableFuture.supplyAsync(() -> {
                    try {
                        return flowRepository.findById(flowId);
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }))
                .toList();

        return CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
                .thenApply(v -> futures.stream()
                        .map(CompletableFuture::join)
                        .map(Flow::getName)
                        .collect(Collectors.toList()))
                .get();
    }
}
