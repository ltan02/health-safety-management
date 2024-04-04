import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Container, Typography, Box, Chip, Modal } from "@mui/material";
import Task from "./Task";
import PreviewForm from "../form/PreviewForm";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "auto",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    overflow: "auto",
    maxHeight: "90%",
    display: "flex",
    flexDirection: "column",
};

function Column({
    id,
    title,
    tasks,
    handleAddTask,
    onRefresh,
    field,
    sortedRows,
    formName,
    commentData,
    setCommentData,
}) {
    const { setNodeRef } = useDroppable({ id });
    const [openModal, setOpenModal] = useState(false);

    const handleSubmit = (field) => {
        handleAddTask(field);
        onClose();
    };
    const onClose = () => {
        setOpenModal(false);
    };
    return (
        <Container
            ref={setNodeRef}
            sx={{
                bgcolor: "grey.200",
                padding: 2,
                borderRadius: 1,
                minHeight: "100%",
                width: "350px",
                minWidth: "350px",
                margin: 2,
                boxShadow: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 2,
                }}
            >
                <Typography variant="h6" fontWeight={600} sx={{ flexGrow: 1 }}>
                    {title} <Chip label={tasks.length} size="small" sx={{ bgcolor: "#EB8C00", color: "white" }} />
                </Typography>
            </Box>
            <SortableContext id={id} items={tasks.map((task) => task.id)} strategy={rectSortingStrategy}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {tasks.map((task) => (
                        <Task
                            key={task.id}
                            id={task.id}
                            task={task}
                            onRefresh={onRefresh}
                            commentData={commentData}
                            setCommentData={setCommentData}
                        />
                    ))}
                </Box>
            </SortableContext>
            <Modal
                open={openModal}
                onClose={() => {
                    onClose();
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                        Report New Incident
                    </Typography>
                    <PreviewForm
                        fields={field}
                        sortedRows={sortedRows}
                        handleSubmit={handleSubmit}
                        onClose={onClose}
                        formName={formName}
                    />
                </Box>
            </Modal>
        </Container>
    );
}

export default Column;
