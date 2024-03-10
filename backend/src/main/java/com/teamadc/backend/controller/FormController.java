package com.teamadc.backend.controller;

import java.util.concurrent.ExecutionException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import com.teamadc.backend.model.Form;
import com.teamadc.backend.model.FieldProp;
import com.teamadc.backend.service.FormService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/forms")
public class FormController {
    @Autowired
    private final FormService formService;

    public FormController(FormService formService) {
        this.formService = formService;
    }

    @PostMapping
    public ResponseEntity<Form> createOrUpdateForm(@RequestBody Form request) {
        try {
            Form newForm = formService.createOrUpdateForm(request);
            return ResponseEntity.ok(newForm);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{formId}")
    public ResponseEntity<Form> updateForm(@PathVariable String formId, @RequestBody Form request) {
        try {
            Form newForm = formService.updateForm(formId, request);
            return ResponseEntity.ok(newForm);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Form>> getAllForms() {
        try {
            List<Form> forms = formService.getForms();
            return ResponseEntity.ok(forms);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{formId}")
    public  ResponseEntity<Form> getFormById(@PathVariable String formId) {
        try {
            Form form = formService.getFormById(formId);
            return  ResponseEntity.ok(form);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
