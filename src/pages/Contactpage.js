import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaPhone, FaEnvelope } from "react-icons/fa";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);
    alert("Message Sent!");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <Container className="mt-4" style={{ paddingBottom: "100px" }}>
      <Row>
        <Col lg={4} className="mb-4">
          <div className="p-3 bg-light border rounded">
            <h4 className="text-danger">
              <FaPhone className="me-2" /> Call Us
            </h4>
            <p>We are available 24/7, 7 days a week.</p>
            <p>Phone: +88011112222</p>
            <hr />
            <h4 className="text-danger">
              <FaEnvelope className="me-2" /> Write To Us
            </h4>
            <p>Fill out our form, and we will contact you within 24 hours.</p>
            <p>Email: customer@exclusive.com</p>
            <p>Email: support@exclusive.com</p>
          </div>
        </Col>

        <Col lg={8}>
          <div className="p-3 bg-light border rounded">
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group controlId="formName">
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="formEmail">
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Your Email *"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="formPhone">
                    <Form.Control
                      type="tel"
                      name="phone"
                      placeholder="Your Phone *"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="formMessage" className="mb-3">
                <Form.Control
                  as="textarea"
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  style={{ minHeight: "120px" }}
                />
              </Form.Group>
              <Button variant="danger" type="submit">
                Send Message
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactPage;
