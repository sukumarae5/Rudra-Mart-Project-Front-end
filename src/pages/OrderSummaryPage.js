import React, { useState, forwardRef } from "react";
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
import {
  decreaseQuantity,
  increaseQuantity,
  removeProduct,
} from "../features/cart/cartActions";

// ✅ MUI components
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

// ✅ Snackbar Alert component for MUI
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(value);

const OrderSummaryPage = forwardRef(({ onConfirmOrder }, ref) => {
  const { checkoutData = [] } = useSelector((state) => state.cart || {});
  console.log(checkoutData)
  const dispatch = useDispatch();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "error", "info", etc.

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseQuantity(productId));
  };

  const handleDecreaseQuantity = (productId) => {
    dispatch(decreaseQuantity(productId));
  };

  const handleRemoveProduct = (productId) => {
    dispatch(removeProduct(productId));
  };

 const totalCost = checkoutData.reduce((total, item) => {
  console.log("Item:", item);
  console.log("Running Total (before adding this item):", total);
  const itemTotal = item.productPrice * item.quantity;
  console.log("Item Subtotal:", itemTotal);
  return total + itemTotal;
}, 0);


  const handleConfirmOrder = async () => {
    if (checkoutData.length === 0) {
      setSnackbarMessage(
        "Your cart is empty. Add items before confirming the order."
      );
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    setSnackbarMessage("Order confirmed! Moving to the payment page...");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);

    setTimeout(() => {
      if (onConfirmOrder) {
        onConfirmOrder();
      } else {
        const paymentSection = document.getElementById("payment-section");
        if (paymentSection) {
          paymentSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, 3000); // Wait for snackbar to finish
  };

  return (
    <div ref={ref} className="container mt-4">
      <Container fluid style={{ background: "#e3f2fd", padding: "4px" }}>
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
                              Price: {formatCurrency(item.productPrice)}
                            </p>
                            <p className="fw-bold">
                              Subtotal:{" "}
                              {formatCurrency(
                                item.productPrice * item.quantity
                              )}
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
                        Total: {formatCurrency(totalCost)}
                      </h5>
                      <Button
                        variant="success"
                        onClick={handleConfirmOrder}
                        className="px-4 py-2 fw-bold"
                      >
                        Next
                      </Button>
                    </div>
                  </Card>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </Container>

      {/* ✅ Snackbar Alert */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
});

export default OrderSummaryPage;