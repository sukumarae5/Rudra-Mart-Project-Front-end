import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const OrderPlacedSuccessfullyPage = () => {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const invoiceRef = useRef(); // Reference for capturing invoice

  const token = localStorage.getItem("authToken");

  // Fetch latest payment and order details
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!token) {
        setError("Unauthorized. Please log in to view payment details.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://192.168.1.15:8081/api/payment", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error('Failed to fetch payment details');

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const sortedPayments = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setPayment(sortedPayments[0]);
        } else {
          setError("No payment data found.");
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [token]);

  // Download Invoice as PDF
  const handleDownloadInvoice = async () => {
    const input = invoiceRef.current;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice_${payment.transaction_id}.pdf`);
  };

  if (loading) return <div>Loading payment details...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <h2 style={{ color: "green", textAlign: "center" }}>🎉 Order Placed Successfully!</h2>

      {/* Invoice Section */}
      <div
        ref={invoiceRef}
        style={{
          padding: "20px",
          border: "2px solid #ccc",
          borderRadius: "10px",
          marginTop: "20px",
          backgroundColor: "#fff",
          fontFamily: "Arial, sans-serif"
        }}
      >
        {/* Logo and Header */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h1 style={{ margin: "0", color: "#007bff" }}>LightUp</h1>
          <p style={{ margin: "5px 0", fontSize: "14px" }}>Invoice</p>
        </div>

        {/* Customer & Transaction Info */}
        <div style={{ marginBottom: "20px" }}>
          <p><strong>Customer Name:</strong> {payment.customer_name || "N/A"}</p>
          <p><strong>Phone Number:</strong> {payment.phone_number || "N/A"}</p>
          <p><strong>Transaction ID:</strong> {payment.transaction_id}</p>
          <p><strong>Payment Method:</strong> {payment.payment_method}</p>
          <p><strong>Status:</strong> {payment.payment_status}</p>
          <p><strong>Paid On:</strong> {new Date(payment.created_at).toLocaleString()}</p>
        </div>

        {/* Items Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>#</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Item Name</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Quantity</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Price</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {payment.items && payment.items.length > 0 ? (
              payment.items.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{index + 1}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.name}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{item.quantity}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>₹ {item.price.toLocaleString("en-IN")}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>₹ {(item.price * item.quantity).toLocaleString("en-IN")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>No items found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Total Paid */}
        <h3 style={{ textAlign: "right", marginRight: "10px" }}>
          Total Paid: ₹ {payment.amount.toLocaleString("en-IN")}
        </h3>

        {/* Thank You Note */}
        <p style={{ textAlign: "center", marginTop: "30px", fontStyle: "italic" }}>
          Thank you for shopping with LightUp! ✨
        </p>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "30px" }}>
        <button onClick={() => navigate('/my-orders')} style={buttonStyle("#007bff")}>My Orders</button>
        <button onClick={handleDownloadInvoice} style={buttonStyle("green")}>Download Invoice</button>
        <button onClick={() => navigate('/')} style={buttonStyle("gray")}>Home</button>
      </div>
    </div>
  );
};

// Reusable button style function
const buttonStyle = (bgColor) => ({
  padding: "12px 20px",
  backgroundColor: bgColor,
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
});

export default OrderPlacedSuccessfullyPage;
