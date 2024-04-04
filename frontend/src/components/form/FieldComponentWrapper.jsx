import React from "react";
import { Container, IconButton, Chip, Tooltip } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { FIELD_TYPES } from "./form_data";
import { FIELD_ELEMENT } from "./form_elements";
import { useSortable } from "@dnd-kit/sortable";

const FieldComponentWrapper = ({ fieldData, onEdit, onDelete,fields }) => {
  if(!FIELD_ELEMENT[fieldData.type]) return (<></>)
  const FieldComponent = FIELD_ELEMENT[fieldData.type];
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: fieldData.id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    boxShadow: isDragging ? "0 0 0.5rem #666" : "none",
    opacity: isDragging ? 0.5 : 1,
    position: "relative",
    cursor: "grab",
  };

  const findFieldById = (id) => {
    return fields.find((field) => field.id === id);
  };
  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      ref={setNodeRef}
      style={style}
    >
      {fieldData.type === "empty" ? (
        <></>
      ) : (
        <>
          <FieldComponent
            {...fieldData.props}
            disabled
            value={fieldData.type === FIELD_TYPES.SELECTION_MULTI ? [] : fieldData.type === FIELD_TYPES.AI_TEXT ? {
              referenceField: findFieldById(fieldData.aiField.referenceId),
              prompt: fieldData.aiField.prompt,
              generated: "AI generated text will appear here",
            } : ""}
            style={{ padding: "10px 10px", flexGrow: 1 }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Tooltip title="Drag" arrow disabled={isDragging}>
              <span>
                <IconButton
                  size="small"
                  {...listeners}
                  {...attributes}
                  style={{ margin: "2px" }}
                >
                  <DragIndicatorIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Edit" arrow>
              <IconButton size="small" onClick={() => onEdit(fieldData)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" arrow>
              <IconButton size="small" onClick={() => onDelete(fieldData)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        </>
      )}
    </Container>
  );
};

export default FieldComponentWrapper;
