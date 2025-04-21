import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Row, Form } from 'react-bootstrap';

const UserForgotpasswordOtpGeneratorpage = () => {
  const [selectedOption, setSelectedOption] = useState('email');
  
  const [userData, setUserData] = useState({
    email: '',
    phone_number: ''
  });

  useEffect(() => {
    const userforgotdata = JSON.parse(localStorage.getItem("forgetuser"));
    if (userforgotdata) {
      setUserData(userforgotdata);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name === 'phone' ? 'phone_number' : name]: value
    });
  };

  const handleGenerateOtp = async (e) => {
    e.preventDefault();

    const contactValue =
      selectedOption === 'email' ? userData.email : userData.phone_number;

    const otpRequestData = {
      method: selectedOption,
      value: contactValue
    };

    try {
      const response = await fetch(`http://${process.env.REACT_APP_IP_ADDRESS}/api/otp/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(otpRequestData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`OTP sent successfully via ${selectedOption}: ${contactValue}`);
        localStorage.setItem('otpRequestData', JSON.stringify(otpRequestData));
      } else {
        alert(`Failed to send OTP: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      alert(`Error sending OTP: ${error.message}`);
    }
  };

  return (
    <div className="bg-secondary min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="p-4" style={{ borderRadius: '1rem', backgroundColor: '#d2fadd' }}>
              <h4 className="text-center mb-4">OTP Generator</h4>
              <Form onSubmit={handleGenerateOtp}>
                {/* Email Row */}
                <Form.Group as={Row} className="mb-3 align-items-center">
                  <Col xs="auto">
                    <Form.Check
                      type="radio"
                      name="contactOption"
                      checked={selectedOption === 'email'}
                      onChange={() => setSelectedOption('email')}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      disabled={selectedOption !== 'email'}
                    />
                  </Col>
                </Form.Group>

                {/* Phone Row */}
                <Form.Group as={Row} className="mb-3 align-items-center">
                  <Col xs="auto">
                    <Form.Check
                      type="radio"
                      name="contactOption"
                      checked={selectedOption === 'phone'}
                      onChange={() => setSelectedOption('phone')}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Enter your phone number"
                      name="phone"
                      value={userData.phone_number}
                      onChange={handleInputChange}
                      disabled={selectedOption !== 'phone'}
                    />
                  </Col>
                </Form.Group>

                <div className="text-center">
                  <Button type="submit" variant="primary">
                    Generate OTP
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserForgotpasswordOtpGeneratorpage;
