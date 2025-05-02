import React, { useEffect, useState } from 'react';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchusersrequest } from '../../../features/user/userActions';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const UserForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users = [] } = useSelector((state) => state.users);

  const [userData, setUserData] = useState({
    email: '',
    number: '',
  });

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const showSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    dispatch(fetchusersrequest());
  }, [dispatch]);

  const handleforget = (e) => {
    e.preventDefault();
    try {
      const matchUser = users.find(
        (user) =>
          user.phone_number === userData.number || user.email === userData.email
      );

      if (matchUser) {
        showSnackbar('User details matched successfully', 'success');
        localStorage.setItem('forgetuser', JSON.stringify(matchUser));
        setTimeout(() => {
          navigate('/UserForgotpasswordOtpGeneratorpage');
        }, 1000);
      } else {
        showSnackbar('User details did not match', 'error');
      }
    } catch (error) {
      showSnackbar('Something went wrong', 'error');
    }
  };

  return (
    <div className="bg-secondary min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card
              className="p-4"
              style={{ borderRadius: '1rem', backgroundColor: '#d2fadd' }}
            >
              <h4 className="text-center mb-4">Forgot Password</h4>
              <Form onSubmit={handleforget}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    value={userData.email}
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    onChange={handleChange}
                  />
                </Form.Group>
                <p style={{ textAlign: 'center' }}>OR</p>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    value={userData.number}
                    name="number"
                    type="text"
                    placeholder="Enter your number"
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="text-center">
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Snackbar Alert */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default UserForgotPasswordPage;
