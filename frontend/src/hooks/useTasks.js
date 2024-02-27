import { useState, useEffect } from "react";
import useAxios from "./useAxios";
import { useAuthContext } from "../context/AuthContext";
import { isPrivileged } from "../utils/permissions";
import { ADMIN_COLUMNS, EMPLOYEE_COLUMNS } from "../constants/board";

export default function useTasks() {
    const [tasks, setTasks] = useState({});
    const [filteredTasks, setFilteredTasks] = useState({});
    const { user } = useAuthContext();
    const { sendRequest } = useAxios();

    useEffect(() => {
        const fetchTasks = async () => {
            const incidents = await sendRequest({ url: "/incidents" });

            const userIds = [...new Set(incidents.flatMap((incident) => [incident.reporter]))];
            const users = await Promise.all(userIds.map((id) => sendRequest({ url: `/users/${id}` })));

            const userMap = users.reduce((acc, user) => ({ ...acc, [user.id]: user }), {});

            let newTasks = incidents.reduce((acc, incident) => {
                const status = isPrivileged(user.role)
                    ? incident.safetyWardenIncidentStatus
                    : incident.employeeIncidentStatus;
                const statusKey = status || "unknown";

                if (!acc[statusKey]) {
                    acc[statusKey] = [];
                }

                const incidentWithUserDetails = {
                    ...incident,
                    reporter: userMap[incident.reporter],
                };

                acc[statusKey].push(incidentWithUserDetails);

                return acc;
            }, {});

            const allStatuses = isPrivileged(user.role) ? ADMIN_COLUMNS : EMPLOYEE_COLUMNS;
            allStatuses.forEach((column) => {
                if (!(column.id in newTasks)) {
                    newTasks[column.id] = [];
                }
            });

            setTasks(newTasks);
            setFilteredTasks(newTasks);
        };

        fetchTasks();
    }, []);

    const filterTasks = (searchQuery) => {
        if (!searchQuery) {
            setFilteredTasks(tasks);
            return;
        }

        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = Object.keys(tasks).reduce((acc, status) => {
            acc[status] = tasks[status].filter((task) => task.title.toLowerCase().includes(lowerCaseQuery));
            return acc;
        }, {});

        setFilteredTasks(filtered);
    };

    return { tasks, filteredTasks, setTasks, filterTasks };
}
