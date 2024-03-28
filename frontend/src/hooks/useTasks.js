import { useState, useEffect, useCallback } from "react";
import useAxios from "./useAxios";
import { useAuthContext } from "../context/AuthContext";
import { isPrivileged } from "../utils/permissions";
import { useBoard } from "../context/BoardContext";

export default function useTasks() {
    const [tasks, setTasks] = useState({});
    const { user } = useAuthContext();
    const { sendRequest } = useAxios();
    const { adminColumns, employeeColumns } = useBoard();

    const fetchTasks = useCallback(async () => {
        const incidents = await sendRequest({ url: "/incidents" });

        const userIds = [...new Set(incidents.flatMap((incident) => [incident.reporter]))];
        const users = await Promise.all(userIds.map((id) => sendRequest({ url: `/users/${id}` })));

        const reviewerIds = [...new Set(incidents.flatMap((incident) => [incident?.reviewer]))].filter(Boolean); // filter(Boolean) removes null and undefined
        const reviewers = await Promise.all(reviewerIds.map((id) => sendRequest({ url: `/users/${id}` })));

        const taskDetails = await Promise.all(incidents.map((incident) => sendRequest({ url: `/incidents/${incident.id}` })));
        const involvedEmployeeIds = taskDetails.flatMap((incident) => incident.employeesInvolved);
        const involvedEmployees = await Promise.all(involvedEmployeeIds.map((id) => sendRequest({ url: `/users/${id}` })));



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
        setTasks(newTasks);
    }, [adminColumns, employeeColumns]);

    const fetchTaskDetailData = async (incidentId) => {
        const res = await sendRequest({
            url: `/incidents/${incidentId}`,
        });

        res.employeesInvolved = [...new Set([...res.employeesInvolved])].filter((id) => id !== res.reporter);

        const userIds = [...new Set([res.reporter, ...res.employeesInvolved])];
        const users = await Promise.all(userIds.map((id) => sendRequest({ url: `/users/${id}` })));

        const userMap = users.reduce((acc, user) => ({ ...acc, [user.id]: user }), {});

        const updatedIncident = {
            ...res,
            reporter: userMap[res.reporter],
            employeesInvolved: res.employeesInvolved.map((id) => userMap[id]),
        };

        return updatedIncident;

    };

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const filterTasks = useCallback(
        (query) => {
            if (!query) return tasks;

            const lowerCaseQuery = query.toLowerCase();
            const filtered = Object.keys(tasks).reduce((acc, status) => {
                acc[status] = tasks[status].filter((task) =>
                    task.incidentCategory.toLowerCase().includes(lowerCaseQuery) ||
                    task.customFields.description.toLowerCase().includes(lowerCaseQuery),
                );
                return acc;
            }, {});

            const concatenatedTasks = Object.keys(filtered).reduce((acc, status) => {
                acc.push(...filtered[status]);
                return acc;
            }, []);

            return concatenatedTasks;
        },
        [tasks],
    );

    return { tasks, filterTasks, setTasks, fetchTasks };
}
