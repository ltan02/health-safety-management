import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";

import { STATE } from "../initial_tasks";

function getStatusIcon(status) {
  switch (status) {
    case STATE.DONE:
      return <CheckCircleOutlineIcon color="success" />;
    case STATE.INPROGRESS:
      return <PlayCircleOutlineIcon color="secondary" />;
    case STATE.TODO:
      return <HourglassEmptyIcon color="error" />;
    case STATE.INACTIVE:
    default:
      return <ReportProblemOutlinedIcon color="action" />;
  }
}

function dateToString(date) {
  return new Date(date).toLocaleDateString();
}

function CustomCell({ title }) {
  return (
    <TableCell>
      <Typography variant="subtitle2">{title}</Typography>
    </TableCell>
  );
}

function Workflow({ tasks = [] }) {
  return (
    <div>
      {tasks.length === 0 ? (
        <Typography variant="h4" gutterBottom>
          No Data
        </Typography>
      ) : (
        <TableContainer sx={{ minHeight: "50vh" }}>
          <Table aria-label="simple table" sx={{ width: "80vw" }}>
            <TableHead>
              <TableRow>
                <CustomCell title="Id" />
                <CustomCell title="Title" />
                <CustomCell title="Status" />
                <CustomCell title="Assignee" />
                <CustomCell title="Description" />
                <CustomCell title="Last Updated" />
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2" noWrap>
                      {task.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {task.title}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ display: "flex", alignItems: "center" }}>
                    <ListItemIcon>{getStatusIcon(task.status)}</ListItemIcon>
                    <Typography variant="body2" noWrap>
                      {task.status}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {task.assignee}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    <Typography variant="body2" title={task.description}>
                      {task.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {dateToString(task.deadline)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

export default Workflow;
