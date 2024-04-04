import { Card, CardContent, Typography, CardActionArea } from "@mui/material";
import Profile from "../users/Profile";

function Task({ task, handleOpenModal }) {
    const ProfileAvatar = ({ user }) => <Profile user={user} />;

    return (
        <Card
            sx={{
                boxShadow: 3,
                "&:hover": {
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
                },
                transition: "0.3s",
            }}
            id={task.id}
            onClick={() => handleOpenModal(task)}
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

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="caption" color="secondary.dark" fontWeight={700}>
                            {new Date(task.incidentDate).toLocaleDateString()}
                        </Typography>
                        <ProfileAvatar user={task.reviewer} />
                    </div>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default Task;
