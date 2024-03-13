import { useState, useEffect, useCallback, useMemo } from "react";
import useAxios from "./useAxios";
import { useAuthContext } from "../context/AuthContext";
import { isPrivileged } from "../utils/permissions";
import { useBoard } from "../context/BoardContext";

export default function useTasks(searchQuery = "") {
    const [tasks, setTasks] = useState({});
    const { user } = useAuthContext();
    const { sendRequest } = useAxios();
    const { adminColumns, employeeColumns } = useBoard();

    const fetchTasks = useCallback(async () => {
        const incidents = await sendRequest({ url: "/incidents" });

        const userIds = [...new Set(incidents.flatMap((incident) => [incident.reporter]))];
        const users = await Promise.all(userIds.map((id) => sendRequest({ url: `/users/${id}` })));

        const userMap = users.reduce((acc, user) => ({ ...acc, [user.id]: user }), {});

        let newTasks = incidents.reduce((acc, incident) => {
            const columns = isPrivileged(user.role) ? adminColumns : employeeColumns;
            const columnId = columns.find((col) => col.statusIds.includes(incident.statusId))?.id || "unknown";

            if (!acc[columnId]) {
                acc[columnId] = [];
            }

            const incidentWithUserDetails = {
                ...incident,
                reporter: userMap[incident.reporter],
            };

            acc[columnId].push(incidentWithUserDetails);

            return acc;
        }, {});

        const allStatuses = isPrivileged(user.role) ? adminColumns : employeeColumns;
        allStatuses.forEach((column) => {
            if (!(column.id in newTasks)) {
                newTasks[column.id] = [];
            }
        });

        setTasks(newTasks);
    }, [adminColumns, employeeColumns]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const filterTasks = useCallback(
        (query) => {
            if (!query) return tasks;

            const lowerCaseQuery = query.toLowerCase();
            return Object.keys(tasks).reduce((acc, status) => {
                acc[status] = tasks[status].filter((task) => task.title.toLowerCase().includes(lowerCaseQuery));
                return acc;
            }, {});
        },
        [tasks],
    );

    const filteredTasks = useMemo(() => filterTasks(searchQuery), [filterTasks, searchQuery]);

    return { tasks, filteredTasks, setTasks, fetchTasks };
}
