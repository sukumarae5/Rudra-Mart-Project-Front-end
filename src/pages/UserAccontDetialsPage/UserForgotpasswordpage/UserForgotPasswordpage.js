import React, { useEffect, useState } from 'react'
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { fetchusersrequest } from '../../../features/user/userActions';
import { useNavigate } from 'react-router-dom';

const UserForgotPasswordPage = () => {
  const dispatch=useDispatch()
  const navigate=useNavigate()
    const { users = [] } = useSelector((state) => state.users);  
  const [userData, setUserData] = useState({
    email: "",
    number: "",
  })

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }
   useEffect(() => {
      dispatch(fetchusersrequest());
    }, [dispatch]);
  const handleforget=(e)=>{
    e.preventDefault()
    try {
      const matchusernumber=users.find((user)=>user.phone_number===userData.number || user.email===userData.email)
console.log(matchusernumber)
if (matchusernumber){

  alert("user detital was match succssfull ")
  localStorage.setItem("forgetuser", JSON.stringify(matchusernumber));
  navigate("/UserForgotpasswordOtpGeneratorpage")
  
}else{
  alert("user detital was not match")
}
      
    } catch (error) {
      
    }

  }

  return (
    <div className="bg-secondary min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="p-4" style={{ borderRadius: '1rem', backgroundColor: '#d2fadd' }}>
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
               <p style={{textAlign:"center"}}>OR</p>
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
    </div>
  )
}

export default UserForgotPasswordPage
