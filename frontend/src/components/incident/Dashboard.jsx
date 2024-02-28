import { useState, useEffect } from "react";
import { Container, Box } from "@mui/material";
import {
    DndContext,
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
import useAxios from "../../hooks/useAxios";

function Dashboard() {
    const { tasks, filterTasks, setTasks, fetchTasks } = useTasks();
    const { activeId, handleDragStart, handleDragOver, handleDragEnd } = useDragBehavior(tasks, setTasks);
    const { user } = useAuthContext();
    const { sendRequest } = useAxios();

    const [employees, setEmployees] = useState([]);

    const columns = isPrivileged(user.role) ? ADMIN_COLUMNS : EMPLOYEE_COLUMNS;

    const activeTask = activeId
        ? Object.values(tasks)
              .flat()
              .find((task) => task.id === activeId)
        : null;

    const handleAddTask = async (task) => {
        const directMapping = {
            timeOfIncident: "incidentDate",
            category: "incidentCategory",
            employeesInvolved: "employeesInvolved",
        };

        const incident = {
            reporter: user.id,
            incidentDate: task.timeOfIncident,
            incidentCategory: task.category,
            employeesInvolved: task.employeesInvolved,
            customFields: [],
        };

        for (const key in task) {
            if (Object.prototype.hasOwnProperty.call(task, key) && !directMapping[key]) {
                incident.customFields.push({
                    fieldName: key,
                    value: task[key],
                });
            }
        }

        await sendRequest({ url: "/incidents", method: "POST", body: incident });
        fetchTasks();
    };

    const refreshDashboard = () => {
        fetchTasks();
    };

    useEffect(() => {
        const fetchEmployees = async () => {
            const res = await sendRequest({ url: "/users" });
            setEmployees(res);
        };

        fetchEmployees();
    }, []);

    return (
        <Container maxWidth="false" disableGutters>
            <IncidentSearchInput onSearch={filterTasks} />
            <DndContext
                sensors={useSensors(
                    useSensor(PointerSensor, {
                        activationConstraint: {
                            distance: 4,
                        },
                    }),
                )}
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
                                employees={employees}
                                onRefresh={refreshDashboard}
                            />
                        </Box>
                    ))}
                </Box>
                <DragOverlay dropAnimation={defaultDropAnimation}>
                    {activeTask && <Task id={activeId} task={activeTask} onRefresh={refreshDashboard} />}
                </DragOverlay>
            </DndContext>
        </Container>
    );
}

export default Dashboard;
