import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FaGifts, FaArrowCircleRight, FaArrowAltCircleDown, FaArrowAltCircleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OrderPlacedSuccessfullyPage = () => {
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [invoiceUrl, setInvoiceUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  console.log(payment)
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const paymentRes = await fetch("http://192.168.1.10:8081/api/payment", {
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

  // ✅ Download invoice as PDF
  const handleDownloadInvoice = () => {
    if (!payment) {
      alert("Payment data not available yet.");
      return;
    }

    const token = localStorage.getItem("authToken");
    const transactionId = payment.transaction_id;

    fetch(`http://192.168.1.10:8081/api/invoice/pdf/${transactionId}`, {
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

  // ✅ View invoice inside modal
  const handleViewInvoice = () => {
    if (!payment) {
      alert("Payment data not available yet.");
      return;
    }

    const token = localStorage.getItem("authToken");
    const transactionId = payment.transaction_id;

    fetch(`http://192.168.1.10:8081/api/invoice/pdf/${transactionId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch invoice.");
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        setInvoiceUrl(url);
        setShowModal(true); // Show the modal
      })
      .catch((err) => alert(err.message));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!payment) return <div>No payment data available.</div>;

  return (
    <div>
    <div className="text-center">
        <div className="w-100 h-100 p-5 bg-light text-danger fs-6 m-3" style={{ backgroundColor: "#c5e0cd" }}>
          <h1 style={{ color: "#586cfc", fontSize: "20px" }}>
            <span>
              <FaGifts style={{ fontSize: "60px", color: "#f7d302", marginLeft: "46%" }} />
            </span>
            <span style={{ color: "#47f013", fontFamily: "bold", fontSize: "29px" }}>Order Placed Successfully!</span>
            <span className="ml-2 fw-italic" style={{ color: "#070808" }}>₹ {payment.amount}!</span>
          </h1>
          <p style={{ color: "blue" }}>Your {payment.quantity} items will be delivered soon...</p>
        </div>
      </div>

      <div style={{ backgroundColor: "#c5e0cd", marginBottom:"1%" , marginLeft:"1%" ,padding:"20px",paddingLeft:"40%"}}>
      <p><a style={{fontFamily:"bold", fontSize:"20px",}}>Name:</a><a style={{fontStyle:"italic"}}>
        {user.name}
        </a>
        </p>
      <p><a style={{fontFamily:"bold",fontSize:"20px", }} > Phone number:</a> <a style={{fontStyle:"italic"}}>{user.phone_number}</a> </p>
     <p><a style={{fontFamily:" bold",fontSize:"20px" }}>Email:</a> <a style={{fontStyle:"italic"}}>{user.email}</a></p>
      <p><a style={{fontFamily:"bold" ,fontSize:"20px ",}}>Transaction ID: </a> <a style={{fontStyle:"italic"}} >{payment.transaction_id}</a></p>
      <p> <a style={{fontFamily:"bold" ,fontSize:"20px",}}> Amount Paid: ₹{payment.amount}</a></p>
      <p>
  <a style={{ fontFamily: "bold", fontSize: "20px" }}>Order Placed Date:</a>
  <a style={{ fontStyle: "italic" }}>
    {new Date(payment.created_at).toISOString().slice(0, 10)}
  </a>
</p>

      <p>Address details</p>
      
</div>

      {/* Buttons */}
      <div className="mb-4 d-flex gap-3" style={{ paddingLeft: "30%", marginBottom:"10%" }}>
        <Button variant="outline-danger" onClick={() => navigate("/")} className="d-flex align-items-center gap-2">
          <FaArrowAltCircleLeft /> Continue Shopping
        </Button>

        <Button variant="outline-primary" onClick={handleDownloadInvoice} className="d-flex align-items-center gap-2">
          <FaArrowAltCircleDown /> Download Invoice
        </Button>

        <Button variant="outline-success" onClick={handleViewInvoice} className="d-flex align-items-center gap-2">
          <FaArrowCircleRight /> View Invoice
        </Button>
      </div>

      {/* Invoice Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Invoice</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {invoiceUrl ? (
                  <iframe src={invoiceUrl} width="100%" height="500px"></iframe>
                ) : (
                  <p>Loading invoice...</p>
                )}
              </div>
              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPlacedSuccessfullyPage;
