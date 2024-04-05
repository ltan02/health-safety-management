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
        let url = "/incidents";
        if (isPrivileged(user.role)) {
            url = "/incidents?all=true";
        }

        const incidents = await sendRequest({ url });

        const userIds = [...new Set(incidents.flatMap((incident) => [incident?.reporter]))].filter(Boolean);
        const users = await Promise.all(userIds.map((id) => sendRequest({ url: `/users/${id}` })));

        const reviewerIds = [...new Set(incidents.flatMap((incident) => [incident?.reviewer]))].filter(Boolean); // filter(Boolean) removes null and undefined
        const reviewers = await Promise.all(reviewerIds.map((id) => sendRequest({ url: `/users/${id}` })));

        const taskDetails = await Promise.all(
            incidents.map((incident) => sendRequest({ url: `/incidents/${incident.id}` })),
        );
        const involvedEmployeeIds = taskDetails.flatMap((incident) => incident.employeesInvolved);
        const involvedEmployees = await Promise.all(
            involvedEmployeeIds.map((id) => sendRequest({ url: `/users/${id}` })),
        );

        const userMap = users.reduce((acc, user) => ({ ...acc, [user.id]: user }), {});
        const reviewerMap = reviewers.reduce((acc, user) => ({ ...acc, [user?.id]: user }), {});
        const employeeMap = involvedEmployees.reduce((acc, user) => ({ ...acc, [user.id]: user }), {});

        let newTasks = taskDetails.reduce((acc, incident) => {
            const columns = isPrivileged(user.role) ? adminColumns : employeeColumns;
            const columnId = columns.find((col) => col.statusIds.includes(incident.statusId))?.id || "unknown";

            if (!acc[columnId]) {
                acc[columnId] = [];
            }

            const incidentWithUserDetails = {
                ...incident,
                reporter: userMap[incident.reporter],
                reviewer: reviewerMap[incident.reviewer],
                employeesInvolved: incident.employeesInvolved.map((id) => employeeMap[id]),
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

        Object.keys(newTasks).forEach((key) => {
            newTasks[key] = newTasks[key].sort((a, b) => new Date(a.incidentDate) - new Date(b.incidentDate));
        });

        setTasks(newTasks);
        setFilteredTasks(newTasks);
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
                    if (task.customFields?.description) {
                        return task.customFields?.description?.toLowerCase().includes(lowerCaseQuery);
                    } else {
                        return task.incidentCategory.toLowerCase().includes(lowerCaseQuery);
                    }
                });
                return acc;
            }, {});

            setFilteredTasks(filtered);
        },
        [tasks],
    );

    return { tasks, filteredTasks, filterTasks, setTasks, fetchTasks, setFilteredTasks };
}
