import { useState } from "react";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Container, Typography, Box, Chip, Modal } from "@mui/material";
import Task from "./Task";
import PreviewForm from "../form/PreviewForm";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import DroppableTransitionBox from "./DroppableTransitionBox";

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
    activeId,
    id,
    title,
    tasks,
    handleAddTask,
    field,
    sortedRows,
    formName,
    columnMap,
    handleOpenModal,
}) {
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
            {!activeId && (
                <SortableContext id={id} items={tasks.map((task) => task.id)} strategy={rectSortingStrategy}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {tasks.map((task) => (
                            <Task key={task.id} task={task} handleOpenModal={handleOpenModal} />
                        ))}
                    </Box>
                </SortableContext>
            )}
            {activeId && (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "90%",
                        width: "100%",
                        alignItems: "center",
                    }}
                >
                    {columnMap && columnMap.length > 0 ? (
                        columnMap.map((column, index) => (
                            <DroppableTransitionBox
                                key={index}
                                statusId={column.statusId}
                                statusName={column.statusName}
                                transitionName={column.transitionName}
                            />
                        ))
                    ) : tasks.some((task) => task.id === activeId) ? (
                        <></>
                    ) : (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                width: "60%",
                                textAlign: "center",
                            }}
                        >
                            <DoNotDisturbIcon />
                            <p style={{ fontSize: 12, marginTop: 5 }}>
                                You can&apos;t move this incident to this column due to workflow configuration or
                                permission.
                            </p>
                        </Box>
                    )}
                </div>
            )}
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
