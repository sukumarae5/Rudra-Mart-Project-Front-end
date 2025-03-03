import React, { forwardRef, useState } from "react";
import {
  Accordion,
  Card,
  Row,
  Col,
  Button,
  Image,
  Container,
} from "react-bootstrap";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import {
  decreaseQuantity,
  increaseQuantity,
  removeProduct,
} from "../features/cart/cartActions";

const OrderSummaryPage = forwardRef(({onConfirmOrder}, ref) => {
  const { checkoutData = [] } = useSelector((state) => state.cart || {});
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId"); // Get user ID from localStorage or Redux

 

  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseQuantity(productId));
  };

  const handleDecreaseQuantity = (productId) => {
    dispatch(decreaseQuantity(productId));
  };

  const handleRemoveProduct = (productId) => {
    dispatch(removeProduct(productId));
  };

  const totalCost = checkoutData.reduce(
    (total, item) => total + item.productPrice * item.quantity,
    0
  );

  // Function to handle order confirmation
  const handleConfirmOrder = async () => {
    if (checkoutData.length === 0) {
      alert("Your cart is empty. Add items before confirming the order.");
      return;
    }

    try {
      const orderData = {
        userId,
        totalPrice: totalCost,
        status: "Pending",
        products: checkoutData,
      };

      const response = await axios.post(
        "http://192.168.1.2:8081/api/orders/orders",
        orderData
      );

      if (response.status === 201) {
        alert("Order placed successfully!");
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing your order.");
    }
  };

  return (
    <>
      <div  ref={ref} className="container mt-4">
        < Container fluid style={{  background: "#e3f2fd", padding: "4px" }}>
        <Row>
          <Col md={12}>
            <Accordion defaultActiveKey="0" style={{ width: "102%" }}>
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <h5 className="mb-0 fw-bold">🛒 Order Summary</h5>
                </Accordion.Header>
                <Accordion.Body>
                  <Card className="p-4 shadow-lg border-0 rounded-4">
                    {checkoutData.length > 0 ? (
                      checkoutData.map((item) => (
                        <Row
                          key={item.id}
                          className="align-items-center p-3 border-bottom"
                        >
                          <Col xs={3} className="text-center">
                            <Image
                              src={item.productImage}
                              rounded
                              fluid
                              style={{
                                width: "200px",
                                height: "200px",
                                objectFit: "cover",
                              }}
                            />
                          </Col>
                          <Col xs={6}>
                            <h1 className="fw-bold">{item.productName}</h1>
                            <p className="text-muted m-0">
                              Price: ₹{item.productPrice}
                            </p>
                            <p className="fw-bold">
                              Subtotal: ₹
                              {(item.productPrice * item.quantity).toFixed(2)}
                            </p>
                          </Col>
                          <Col xs={2} className="text-end">
                            <div className="d-flex justify-content-end align-items-center gap-2">
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() =>
                                  handleDecreaseQuantity(item.productId)
                                }
                              >
                                <FaMinus />
                              </Button>
                              <span className="fw-bold">{item.quantity}</span>
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() =>
                                  handleIncreaseQuantity(item.productId)
                                }
                              >
                                <FaPlus />
                              </Button>
                            </div>
                            <br />
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() =>
                                handleRemoveProduct(item.productId)
                              }
                            >
                              <FaTrash />
                            </Button>
                          </Col>
                        </Row>
                      ))
                    ) : (
                      <p className="text-muted text-center">
                        No products available in checkout.
                      </p>
                    )}
                    <hr />
                    <div className="d-flex justify-content-between align-items-center mt-3 p-3 bg-light rounded shadow-sm">
                      <h5 className="text-danger fw-bold">
                        Total: ₹{totalCost}
                      </h5>
                      <Button
                        variant="success"
                        onClick={handleConfirmOrder}
                        className="px-4 py-2 fw-bold"
                      >
                        Confirm Order
                      </Button>
                    </div>
                  </Card>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
        </Container>
      </div>
      </>
  );
});

export default OrderSummaryPage;
