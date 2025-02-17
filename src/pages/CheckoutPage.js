import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Form, Button, Card, Image, Table } from "react-bootstrap";
import { FaMapMarkerAlt, FaRegCreditCard } from "react-icons/fa";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const { cartItems = [] } = useSelector((state) => state.cart || {});
  const { products = [] } = useSelector((state) => state.products || {});
  console.log({ cartItems, products });

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });

  const handleAddAddress = () => {
    const newAddr = { id: savedAddresses.length + 1, ...formData };
    setSavedAddresses([newAddr]);
    setSelectedAddress(newAddr);
    setNewAddress(false);
  };

  const filteredCartItems = cartItems.map((cartItem) => {
    const product = products.find((prod) => prod.id === cartItem.product_id);
    return product ? { ...product, quantity: cartItem.quantity } : null;
  }).filter(Boolean);
  
  const totalCost = filteredCartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Container fluid style={{ minHeight: "100vh", background: "#e3f2fd", padding: "50px" }}>
      <Row>
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
                  <Form.Control type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </Form.Group>
                <Button variant="primary" onClick={handleAddAddress}>Save Address</Button>
              </Form>
            </div>
          )}
        </Col>

        <Col md={6}>
          <Card className="p-4 border rounded-lg shadow-lg mb-4">
            <h3 className="text-lg font-semibold text-green-700 flex items-center">
              <FaRegCreditCard className="mr-2" /> Payment Details
            </h3>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Card Number</Form.Label>
                <Form.Control type="text" placeholder="XXXX-XXXX-XXXX-XXXX" />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Expiry Date</Form.Label>
                    <Form.Control type="text" placeholder="MM/YY" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>CVV</Form.Label>
                    <Form.Control type="text" placeholder="XXX" />
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="success" className="w-full">Place Order</Button>
            </Form>
          </Card>

          <Card className="p-4 border rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-red-700">Order Summary</h3>
            {filteredCartItems.length > 0 ? (
              filteredCartItems.map((item) => (
                <Row key={item.id} className="mb-3">
                  <Col xs={3}>
                    <Image src={item.image_url} rounded style={{ width: '50px', height: '50px' }} />
                  </Col>
                  <Col>
                    <p>Product: <strong>{item.name}</strong></p>
                    <p>Price: <strong>₹{item.price}</strong></p>
                    <p>Quantity: <strong>{item.quantity}</strong></p>
                                  </Col>
                </Row>
              ))
            ) : (
              <p className="text-muted">No matching products in cart.</p>
            )}
            <hr />
            <h4>Total: ₹{totalCost.toFixed(2)}</h4>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
