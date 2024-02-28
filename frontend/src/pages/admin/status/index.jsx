import Dashboard from "./Dashboard";
import { initialWorkflows, STATE, COLUMNS } from "../initial_tasks";
function AdminStatus() {
  return (
    <div>
      <Dashboard initialTasks={initialWorkflows} columns={COLUMNS} state={STATE} />
    </div>
  );
}

export default AdminStatus;
