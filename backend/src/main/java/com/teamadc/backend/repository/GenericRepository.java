package com.teamadc.backend.repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

public interface GenericRepository<T> {
    T save(T entity) throws InterruptedException, ExecutionException;
    T findById(String id) throws InterruptedException, ExecutionException;
    List<T> findAll() throws InterruptedException, ExecutionException;
    void deleteById(String id) throws InterruptedException, ExecutionException;

    default Optional<List<T>> findAll(Map<String, Object> filters, int page, int size) throws InterruptedException, ExecutionException {
        throw new UnsupportedOperationException("Pagination not implemented.");
    }
}
