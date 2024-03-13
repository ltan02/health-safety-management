import Dashboard from "./Dashboard";
import { useAuthContext } from "../../../context/AuthContext";
import { useBoard } from "../../../context/BoardContext";
import { isPrivileged } from "../../../utils/permissions";
function AdminStatus() {
    const { user } = useAuthContext();
    const { adminColumns, employeeColumns, statuses, updateBoard, boardDetails } = useBoard();

    const columns = isPrivileged(user.role) ? adminColumns : employeeColumns;

    return (
        <div>
            <Dashboard columns={columns} state={statuses} updateBoard={updateBoard} boardId={boardDetails.id} />
        </div>
    );
}

export default AdminStatus;
