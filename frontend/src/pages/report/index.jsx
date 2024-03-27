import { Grid,  Fab, Card, CardActionArea, CardContent, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Chatbot from "../../components/report/Chatbot.jsx";
import ChatIcon from "@mui/icons-material/Chat";
import Draggable from "react-draggable";
import { useState } from "react";
import ReportChart from "../../components/report/ReportChart.jsx";
import ReportModal from "../../components/report/ReportModal.jsx";

function ReportOverview() {
    const [chatbotVisible, setChatbotVisible] = useState(false);
    const toggleChatbot = () => {
        setChatbotVisible(!chatbotVisible);
    };

    const navigate = useNavigate();

    const handleBarClick = () => {
        navigate("/report/bar");
    };

    const handleScatterClick = () => {
        navigate("/report/scatter");
    };

    const handleLineClick = () => {
        navigate("/report/line");
    };

    const handlePieClick = () => {
        navigate("/report/pie");
    };

    const [dashData, setDashData] = useState([
        {
            type: "Bar",
            field: "category",
            start: null,
            end: null
        }, 
        {
            type: "Line",
            field: "reporter",
            start: null,
            end: null
        },
        {
            type: "Pie",
            field: "status",
            start: null,
            end: null
        }, 
        {
            type: "Scatter",
            field: "date",
            start: null,
            end: null
        } 
    ]);

    const [openModal, setOpenModal] = useState(false);

    const toggleModal = () => setOpenModal(!openModal);

    console.log(dashData)

    return (
        <div>
            <center><h1>Dashboard</h1></center>
            <ReportModal open={openModal} onClose={toggleModal} data={dashData} setDashData={setDashData}/>
            <div style={{display: "flex", justifyContent: 'flex-end'}}>
                    <Button variant="contained" onClick={toggleModal}
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
                    onClick={handleBarClick}
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
                    onClick={handleLineClick}
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
                    onClick={handleScatterClick}
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
                    onClick={handlePieClick}
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
