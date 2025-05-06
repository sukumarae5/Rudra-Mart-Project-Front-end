import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const AdminInbox = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [allMessages, setAllMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const ws = useRef(null);
  const messageBoxRef = useRef(null);

  const adminId = 'admin';
  const adminName = 'Admin';

  useEffect(() => {
    fetchConversations();
    setupWebSocket();
    return () => ws.current?.close();
  }, []);

  useEffect(() => {
    if (selectedUser?.id) fetchMessages(selectedUser.id);
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const setupWebSocket = () => {
    ws.current = new WebSocket('ws://localhost:8081');

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      ws.current.send(JSON.stringify({ type: 'init', userId: adminId }));
    };

    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (!msg.conversation_id) return;

      // Only append messages for the selected conversation
      if (
        selectedUser &&
        msg.conversation_id === getConversationId(selectedUser.id)
      ) {
        setAllMessages((prev) => [...prev, msg]);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket closed');
    };
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch('http://192.168.1.10:8081/api/admin/messages/all');
      const data = await res.json();
      setConversations(data);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const conversationId = getConversationId(userId);
      const res = await fetch(`http://192.168.1.10:8081/api/user/messages/${conversationId}`);
      const data = await res.json();
      setAllMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const getConversationId = (userId) => `user-${userId}-${adminId}`;

  const handleSendMessage = () => {
    if (!msgInput.trim() || !selectedUser) return;

    const messageObj = {
      sender_id: adminId,
      sender_name: adminName,
      receiver_id: selectedUser.id,
      message: msgInput.trim(),
      conversation_id: getConversationId(selectedUser.id),
    };

    ws.current.send(JSON.stringify(messageObj));
    setAllMessages((prev) => [
      ...prev,
      { ...messageObj, created_at: new Date().toISOString() },
    ]);
    setMsgInput('');
  };

  const scrollToBottom = () => {
    messageBoxRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ✅ Filter messages based on selected user conversation
  const displayedMessages = selectedUser
    ? allMessages.filter(
        (msg) => msg.conversation_id === getConversationId(selectedUser.id)
      )
    : [];

  return (
    <Box display="flex" height="90vh" boxShadow={3}>
      {/* Sidebar */}
      <Paper sx={{ width: 300, overflowY: 'auto' }}>
        <Box p={2}>
          <Typography variant="h6">Inbox</Typography>
        </Box>
        <Divider />
        <List>
          {conversations.map((user, index) => {
            const userId = user?.sender;
            const userName = user?.sender_name || 'Unknown';
            return (
              <ListItem
                key={index}
                button
                selected={selectedUser?.id === userId}
                onClick={() => setSelectedUser({ id: userId, name: userName })}
              >
                <Avatar sx={{ mr: 2 }}>
                  {userName.charAt(0).toUpperCase()}
                </Avatar>
                <ListItemText
                  primary={userName}
                  secondary={user.last_message || ''}
                />
              </ListItem>
            );
          })}
        </List>
      </Paper>

      {/* Chat Window */}
      <Box flex={1} display="flex" flexDirection="column">
        <Box display="flex" alignItems="center" p={2} bgcolor="#f5f5f5" borderBottom="1px solid #ddd">
          <AdminPanelSettingsIcon sx={{ mr: 1 }} />
          <Typography variant="h6">
            {selectedUser ? `Chat with ${selectedUser.name}` : 'Select a conversation'}
          </Typography>
        </Box>

        {/* Messages */}
        <Box flex={1} p={2} overflow="auto">
          {displayedMessages.map((msg, idx) => (
            <Box
              key={idx}
              display="flex"
              justifyContent={msg.sender_id === adminId ? 'flex-end' : 'flex-start'}
              mb={1}
            >
              <Box
                bgcolor={msg.sender_id === adminId ? '#1976d2' : '#e0e0e0'}
                color={msg.sender_id === adminId ? 'white' : 'black'}
                px={2}
                py={1}
                borderRadius={2}
                maxWidth="60%"
              >
                <Typography variant="body2">{msg.message}</Typography>
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'right' }}>
                  {new Date(msg.created_at).toLocaleTimeString()}
                </Typography>
              </Box>
            </Box>
          ))}
          <div ref={messageBoxRef}></div>
        </Box>

        {/* Input */}
        {selectedUser && (
          <Box display="flex" p={2} borderTop="1px solid #ccc">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message"
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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
