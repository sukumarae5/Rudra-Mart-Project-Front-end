// AdminInbox.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Badge,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import moment from "moment";

const AdminInbox = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [allMessages, setAllMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");
  const ws = useRef(null);
  const messageBoxRef = useRef(null);

  const adminId = 2;
  const adminName = "admin";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchConversations = async () => {
      const res = await fetch("http://192.168.1.10:8081/api/admin/messages/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const convs = await res.json();
      const withHistory = await Promise.all(
        convs.map(async (conv) => {
          const convId = `user-${conv.sender}-admin`;
          const r2 = await fetch(
            `http://192.168.1.10:8081/api/user/messages/${convId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const msgs = await r2.json();
          return { ...conv, messages: Array.isArray(msgs) ? msgs : [] };
        })
      );
      setConversations(withHistory);
    };

    fetchConversations();

    ws.current = new WebSocket("ws://192.168.1.10:8081");
    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({ type: "init", userId: adminId }));
    };
    ws.current.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      const isAdminSender = msg.sender === adminId || msg.sender_id === adminId;

      setTimeout(() => {
        setConversations((prev) =>
          prev.map((c) => {
            if (c.sender === msg.sender_id || c.sender === msg.receiver_id) {
              const updatedMessages = [...c.messages, msg];
              return {
                ...c,
                last_message: msg.message,
                is_read: selectedUser?.id === msg.sender,
                messages: updatedMessages,
              };
            }
            return c;
          })
        );

        if (selectedUser && msg.conversation_id === `user-${selectedUser.id}-admin`) {
          setAllMessages((prev) => [...prev, msg]);
        }
      }, isAdminSender ? 0 : 2000);
    };

    return () => ws.current?.close();
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      const conv = conversations.find((c) => c.sender === selectedUser.id);
      setAllMessages(conv?.messages || []);
    }
  }, [selectedUser, conversations]);

  useEffect(() => {
    messageBoxRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  const handleSelect = (conv) => {
    setSelectedUser({ id: conv.sender, name: conv.sender_name });
    setConversations((prev) =>
      prev.map((c) => (c.sender === conv.sender ? { ...c, is_read: true } : c))
    );
  };

  const handleSendMessage = () => {
    if (!msgInput.trim() || !selectedUser) return;

    const newMsg = {
      sender_id: adminId,
      sender_name: adminName,
      receiver_id: selectedUser.id,
      message: msgInput.trim(),
      conversation_id: `user-${selectedUser.id}-admin`,
      is_read: false,
    };
    ws.current.send(JSON.stringify(newMsg));

    const newMsgWithTime = { ...newMsg, created_at: new Date().toISOString() };

    setAllMessages((prev) => [...prev, newMsgWithTime]);
    setConversations((prev) =>
      prev.map((c) =>
        c.sender === selectedUser.id
          ? {
              ...c,
              last_message: newMsg.message,
              messages: [...c.messages, newMsgWithTime],
            }
          : c
      )
    );

    setMsgInput("");
  };

  const deduped = Array.from(new Map(conversations.map((c) => [c.sender, c])).values()).sort(
    (a, b) => new Date(b.messages.at(-1)?.created_at || 0) - new Date(a.messages.at(-1)?.created_at || 0)
  );

  const displayedMessages = selectedUser
    ? allMessages
        .filter((m) => m.conversation_id === `user-${selectedUser.id}-admin`)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    : [];

  const groupedMessages = displayedMessages.reduce((acc, msg) => {
    const dateLabel = moment(msg.created_at).calendar(null, {
      sameDay: "[Today]",
      lastDay: "[Yesterday]",
      lastWeek: "dddd",
      sameElse: "DD/MM/YYYY",
    });
    if (!acc[dateLabel]) acc[dateLabel] = [];
    acc[dateLabel].push(msg);
    return acc;
  }, {});

  return (
    <Box display="flex" height="90vh" boxShadow={3}>
      {/* Sidebar */}
      <Paper sx={{ width: 300, overflowY: "auto" }}>
        <Box p={2}>
          <Typography variant="h6">Inbox</Typography>
        </Box>
        <Divider />
        <List>
          {deduped.map((conv, i) => {
            const isSelected = selectedUser?.id === conv.sender;
            const hasUnread = conv.messages?.some(
              (m) => !m.is_read && m.sender === conv.sender
            );
            return (
              <ListItem key={i} disablePadding>
                <ListItemButton selected={isSelected} onClick={() => handleSelect(conv)}>
                  <ListItemIcon>
                    <Badge color="secondary" variant="dot" invisible={!hasUnread} overlap="circular">
                      <Avatar>{conv.sender_name?.[0]?.toUpperCase()}</Avatar>
                    </Badge>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography fontWeight={hasUnread ? "bold" : "normal"}>
                        {conv.sender_name}
                      </Typography>
                    }
                    secondary={conv.last_message || ""}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Paper>

      {/* Chat Window */}
      <Box flex={1} display="flex" flexDirection="column">
        <Box p={2} bgcolor="#f5f5f5" borderBottom="1px solid #ddd">
          <Typography variant="h6">
            {selectedUser ? `Chat with ${selectedUser.name}` : "Select a conversation"}
          </Typography>
        </Box>

        <Box flex={1} p={2} overflow="auto">
          {Object.entries(groupedMessages).map(([date, msgs]) => (
            <Box key={date}>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "center",
                  my: 2,
                  color: "#888",
                }}
              >
                {date}
              </Typography>
              {msgs.map((msg, idx) => (
                <Box
                  key={idx}
                  display="flex"
                  justifyContent={
                    msg.sender === adminId || msg.sender_id === adminId
                      ? "flex-end"
                      : "flex-start"
                  }
                  my={0.5}
                >
                  <Box
                    bgcolor={
                      msg.sender === adminId || msg.sender_id === adminId
                        ? "#1976d2"
                        : "#e0e0e0"
                    }
                    color={
                      msg.sender === adminId || msg.sender_id === adminId
                        ? "white"
                        : "black"
                    }
                    px={2}
                    py={1}
                    borderRadius={2}
                    maxWidth="60%"
                  >
                    <Typography variant="body2">{msg.message}</Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      textAlign="right"
                    >
                      {moment(msg.created_at).format("h:mm A")}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          ))}
          <div ref={messageBoxRef} />
        </Box>

        {selectedUser && (
          <Box
            display="flex"
            alignItems="center"
            p={2}
            borderTop="1px solid #ccc"
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message"
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <IconButton onClick={handleSendMessage}>
              <SendIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminInbox;
