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

// function getStatusIcon(status) {
//   switch (status) {
//     case STATE.DONE:
//       return <CheckCircleOutlineIcon color="success" />;
//     case STATE.INPROGRESS:
//       return <PlayCircleOutlineIcon color="secondary" />;
//     case STATE.TODO:
//       return <HourglassEmptyIcon color="error" />;
//     case STATE.INACTIVE:
//     default:
//       return <ReportProblemOutlinedIcon color="action" />;
//   }
// }

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
function Workflow({ workflows = [] }) {
  return (
    <div>
      {workflows.length === 0 ? (
        <Typography variant="h4" gutterBottom>
  
        </Typography>
      ) : (
        <TableContainer sx={{ minHeight: "50vh" }}>
          <Table aria-label="workflow table" sx={{ width: { xs: "100%", sm: "80vw" } }}>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="subtitle2">Id</Typography></TableCell>
                <TableCell><Typography variant="subtitle2">Title</Typography></TableCell>
                <TableCell><Typography variant="subtitle2">Included in Projects</Typography></TableCell>
                <TableCell><Typography variant="subtitle2">Included in Workflow Schemes</Typography></TableCell>
                <TableCell><Typography variant="subtitle2">Last Updated</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workflows.map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {workflow.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {workflow.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {workflow.projectIncluded.length === 0 ? "NOT IN USE" : workflow.projectIncluded.join(", ")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap>
                    {workflow.schemeIncluded.length === 0 ? "NOT IN USE" : workflow.schemeIncluded.join(", ")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {new Date(workflow.lastUpdated).toLocaleDateString()}
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
