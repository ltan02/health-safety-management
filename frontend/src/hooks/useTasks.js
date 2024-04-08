import { useState, useEffect, useCallback } from "react";
import useAxios from "./useAxios";
import { useAuthContext } from "../context/AuthContext";
import { isPrivileged } from "../utils/permissions";
import { useBoard } from "../context/BoardContext";

export default function useTasks() {
    const [tasks, setTasks] = useState({});
    const [filteredTasks, setFilteredTasks] = useState({});
    const { user } = useAuthContext();
    const { sendRequest } = useAxios();
    const { adminColumns, employeeColumns } = useBoard();
    const [loading, setLoading] = useState(true);

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        let url = "/incidents";
        if (isPrivileged(user.role)) {
            url += "?all=true";
        }

        try {
            const incidentsResponse = await sendRequest({ url });
            const allUserIds = new Set(
                incidentsResponse.flatMap((incident) =>
                    [incident.reporter, incident.reviewer, ...incident.employeesInvolved].filter(Boolean),
                ),
            );
            const usersResponse = await Promise.all([...allUserIds].map((id) => sendRequest({ url: `/users/${id}` })));
            const userMap = usersResponse.reduce((acc, user) => ({ ...acc, [user.id]: user }), {});

            let newState = { ...tasks };
            let taskIdToColumnMap = {};

            incidentsResponse.forEach((incident) => {
                const columnId =
                    (isPrivileged(user.role) ? adminColumns : employeeColumns).find((col) =>
                        col.statusIds.includes(incident.statusId),
                    )?.id || "unknown";

                if (!newState[columnId]) {
                    newState[columnId] = [];
                }

                if (taskIdToColumnMap[incident.id] && taskIdToColumnMap[incident.id] !== columnId) {
                    const oldColumnId = taskIdToColumnMap[incident.id];
                    newState[oldColumnId] = newState[oldColumnId].filter((task) => task.id !== incident.id);
                }

                taskIdToColumnMap[incident.id] = columnId;

                const updatedIncident = {
                    ...incident,
                    reporter: userMap[incident.reporter],
                    reviewer: userMap[incident.reviewer],
                    employeesInvolved: incident.employeesInvolved.map((id) => userMap[id]),
                };

                const existingIndex = newState[columnId].findIndex((item) => item.id === incident.id);
                if (existingIndex > -1) {
                    newState[columnId][existingIndex] = updatedIncident;
                } else {
                    if (!newState[columnId] || !Array.isArray(newState[columnId])) {
                        newState[columnId] = [];
                    }

                    newState[columnId].push(updatedIncident);
                }
            });

            Object.keys(newState).forEach((key) => {
                newState[key].sort((a, b) => new Date(a.incidentDate) - new Date(b.incidentDate));
            });

            setTasks(newState);
            setFilteredTasks(newState);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        } finally {
            setLoading(false);
        }
    }, [adminColumns, employeeColumns]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const filterTasks = useCallback(
        (query) => {
            if (!query) return setFilteredTasks(tasks);

            const lowerCaseQuery = query.toLowerCase();
            const filtered = Object.keys(tasks).reduce((acc, status) => {
                acc[status] = tasks[status].filter((task) => {
                    return (
                        task.customFields?.description?.toLowerCase().includes(lowerCaseQuery) ||
                        task.incidentCategory?.toLowerCase().includes(lowerCaseQuery) ||
                        task.incidentDate?.toLowerCase().includes(lowerCaseQuery)
                    );
                });
                return acc;
            }, {});

            setFilteredTasks(filtered);
        },
        [tasks],
    );

    return { tasks, filteredTasks, filterTasks, setTasks, fetchTasks, setFilteredTasks, loading };
}
