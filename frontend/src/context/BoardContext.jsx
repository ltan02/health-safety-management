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

    useEffect(() => {
        fetchBoardInfo();
    }, [fetchBoardInfo]);

    const value = useMemo(
        () => ({
            boardDetails,
            statuses,
            adminColumns,
            employeeColumns,
            updateBoard: fetchBoardInfo,
        }),
        [boardDetails, statuses, adminColumns, employeeColumns, fetchBoardInfo],
    );

    return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
};
