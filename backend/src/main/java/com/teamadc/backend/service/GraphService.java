package com.teamadc.backend.service;

import com.teamadc.backend.model.Graph;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class GraphService {
    private final GenericRepository<Graph> graphRepository;

    @Autowired
    public GraphService(GenericRepository<Graph> graphRepository) {
        this.graphRepository = graphRepository;
    }

    public Graph createOrUpdateGraph(Graph graph) throws InterruptedException, ExecutionException {
        return graphRepository.save(graph);
    }

    public void deleteGraph(String graphId) throws InterruptedException, ExecutionException {
        graphRepository.deleteById(graphId);
    }

    public Graph getGraphById(String graphId) throws InterruptedException, ExecutionException {
        return graphRepository.findById(graphId);
    }

    public List<Graph> getGraphs() throws InterruptedException, ExecutionException {
        return graphRepository.findAll();
    }

    public void addState(String graphId, String stateId ) throws InterruptedException, ExecutionException {
        Graph graph = graphRepository.findById(graphId);
        List<String> states = graph.getStates();
        states.add(stateId);
        graph.setStates(states);
        graphRepository.save(graph);
    }

    public void deleteState(String graphId, String stateId) throws InterruptedException, ExecutionException {
        Graph graph = graphRepository.findById(graphId);
        List<String> states = graph.getStates();
        states.removeIf(state -> state.equals(stateId));
        graph.setStates(states);
        graphRepository.save(graph);
    }

    public void addFlow(String graphId, String flowId) throws InterruptedException, ExecutionException {
        Graph graph = graphRepository.findById(graphId);
        List<String> flows = graph.getFlows();
        flows.add(flowId);
        graph.setFlows(flows);
        graphRepository.save(graph);
    }

    public void deleteFlow(String graphId, String flowId) throws InterruptedException, ExecutionException {
        Graph graph = graphRepository.findById(graphId);
        List<String> flows = graph.getFlows();
        flows.removeIf(f -> f.equals(flowId));
        graph.setFlows(flows);
        graphRepository.save(graph);
    }
    
}
