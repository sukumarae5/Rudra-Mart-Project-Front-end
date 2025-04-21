import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Form } from "react-bootstrap";

const EditOrdersForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;
  const [status, setStatus] = useState(order?.status || "");
  const [loading, setLoading] = useState(false);
  
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

  const handleStatusUpdate = async () => {
    if (!validStatuses.includes(status)) {
      alert(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://${process.env.REACT_APP_IP_ADDRESS}/api/orders/status/${order.order_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Order status updated successfully!");
        navigate("/admin/adminorders");
      } else {
        alert(`Error: ${data.message || "Failed to update order status"}`);
      }
    } catch (error) {
      alert("Error updating order status: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://${process.env.REACT_APP_IP_ADDRESS}/api/orders/${order.order_id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Order deleted successfully!");
        navigate("/admin/adminorders");
      } else {
        alert(`Error: ${data.message || "Failed to delete order"}`);
      }
    } catch (error) {
      alert("Error deleting order: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <Card className="p-4 shadow-sm">
        <h2 className="fw-bold mb-3">Order #{order?.order_id}</h2>

        <div className="mb-3">
          <strong>User ID:</strong> {order?.user_id}
        </div>

        <div className="mb-3">
          <strong>Total Price:</strong> ₹{order?.total_price}
        </div>

        <div className="mb-3">
          <strong>Order Date:</strong>{" "}
          {new Date(order?.order_created_at).toLocaleString()}
        </div>

        <div className="mb-3">
          <strong>Shipping Address:</strong>
          <br />
          {order?.address?.street_address}, {order?.address?.city},{" "}
          {order?.address?.state} - {order?.address?.postal_code}
        </div>

        <h5 className="mt-4">Products</h5>
        <ul className="list-unstyled">
          {order?.products?.map((product, i) => (
            <li
              key={i}
              className="d-flex gap-3 align-items-start mb-4 border-bottom pb-3"
            >
              <img
                src={product.image_url}
                alt={product.product_name}
                width="80"
                height="80"
                className="rounded shadow-sm"
              />
              <div>
                <h6 className="mb-1">{product.product_name}</h6>
                <div>
                  <strong>Category:</strong> {product.category_name}
                </div>
                <div>
                  <strong>Price:</strong> ₹{product.product_price}
                </div>
                <div>
                  <strong>Description:</strong> {product.product_description}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <Form.Group className="mt-4">
          <Form.Label>
            <strong>Status</strong>
          </Form.Label>
          <Form.Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {validStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <div className="d-flex gap-3 mt-4">
          <Button onClick={handleStatusUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update Status"}
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteOrder}
            disabled={loading} 
          >
            {loading ? "Deleting..." : "Delete Order"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/admin/adminorders")}
          >
            Back to Orders
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EditOrdersForm;
