import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import useAxios from "../hooks/useAxios";

const BoardContext = createContext();

export const useBoard = () => useContext(BoardContext);

export const BoardProvider = ({ children }) => {
    const [boardDetails, setBoardDetails] = useState({});
    const [statuses, setStatuses] = useState([]);
    const [adminColumns, setAdminColumns] = useState([]);
    const [employeeColumns, setEmployeeColumns] = useState([]);
    const { sendRequest } = useAxios();

    const fetchBoardInfo = useCallback(async () => {
        const boards = await sendRequest({ url: "/boards", method: "GET" });
        const boardResponse = boards[0];

        const columnIds = [...boardResponse.adminColumnIds, ...boardResponse.employeeColumnIds];
        const columnPromises = columnIds.map(id => sendRequest({ url: `/columns/${id}`, method: "GET" }));
        const columns = await Promise.all(columnPromises);

        const statusPromises = boardResponse.statusIds.map(id => sendRequest({ url: `/status/${id}`, method: "GET" }));
        const statuses = await Promise.all(statusPromises);
        setStatuses(statuses);

        const statusMap = statuses.reduce((acc, status) => {
            acc[status.id] = status;
            return acc;
        }, {});

        const mapColumns = (column) => ({
            ...column,
            statuses: column.statusIds.map(id => statusMap[id]),
        });

        let adminColumns = columns.filter(column => boardResponse.adminColumnIds.includes(column.id)).map(mapColumns);
        let employeeColumns = columns.filter(column => boardResponse.employeeColumnIds.includes(column.id)).map(mapColumns);

        adminColumns.push({
            id: "UNASSIGNED",
            title: "Unassigned statuses",
            statusIds: [
                ...new Set(
                    statuses
                        .map((status) => status.id)
                        .filter((id) => !adminColumns.flatMap((column) => column.statusIds).includes(id)),
                ),
            ],
            statuses: [
                ...new Set(
                    statuses.filter(
                        (status) => !adminColumns.flatMap((column) => column.statusIds).includes(status.id),
                    ),
                ),
            ],
        });

        employeeColumns.push({
            id: "UNASSIGNED",
            title: "Unassigned statuses",
            statusIds: [
                ...new Set(
                    statuses
                        .map((status) => status.id)
                        .filter((id) => !employeeColumns.flatMap((column) => column.statusIds).includes(id)),
                ),
            ],
            statuses: [
                ...new Set(
                    statuses.filter(
                        (status) => !employeeColumns.flatMap((column) => column.statusIds).includes(status.id),
                    ),
                ),
            ],
        });

        adminColumns.sort((a, b) => a.order - b.order);
        employeeColumns.sort((a, b) => a.order - b.order);

        setAdminColumns(adminColumns);
        setEmployeeColumns(employeeColumns);
        setBoardDetails({ ...boardResponse, adminColumns, employeeColumns });
    }, []);

    const updateStatusLocally = useCallback(
        (statusId, newColumnId, admin = true) => {
            const columns = admin ? adminColumns : employeeColumns;
            const setColumns = admin ? setAdminColumns : setEmployeeColumns;

            const updatedStatus = statuses.find((status) => status.id === statusId);

            if (!updatedStatus) return;

            const updatedColumns = columns.map((column) => {
                if (column.id === newColumnId) {
                    if (column.statusIds.includes(statusId)) return column;
                    return {
                        ...column,
                        statusIds: [...new Set([...column.statusIds, updatedStatus.id])],
                        statuses: [...new Set([...column.statuses, updatedStatus])],
                    };
                } else {
                    return {
                        ...column,
                        statusIds: [...new Set(column.statusIds.filter((id) => id !== statusId))],
                        statuses: [...new Set(column.statuses.filter((status) => status.id !== statusId))],
                    };
                }
            });

            setColumns(updatedColumns);
        },
        [adminColumns, employeeColumns, statuses],
    );

    const addColumn = useCallback(
        (column, admin = true) => {
            const columns = admin ? adminColumns : employeeColumns;
            const setColumns = admin ? setAdminColumns : setEmployeeColumns;

            const newColumns = [...columns, { ...column, statuses: [] }];
            newColumns.sort((a, b) => a.order - b.order);

            setColumns(newColumns);

            if (admin) {
                setBoardDetails((prev) => ({
                    ...prev,
                    adminColumns: newColumns,
                    adminColumnIds: newColumns.map((c) => c.id),
                }));
            } else {
                setBoardDetails((prev) => ({
                    ...prev,
                    employeeColumns: newColumns,
                    employeeColumnIds: newColumns.map((c) => c.id),
                }));
            }
        },
        [adminColumns, employeeColumns],
    );

    const deleteColumn = useCallback((columnId, admin = true) => {
        setBoardDetails((prev) => {
            const newBoard = { ...prev };
            if (admin) {
                newBoard.adminColumnIds = newBoard.adminColumnIds.filter((id) => id !== columnId);
                newBoard.adminColumns
                    .find((column) => column.id === "UNASSIGNED")
                    .statusIds.push(...newBoard.adminColumns.find((column) => column.id === columnId).statusIds);
                newBoard.adminColumns
                    .find((column) => column.id === "UNASSIGNED")
                    .statuses.push(...newBoard.adminColumns.find((column) => column.id === columnId).statuses);
                newBoard.adminColumns = newBoard.adminColumns.filter((column) => column.id !== columnId);

                const adminColumns = newBoard.adminColumns;
                adminColumns.sort((a, b) => a.order - b.order);
                setAdminColumns(adminColumns);
            } else {
                newBoard.employeeColumnIds = newBoard.employeeColumnIds.filter((id) => id !== columnId);
                newBoard.employeeColumns
                    .find((column) => column.id === "UNASSIGNED")
                    .statusIds.push(...newBoard.employeeColumns.find((column) => column.id === columnId).statusIds);
                newBoard.employeeColumns
                    .find((column) => column.id === "UNASSIGNED")
                    .statuses.push(...newBoard.employeeColumns.find((column) => column.id === columnId).statuses);
                newBoard.employeeColumns = newBoard.employeeColumns.filter((column) => column.id !== columnId);

                const employeeColumns = newBoard.employeeColumns;
                employeeColumns.sort((a, b) => a.order - b.order);
                setEmployeeColumns(employeeColumns);
            }
            return newBoard;
        });
    }, []);

    useEffect(() => {
        fetchBoardInfo();
    }, []);

    const value = useMemo(
        () => ({
            boardDetails,
            statuses,
            adminColumns,
            employeeColumns,
            updateBoard: fetchBoardInfo,
            updateStatus: updateStatusLocally,
            addColumn,
            deleteColumn,
        }),
        [
            boardDetails,
            statuses,
            adminColumns,
            employeeColumns,
            fetchBoardInfo,
            updateStatusLocally,
            addColumn,
            deleteColumn,
        ],
    );

    return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
};
