import { Grid, Fab, Divider, Typography } from "@mui/material";
import Chatbot from "../../components/report/Chatbot.jsx";
import ChatIcon from "@mui/icons-material/Chat";
import Draggable from "react-draggable";
import { useEffect, useState } from "react";
import ReportChart from "../../components/report/ReportChart.jsx";
import ReportModal from "../../components/report/ReportModal.jsx";
import useDashboard from "../../hooks/useDashboard.js";

function ReportOverview() {
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const calculateHeightByWindow = () => {
    const height = window.innerHeight;
    return height * 0.3;
  };

  const calculateWidthByWindow = () => {
    const width = window.innerWidth;
    return width * 0.3;
  };
  const [dimensions, setDimensions] = useState({
    height: calculateHeightByWindow(),
    width: calculateWidthByWindow(),
  });
  const toggleChatbot = () => {
    setChatbotVisible(!chatbotVisible);
  };

  const [dashData, setDashData] = useState([]);
  const [newData, setNewData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedVal, setSelectedVal] = useState(0);

  const toggleModal = () => setOpenModal(!openModal);

  const { board, fetchBoards, loading } = useDashboard();
  const [boardId, setBoardId] = useState("");

  const refreshDashboard = () => {
    window.location.reload();
  };

  const [name, setName] = useState("");
  const handleOpenEdit = (item, index) => {
    console.log("open edit");
    setSelectedVal(index);
    console.log(item);
    console.log(index);
    setName(item.name);
    toggleModal();
    setNewData(dashData);
    console.log(name);
  };

  useEffect(() => {
    fetchBoards();
    const handleResize = () => {
      setDimensions({
        height: calculateHeightByWindow(),
        width: calculateWidthByWindow(),
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (board.graphs) {
      setDashData(board.graphs);
      setNewData(board.graphs);
      setBoardId(board.id);
    }
  }, [loading]);

  const boardFn = (
    <>
      <ReportModal
        open={openModal}
        onClose={toggleModal}
        newData={newData}
        setNewData={setNewData}
        boardId={boardId}
        onRefresh={refreshDashboard}
        selectedVal={selectedVal}
        name={name}
      />

      <div
        style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
      ></div>
      <Grid container sx={{ p: 1 }}>
        {dashData.slice(0, 4).map((item, index) => (
          <Grid
            item
            xs={6}
            key={index}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
            gap={2}
            onClick={() => {
              handleOpenEdit(item, index);
            }}
          >
            {item.type && (
              <ReportChart
                type={item.type}
                data={item}
                locked={true}
                height={calculateHeightByWindow()}
                width={calculateWidthByWindow()}
              />
            )}
          </Grid>
        ))}
      </Grid>
    </>
  );

  return (
    <div>
      <Typography variant="h4" sx={{ mt: 5, mb: 2 }} fontWeight={600}>
        Report Overview
      </Typography>
      <Typography variant="body" sx={{ mt: 2 }}>
        This report overview page represents incident data through a series of
        customizable graphs. Each graph is fully editable—allowing users to
        modify the name, type, and data set by simply clicking on the graph. For
        additional insights and information, users are encouraged to interact
        with the integrated chatbot feature.
      </Typography>
      <Divider />
      {!loading && dashData.length !== 0 && boardFn}
      <Fab
        color="primary"
        aria-label="chat"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={toggleChatbot}
      >
        <ChatIcon />
      </Fab>
      {chatbotVisible && (
        <Draggable>
          <div
            style={{
              position: "absolute",
              bottom: 50,
              right: 50,
              zIndex: 1500,
              display: chatbotVisible ? "block" : "none",
            }}
          >
            <Chatbot />
          </div>
        </Draggable>
      )}
    </div>
  );
}

export default ReportOverview;
