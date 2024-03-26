import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Container, Typography, Box, Chip } from "@mui/material";
import Task from "./Task";

function Column({ id, title, tasks, activeId, isOverlayActive }) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <Container
            ref={setNodeRef}
            sx={{
                position: "relative",
                bgcolor: "grey.200",
                p: 2,
                borderRadius: 1,
                minHeight: "92%",
                width: "310px",
                marginRight: 1,
                marginTop: 2,
                marginLeft: 0,
                boxShadow: 2,
                display: "flex",
                flexDirection: "column",
            }}
        >
            {isOverlayActive && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: "rgba(235, 140, 0, 0.1)",
                        zIndex: 1,
                        borderStyle: "solid",
                        borderWidth: 2,
                        borderColor: "#EB8C00",
                        borderRadius: 1,
                    }}
                />
            )}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 2,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body1" fontWeight={600}>
                        {title}
                    </Typography>
                    <Chip label={tasks.length} size="small" sx={{bgcolor:"#EB8C00", color: "white"}}/>
                </Box>
            </Box>
            {tasks && tasks.length > 0 ? (
                <SortableContext id={id} items={tasks.map((task) => task.id)} strategy={rectSortingStrategy}>
                    <Box sx={{ flexGrow: 1 }}>
                        {tasks.map((task) => (
                            <Box key={task.id} sx={{ marginBottom: 1 }}>
                                {task.id === activeId ? (
                                    <Task id={task.id} task={task} invisible />
                                ) : (
                                    <Task id={task.id} task={task} />
                                )}
                            </Box>
                        ))}
                    </Box>
                </SortableContext>
            ) : (
                <Box
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                    }}
                >
                    <Typography>
                        Drag and drop a status here to hide it from the incident board. Incident reports with these
                        statuses won&apos;t be visible.
                    </Typography>
                </Box>
            )}
        </Container>
    );
}

export default Column;
