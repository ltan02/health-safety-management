import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Card, CardContent, Typography, Avatar } from "@mui/material";
import IncidentDetailModal from "./IncidentDetailModal";

function Task({ id, task }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        boxShadow: 3,
        borderRadius: 2,
        opacity: isDragging ? 0 : 1,
        cursor: "pointer",
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            <Card sx={style} id={task.id} ref={setNodeRef} {...attributes} {...listeners} onClick={handleOpenModal}>
                <CardContent>
                    <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        fontWeight={500}
                        fontSize={16}
                        sx={{ color: "#3a3a3a" }}
                    >
                        {`${task.incidentCategory} on ${task.incidentDate}`}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar sx={{ bgcolor: "blue", width: "30px", height: "30px", fontSize: "14px" }}>
                                {`${task.reporter.firstName[0]}${task.reporter.lastName[0]}`}
                            </Avatar>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
            {isModalOpen && (
                <IncidentDetailModal incidentId={task.id} open={isModalOpen} onClose={() => setIsModalOpen(false)} />
            )}
        </>
    );
}

export default Task;
