import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Form, Badge, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderRequest, deleteOrderRequest } from "../../features/order/orderActions";

const EditOrdersForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const order = location.state?.order;
  const [status, setStatus] = useState(order?.status || "");

  const { loading } = useSelector((state) => state.order || {}); // ensure default fallback

  const validStatuses = [
    "Pending",
    "Processing",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Returned",
  ];

  useEffect(() => {
    if (!order) {
      alert("No order data found.");
      navigate("/admin/orders");
    }
  }, [order, navigate]);

  const handleStatusUpdate = () => {
    if (!validStatuses.includes(status)) {
      alert(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
      return;
    }

    dispatch(updateOrderRequest(order.order_id, status));
    alert("Order status update requested.");
    navigate("/admin/adminorders");
  };

  const handleDeleteOrder = () => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    console.log(order.order_id)
    dispatch(deleteOrderRequest(order.order_id));
    alert("Order delete requested.");
    navigate("/admin/adminorders");
  };

  const getStatusColor = (status) => {
    const map = {
      Pending: "secondary",
      Processing: "info",
      Confirmed: "primary",
      Shipped: "warning",
      Delivered: "success",
      Cancelled: "danger",
      Returned: "dark",
    };
    return map[status] || "light";
  };

  return (
    <div className="container py-4">
      <Card className="p-4 shadow-lg border-0">
        <h2 className="fw-bold mb-4 text-primary">Manage Order #{order?.order_id}</h2>

        <Row className="mb-4">
          <Col md={6}>
            <div className="mb-2">
              <strong>User ID:</strong> {order?.user_id}
            </div>
            <div className="mb-2">
              <strong>Total Price:</strong> ₹{order?.total}
            </div>
            <div className="mb-2">
              <strong>Order Date:</strong> {new Date(order?.order_date).toLocaleString()}
            </div>
          </Col>

          <Col md={6}>
            <div className="mb-2">
              <strong>Status:</strong>{" "}
              <Badge bg={getStatusColor(order?.status)}>{order?.status}</Badge>
            </div>
            <div>
              <strong>Shipping Address:</strong>
              <br />
              {order?.address?.street}, {order?.address?.city}, {order?.address?.state} -{" "}
              {order?.address?.pincode}
            </div>
          </Col>
        </Row>

        <h5 className="mt-4 text-secondary">Ordered Products</h5>
        <hr />
        {order?.products?.map((product, i) => (
          <div key={i} className="d-flex gap-3 align-items-start mb-4 border-bottom pb-3">
            <img
              src={product.image_url}
              alt={product.product_name}
              width="90"
              height="90"
              className="rounded shadow-sm"
              style={{ objectFit: "cover" }}
            />
            <div>
              <h6 className="fw-semibold mb-1">{product.product_name}</h6>
              <div><strong>Category:</strong> {product.category_name}</div>
              <div><strong>Price:</strong> ₹{product.price}</div>
              <div><strong>Description:</strong> {product.description}</div>
            </div>
          </div>
        ))}

        <Form.Group className="mt-4">
          <Form.Label><strong>Change Order Status</strong></Form.Label>
          <Form.Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="shadow-sm"
          >
            {validStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <div className="d-flex flex-wrap gap-3 mt-4">
          <Button variant="success" onClick={handleStatusUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update Status"}
          </Button>
          <Button variant="danger" onClick={handleDeleteOrder} disabled={loading}>
            {loading ? "Deleting..." : "Delete Order"}
          </Button>
          <Button variant="outline-secondary" onClick={() => navigate("/admin/adminorders")}>
            Back to Orders
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EditOrdersForm;
