import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { isPrivileged } from "../utils/permissions";
import { ADMIN_STATE, EMPLOYEE_STATE } from "../constants/board";

const useDragBehavior = (tasks, setTasks) => {
    const [activeId, setActiveId] = useState(null);
    const { user } = useAuthContext();

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = ({ active, over }) => {
        if (!over || active.id === over.id) return;

        const sourceColumn = Object.keys(tasks).find((column) => tasks[column].some((task) => task.id === active.id));
        const destinationColumn = Object.keys(tasks).find((column) =>
            tasks[column].some((task) => task.id === over.id),
        );

        if (!sourceColumn || !destinationColumn) return;

        setTasks((prevTasks) => {
            const newTasks = { ...prevTasks };
            const activeTask = newTasks[sourceColumn].find((task) => task.id === active.id);
            const movingTaskIndex = newTasks[sourceColumn].findIndex((task) => task.id === active.id);
            const targetIndex = newTasks[destinationColumn].findIndex((task) => task.id === over.id);

            newTasks[sourceColumn] = newTasks[sourceColumn].filter((task) => task.id !== active.id);

            if (sourceColumn === destinationColumn) {
                newTasks[destinationColumn].splice(
                    movingTaskIndex < targetIndex ? targetIndex : targetIndex,
                    0,
                    activeTask,
                );
            } else {
                newTasks[destinationColumn].splice(targetIndex + 1, 0, activeTask);
            }

            return newTasks;
        });
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        const state = isPrivileged(user.role) ? ADMIN_STATE : EMPLOYEE_STATE;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeTask = Object.values(tasks)
            .flat()
            .find((task) => task.id === active.id);
        if (!activeTask) return;

        const statusField = isPrivileged(user.role) ? "safetyWardenIncidentStatus" : "employeeIncidentStatus";
        const sourceColumnId = activeTask[statusField];
        const destinationColumnId = over.id;

        if (!state[destinationColumnId]) {
            setActiveId(null);
            return;
        }

        setTasks((prevTasks) => {
            const updatedTasks = { ...prevTasks };

            if (sourceColumnId !== destinationColumnId) {
                updatedTasks[sourceColumnId] = updatedTasks[sourceColumnId].filter((task) => task.id !== active.id);
                const updatedTask = { ...activeTask, [statusField]: destinationColumnId };
                updatedTasks[destinationColumnId] = [...updatedTasks[destinationColumnId], updatedTask];
            }

            return updatedTasks;
        });

        setActiveId(null);
    };

    return {
        activeId,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
    };
};

export default useDragBehavior;
