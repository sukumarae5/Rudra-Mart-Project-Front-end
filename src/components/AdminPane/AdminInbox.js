import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Paper,
  TextField,
  IconButton,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";

const AdminInbox = () => {
  const [groupedMessages, setGroupedMessages] = useState({});
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [replyMessages, setReplyMessages] = useState({});
  const bottomRef = useRef(null);

  useEffect(() => {
    fetch("http://192.168.1.7:8081/api/admin/messages/all")
      .then((res) => res.json())
      .then((data) => {
        const grouped = data.reduce((acc, msg) => {
          const convId = msg.conversation_id;
          if (!acc[convId]) acc[convId] = [];
          acc[convId].push(msg);
          return acc;
        }, {});
        setGroupedMessages(grouped);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConvId, groupedMessages]);

  const handleReply = (userId, conversationId) => {
    const message = replyMessages[conversationId];
    if (!message) return;

    fetch("http://192.168.1.7:8081/api/messages/adminsend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender_name: "Admin",
        receiver: userId,
        message,
        conversation_id: conversationId,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setReplyMessages({ ...replyMessages, [conversationId]: "" });
        return fetch("http://192.168.1.7:8081/api/admin/messages/all");
      })
      .then((res) => res.json())
      .then((data) => {
        const grouped = data.reduce((acc, msg) => {
          const convId = msg.conversation_id;
          if (!acc[convId]) acc[convId] = [];
          acc[convId].push(msg);
          return acc;
        }, {});
        setGroupedMessages(grouped);
      })
      .catch((err) => console.error("Reply error:", err));
  };

  const conversations = Object.entries(groupedMessages);
  const selectedMessages = groupedMessages[selectedConvId] || [];

  const getUserInfo = (messages) => {
    const userMsg = messages.find((msg) => msg.sender !== null);
    return {
      userId: userMsg?.sender || messages[0]?.receiver,
      userName: userMsg?.sender_name || "User",
    };
  };

  return (
    <Box sx={{ height: "100vh", padding: 2 }}>
      <Grid container sx={{ height: "100%" }}>
        {/* Sidebar */}
        <Grid item xs={12} md={3} sx={{ borderRight: "1px solid #ccc" }}>
          <Typography variant="h6" sx={{ padding: 2, display: "flex", alignItems: "center" }}>
            <ChatIcon sx={{ marginRight: 1 }} /> Conversations
          </Typography>
          <Divider />
          <List>
            {conversations.map(([convId, msgs]) => {
              const { userName } = getUserInfo(msgs);
              return (
                <ListItem
                  button
                  key={convId}
                  selected={convId === selectedConvId}
                  onClick={() => setSelectedConvId(convId)}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={userName} />
                </ListItem>
              );
            })}
          </List>
        </Grid>

        {/* Chat Window */}
        <Grid item xs={12} md={9} sx={{ display: "flex", flexDirection: "column" }}>
          {selectedConvId ? (
            <>
              <Paper elevation={1} sx={{ padding: 2 }}>
                <Typography variant="subtitle1">
                  Chat with {getUserInfo(selectedMessages).userName}
                </Typography>
              </Paper>

              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  padding: 2,
                  backgroundColor: "#f9f9f9",
                }}
              >
                {selectedMessages.map((msg, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: msg.sender_name === "Admin" ? "flex-end" : "flex-start",
                      marginBottom: 1,
                    }}
                  >
                    <Box
                      sx={{
                        padding: 1,
                        borderRadius: 2,
                        backgroundColor: msg.sender_name === "Admin" ? "#1976d2" : "#e0e0e0",
                        color: msg.sender_name === "Admin" ? "#fff" : "#000",
                        maxWidth: "70%",
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {msg.sender_name}
                      </Typography>
                      <Typography variant="body1">{msg.message}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(msg.created_at).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                <div ref={bottomRef} />
              </Box>

              {/* Input Field */}
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const { userId } = getUserInfo(selectedMessages);
                  handleReply(userId, selectedConvId);
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: 2,
                  borderTop: "1px solid #ccc",
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type a message"
                  value={replyMessages[selectedConvId] || ""}
                  onChange={(e) =>
                    setReplyMessages({
                      ...replyMessages,
                      [selectedConvId]: e.target.value,
                    })
                  }
                />
                <IconButton type="submit" color="primary" sx={{ ml: 1 }}>
                  <SendIcon />
                </IconButton>
              </Box>
            </>
          ) : (
            <Box sx={{ margin: "auto", color: "gray" }}>
              <Typography variant="h6" align="center">
                Select a conversation to start chatting
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminInbox;
