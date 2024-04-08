package com.teamadc.backend.service;

import com.teamadc.backend.model.Column;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class ColumnService {

    private final GenericRepository<Column> columnRepository;

    @Autowired
    public ColumnService(GenericRepository<Column> columnRepository) {
        this.columnRepository = columnRepository;
    }

    public Column createOrUpdateColumn(Column column) throws InterruptedException, ExecutionException {
        return columnRepository.save(column);
    }

    public void deleteColumn(String columnId) throws InterruptedException, ExecutionException {
        columnRepository.deleteById(columnId);
    }

    public Column getColumnById(String columnId) throws InterruptedException, ExecutionException {
        return columnRepository.findById(columnId);
    }

    public List<Column> getColumns() throws InterruptedException, ExecutionException {
        return columnRepository.findAll();
    }

    public void deleteStatusFromColumns(String statusId) throws InterruptedException, ExecutionException {
        List<Column> columns = columnRepository.findAll();
        for (Column column : columns) {
            column.getStatusIds().remove(statusId);
            columnRepository.save(column);
        }
    }
}
