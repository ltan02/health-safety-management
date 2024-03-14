import { useState, useEffect } from "react";
import { Container, Box } from "@mui/material";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimation,
  rectIntersection,
} from "@dnd-kit/core";
import Column from "./Column";
import IncidentSearchInput from "./IncidentSearchInput";
import Task from "./Task";
import useTasks from "../../hooks/useTasks";
import useDragBehavior from "../../hooks/useDragBehavior";
import { useAuthContext } from "../../context/AuthContext";
import { isPrivileged } from "../../utils/permissions";
import useAxios from "../../hooks/useAxios";
import { useBoard } from "../../context/BoardContext";
import IncidentDetailModal from "./IncidentDetailModal";


function Dashboard() {
  const { tasks, filteredTasks, filterTasks, setTasks, fetchTasks } =
    useTasks();
  const { activeId, handleDragStart, handleDragOver, handleDragEnd } =
    useDragBehavior(tasks, setTasks);
  const { user } = useAuthContext();
  const { sendRequest } = useAxios();
  const { adminColumns, employeeColumns, statuses } = useBoard();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);


  const [employees, setEmployees] = useState([]);

  const unsortedColumns = isPrivileged(user.role)
    ? adminColumns
    : employeeColumns;
  const columns = unsortedColumns.sort((a, b) => a.order - b.order);

  const activeTask = activeId
    ? Object.values(tasks)
        .flat()
        .find((task) => task.id === activeId)
    : null;

  const handleAddTask = async (task) => {
    const directMapping = {
      timeOfIncident: "incidentDate",
      category: "incidentCategory",
      employeesInvolved: "employeesInvolved",
    };

    const incident = {
      reporter: user.id,
      incidentDate: task.timeOfIncident,
      incidentCategory: task.category,
      employeesInvolved: task.employeesInvolved,
      customFields: [],
      statusId: statuses.find((status) => status.name === "Pending Review")?.id,
    };

    for (const key in task) {
      if (
        Object.prototype.hasOwnProperty.call(task, key) &&
        !directMapping[key]
      ) {
        incident.customFields.push({
          fieldName: key,
          value: task[key],
        });
      }
    }

    await sendRequest({ url: "/incidents", method: "POST", body: incident });
    fetchTasks();
  };

  const refreshDashboard = () => {
    fetchTasks();
  };

  const handleOpenModal = (task) => {
    setIsModalOpen(true);
    setSelectedTask(task);
  }

  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await sendRequest({ url: "/users" });
      setEmployees(res);
    };

    fetchEmployees();
  }, []);

  return (
    <Container maxWidth="false" disableGutters>
      <IncidentSearchInput onSearch={filterTasks} isModalOpen={isModalOpen} filteredTasks={filteredTasks} handleOpenModal={handleOpenModal} />
      <DndContext
        sensors={useSensors(
          useSensor(PointerSensor, {
            activationConstraint: {
              distance: 4,
            },
          }),
        )}
        collisionDetection={rectIntersection}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
      >
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 2,
            p: 2,
            minHeight: "calc(100vh - 200px)",
            alignItems: "stretch",
          }}
        >
          {columns.map((column) => (
            <Box
              key={column.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Column
                id={column.id}
                title={column.name}
                tasks={tasks[column.id] || []}
                activeId={activeId}
                handleAddTask={handleAddTask}
                employees={employees}
                onRefresh={refreshDashboard}
              />
            </Box>
          ))}
        </Box>
        <DragOverlay dropAnimation={defaultDropAnimation}>
          {activeTask && (
            <Task
              id={activeId}
              task={activeTask}
              onRefresh={refreshDashboard}
            />
          )}
        </DragOverlay>
      </DndContext>
      {isModalOpen && selectedTask && (
                <IncidentDetailModal
                    incidentId={selectedTask.id}
                    open={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        refreshDashboard;
                    }}
                    onRefresh={refreshDashboard}
                />
            )}
    </Container>
  );
}

export default Dashboard;
