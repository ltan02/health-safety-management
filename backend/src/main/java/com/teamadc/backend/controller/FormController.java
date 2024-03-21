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
import com.teamadc.backend.dto.request.FieldCoordinateRequest;
import com.teamadc.backend.model.Coordinate;
import com.teamadc.backend.model.Field;
import com.teamadc.backend.service.FormService;

import org.springframework.web.bind.annotation.DeleteMapping;
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

    @PutMapping("/{formId}/coordinate/{fieldId}")
    public ResponseEntity<Field> updateCoordinate(@PathVariable String formId, @PathVariable String fieldId, @RequestBody Coordinate request) {
        try {
            Field newField = formService.updateCoordinate(formId, fieldId, request);
            return ResponseEntity.ok(newField);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{formId}/coordinate")
    public ResponseEntity<Form> updateCoordinates(@PathVariable String formId, @RequestBody List<FieldCoordinateRequest> request) {
        try {
            Form newForm = formService.updateCoordinates(formId, request);
            return ResponseEntity.ok(newForm);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{formId}/field")
    public ResponseEntity<Form> addField(@PathVariable String formId, @RequestBody Field request) {
        try {
            Form newForm = formService.addField(formId, request);
            return ResponseEntity.ok(newForm);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @DeleteMapping("/{formId}/field/{fieldId}")
    public ResponseEntity<Form> deleteField(@PathVariable String formId, @PathVariable String fieldId) {
        try {
            Form newForm = formService.deleteField(formId, fieldId);
            return ResponseEntity.ok(newForm);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{formId}")
    public ResponseEntity<Form> deleteForm(@PathVariable String formId) {
        try {
            formService.deleteForm(formId);
            return ResponseEntity.ok().build();
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
