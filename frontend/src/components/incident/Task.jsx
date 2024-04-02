import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CardActionArea,
} from "@mui/material";
import IncidentDetailModal from "./IncidentDetailModal";
import Profile from "../users/Profile";

function Task({ id, task, onRefresh, commentData, setCommentData }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
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
        <CardActionArea onClick={handleOpenModal} sx={{ p: 1 }}>
          <CardContent>
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              fontWeight={500}
              fontSize="1rem"
              color="primary.text"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
              }}
            >
              {task.customFields.description}
            </Typography>

            <Grid spacing={2} justifyContent="space-between" container>
              <Grid item width="50%">
                <Grid
                  container
                  display="flex"
                  justifyContent={"center"}
                  direction={"column"}
                >
                  <Grid item>
                    <Typography
                      variant="caption"
                      color="secondary.dark"
                      fontWeight={700}
                      sx={{ mt: 2 }}
                    >
                      {new Date(task.incidentDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Box sx = {{ display: 'inline-block', p: 0.5, backgroundColor:"rgba(255, 182, 0, 0.45)",
                      borderRadius: 2, mt: 0.5, border: "2px solid #FFB600", alignItems: "center" }}>
                      <Typography variant="p" color="#EB8C00" sx={{ m: 0, fontWeight: 600}}>
                      {task.incidentCategory}
                    </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                {task.reporter && (
                  <Grid container item spacing={1} alignItems="center">
                    <Typography
                      variant="caption"
                      color="secondary.dark"
                      fontWeight={600}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                      p={1.5}
                    >
                      Reporter:
                    </Typography>
                    <ProfileAvatar user={task.reporter} />
                  </Grid>
                )}
                <Grid item>
                  <Grid container item spacing={1} alignItems="center">
                    <Typography
                      variant="caption"
                      color="secondary.dark"
                      fontWeight={600}
                      p={1.3}
                    >
                      Reviewer:
                    </Typography>

                    <ProfileAvatar user={task.reviewer} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
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
