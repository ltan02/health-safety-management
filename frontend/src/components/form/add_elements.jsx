import React from 'react';
import { FIELD_TYPES } from './form_data';
import AddInputField from './AddInputField';
import AddSelectionField from './AddSelectionField';
import AddFileField from './AddFileField';
export const FIELD_ADD_FORM = {
  [FIELD_TYPES.TEXT_FIELD]: ({onTitleChange, onDescriptionChange, onPlaceHolderChange, onRequiredChange, initialTitle, initialDescription, initialPlaceHolder, initialRequired})=> (
    <AddInputField type={FIELD_TYPES.TEXT_FIELD} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} onPlaceHolderChange={onPlaceHolderChange} onRequiredChange={onRequiredChange} initialTitle={initialTitle} initialDescription={initialDescription} initialPlaceHolder={initialPlaceHolder} initialRequired={initialRequired}/>
  ),
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
  [FIELD_TYPES.SELECTION_SINGLE]: ({onTitleChange, onDescriptionChange, onOptionChange, initialTitle, initialDescription, initialOptions, initialRequired})=> (
    <AddSelectionField type={FIELD_TYPES.SELECTION_SINGLE} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} onOptionChange={onOptionChange} initialTitle={initialTitle} initialDescription={initialDescription} initialOptions={initialOptions} initialRequired={initialRequired}/>
  ),
  [FIELD_TYPES.FILE_ATTACHMENT]: ({onTitleChange, onDescriptionChange, onPlaceHolderChange, onRequiredChange, initialTitle, initialDescription, initialPlaceHolder, initialRequired})=> (
    <AddFileField type={FIELD_TYPES.FILE_ATTACHMENT} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} onPlaceHolderChange={onPlaceHolderChange} onRequiredChange={onRequiredChange} initialTitle={initialTitle} initialDescription={initialDescription} initialPlaceHolder={initialPlaceHolder} initialRequired={initialRequired}/>

  )
}