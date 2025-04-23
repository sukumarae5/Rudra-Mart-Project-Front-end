import React, { useEffect, useState } from 'react';
import { Container, Table, Spinner, Alert } from 'react-bootstrap';

const UserTrackingpage = ({ userId }) => {
  const [trackingData, setTrackingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`http://${process.env.REACT_APP_IP_ADDRESS}/api/tracking/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        setTrackingData(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch tracking info');
        setLoading(false);
      });
  }, [userId]);

  return (
    <Container className="my-5">
      <h3 className="text-center mb-4">Order Tracking</h3>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Order ID</th>
              <th>Order Status</th>
              <th>Tracking Status</th>
              <th>Location</th>
              <th>Notes</th>
              <th>Updated At</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {trackingData.map((item, index) => (
              <tr key={index}>
                <td>{item.order_id}</td>
                <td>{item.order_status}</td>
                <td>{item.tracking_status}</td>
                <td>{item.location}</td>
                <td>{item.notes}</td>
                <td>{new Date(item.updated_at).toLocaleString()}</td>
                <td>
                  {item.street_address}, {item.city}, {item.state}, {item.postal_code}, {item.country}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default UserTrackingpage;
