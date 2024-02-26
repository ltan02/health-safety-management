import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { isPrivileged } from "../utils/permissions";
import useAxios from "./useAxios";
import { ADMIN_STATE, EMPLOYEE_STATE } from "../constants/board";

const useDragBehavior = (tasks, setTasks) => {
    const [activeId, setActiveId] = useState(null);
    const { user } = useAuthContext();
    const { sendRequest } = useAxios();

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = ({ active, over }) => {
        if (!over) return;

        const states = isPrivileged(user.role) ? ADMIN_STATE : EMPLOYEE_STATE;
        const sourceColumn = Object.keys(tasks).find((column) => tasks[column].some((task) => task.id === active.id));
        let destinationColumn = over.id;

        if (!sourceColumn || !destinationColumn) return;

        if (Object.keys(states).indexOf(destinationColumn) < 0) {
            destinationColumn = Object.keys(tasks).find((column) => tasks[column].some((task) => task.id === over.id));
        }

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
                const updatedTask = {
                    ...activeTask,
                    employeeIncidentStatus: isPrivileged(user.role)
                        ? activeTask.employeeIncidentStatus
                        : destinationColumn,
                    safetyWardenIncidentStatus: isPrivileged(user.role)
                        ? destinationColumn
                        : activeTask.safetyWardenIncidentStatus,
                };

                newTasks[destinationColumn].splice(targetIndex, 0, updatedTask);
            }

            return newTasks;
        });
    };

    const handleDragEnd = ({ active, over }) => {
        if (!over) return;

        const states = isPrivileged(user.role) ? ADMIN_STATE : EMPLOYEE_STATE;
        let destinationColumn = over.id;

        if (!destinationColumn) return;

        if (Object.keys(states).indexOf(destinationColumn) < 0) {
            destinationColumn = Object.keys(tasks).find((column) => tasks[column].some((task) => task.id === over.id));
        }

        const activeTask = tasks[destinationColumn].find((task) => task.id === active.id);
        const updatedTask = {
            ...activeTask,
            employeeIncidentStatus: isPrivileged(user.role) ? activeTask.employeeIncidentStatus : destinationColumn,
            safetyWardenIncidentStatus: isPrivileged(user.role)
                ? destinationColumn
                : activeTask.safetyWardenIncidentStatus,
        };
        sendRequest({
            url: `/incidents/${activeTask.id}`,
            method: "POST",
            body: {
                employeeIncidentStatus: updatedTask.employeeIncidentStatus,
                safetyWardenIncidentStatus: updatedTask.safetyWardenIncidentStatus,
            },
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
