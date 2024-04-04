import { useState, useEffect, useRef } from "react";
import { Box, TextField, Button, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import useAxios from "../../hooks/useAxios";
import "./Chatbot.css";

const randomID = Math.random();
const Chatbot = () => {
    const [messages, setMessages] = useState([
        {
            text: "Hello! I'm here to help you navigate through incident data, provide insights, and answer your questions related to workplace incidents, safety measures, and more.",
            sender: "bot",
        },
    ]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const { sendAIRequest } = useAxios();

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async () => {
        setLoading(true);
        if (!newMessage.trim()) return;
        setMessages((prev) => [...prev, { text: newMessage, sender: "user" }, { text: undefined, sender: "bot" }]);
        setNewMessage("");
        const response = await sendAIRequest({
            url: "/chat",
            method: "POST",
            body: { prompt: newMessage },
            id: randomID,
        });
        setMessages((prevMessages) => {
            prevMessages.pop();
            return [...prevMessages, { text: response.response, sender: "bot" }];
        });
        setLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
            e.preventDefault();
        }
    };

    return (
        <Paper
            sx={{
                height: 600,
                width: 500,
                display: "flex",
                flexDirection: "column",
                p: 2,
                backgroundColor: "#f5f5f5",
            }}
        >
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: "#fffffff" }}>
                Digital Assistant Bot
            </Typography>
            <List sx={{ mb: 2, overflow: "auto" }}>
                {messages.map((message, index) => (
                    <ListItem
                        key={index}
                        alignItems="flex-start"
                        sx={{
                            backgroundColor: message.sender === "bot" ? "#e3f2fd" : "#c8e6c9",
                            mb: 1,
                            borderRadius: "10px",
                        }}
                    >
                        {message.sender === "bot" && message.text === undefined ? (
                            <ListItemText
                                primary="Bot"
                                secondary={<div className="dot-flashing" />}
                                primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: "bold", color: "#424242" }}
                                secondaryTypographyProps={{ fontSize: "0.875rem", color: "#424242" }}
                            />
                        ) : (
                            <ListItemText
                                primary={message.sender === "bot" ? "Bot" : "You"}
                                secondary={message.text}
                                primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: "bold", color: "#424242" }}
                                secondaryTypographyProps={{ fontSize: "0.875rem", color: "#424242" }}
                            />
                        )}
                    </ListItem>
                ))}
                <div ref={bottomRef} />
            </List>
            <Box sx={{ display: "flex", alignItems: "center", mt: "auto" }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type your message here..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    sx={{ mr: 1, backgroundColor: "#ffffff" }}
                />
                <Button
                    variant="contained"
                    onClick={handleSendMessage}
                    sx={{ backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#115293" } }}
                >
                    Send
                </Button>
            </Box>
        </Paper>
    );
};

export default Chatbot;
