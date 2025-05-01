import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const AdminInbox = () => {
  const [groupedMessages, setGroupedMessages] = useState({});
  const bottomRef = useRef(null);

  // Fetch all messages once on mount
  useEffect(() => {
    fetch("http://localhost:8081/admin/messages/all")
      .then((res) => res.json())
      .then((messages) => {
        const grouped = {};

        messages.forEach((msg) => {
          const userId = msg.sender_id === "admin" ? msg.receiver_id : msg.sender_id;
          const key = userId === null ? "Guest" : userId;

          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(msg);
        });

        setGroupedMessages(grouped);
      })
      .catch(console.error);
  }, []);

  // Scroll to bottom of each message group
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [groupedMessages]);

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={12}>
          <h4>All User Conversations</h4>

          {Object.entries(groupedMessages).map(([userId, messages]) => (
            <Card key={userId} className="mb-4 shadow-sm">
              <Card.Header>
                <strong>{userId === "Guest" ? "Guest" : `User ${userId}`}</strong>
              </Card.Header>
              <Card.Body style={{ maxHeight: "300px", overflowY: "auto" }}>
                {messages.length === 0 ? (
                  <div className="text-muted">No messages.</div>
                ) : (
                  messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`d-flex mb-2 ${
                        msg.sender_id === "admin" ? "justify-content-end" : "justify-content-start"
                      }`}
                    >
                      <div
                        className={`p-2 rounded ${
                          msg.sender_id === "admin" ? "bg-success text-white" : "bg-light"
                        }`}
                        style={{ maxWidth: "75%" }}
                      >
                        <div>
                          <strong>{msg.sender_name}:</strong> {msg.message}
                        </div>
                        {msg.created_at && (
                          <div className="text-end text-muted" style={{ fontSize: "0.75rem" }}>
                            {new Date(msg.created_at).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={bottomRef} />
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminInbox;
