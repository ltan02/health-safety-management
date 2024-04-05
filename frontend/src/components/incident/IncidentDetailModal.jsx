import { useState, useEffect } from "react";
import { Modal, Box, IconButton, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useAxios from "../../hooks/useAxios";
import { useAuthContext } from "../../context/AuthContext";
import { useBoard } from "../../context/BoardContext";
import { isPrivileged } from "../../utils/permissions";
import StatusModal from "./StatusModal";
import IncidentDetailField from "./IncidentDetailField";
import IncidentDetailBasicField from "./IncidentDetailBasicField";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70vw",
  maxHeight: "80vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  border: "2px solid",
  borderColor: "#7D7D7D",
};

export default function IncidentDetailModal({
  selectedIncident,
  open,
  onClose,
  onRefresh,
  commentData,
  setTasks,
}) {
  const { sendRequest, loading, sendAIRequest } = useAxios();
  const { user } = useAuthContext();
  const { statuses, adminColumns, employeeColumns } = useBoard();

  const [incident, setIncident] = useState(selectedIncident);
  const [incidentState, setIncidentState] = useState(
    selectedIncident?.statusId
  );
  const [openReviewer, setOpenReviewer] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isStatusModalOpen, setStatusModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [editingCustomField, setEditingCustomField] = useState(null);
  const [customField, setCustomField] = useState({});
  const [oldField, setOldField] = useState({});
  const [reviewer, setReviewer] = useState(null);
  const [openReporter, setOpenReporter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Object.keys(incident?.customFields ?? {}).map((fieldName) => {
      setCustomField((prev) => ({
        ...prev,
        [fieldName]: incident.customFields[fieldName],
      }));
      setOldField((prev) => ({
        ...prev,
        [fieldName]: incident.customFields[fieldName],
      }));
    });
    setReviewer(incident?.reviewer);
  }, []);

  if (!incident) return <></>;

  const handleStateChange = async (event) => {
    const newStateId = event.target.value;

    await sendRequest({
      url: `/incidents/${incident.id}`,
      method: "POST",
      body: {
        statusId: newStateId,
      },
    });

    const oldStatusId = incident.statusId;
    const newIncident = {
      ...incident,
      statusId: newStateId,
    };

    setIncident(newIncident);
    setIncidentState(newStateId);

    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      const columns = isPrivileged(user.role) ? adminColumns : employeeColumns;

      const currentColumn = columns.find((column) =>
        column.statusIds.includes(oldStatusId)
      ).id;
      const newColumn = columns.find((column) =>
        column.statusIds.includes(newStateId)
      ).id;

      updatedTasks[currentColumn] = updatedTasks[currentColumn].filter(
        (task) => task.id !== incident.id
      );
      updatedTasks[newColumn].push(newIncident);

      Object.keys(updatedTasks).forEach((key) => {
        updatedTasks[key] = updatedTasks[key].sort(
          (a, b) => new Date(a.incidentDate) - new Date(b.incidentDate)
        );
      });

      return updatedTasks;
    });
    setStatusModalOpen(true);
  };

  const handleSwitchReviewer = async (reviewerId) => {
    try {
      await sendRequest({
        url: `/incidents/${incident.id}/reviewer/${reviewerId}`,
        method: "POST",
      });

      const newIncident = {
        ...incident,
        reviewer: employees.find((employee) => employee.id === reviewerId),
      };

      setIncident(newIncident);

      setReviewer(employees.find((employee) => employee.id === reviewerId));

      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        const columns = isPrivileged(user.role)
          ? adminColumns
          : employeeColumns;

        const columnId = columns.find((column) =>
          column.statusIds.includes(incidentState)
        ).id;

        updatedTasks[columnId] = updatedTasks[columnId].filter(
          (task) => task.id !== incident.id
        );
        updatedTasks[columnId].push(newIncident);

        Object.keys(updatedTasks).forEach((key) => {
          updatedTasks[key] = updatedTasks[key].sort(
            (a, b) => new Date(a.incidentDate) - new Date(b.incidentDate)
          );
        });

        return updatedTasks;
      });
    } catch (error) {
      console.error(error);
    }
    setOpenReviewer(false);
    // onClose();
  };

  const handleSwitchReporter = async (reporterId) => {
    try {
      await sendRequest({
        url: `/incidents/${incident.id}/reporter/${reporterId}`,
        method: "POST",
      });

      const newIncident = {
        ...incident,
        reporter: employees.find((employee) => employee.id === reporterId),
      };

      setIncident(newIncident);

      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        const columns = isPrivileged(user.role)
          ? adminColumns
          : employeeColumns;

        const columnId = columns.find((column) =>
          column.statusIds.includes(incidentState)
        ).id;

        updatedTasks[columnId] = updatedTasks[columnId].filter(
          (task) => task.id !== incident.id
        );
        updatedTasks[columnId].push(newIncident);

        Object.keys(updatedTasks).forEach((key) => {
          updatedTasks[key] = updatedTasks[key].sort(
            (a, b) => new Date(a.incidentDate) - new Date(b.incidentDate)
          );
        });

        return updatedTasks;
      });
    } catch (error) {
      console.error(error);
    }
    setOpenReporter(false);
    // onClose();
  };

  const fetchEmployees = async (privileged) => {
    const response = await sendRequest({
      url: "/users",
      method: "GET",
    });
    if (!privileged) {
      setEmployees(response);
      return;
    } else {
      setEmployees(response.filter((employee) => isPrivileged(employee.role)));
    }
  };

  const handleOpenEmployeesListModal = async ({ e, privileged }) => {
    setAnchorEl(e.currentTarget);
    await fetchEmployees(privileged);
  };

  const handleUpdateEmployeesInvolved = async (employees) => {
    const involvedEmployees = employees.map((employee) => employee.id);

    await sendRequest({
      url: `/incidents/${incident.id}/employees_involved`,
      method: "PUT",
      body: {
        employeesInvolved: involvedEmployees,
      },
    });

    const newInvolvedEmployees = employees.filter((employee) =>
      involvedEmployees.includes(employee.id)
    );
    console.log(newInvolvedEmployees);

    const newIncident = {
      ...incident,
      employeesInvolved: newInvolvedEmployees,
    };

    setIncident(newIncident);

    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      const columns = isPrivileged(user.role) ? adminColumns : employeeColumns;

      const columnId = columns.find((column) =>
        column.statusIds.includes(incidentState)
      ).id;
      updatedTasks[columnId] = updatedTasks[columnId].filter(
        (task) => task.id !== incident.id
      );
      updatedTasks[columnId].push(newIncident);

      Object.keys(updatedTasks).forEach((key) => {
        updatedTasks[key] = updatedTasks[key].sort(
          (a, b) => new Date(a.incidentDate) - new Date(b.incidentDate)
        );
      });

      return updatedTasks;
    });
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleClose = () => {
    setOpenReviewer(false);
    setOpenReporter(false);
    setAnchorEl(null);
  };

  const toggleStatusModal = () => {
    setStatusModalOpen(!isStatusModalOpen);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment) {
      return;
    }

    setComment("");

    const response = await sendRequest({
      url: `/incidents/${incident.id}/comments`,
      method: "POST",
      body: {
        content: comment,
      },
    });

    const newIncident = {
      ...incident,
      comments: response.comments,
    };

    setIncident(newIncident);

    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      const columns = isPrivileged(user.role) ? adminColumns : employeeColumns;

      const columnId = columns.find((column) =>
        column.statusIds.includes(incidentState)
      ).id;

      updatedTasks[columnId] = updatedTasks[columnId].filter(
        (task) => task.id !== incident.id
      );
      updatedTasks[columnId].push(newIncident);

      Object.keys(updatedTasks).forEach((key) => {
        updatedTasks[key] = updatedTasks[key].sort(
          (a, b) => new Date(a.incidentDate) - new Date(b.incidentDate)
        );
      });

      return updatedTasks;
    });
  };

  const handleEditCustomField = (fieldName) => {
    if (editingCustomField === fieldName) {
      return;
    }
    setEditingCustomField(fieldName);
  };

  const handleSaveChanges = async () => {
    const updatedField = [];
    if (customField?.description) {
      setIsLoading(true);
    }
    try {
      Object.keys(customField).map((fieldName) => {
        if (customField[fieldName] !== oldField[fieldName]) {
          updatedField.push({ fieldName, value: customField[fieldName] });
        }
      });
      await sendRequest({
        url: `/incidents/${incident.id}/fields`,
        method: "PUT",
        body: {
          customFields: updatedField,
        },
      });

      const newIncident = {
        ...incident,
        customFields: {
          ...customField,
        },
      };

      if (customField?.description) {
        const res = await sendAIRequest({
          url: "/categorize/",
          method: "POST",
          body: {
            incident: customField.description,
          },
        });
        await sendRequest({
          url: `/incidents/${incident.id}/category`,
          method: "PUT",
          body: {
            incidentCategory: res.response,
          },
        });

        newIncident.incidentCategory = res.response;
      }

      setOldField(customField);
      setIncident(newIncident);

      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        const columns = isPrivileged(user.role)
          ? adminColumns
          : employeeColumns;

        const columnId = columns.find((column) =>
          column.statusIds.includes(incidentState)
        ).id;

        updatedTasks[columnId] = updatedTasks[columnId].filter(
          (task) => task.id !== incident.id
        );
        updatedTasks[columnId].push(newIncident);

        Object.keys(updatedTasks).forEach((key) => {
          updatedTasks[key] = updatedTasks[key].sort(
            (a, b) => new Date(a.incidentDate) - new Date(b.incidentDate)
          );
        });

        return updatedTasks;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
    setEditingCustomField(null);
  };

  const handleCancelChanges = () => {
    //not updated
    setEditingCustomField(null);
    setCustomField(oldField);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="issue-detail-modal"
      aria-describedby="issue-details"
    >
      <Box sx={modalStyle}>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "flex-end",
          }}
        >
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <StatusModal
          isStatusModalOpen={isStatusModalOpen}
          toggleStatusModal={toggleStatusModal}
        />
        <Box
          sx={{
            display: "flex",
            width: "100%",
          }}
        >
          <IncidentDetailField
            incident={incident}
            user={user}
            commentData={commentData}
            incidentId={incident.id}
            customField={customField}
            handleAddComment={handleAddComment}
            handleEditCustomField={handleEditCustomField}
            editingCustomField={editingCustomField}
            setCustomField={setCustomField}
            handleSaveChanges={handleSaveChanges}
            handleCancelChanges={handleCancelChanges}
            comment={comment}
            setComment={setComment}
            loading={loading || isLoading}
          />
          <IncidentDetailBasicField
            incident={incident}
            user={user}
            reviewer={reviewer}
            handleOpenEmployeesListModal={handleOpenEmployeesListModal}
            employees={employees}
            fetchEmployees={fetchEmployees}
            handleSwitchReviewer={handleSwitchReviewer}
            openReviewer={openReviewer}
            anchorEl={anchorEl}
            handleClose={handleClose}
            statuses={statuses}
            handleStateChange={handleStateChange}
            incidentState={incidentState}
            open={open}
            onClose={onClose}
            onRefresh={onRefresh}
            handleSwitchReporter={handleSwitchReporter}
            setOpenReporter={setOpenReporter}
            setOpenReviewer={setOpenReviewer}
            handleUpdateEmployeesInvolved={handleUpdateEmployeesInvolved}
            openReporter={openReporter}
            loading={loading}
          />
          <CircularProgress
            sx={{
              position: "fixed",
              top: "10%",
              left: "90%",
              display: loading ? "block" : "none",
            }}
          />
        </Box>
      </Box>
    </Modal>
  );
}
