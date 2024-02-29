import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { isPrivileged } from "../utils/permissions";
import useAxios from "./useAxios";
import { useBoard } from "../context/BoardContext";

const useDragBehavior = (tasks, setTasks) => {
    const [activeId, setActiveId] = useState(null);
    const { user } = useAuthContext();
    const { sendRequest } = useAxios();
    const { adminColumns, employeeColumns } = useBoard();

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = ({ active, over }) => {
        if (!over) return;

        const columns = isPrivileged(user.role) ? adminColumns : employeeColumns;
        const sourceColumn = Object.keys(tasks).find((column) => tasks[column].some((task) => task.id === active.id));
        let destinationColumn = over.id;

        if (!sourceColumn || !destinationColumn) return;

        if (columns.find((column) => column.id === destinationColumn) === undefined) {
            destinationColumn = Object.keys(tasks).find((column) => tasks[column].some((task) => task.id === over.id));
        }

        setTasks((prevTasks) => {
            const newTasks = { ...prevTasks };
            const activeTask = newTasks[sourceColumn].find((task) => task.id === active.id);
            const movingTaskIndex = newTasks[sourceColumn].findIndex((task) => task.id === active.id);
            const targetIndex = newTasks[destinationColumn].findIndex((task) => task.id === over.id);

            newTasks[sourceColumn] = newTasks[sourceColumn].filter((task) => task.id !== active.id);

            if (!newTasks[destinationColumn].some((task) => task.id === active.id)) {
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
            }

            return newTasks;
        });
    };

    const handleDragEnd = ({ active, over }) => {
        if (!over) return;
        let destinationColumn = over.id;

        if (!destinationColumn) return;

        const columns = isPrivileged(user.role) ? adminColumns : employeeColumns;
        if (Object.keys(columns).indexOf(destinationColumn) < 0) {
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
