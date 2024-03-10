package com.teamadc.backend.service;

import com.teamadc.backend.model.Form;
import com.teamadc.backend.model.Field;
import com.teamadc.backend.model.FieldProp;
import com.teamadc.backend.model.FieldOption;
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
