import Dashboard from "./Dashboard";
import { BOARD } from "../initial_tasks";
import { useAuthContext } from "../../../context/AuthContext";
import { useBoard } from "../../../context/BoardContext";
import { isPrivileged } from "../../../utils/permissions";
function AdminStatus() {
  const { user } = useAuthContext();
  const { adminColumns, employeeColumns, statuses } = useBoard()

  const columns = isPrivileged(user.role) ? adminColumns : employeeColumns;

  return (
    <div>
      <Dashboard initialWorkflows={BOARD} columns={columns} state={statuses} />
    </div>
  );
}

export default AdminStatus;
