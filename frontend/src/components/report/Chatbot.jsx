import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';

const Chatbot = () => {
  const [messages, setMessages] = useState([{ text: "Hi! How can I help you today?", sender: "bot" }]);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const newMessages = [...messages, { text: newMessage, sender: "user" }];
    setMessages(newMessages);
    setNewMessage("");

    setTimeout(() => {
      const botResponse = { text: `You said: ${newMessage}`, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 1000);
  };

  return (
    <Paper sx={{
      height: 600, width: 500,  display: 'flex', flexDirection: 'column', p: 2,
      backgroundColor: '#f5f5f5', 
    }}>
      <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: '#fffffff' }}>
        Digital Assistant Bot
      </Typography>
      <List sx={{ mb: 2, overflow: 'auto' }}>
        {messages.map((message, index) => (
          <ListItem key={index} alignItems="flex-start" sx={{
            backgroundColor: message.sender === 'bot' ? '#e3f2fd' : '#c8e6c9', 
            mb: 1,
            borderRadius: '10px',
          }}>
            <ListItemText
              primary={message.sender === "bot" ? "Bot" : "You"}
              secondary={message.text}
              primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#424242' }} 
              secondaryTypographyProps={{ fontSize: '0.875rem', color: '#424242' }}
            />
          </ListItem>
        ))}
        <div ref={bottomRef} /> {/* add ref here so that I can scroll to bottom  */}
      </List>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          sx={{ mr: 1, backgroundColor: '#ffffff' }}
        />
        <Button variant="contained" onClick={handleSendMessage} sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115293' } }}> 
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default Chatbot;
