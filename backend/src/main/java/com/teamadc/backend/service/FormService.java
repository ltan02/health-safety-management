package com.teamadc.backend.service;

import com.teamadc.backend.model.Form;
import com.teamadc.backend.dto.request.FieldCoordinateRequest;
import com.teamadc.backend.model.Coordinate;
import com.teamadc.backend.model.Field;
import com.teamadc.backend.model.FieldProp;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class FormService {
    private final GenericRepository<Form> formRepository;
    private final GenericRepository<Field> fieldRepository;
    private final GenericRepository<FieldProp> fieldPropRepository;

    @Autowired
    public FormService(GenericRepository<Form> formRepository, GenericRepository<Field> fieldRepository, GenericRepository<FieldProp> fieldPropRepository) {
        this.formRepository = formRepository;
        this.fieldRepository = fieldRepository;
        this.fieldPropRepository = fieldPropRepository;
    }

    public Form createOrUpdateForm(Form form) throws InterruptedException, ExecutionException {
        form.setFields(List.of());
        return formRepository.save(form);
    }

    public Form updateForm(String formId, Form newForm) throws InterruptedException, ExecutionException {
        Form form = formRepository.findById(formId);
        for (Field newField : newForm.getFields()) {
            FieldProp fieldProp = newField.getProps();
            fieldPropRepository.save(fieldProp);
            fieldRepository.save(newField);
        }
        form.setFields(newForm.getFields());

        return formRepository.save(form);
    }

    public Form addField (String formId, Field field) throws InterruptedException, ExecutionException {
        Form form = formRepository.findById(formId);
        FieldProp fieldProp = field.getProps();
        fieldPropRepository.save(fieldProp);
        fieldRepository.save(field);
        List<Field> fields = form.getFields();
        fields.add(field);
        form.setFields(fields);
        return formRepository.save(form);
    }

    public Form deleteField(String formId, String fieldId) throws InterruptedException, ExecutionException {
        Form form = formRepository.findById(formId);
        List<Field> fields = form.getFields();
        for (Field field : fields) {
            if (field.getId().equals(fieldId)) {
                fields.remove(field);
                fieldRepository.deleteById(fieldId);
                break;
            }
        }
        form.setFields(fields);
        return formRepository.save(form);
    }

    public Form updateField(String formId, String fieldId, Field field) throws InterruptedException, ExecutionException {
        Form form = formRepository.findById(formId);
        List<Field> fields = form.getFields();
        Field fieldToUpdate = fields.stream()
                                    .filter(f -> f.getId().equals(fieldId))
                                    .findFirst()
                                    .orElseThrow(() -> new IllegalStateException("Field not found with id: " + fieldId));
        fieldToUpdate.setProps(field.getProps());
        fields.removeIf(f -> f.getId().equals(fieldId));
        fields.add(fieldToUpdate);
        
        fieldRepository.save(fieldToUpdate);
        form.setFields(fields);
        return formRepository.save(form);
    }

    public Field updateCoordinate(String formId, String fieldId, Coordinate coordinate) throws InterruptedException, ExecutionException {
        Form form = formRepository.findById(formId);
        List<Field> fields = form.getFields();
        Field fieldToUpdate = fields.stream()
                                    .filter(f -> f.getId().equals(fieldId))
                                    .findFirst()
                                    .orElseThrow(() -> new IllegalStateException("Field not found with id: " + fieldId));
        fieldToUpdate.setCoordinate(coordinate);
        fields.removeIf(f -> f.getId().equals(fieldId));
        fields.add(fieldToUpdate);
        
        fieldRepository.save(fieldToUpdate);
        form.setFields(fields);
        formRepository.save(form); // field collection is updated, but field in form is not updated when we try replacing the coordinates
        
        return form.getFields().stream()
                .filter(f -> f.getId().equals(fieldId))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Field not found with id: " + fieldId));
    }

    public Form updateCoordinates(String formId, List<FieldCoordinateRequest> fields) throws InterruptedException, ExecutionException {
        Form form = formRepository.findById(formId);
        List<Field> formFields = form.getFields();
        for (FieldCoordinateRequest field : fields) {
            Field fieldToUpdate = formFields.stream()
                    .filter(f -> f.getId().equals(field.getId()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalStateException("Field not found with id: " + field.getId()));
            fieldToUpdate.setCoordinate(field.getCoordinate());
            formFields.removeIf(f -> f.getId().equals(field.getId()));
            formFields.add(fieldToUpdate);
            fieldRepository.save(fieldToUpdate);
        }

        form.setFields(formFields);
        return formRepository.save(form);
    }
    

    public void deleteForm(String formId) throws InterruptedException, ExecutionException {
        formRepository.deleteById(formId);
    }

    public Form getFormById(String formId) throws InterruptedException, ExecutionException {
        return formRepository.findById(formId);
    }

    public List<Form> getForms() throws InterruptedException, ExecutionException {
        return formRepository.findAll();
    }

}
