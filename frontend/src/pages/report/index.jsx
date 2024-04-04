import { Grid, Fab, Card, CardActionArea, CardContent, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Chatbot from "../../components/report/Chatbot.jsx";
import ChatIcon from "@mui/icons-material/Chat";
import Draggable from "react-draggable";
import { useEffect, useState } from "react";
import ReportChart from "../../components/report/ReportChart.jsx";
import ReportModal from "../../components/report/ReportModal.jsx";
import useDashboard from "../../hooks/useDashboard.js";

function ReportOverview() {
    const [chatbotVisible, setChatbotVisible] = useState(false);
    const toggleChatbot = () => {
        setChatbotVisible(!chatbotVisible);
    };

    const navigate = useNavigate();

    const handleClick = (i) => {
        if (dashData.length > i && dashData[i].type) {
            const typec = dashData[i].type.toLowerCase();
            const nav = `/report/${typec}`;
            navigate(nav);
        }
    };

    const [dashData, setDashData] = useState([]);
    const [newData, setNewData] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    const toggleModal = () => setOpenModal(!openModal);

    const { board, fetchBoards, loading } = useDashboard();
    const [boardId, setBoardId] = useState("");

    const refreshDashboard = () => {
        window.location.reload();
    };

    useEffect(() => {
        fetchBoards();
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
            />

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                    variant="contained"
                    onClick={() => {
                        toggleModal();
                        setNewData(dashData);
                    }}
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginBottom: "1rem",
                        fontWeight: "bold",
                    }}
                >
                    Edit Dashboard
                </Button>
            </div>
            <Grid container sx={{ p: 2 }}>
                {dashData.slice(0, 4).map((item, index) => (
                    <Grid
                        item
                        xs={6}
                        key={index}
                        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}
                        onClick={() => {
                            handleClick(index);
                        }}
                    >
                        <Card sx={{ maxWidth: 500, maxHeight: 450 }}>
                            <CardActionArea>
                                <CardContent>
                                    {item.type && (
                                        <ReportChart
                                            type={item.type}
                                            data={item}
                                            locked={true}
                                            height={250}
                                            width={350}
                                        />
                                    )}
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    );

    return (
        <div>
            <center>
                <h1>Dashboard</h1>
            </center>
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
