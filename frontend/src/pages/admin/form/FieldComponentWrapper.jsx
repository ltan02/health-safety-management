import React from "react";
import { Container, IconButton, Chip } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { FIELD_ELEMENT, FIELD_TYPES } from "./initial_form";
import { useSortable } from "@dnd-kit/sortable";

const FieldComponentWrapper = ({ fieldData, onEdit, onDelete }) => {
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
            value={fieldData.type === FIELD_TYPES.SELECTION_MULTI ? [] : ""}
            style={{ padding: "10px 0px", flexGrow: 1 }}
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
            <IconButton
              size="small"
              style={{ margin: "2px" }}
              {...listeners}
              {...attributes}
            >
              <DragIndicatorIcon />
            </IconButton>
            {/* <IconButton size="small" style={{ margin: '2px' }} onClick={() => onEdit(fieldData)}>
          <EditIcon />
        </IconButton> */}
            <IconButton
              size="small"
              style={{ margin: "2px" }}
              onClick={() => onDelete(fieldData)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </>
      )}
    </Container>
  );
};

export default FieldComponentWrapper;
