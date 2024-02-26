import { Container, Box } from "@mui/material";
import {
    DndContext,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimation,
    rectIntersection,
} from "@dnd-kit/core";
import Column from "./Column";
import IncidentSearchInput from "./IncidentSearchInput";
import Task from "./Task";
import useTasks from "../../hooks/useTasks";
import useDragBehavior from "../../hooks/useDragBehavior";
import { useAuthContext } from "../../context/AuthContext";
import { isPrivileged } from "../../utils/permissions";
import { ADMIN_COLUMNS, EMPLOYEE_COLUMNS } from "../../constants/board";

function Dashboard() {
    const { tasks, filterTasks, setTasks } = useTasks();
    const { activeId, handleDragStart, handleDragOver, handleDragEnd } = useDragBehavior(tasks, setTasks);
    const { user } = useAuthContext();

    const columns = isPrivileged(user.role) ? ADMIN_COLUMNS : EMPLOYEE_COLUMNS;

    const activeTask = activeId
        ? Object.values(tasks)
              .flat()
              .find((task) => task.id === activeId)
        : null;

    const handleAddTask = (task) => console.log(task);

    return (
        <Container maxWidth="false" disableGutters>
            <IncidentSearchInput onSearch={filterTasks} />
            <DndContext
                sensors={useSensors(useSensor(PointerSensor))}
                collisionDetection={rectIntersection}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragStart={handleDragStart}
            >
                <Box
                    sx={{
                        display: "flex",
                        overflowX: "auto",
                        gap: 2,
                        p: 2,
                        minHeight: "calc(100vh - 200px)",
                        alignItems: "stretch",
                    }}
                >
                    {columns.map((column) => (
                        <Box
                            key={column.id}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            <Column
                                id={column.id}
                                title={column.title}
                                tasks={tasks[column.id] || []}
                                activeId={activeId}
                                handleAddTask={handleAddTask}
                            />
                        </Box>
                    ))}
                </Box>
                <DragOverlay dropAnimation={defaultDropAnimation}>
                    {activeTask && <Task id={activeId} task={activeTask} />}
                </DragOverlay>
            </DndContext>
        </Container>
    );
}

export default Dashboard;
