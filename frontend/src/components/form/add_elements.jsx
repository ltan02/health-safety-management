import React from 'react';
import { FIELD_TYPES } from './form_data';
import AddInputField from './AddInputField';
import AddSelectionField from './AddSelectionField';
import AddAutoInputField from './AddAutoInputField';
export const FIELD_ADD_FORM = {
  [FIELD_TYPES.TEXT_BOX]: ({onTitleChange, onDescriptionChange, onPlaceHolderChange, onRequiredChange, initialTitle, initialDescription, initialPlaceHolder, initialRequired})=> (
    <AddInputField type={FIELD_TYPES.TEXT_BOX} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} onPlaceHolderChange={onPlaceHolderChange} onRequiredChange={onRequiredChange} initialTitle={initialTitle} initialDescription={initialDescription} initialPlaceHolder={initialPlaceHolder} initialRequired={initialRequired}/>
  ),
  [FIELD_TYPES.NUMBER_FIELD]: ({onTitleChange, onDescriptionChange, onPlaceHolderChange, onRequiredChange, initialTitle, initialDescription, initialPlaceHolder, initialRequired})=> (
    <AddInputField type={FIELD_TYPES.NUMBER_FIELD} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} onPlaceHolderChange={onPlaceHolderChange} onRequiredChange={onRequiredChange} initialTitle={initialTitle} initialDescription={initialDescription} initialPlaceHolder={initialPlaceHolder} initialRequired={initialRequired}/>
  ),
  [FIELD_TYPES.DATETIME_LOCAL]: ({onTitleChange, onDescriptionChange, onPlaceHolderChange, onRequiredChange, initialTitle, initialDescription, initialPlaceHolder, initialRequired})=> (
    <AddInputField type={FIELD_TYPES.DATETIME_LOCAL} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} onPlaceHolderChange={onPlaceHolderChange} onRequiredChange={onRequiredChange} initialTitle={initialTitle} initialDescription={initialDescription} initialPlaceHolder={initialPlaceHolder} initialRequired={initialRequired}/>
  ),
  [FIELD_TYPES.SELECTION_MULTI]: ({onTitleChange, onDescriptionChange, onOptionChange, initialTitle, initialDescription, initialOptions, initialRequired})=> (
    <AddSelectionField type={FIELD_TYPES.SELECTION_MULTI} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} onOptionChange={onOptionChange} initialTitle={initialTitle} initialDescription={initialDescription} initialOptions={initialOptions}/>
  ),
  [FIELD_TYPES.SELECTION_SINGLE]: ({onTitleChange, onDescriptionChange, onOptionChange, initialTitle, initialDescription, initialOptions, initialRequired,})=> (
    <AddSelectionField type={FIELD_TYPES.SELECTION_SINGLE} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} onOptionChange={onOptionChange} initialTitle={initialTitle} initialDescription={initialDescription} initialOptions={initialOptions} initialRequired={initialRequired}/>
  ),
  [FIELD_TYPES.AI_TEXT]: ({onTitleChange, onDescriptionChange, onPlaceHolderChange, onRequiredChange, initialTitle, initialDescription, initialPlaceHolder, initialRequired, currentFields, onReferenceFieldChange, onPromptChange})=> (
    <AddAutoInputField type={FIELD_TYPES.AI_TEXT} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} onPlaceHolderChange={onPlaceHolderChange} onRequiredChange={onRequiredChange} initialTitle={initialTitle} initialDescription={initialDescription} initialPlaceHolder={initialPlaceHolder} initialRequired={initialRequired} currentFields={currentFields} onReferenceFieldChange={onReferenceFieldChange} onPromptChange={onPromptChange}/>
  )
}