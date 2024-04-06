import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { isPrivileged } from "../utils/permissions";
import useAxios from "./useAxios";
import { useBoard } from "../context/BoardContext";

const useDragBehavior = (tasks, setTasks) => {
    const [activeId, setActiveId] = useState(null);
    const { adminColumns, employeeColumns } = useBoard();
    const { user } = useAuthContext();
    const { sendRequest } = useAxios();

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = ({ over }) => {
        if (!over) {
            setActiveId(null);
            return;
        }

        const destinationStatus = over.id;
        const activeColumn = Object.keys(tasks).find((column) => tasks[column].some((task) => task.id === activeId));
        const activeTask = tasks[activeColumn].find((task) => task.id === activeId);

        const updatedTask = {
            ...activeTask,
            statusId: destinationStatus,
        };

        sendRequest({
            url: `/incidents/${activeTask.id}`,
            method: "POST",
            body: {
                statusId: destinationStatus,
            },
        });

        setTasks((prevTasks) => {
            const updatedTasks = { ...prevTasks };
            const columns = isPrivileged(user.role) ? adminColumns : employeeColumns;

            const newColumn = columns.find((column) => column.statusIds.includes(destinationStatus)).id;

            updatedTasks[activeColumn] = updatedTasks[activeColumn].filter((task) => task.id !== activeId);
            updatedTasks[newColumn].push(updatedTask);

            Object.keys(updatedTasks).forEach((key) => {
                updatedTasks[key] = updatedTasks[key].sort(
                    (a, b) => new Date(a.incidentDate) - new Date(b.incidentDate),
                );
            });

            return updatedTasks;
        });

        setActiveId(null);
    };

    return {
        activeId,
        handleDragStart,
        handleDragEnd,
    };
};

export default useDragBehavior;
