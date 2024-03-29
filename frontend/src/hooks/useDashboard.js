import { useState } from "react";
import useAxios from "./useAxios";
import { useAuthContext } from "../context/AuthContext";


export default function useDashboard() {
  const [board, setBoard] = useState([]);

  const { sendRequest, loading } = useAxios();
  const {user} = useAuthContext();

  const fetchBoards = async () => {
    const response = await sendRequest({
      url: `/dashboard/${user.id}`,
      method: "GET",
    });
    setBoard(response);
  };

  const updateBoard = async (boardId, graphs) => {
    try {
      if (!boardId || !graphs) {
        console.log(boardId, graphs)
        console.error("Invalid input");
        return;
      }
      const response = await sendRequest({
        url: `/dashboard/${boardId}`,
        method: "POST",
        body: graphs,
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  return {
    fetchBoards,
    board,
    loading,
    updateBoard,
  };
}
