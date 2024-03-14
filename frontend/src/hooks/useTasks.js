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
        setFilteredTasks(newTasks);
    }, [adminColumns, employeeColumns]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const filterTasks = (searchQuery) => {
        if (!searchQuery) {
            setFilteredTasks(tasks);
            return;
        }

        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = Object.keys(tasks).reduce((acc, status) => {
            acc[status] = tasks[status].filter((task) => task.incidentCategory.toLowerCase().includes(lowerCaseQuery));
            return acc;
        }, {});

        setFilteredTasks(filtered);
    };

    return { tasks, filteredTasks, setTasks, filterTasks, fetchTasks };
}
