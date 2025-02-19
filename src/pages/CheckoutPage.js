import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Form, Button, Card, Image } from "react-bootstrap";
import { FaMapMarkerAlt, FaRegCreditCard, FaPaypal } from "react-icons/fa";
import Accordion from 'react-bootstrap/Accordion';
import { decreaseQuantity, increaseQuantity, removeProduct } from '../features/cart/cartActions'; // Import actions
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const CheckoutPage = () => {
  const { checkoutData = [] } = useSelector((state) => state.cart || {});
  const dispatch = useDispatch(); // To dispatch actions

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
  const [paymentMethod, setPaymentMethod] = useState("creditCard"); // Default payment method
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });

  const handleAddAddress = () => {
    const newAddr = { id: savedAddresses.length + 1, ...formData };
    setSavedAddresses([...savedAddresses, newAddr]);
    setSelectedAddress(newAddr);
    setNewAddress(false);
    
  };

  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseQuantity(productId)); // Dispatch the action to increase quantity
  };

  const handleDecreaseQuantity = (productId) => {
    dispatch(decreaseQuantity(productId));
  };

  const handleRemoveProduct = (productId) => {
    dispatch(removeProduct(productId)); // Dispatch the action to remove product
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleCardDetailChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const totalCost = checkoutData.reduce((total, item) => total + item.productPrice * item.quantity, 0);

  return (
    <Container fluid style={{ minHeight: "100vh", background: "#e3f2fd", padding: "50px" }}>
      <Row>
        {/* Address and Payment Section */}
        <Col md={6} style={{ background: "white", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
          <h3 className="text-blue-700 font-semibold mb-4 flex items-center">
            <FaMapMarkerAlt className="mr-2" /> Delivery Address
          </h3>
          {savedAddresses.length > 0 ? (
            savedAddresses.map((addr) => (
              <div key={addr.id} className="border p-2 rounded-lg mb-2 cursor-pointer hover:bg-blue-50" onClick={() => setSelectedAddress(addr)}>
                <input type="radio" name="address" checked={selectedAddress?.id === addr.id} readOnly className="mr-2" />
                <span className="font-semibold">{addr.name}</span> ({addr.phone}) <br />
                <span>{addr.address}</span>
              </div>
            ))
          ) : (
            <p className="text-muted">No saved addresses. Please add a new address.</p>
          )}
          <Button variant="link" className="text-blue-500" onClick={() => setNewAddress(true)}>+ Add New Address</Button>
          {newAddress && (
            <div className="border p-4 rounded-lg mt-3">
              <h3 className="text-lg font-semibold text-blue-700">Enter New Address</h3>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </Form.Group>
                <Button variant="primary" onClick={handleAddAddress}>Save Address</Button>
              </Form>
            </div>
          )}
        </Col>

        {/* Order Summary */}
        <Col md={6}>
          <Accordion defaultActiveKey="0" flush>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Payment Method</Accordion.Header>
              <Accordion.Body>
                <Card className="p-4 border rounded-lg shadow-lg mb-4">
                  <h3 className="text-lg font-semibold text-green-700 flex items-center">
                    <FaRegCreditCard className="mr-2" /> Payment Details
                  </h3>
                  <Form>
                    <Form.Check
                      type="radio"
                      label="Credit Card"
                      value="creditCard"
                      checked={paymentMethod === "creditCard"}
                      onChange={handlePaymentMethodChange}
                    />
                    <Form.Check
                      type="radio"
                      label="PayPal"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={handlePaymentMethodChange}
                    />
                    <Form.Check
                      type="radio"
                      label="Cash on Delivery"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={handlePaymentMethodChange}
                    />
                  </Form>
                  <Accordion>
                    {paymentMethod === "creditCard" && (
                      <Accordion.Item eventKey="1">
                        <Accordion.Header>Credit Card Details</Accordion.Header>
                        <Accordion.Body>
                          <div className="mt-4">
                            <Form.Group className="mb-3">
                              <Form.Label>Card Number</Form.Label>
                              <Form.Control
                                type="text"
                                name="cardNumber"
                                value={cardDetails.cardNumber}
                                onChange={handleCardDetailChange}
                                placeholder="XXXX XXXX XXXX XXXX"
                              />
                            </Form.Group>
                            <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Expiry Date</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="expiryDate"
                                    value={cardDetails.expiryDate}
                                    onChange={handleCardDetailChange}
                                    placeholder="MM/YY"
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>CVV</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="cvv"
                                    value={cardDetails.cvv}
                                    onChange={handleCardDetailChange}
                                    placeholder="CVV"
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    )}
                  </Accordion>
                  <Button variant="success" className="w-full">Place Order</Button>
                </Card>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Card className="p-4 border rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-red-700">Order Summary</h3>
            {checkoutData.length > 0 ? (
              checkoutData.map((item) => (
                <Row key={item.id} className="mb-3">
                  <Col xs={3}>
                    <Image src={item.productImage} rounded style={{ width: '100px', height: 'auto' }} />
                  </Col>
                  <Col>

                   <div> 
                   <Button variant="drk" style={{paddingLeft:"300px"}}   onClick={() => handleRemoveProduct(item.productId)}>
                    <a><DeleteOutlineOutlinedIcon /></a>

                    </Button>
                    <p>Product: <strong>{item.productName}</strong></p>
                    <p>Price: <strong>₹{item.productPrice}</strong></p>
                    <p>Quantity: <strong>{item.quantity}</strong></p>
                    <p>Subtotal: <strong>₹{(item.productPrice * item.quantity).toFixed(2)}</strong></p>
</div>
                   
                    <div className="d-flex justifycontent-between">
                     
                    <div>
                    <Button variant="primary" className="mr-1" onClick={() => handleIncreaseQuantity(item.productId)}>
                      +
                    </Button>
                    <Button variant="primary" className="mr-1" onClick={() => handleDecreaseQuantity(item.productId)}>
                      -
                    </Button>
                    
                    </div>
                    </div>
                  </Col>
                </Row>
              ))
            ) : (
              <p className="text-muted">No products available in checkout.</p>
            )}
            <hr />
            <h4 style={{marginLeft:"80%"}}>Total: ₹{totalCost.toFixed(2)}</h4>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
