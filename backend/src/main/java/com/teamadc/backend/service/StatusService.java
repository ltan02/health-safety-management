package com.teamadc.backend.service;

import com.teamadc.backend.model.Status;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class StatusService {

    private final GenericRepository<Status> statusRepository;

    @Autowired
    public StatusService(GenericRepository<Status> statusRepository) {
        this.statusRepository = statusRepository;
    }

    public Status createOrUpdateStatus(Status status) throws InterruptedException, ExecutionException {
        return statusRepository.save(status);
    }

    public void deleteStatus(String statusId) throws InterruptedException, ExecutionException {
        statusRepository.deleteById(statusId);
    }

    public Status getStatusById(String statusId) throws InterruptedException, ExecutionException {
        return statusRepository.findById(statusId);
    }

    public List<Status> getStatuses() throws InterruptedException, ExecutionException {
        return statusRepository.findAll();
    }

    public List<String> getStatusNamesByIds(List<String> statusIds) throws InterruptedException, ExecutionException {
        List<CompletableFuture<Status>> futures = statusIds.stream()
                .map(statusId -> CompletableFuture.supplyAsync(() -> {
                    try {
                        return statusRepository.findById(statusId);
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }))
                .toList();

        return CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
                .thenApply(v -> futures.stream()
                        .map(CompletableFuture::join)
                        .map(Status::getName)
                        .collect(Collectors.toList()))
                .get();
    }
}
