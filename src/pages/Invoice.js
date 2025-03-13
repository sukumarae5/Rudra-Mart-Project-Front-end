import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Invoice = () => {
  const { transactionId } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    if (!transactionId) return;
    axios.get(`http://192.168.1.10:8081/api/invoice/data/${transactionId}`)
      .then(res => setInvoice(res.data))
      .catch(err => console.error('Error:', err));
  }, [transactionId]);

  if (!invoice) return <p>Loading invoice...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center' }}>INVOICE</h2>
      <p><strong>Transaction ID:</strong> {invoice.transaction_id}</p>
      <p><strong>Customer Name:</strong> {invoice.customer_name}</p>
      <p><strong>Phone Number:</strong> {invoice.phone_number}</p>
      <p><strong>Payment Method:</strong> {invoice.payment_method}</p>
      <p><strong>Status:</strong> {invoice.payment_status}</p>
      <p><strong>Total Paid:</strong> ₹ {invoice.amount}</p>
      <p><strong>Paid On:</strong> {new Date(invoice.created_at).toLocaleString()}</p>

      <h3>Ordered Products:</h3>
      <ul>
        {invoice.products.map((p, idx) => (
          <li key={idx}>{p.name} - Quantity: {p.quantity}</li>
        ))}
      </ul>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>Thank you for your purchase!</p>
      </div>
    </div>
  );
};

export default Invoice;
