import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderPlacedSuccessfullyPage = () => {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");

  // Fetch latest payment details
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!token) {
        setError("Unauthorized. Please log in to view payment details.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://192.168.1.10:8081/api/payment", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) throw new Error("Unauthorized. Please log in again.");
          if (response.status === 404) throw new Error("Payment details not found.");
          throw new Error("Failed to fetch payment details.");
        }

        const data = await response.json();
        console.log("✅ Payment details fetched:", data);

        if (Array.isArray(data) && data.length > 0) {
          const sortedPayments = data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setPayment(sortedPayments[0]);
        } else {
          setPayment(null);
          setError("No payment data found.");
        }
      } catch (err) {
        console.error("❌ Error fetching payment:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [token]);
  console.log(payment.transaction_id)

  const handleDownloadInvoice = async () => {
    try {
      const response = await fetch(`http://192.168.1.10:8081/api/invoice/pdf/${payment.transaction_id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to download invoice.');
      }
  
      const blob = await response.blob(); // Get binary data as blob
      const url = window.URL.createObjectURL(blob); // Create a blob URL
  
      // Create a link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_${payment.transaction_id}.pdf`; // Filename
      document.body.appendChild(a);
      a.click();
      a.remove(); // Clean up
      window.URL.revokeObjectURL(url); // Free memory
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice.');
    }
  };
  

  // Navigate to My Orders
  const handleMyOrders = () => {
    navigate("/my-orders");
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading payment details...</div>;
  if (error) return <div style={{ textAlign: "center", color: "red", marginTop: "50px" }}>{error}</div>;
  if (!payment) return <div style={{ textAlign: "center", color: "orange", marginTop: "50px" }}>No payment details available.</div>;

  return (
    <div style={{ margin: "50px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", fontFamily: "Arial, sans-serif", maxWidth: "600px" }}>
      <h2 style={{ textAlign: "center", color: "green" }}>🎉 Order Placed Successfully!</h2>
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Payment Summary</h3>

      <p><strong>Transaction ID:</strong> {payment.transaction_id || "N/A"}</p>
      <p><strong>Payment Method:</strong> {payment.payment_method || "N/A"}</p>
      <p><strong>Status:</strong> <span style={{ color: payment.payment_status === "Success" ? "green" : "orange" }}>{payment.payment_status || "N/A"}</span></p>
      <p><strong>Total Paid:</strong> ₹ {payment.amount ? payment.amount.toLocaleString("en-IN") : "N/A"}</p>
      <p><strong>Paid On:</strong> {payment.created_at ? new Date(payment.created_at).toLocaleString() : "N/A"}</p>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "30px", flexWrap: "wrap" }}>
        <button onClick={handleMyOrders} style={{ padding: "10px 15px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", minWidth: "120px" }}>My Orders</button>
        <button onClick={handleDownloadInvoice} style={{ padding: "10px 15px", backgroundColor: "green", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", minWidth: "120px" }}>
  Download Invoice
</button>
        <button onClick={() => navigate("/")} style={{ padding: "10px 15px", backgroundColor: "gray", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", minWidth: "120px" }}>Home</button>
      </div>
    </div>
  );
};

export default OrderPlacedSuccessfullyPage;
