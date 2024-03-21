import React from 'react';
import { FIELD_TYPES } from './form_data';
import AddInputField from './AddInputField';
import AddSelectionField from './AddSelectionField';
import AddFileField from './AddFileField';
export const FIELD_ADD_FORM = {
  [FIELD_TYPES.TEXT_FIELD]: ({onTitleChange, onDescriptionChange, onPlaceHolderChange, onRequiredChange})=> (
    <AddInputField type={FIELD_TYPES.TEXT_FIELD} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} onPlaceHolderChange={onPlaceHolderChange} onRequiredChange={onRequiredChange}/>
  ),
  [FIELD_TYPES.TEXT_BOX]: ({onTitleChange, onDescriptionChange, onPlaceHolderChange, onRequiredChange})=> (
    <AddInputField type={FIELD_TYPES.TEXT_BOX} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} onPlaceHolderChange={onPlaceHolderChange} onRequiredChange={onRequiredChange}/>
  ),
  [FIELD_TYPES.NUMBER_FIELD]: ({onTitleChange, onDescriptionChange, onPlaceHolderChange, onRequiredChange})=> (
    <AddInputField type={FIELD_TYPES.NUMBER_FIELD} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} onPlaceHolderChange={onPlaceHolderChange} onRequiredChange={onRequiredChange}/>
  ),
  [FIELD_TYPES.DATETIME_LOCAL]: ({onTitleChange, onDescriptionChange, onPlaceHolderChange, onRequiredChange})=> (
    <AddInputField type={FIELD_TYPES.DATETIME_LOCAL} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} onPlaceHolderChange={onPlaceHolderChange} onRequiredChange={onRequiredChange}/>
  ),
  [FIELD_TYPES.SELECTION_MULTI]: ({onTitleChange, onDescriptionChange, onOptionChange})=> (
    <AddSelectionField type={FIELD_TYPES.SELECTION_MULTI} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} onOptionChange={onOptionChange}/>
  ),
  [FIELD_TYPES.SELECTION_SINGLE]: ({onTitleChange, onDescriptionChange, onOptionChange})=> (
    <AddSelectionField type={FIELD_TYPES.SELECTION_SINGLE} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} onOptionChange={onOptionChange}/>
  ),
  [FIELD_TYPES.FILE_ATTACHMENT]: ({onTitleChange, onDescriptionChange, onPlaceHolderChange, onRequiredChange})=> (
    <AddFileField type={FIELD_TYPES.FILE_ATTACHMENT} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} onPlaceHolderChange={onPlaceHolderChange} onRequiredChange={onRequiredChange}/>

  )
}