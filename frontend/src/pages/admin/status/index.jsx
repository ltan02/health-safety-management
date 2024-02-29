import Dashboard from "./Dashboard";
import { BOARD, STATE, COLUMNS } from "../initial_tasks";
function AdminStatus() {
  return (
    <div>
      <Dashboard initialWorkflows={BOARD} columns={COLUMNS} state={STATE} />
    </div>
  );
}

export default AdminStatus;
