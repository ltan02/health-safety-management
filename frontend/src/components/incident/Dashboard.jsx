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
import useForm from "../../hooks/useForm";


function Dashboard() {
  const { tasks, filterTasks, setTasks, fetchTasks } =
    useTasks();
    
  const {forms, fetchForms, groupedByRows, sortedRows} = useForm();
  const { activeId, handleDragStart, handleDragOver, handleDragEnd } =
    useDragBehavior(tasks, setTasks);
  const { user } = useAuthContext();
  const { sendRequest } = useAxios();
  const { adminColumns, employeeColumns, statuses } = useBoard();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [fields, setFields] = useState({});


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
      incidentDate: "incidentDate",
      category: "incidentCategory",
      employees_involved: "employeesInvolved",
    };

    const incident = {
      reporter: user.id,
      incidentDate: task.incidentDate,
      incidentCategory: task.category,
      employeesInvolved: task.employees_involved,
      customFields: [],
      comments: [],
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

  const handleSort = () => {
    return sortedRows(groupedByRows(fields));
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await sendRequest({ url: "/users" });
      setEmployees(res);
    };
    fetchForms();
    fetchEmployees();
  }, []);

  useEffect(() => {
    // TODO: remove this when the form is selected from the form list
    setFields(forms["GZ4tf8bErd3rZ9YizFOu"]?.fields);
  }, [forms]);

  return (
    <Container maxWidth="false" disableGutters>
      <IncidentSearchInput onSearch={filterTasks} handleOpenModal={handleOpenModal} />
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
                field={fields}
                sortedRows={handleSort}
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
                    selectedIncident={selectedTask}
                />
            )}
    </Container>
  );
}

export default Dashboard;
