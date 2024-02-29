package com.teamadc.backend.service;

import com.teamadc.backend.model.Rule;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class RuleService {

    private final GenericRepository<Rule> ruleRepository;

    @Autowired
    public RuleService(GenericRepository<Rule> ruleRepository) {
        this.ruleRepository = ruleRepository;
    }

    public Rule createOrUpdateRule(Rule rule) throws InterruptedException, ExecutionException {
        return ruleRepository.save(rule);
    }

    public void deleteRule(String ruleId) throws InterruptedException, ExecutionException {
        ruleRepository.deleteById(ruleId);
    }

    public Rule getRuleById(String ruleId) throws InterruptedException, ExecutionException {
        return ruleRepository.findById(ruleId);
    }

    public List<Rule> getRules() throws InterruptedException, ExecutionException {
        return ruleRepository.findAll();
    }

}
