import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Image } from 'react-bootstrap';

const CheckoutPage = () => {
  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const [formData, setFormData] = useState({
    name: storedUser.name || '',
    email: storedUser.email || '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Order Placed Successfully!');
  };

  return (
    <Container fluid style={{ minHeight: '100vh', background: '#e3f2fd', padding: '50px' }}>
      <Row className="justify-content-center">
        <Col md={10} style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', width: '90%' }}>
          <h2 className="text-center" style={{ color: '#0d47a1', marginBottom: '20px' }}>Checkout</h2>
          
          {/* User Details */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control type="text" name="name" value={formData.name} readOnly />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} readOnly />
              </Form.Group>
            </Col>
          </Row>
          
          {/* Billing Details */}
          <Row>
            <Col md={6}>
              <h3 style={{ color: '#0d47a1' }}>Billing Details</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} required />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>City</Form.Label>
                      <Form.Control type="text" name="city" value={formData.city} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>ZIP Code</Form.Label>
                      <Form.Control type="text" name="zip" value={formData.zip} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Col>
            <Col md={6}>
              <h3 className="mt-4" style={{ color: '#2e7d32' }}>Payment Details</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Card Number</Form.Label>
                  <Form.Control type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange} required />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Expiry Date</Form.Label>
                      <Form.Control type="text" name="expiry" placeholder="MM/YY" value={formData.expiry} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>CVV</Form.Label>
                      <Form.Control type="text" name="cvv" value={formData.cvv} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Accepted Cards</Form.Label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" width="50" height="30" />
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" width="50" height="30" />
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/8/80/PayPal_logo.svg" width="50" height="30" />
                  </div>
                </Form.Group>
                <Button variant="success" type="submit" style={{ width: '100%' }}>Place Order</Button>
              </Form>
            </Col>
          </Row>
          
          {/* Order Summary Below Billing Details */}
          <Row >
            <Col md={6}>
              <Card style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                <Card.Body>
                  <h3 style={{ color: '#d32f2f' }}>Order Summary</h3>
                  <p>Product: <strong>React T-Shirt</strong></p>
                  <p>Price: <strong>$25</strong></p>
                  <hr />
                  <h4>Total: $25</h4>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
