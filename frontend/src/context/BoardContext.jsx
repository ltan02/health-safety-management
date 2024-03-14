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

        const fetchColumns = async (columnIds) => {
            const columnPromises = columnIds.map((id) => sendRequest({ url: `/columns/${id}`, method: "GET" }));
            const columns = await Promise.all(columnPromises);

            const statusIds = [...new Set(columns.flatMap((column) => column.statusIds))];
            const statusPromises = statusIds.map((id) => sendRequest({ url: `/status/${id}`, method: "GET" }));
            const statuses = await Promise.all(statusPromises);

            return columns.map((column) => ({
                ...column,
                statuses: column.statusIds.map((id) => statuses.find((status) => status.id === id)),
            }));
        };

        const fetchStatus = async (statusIds) => {
            const statusPromises = statusIds.map((id) => sendRequest({ url: `/status/${id}`, method: "GET" }));
            const statuses = await Promise.all(statusPromises);
            setStatuses(statuses);
        };

        const [adminColumns, employeeColumns] = await Promise.all([
            fetchColumns(boardResponse.adminColumnIds),
            fetchColumns(boardResponse.employeeColumnIds),
            fetchStatus(boardResponse.statusIds),
        ]);

        setAdminColumns(adminColumns);
        setEmployeeColumns(employeeColumns);
        setBoardDetails({ ...boardResponse, adminColumns, employeeColumns });
    }, []);

    const updateStatusLocally = useCallback((statusId, newColumnId, admin = true) => {
        const columns = admin ? adminColumns : employeeColumns;
        const setColumns = admin ? setAdminColumns : setEmployeeColumns;
    
        const updatedStatus = statuses.find(status => status.id === statusId);
    
        if (!updatedStatus) return;
    
        const updatedColumns = columns.map(column => {
            if (column.id === newColumnId) {
                return {
                    ...column,
                    statusIds: [...new Set([...column.statusIds, updatedStatus.id])],
                    statuses: [...new Set([...column.statuses, updatedStatus])],
                };
            } else {
                return {
                    ...column,
                    statusIds: [...new Set(column.statusIds.filter(id => id !== statusId))],
                    statuses: [...new Set(column.statuses.filter(status => status.id !== statusId))],
                };
            }
        });

        setColumns(updatedColumns);
    }, [adminColumns, employeeColumns, statuses]); 

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
        }),
        [boardDetails, statuses, adminColumns, employeeColumns, fetchBoardInfo, updateStatusLocally],
    );

    return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
};
