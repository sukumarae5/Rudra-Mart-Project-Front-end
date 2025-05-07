import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, InputGroup, FormControl } from "react-bootstrap";
import { BsChatDots } from "react-icons/bs";

const ChatWidget = () => {
  const navigate = useNavigate();
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef();
  const [showChat, setShowChat] = useState(false);

  const token = localStorage.getItem("authToken");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const senderName = user?.name;

  const storedConversationId = localStorage.getItem("conversationId");
  const [conversationId, setConversationId] = useState(storedConversationId);

  // Generate conversation ID if not set
  useEffect(() => {
    if (!conversationId && userId) {
      const newId = `user-${userId}-admin`;
      localStorage.setItem("conversationId", newId);
      setConversationId(newId);
    }
  }, [conversationId, userId]);

  // Handle WebSocket connection
  useEffect(() => {
    if (!token || !userId || !senderName || !conversationId) return;

    const socket = new WebSocket("ws://192.168.1.10:8081");
    setWs(socket);

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "init", userId }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Filter messages to current conversation only
      if (data.conversation_id === conversationId) {
        setMessages((prev) => [...prev, data]);
      }
    };

    return () => {
      socket.close();
    };
  }, [token, userId, senderName, conversationId]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(() => {
    if (!text.trim() || !ws || !conversationId) return;

    const msg = {
      sender_id: userId,
      sender_name: senderName,
      receiver_id: "admin",
      message: text.trim(),
      conversation_id: conversationId,
    };

    ws.send(JSON.stringify(msg));
    setText("");
  }, [ws, text, userId, senderName, conversationId]);

  const toggleChat = () => {
    if (!token || !userId || !senderName) {
      alert("You need to log in first.");
      navigate("/login");
      return;
    }
    setShowChat((prev) => !prev);
  };

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
      <Button variant="primary" onClick={toggleChat}>
        <BsChatDots size={24} />
      </Button>

      {showChat && (
        <div style={{ marginTop: 10 }}>
          <div className="card shadow p-3" style={{ width: 400, maxHeight: 500 }}>
            <h5 className="mb-3">Chat with Support</h5>

            <div
              className="border rounded mb-3 p-2 bg-white"
              style={{ height: 300, overflowY: "auto" }}
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`text-${msg.sender_id === userId ? "end" : "start"}`}
                >
                  <div
                    className={`d-inline-block p-2 rounded mb-1 ${
                      msg.sender_id === userId
                        ? "bg-primary text-white"
                        : "bg-light"
                    }`}
                    style={{ maxWidth: "80%" }}
                  >
                    {msg.sender_id !== userId && (
                      <strong>{msg.sender_name}</strong>
                    )}
                    <div>{msg.message}</div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <InputGroup>
              <FormControl
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
              />
              <Button variant="primary" onClick={handleSend}>
                Send
              </Button>
            </InputGroup>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
