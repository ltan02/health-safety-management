import { Grid,  Fab, Card, CardActionArea, CardContent, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Chatbot from "../../components/report/Chatbot.jsx";
import ChatIcon from "@mui/icons-material/Chat";
import Draggable from "react-draggable";
import { useEffect, useState } from "react";
import ReportChart from "../../components/report/ReportChart.jsx";
import ReportModal from "../../components/report/ReportModal.jsx";
import useAxios from "../../hooks/useAxios.js";
import { useAuthContext } from "../../context/AuthContext.jsx";
import useDashboard from "../../hooks/useDashboard.js";
import { dashboardData } from "./initialData.js";

function ReportOverview() {
    const [chatbotVisible, setChatbotVisible] = useState(false);
    const toggleChatbot = () => {
        setChatbotVisible(!chatbotVisible);
    };

    const navigate = useNavigate();

    const handleClick = (i) => {
        const typec = dashData[i].type
        typec.toLowerCase();
        const nav = `/report/${typec}`;
        navigate(nav);
    };

    const [dashData, setDashData] = useState(dashboardData);
    const [newData, setNewData] = useState(dashboardData);
    const [openModal, setOpenModal] = useState(false);

    const toggleModal = () => setOpenModal(!openModal);


    const {board, fetchBoards, loading} = useDashboard();
    const [boardId, setBoardId] = useState("");
    
    const refreshDashboard = () => {
        fetchBoards();
        fetchBoards();

    };
    
    useEffect(() => {
        fetchBoards();
    },[]);

    useEffect (() => {
        if(board.graphs) {
            setDashData(board.graphs);
            setNewData(board.graphs)
            setBoardId(board.id);   
        }   
    }, [board])

    return (
        <div>
            <center><h1>Dashboard</h1></center>
            <ReportModal open={openModal} onClose={toggleModal} newData={newData} setNewData={setNewData} boardId={boardId} onRefresh={refreshDashboard}/>
            <div style={{display: "flex", justifyContent: 'flex-end'}}>
                    <Button variant="contained" onClick={() => {
                        toggleModal();
                        setNewData(dashData);
                    }}
                    style={{display: 'flex', justifyContent: 'flex-end', marginBottom: "1rem",
                        fontWeight: "bold"}}>
                        Edit Dashboard
                    </Button>
                </div>
            <Grid container sx={{ p: 2 }}>
                <Grid
                    item
                    xs={6}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}
                    onClick={() => {
                        handleClick(0);
                    }}
                >
                    <Card sx={{ maxWidth: 500, maxHeight: 450 }}>
                        <CardActionArea>
                            <CardContent>
                                <ReportChart type={dashData[0].type} val={dashData[0].field} start={dashData[0].start} end={dashData[0].end} locked={true} height={250} width={350}/>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid
                    item
                    xs={6}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}
                    onClick={() => {
                        handleClick(1);
                    }}
                >
                    <Card sx={{ maxWidth: 500, maxHeight: 450 }}>
                        <CardActionArea>
                            <CardContent>
                                <ReportChart type={dashData[1].type} val={dashData[1].field} start={dashData[1].start} end={dashData[1].end} locked={true} height={250} width={350}/>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    
                </Grid>
            </Grid>
            <Grid container sx={{ p: 2 }}>
                <Grid
                    item
                    xs={6}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}
                    onClick={() => {
                        handleClick(2);
                    }}
                >
                    <Card sx={{ maxWidth: 500, maxHeight: 450 }}>
                        <CardActionArea>
                            <CardContent>
                                <ReportChart type={dashData[2].type} val={dashData[2].field} start={dashData[2].start} end={dashData[2].end} locked={true} height={250} width={350}/>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid
                    item
                    xs={6}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}
                    onClick={() => {
                        handleClick(3);
                    }}
                >
                    <Card sx={{ maxWidth: 500, maxHeight: 450 }}>
                        <CardActionArea>
                            <CardContent>
                                <ReportChart type={dashData[3].type} val={dashData[3].field} start={dashData[3].start} end={dashData[3].end} locked={true} height={250} width={350}/>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    
                </Grid>
            </Grid>
            <Fab
                color="primary"
                aria-label="chat"
                sx={{ position: "fixed", bottom: 16, right: 16 }}
                onClick={toggleChatbot}
            >
                <ChatIcon />
            </Fab>
            {
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
            }   
        </div>
    );
}

export default ReportOverview;
