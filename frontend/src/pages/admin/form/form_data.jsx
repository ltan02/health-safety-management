import React from "react";

export const FIELD_TYPES = {
  TEXT_FIELD: "text",
  TEXT_BOX: "text-box",
  NUMBER_FIELD: "number",
  DATETIME_LOCAL: "datetime-local",
  SELECTION_MULTI: "selection-multi",
  SELECTION_SINGLE: "selection-single",
  FILE_ATTACHMENT: "file",
  EMPTY: "empty",
};

export const VARIANT_TYPES = {
  OUTLINED: "outlined",
  STANDARD: "standard",
  TEXT: "text",
  FILLED: "filled",
  LABEL: "h7",
  BODY: "body2",
};

export const FIELD_DATA = {
  [FIELD_TYPES.TEXT_FIELD]: {
    id: FIELD_TYPES.TEXT_FIELD,
    label: "Text Field",
    description: "A single line of text",
  },
  [FIELD_TYPES.TEXT_BOX]: {
    id: FIELD_TYPES.TEXT_BOX,
    label: "Text Box",
    description: "A multi-line text input",
  },
  [FIELD_TYPES.NUMBER_FIELD]: {
    id: FIELD_TYPES.NUMBER_FIELD,
    label: "Number Field",
    description: "A number input",
  },
  [FIELD_TYPES.DATETIME_LOCAL]: {
    id: FIELD_TYPES.DATETIME_LOCAL,
    label: "Date and Time",
    description: "A date and time input",
  },
  [FIELD_TYPES.SELECTION_MULTI]: {
    id: FIELD_TYPES.SELECTION_MULTI,
    label: "Multi-Select",
    description: "Select multiple options",
  },
  [FIELD_TYPES.SELECTION_SINGLE]: {
    id: FIELD_TYPES.SELECTION_SINGLE,
    label: "Single-Select",
    description: "Select a single option",
  },
  [FIELD_TYPES.FILE_ATTACHMENT]: {
    id: FIELD_TYPES.FILE_ATTACHMENT,
    label: "File Attachment",
    description: "Upload a file",
  },
};
