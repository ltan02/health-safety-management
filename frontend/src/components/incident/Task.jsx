import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, Typography, CardActionArea } from "@mui/material";
import IncidentDetailModal from "./IncidentDetailModal";
import Profile from "../users/Profile";

function Task({ id, task, onRefresh, commentData, setCommentData }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIncident, setSelectedIncident] = useState(null);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        boxShadow: 3,
        borderRadius: 2,
        opacity: isDragging ? 0 : 1,
        cursor: "pointer",
    };

    const ProfileAvatar = ({ user }) => <Profile user={user} />;

    const handleOpenModal = () => {
        setSelectedIncident(task);
        setIsModalOpen(true);
    };

    return (
        <>
            <Card
                sx={{
                    ...style,
                    boxShadow: 3,
                    "&:hover": {
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
                    },
                    transition: "0.3s",
                }}
                id={task.id}
                ref={setNodeRef}
                {...attributes}
                {...listeners}
                onClick={handleOpenModal}
            >
                <CardActionArea onClick={handleOpenModal} sx={{ p: 0 }}>
                    <CardContent
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            height: "100%",
                        }}
                    >
                        <Typography
                            gutterBottom
                            component="div"
                            color="primary.text"
                            sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: "2",
                                WebkitBoxOrient: "vertical",
                                fontSize: 14,
                            }}
                        >
                            {task.customFields?.description && task.customFields?.description.length > 0
                                ? task.customFields?.description
                                : `${task.incidentCategory} on ${
                                      new Date(task.incidentDate).toLocaleDateString().split("T")[0]
                                  }`}
                        </Typography>

                        <div style={{ flexGrow: 1 }}></div>

                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="caption" color="secondary.dark" fontWeight={700}>
                                {new Date(task.incidentDate).toLocaleDateString()}
                            </Typography>
                            <ProfileAvatar user={task.reviewer} />
                        </div>
                    </CardContent>
                </CardActionArea>
            </Card>

            {isModalOpen && (
                <IncidentDetailModal
                    incidentId={task.id}
                    open={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        onRefresh();
                    }}
                    onRefresh={onRefresh}
                    selectedIncident={selectedIncident}
                    commentData={commentData}
                    setCommentData={setCommentData}
                />
            )}
        </>
    );
}

export default Task;
