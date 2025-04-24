import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Form } from 'react-bootstrap';

const AdminUpdateTracking = () => {
  const location = useLocation();
  const { orderId, email, phone } = location.state || {};

  const [trackingId, setTrackingId] = useState('');
  const [status, setStatus] = useState('');
  const [trackingEmail, setTrackingEmail] = useState(email || '');
  const [trackingPhone, setTrackingPhone] = useState(phone || '');
  const [order_id, setOrderId] = useState(orderId || '');

  const statusOptions = [
    'Pending',
    'Processing',
    'Confirmed',
    'Shipped',
    'Delivered',
    'Cancelled',
    'Returned',
  ];

  useEffect(() => {
    if (orderId) setOrderId(orderId);
    if (email) setTrackingEmail(email);
    if (phone) setTrackingPhone(phone);
  }, [orderId, email, phone]);

  const updateTracking = async () => {
    try {
      const res = await fetch(`http://${process.env.REACT_APP_IP_ADDRESS}/api/tracking`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order_id,
          trackingId,
          status,
          email: trackingEmail,
          phone: trackingPhone,
        }),
      });

      const data = await res.json();
      alert(data.message);
    } catch (error) {
      console.error('Update failed:', error);
      alert('Update failed.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 fw-bold text-center text-primary">Update Tracking</h2>
      <div className="form-group mb-3">
        <label>Order ID</label>
        <input className="form-control" value={order_id} readOnly />
      </div>
      <div className="form-group mb-3">
        <label>Tracking ID</label>
        <input
          className="form-control"
          placeholder="Enter tracking ID"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
        />
      </div>
      <div className="form-group mb-3">
        <label>Status</label>
        <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Select Status</option>
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Form.Select>
      </div>
      <div className="text-center">
        <button className="btn btn-warning px-4" onClick={updateTracking}>
          Update Tracking
        </button>
      </div>
    </div>
  );
};

export default AdminUpdateTracking;
