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
import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import moment from "moment";

const AdminInbox = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [allMessages, setAllMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");
  const ws = useRef(null);
  const messageBoxRef = useRef(null);
  const intervalRef = useRef(null);
  const audioReceiveRef = useRef(null);
  const audioSendRef = useRef(null);
  const receivedMessageIdsRef = useRef(new Set());

  const adminId = process.env.REACT_APP_ADMIN_ID;
  const adminName = "admin";
  const token = localStorage.getItem("token");

  useEffect(() => {
    audioReceiveRef.current = new Audio("/notification.mp3");
    audioSendRef.current = new Audio("/sendingnotification.mp3");
  }, []);

  const connectWebSocket = () => {
    ws.current = new WebSocket("ws://192.168.1.23:8081");

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({ type: "init", userId: adminId }));
    };

    ws.current.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      setTimeout(() => handleIncomingMessage(msg), 0);
    };

    ws.current.onclose = () => {
      setTimeout(connectWebSocket, 3000);
    };

    ws.current.onerror = (err) => {
      console.error("WebSocket error", err);
      ws.current.close();
    };
  };

  useEffect(() => {
    fetchConversations(true);
    connectWebSocket();
    return () => ws.current?.close();
  }, []);

  const fetchConversations = async (playSound = false) => {
    try {
      const res = await fetch("http://192.168.1.23:8081/api/admin/messages/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const convs = await res.json();

      const withHistory = await Promise.all(
        convs.map(async (conv) => {
          const convId = `user-${conv.sender}-admin`;
          const r2 = await fetch(
            `http://192.168.1.23:8081/api/user/messages/${convId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const msgs = await r2.json();
          return { ...conv, messages: msgs };
        })
      );

      withHistory.forEach((conv) => {
        (conv.messages || []).forEach((msg) => {
          if (
            msg.receiver_id === adminId &&
            (!msg.is_read || msg.is_read === 0) &&
            !receivedMessageIdsRef.current.has(msg.id)
          ) {
            receivedMessageIdsRef.current.add(msg.id);
            if (playSound) {
              audioReceiveRef.current?.play().catch(console.warn);
            }
          }
        });
      });

      setConversations(withHistory);
    } catch (err) {
      console.error(err);
    }
  };

  const handleIncomingMessage = (msg) => {
    const isForAdmin = msg.receiver_id === adminId;

    if (
      (!msg.is_read || msg.is_read === 0) &&
      isForAdmin &&
      !receivedMessageIdsRef.current.has(msg.id)
    ) {
      receivedMessageIdsRef.current.add(msg.id);
      audioReceiveRef.current?.play().catch(console.warn);
    }

    setConversations((prev) =>
      prev.map((c) => {
        if (c.sender === msg.sender_id || c.sender === msg.receiver_id) {
          const updatedMsgs = [...(c.messages || []), msg];
          return {
            ...c,
            last_message: msg.message,
            messages: updatedMsgs,
            is_read:
              selectedUser && selectedUser.id === msg.sender_id
                ? true
                : c.is_read,
          };
        }
        return c;
      })
    );

    if (
      selectedUser &&
      msg.conversation_id === `user-${selectedUser.id}-admin`
    ) {
      setAllMessages((prev) => [...prev, msg]);
    }
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => fetchConversations(true), 4000);
    return () => clearInterval(intervalRef.current);
  }, []);

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
    setSelectedUser({
      id: conv.sender,
      name: conv.sender_name,
      msg_id: conv.id,
    });

    ws.current?.send(
      JSON.stringify({
        type: "read",
        message_id: conv.id,
        conversation_id: `user-${conv.sender}-admin`,
        reader_id: adminId,
        sender_id: conv.sender,
      })
    );

    setConversations((prev) =>
      prev.map((c) => (c.sender === conv.sender ? { ...c, is_read: true } : c))
    );
  };

  const handleSendMessage = () => {
    if (!msgInput.trim() || !selectedUser) return;

    const newMsg = {
      sender_id: adminId,
      sender_name: adminName,
      receiver: selectedUser.name,
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
    audioSendRef.current?.play().catch(console.warn);
  };

  const deduped = Array.from(
    new Map(conversations.map((c) => [c.sender, c])).values()
  ).sort((a, b) => {
    const aDate = new Date(a.messages?.at(-1)?.created_at || 0);
    const bDate = new Date(b.messages?.at(-1)?.created_at || 0);
    return bDate - aDate;
  });

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
            const unreadCount =
              conv.messages?.filter(
                (m) => !m.is_read && m.sender === conv.sender
              ).length || 0;

            return (
              <ListItem key={i} disablePadding>
                <ListItemButton selected={isSelected} onClick={() => handleSelect(conv)}>
                  <ListItemIcon>
                    <Badge
                      badgeContent={unreadCount}
                      color="error"
                      invisible={unreadCount === 0}
                    >
                      <Avatar>{conv.sender_name?.[0]?.toUpperCase()}</Avatar>
                    </Badge>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography fontWeight={unreadCount ? "bold" : "normal"}>
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
                sx={{ display: "block", textAlign: "center", my: 2, color: "#888" }}
              >
                {date}
              </Typography>
              {msgs.map((msg, idx) => {
                const isAdminSender = msg.sender_name === "admin";
                return (
                  <Box
                    key={idx}
                    display="flex"
                    justifyContent={isAdminSender ? "flex-end" : "flex-start"}
                    my={1}
                  >
                    <Box
                      bgcolor={isAdminSender ? "#d1f5d3" : "#f0f0f0"}
                      p={1.5}
                      borderRadius={2}
                      maxWidth="60%"
                      boxShadow={1}
                    >
                      <Typography variant="body2">{msg.message}</Typography>
                      <Box display="flex" justifyContent="flex-end" alignItems="center">
                        <Typography variant="caption" color="textSecondary" mr={0.5}>
                          {moment(msg.created_at).format("HH:mm")}
                        </Typography>
                        {isAdminSender &&
                          (msg.is_read ? (
                            <DoneAllIcon fontSize="small" color="primary" />
                          ) : (
                            <CheckIcon fontSize="small" />
                          ))}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ))}
          <div ref={messageBoxRef} />
        </Box>

        {/* Message Input */}
        {selectedUser && (
          <Box display="flex" p={1} borderTop="1px solid #ddd">
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Type a message"
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <IconButton color="primary" onClick={handleSendMessage}>
              <SendIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminInbox;
