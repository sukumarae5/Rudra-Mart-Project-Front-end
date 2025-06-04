import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, InputGroup, FormControl, Spinner } from "react-bootstrap";
import { BsChatDots, BsCheck, BsCheckAll } from "react-icons/bs";

const ChatWidget = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [showChat, setShowChat] = useState(false);
  const bottomRef = useRef();
  const chatBoxRef = useRef();
  const audioRef = useRef(null);
  const sendAudioRef = useRef(null);
  const wsRef = useRef(null);
  const messageQueue = useRef([]);

  const token = localStorage.getItem("authToken");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const senderName = user?.name;
  const [conversationId, setConversationId] = useState(localStorage.getItem("conversationId"));

  useEffect(() => {
    if (!conversationId && userId) {
      const newId = `user-${userId}-admin`;
      localStorage.setItem("conversationId", newId);
      setConversationId(newId);
    }
  }, [conversationId, userId]);

  const fetchMessages = useCallback(async () => {
    if (!conversationId || !token) return;
    try {
      const response = await fetch(
        `http://192.168.1.13:8081/api/user/messages/${conversationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      const filtered = Array.isArray(data)
        ? data.filter(
            (msg) =>
              (msg.sender === userId || msg.receiver_id === userId) &&
              msg.conversation_id === conversationId
          )
        : [];
      setMessages(filtered);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  }, [conversationId, token, userId]);

  useEffect(() => {
    if (!token || !userId || !senderName || !conversationId || wsRef.current)
      return;
    if (!token || !userId || !senderName || !conversationId || wsRef.current)
      return;

    fetchMessages();

    const socket = new WebSocket("ws://192.168.1.13:8081");
    wsRef.current = socket;

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "init", userId }));
      messageQueue.current.forEach((queuedMsg) => {
        socket.send(JSON.stringify(queuedMsg));
      });
      messageQueue.current = [];
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.conversation_id === conversationId) {
        setMessages((prev) => [...prev, data]);

        if (data.sender_id !== userId && audioRef.current) {
          audioRef.current.play().catch((e) => {
            console.warn("Audio autoplay blocked:", e);
          });
        }

        // Mark as read if from admin
        if (data.sender_id !== userId && wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: "read", messageId: data.id }));
        }
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      socket.close();
      wsRef.current = null;
    };
  }, [token, userId, senderName, conversationId, fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(() => {
    if (!text.trim() || !wsRef.current || !conversationId) return;

    const msg = {
      sender_id: userId,
      sender_name: senderName,
      receiver: "admin",
      receiver_id: 660026,
      message: text.trim(),
      conversation_id: conversationId,
      created_at: new Date().toISOString(),
      is_read: false,
    };

    if (wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    } else {
      messageQueue.current.push(msg);
    }

    setText("");

    if (sendAudioRef.current) {
      sendAudioRef.current.play().catch((e) => {
        console.warn("Send sound blocked:", e);
      });
    }
  }, [text, userId, senderName, conversationId]);

  useEffect(() => {
    if (!showChat) return;

    const interval = setInterval(() => {
      fetchMessages();
    }, 2000);
    return () => clearInterval(interval);
  }, [showChat, fetchMessages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showChat && chatBoxRef.current && !chatBoxRef.current.contains(event.target)) {
        setShowChat(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showChat]);

  const toggleChat = () => {
    if (!token || !userId || !senderName) {
      alert("You need to log in first.");
      navigate("/login");
      return;
    }

    if (audioRef.current) {
      audioRef.current.play().catch((e) => {
        console.warn("Audio play blocked:", e);
      });
    }

    setShowChat((prev) => !prev);
  };

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
      <Button variant="primary" onClick={toggleChat}>
        <BsChatDots size={24} />
      </Button>

      <audio ref={audioRef} src="/notification.mp3" preload="auto" />
      <audio ref={sendAudioRef} src="/sendingnotification.mp3" preload="auto" />

      {showChat && (
        <div style={{ marginTop: 10 }} ref={chatBoxRef}>
          <div className="card shadow p-3" style={{ width: 400, maxHeight: 500 }}>
            <h5 className="mb-3">Chat with Support</h5>

            <div
              className="border rounded mb-3 p-2 bg-white"
              style={{ height: 300, overflowY: "auto" }}
            >
              {messages.length === 0 ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                messages.map((msg, idx) => {
                  const isUser = msg.sender === userId;
                  return (
                    <div
                      key={idx}
                      className={`d-flex mb-2 ${isUser ? "justify-content-end" : "justify-content-start"}`}
                    >
                      <div
                        className={`p-2 rounded ${isUser ? "bg-primary text-white" : "bg-light"}`}
                        style={{ maxWidth: "80%" }}
                      >
                        <div className="fw-bold mb-1" style={{ fontSize: "0.85rem" }}>
                          {isUser ? senderName : "Admin"}
                        </div>
                        <div>{msg.message}</div>
                        {isUser && (
                          <div className="text-end mt-1" style={{ fontSize: "0.75rem" }}>
                            {msg.is_read ? <BsCheckAll color="white" /> : <BsCheck color="white" />}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
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