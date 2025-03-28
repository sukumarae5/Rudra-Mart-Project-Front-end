import React, { useRef, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import emailjs from "@emailjs/browser";

const ContactPage = () => {
  const formRef = useRef();

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
      e.preventDefault(); // Prevent form from refreshing the page

      emailjs
      .send(
        "service_psruo8l", 
        "template_334gnmg", 
        formData,
        "mBpMLaypCOJsTVE_x" 
      )

      
    .then(
      (response) => {
        console.log("Email sent successfully!", response);
        alert("Message Sent Successfully!");
        setFormData({ name: "", email: "", phone: "", message: "" });
      },
      (error) => {
        console.error("Failed to send email:", error);
        alert("Failed to send message. Try again later.");
      }
    );
   
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      padding: "3%",
      }}
    >
      <Container className="p-5 bg-light border rounded" style={{ maxWidth: "1200px" }}>
        <Row>
          <Col lg={4} className="mb-4">
            <div className="p-4 bg-light border rounded">
              <h4 className="text-danger">
                <FaPhone className="me-2" /> Call Us
              </h4>
              <p>We are available 24/7, 7 days a week.</p>
              <p>Phone: +88011112222</p>
              <hr />
              <h4 className="text-danger" >
                <FaEnvelope className="me-2" /> Write To Us
              </h4>
              <p>Fill out our form, and we will contact you within 24 hours.</p>
              <p>Email: customer@exclusive.com</p>
              <p>Email: support@exclusive.com</p>
            </div>
          </Col>

          <Col lg={8}>
            <div className="p-4 bg-light border rounded">
              <Form ref={formRef} onSubmit={handleSubmit}>
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
                    style={{ minHeight: "150px" }}
                  />
                </Form.Group>
                <Button
                  variant="danger"
                  type="submit"
                  style={{                     
                    border: "none",
                    marginLeft:"75%",
                    padding: "10px 20px ",
                    fontSize: "18px",
                  }}
                >
                  Send Message
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactPage;
