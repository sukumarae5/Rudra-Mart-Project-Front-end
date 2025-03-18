import React, { useEffect, useState } from "react";

const OrderPlacedSuccessfullyPage = () => {
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch latest payment
  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const token = localStorage.getItem("authToken");
        
        const paymentRes = await fetch("http://192.168.1.15:8081/api/payment", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!paymentRes.ok) throw new Error("Failed to fetch payment details");

        const payments = await paymentRes.json();
        if (!Array.isArray(payments) || payments.length === 0) throw new Error("No payment data found.");
        
        const latestPayment = payments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
        setPayment(latestPayment);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, []);

  // ✅ Download invoice directly as PDF
  const handleDownloadInvoice = () => {
    if (!payment) {
      alert("Payment data not available yet.");
      return;
    }

    const token = localStorage.getItem("authToken");
    const transactionId = payment.transaction_id;

    fetch(`http://192.168.1.15:8081/api/invoice/pdf/${transactionId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) throw new Error("Failed to download invoice.");
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Invoice_${transactionId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch(err => alert(err.message));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!payment) return <div>No payment data available.</div>;

  return (
    <div className="text-center">
      <h1>Order Placed Successfully!</h1>
      <p>Transaction ID: {payment.transaction_id}</p>
      <p>Amount Paid: ₹{payment.amount}</p>
      <button onClick={handleDownloadInvoice} className="btn btn-primary">
        Download Invoice
      </button>
    </div>
  );
};

export default OrderPlacedSuccessfullyPage;
