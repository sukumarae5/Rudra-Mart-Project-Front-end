import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import {
  FaGifts,
  FaArrowCircleRight,
  FaArrowAltCircleDown,
  FaArrowAltCircleLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OrderPlacedSuccessfullyPage = () => {
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [invoiceUrl, setInvoiceUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(
          `http://${process.env.REACT_APP_IP_ADDRESS}/api/payment/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch payment details");

        const payments = await res.json();
        if (!Array.isArray(payments) || payments.length === 0)
          throw new Error("No payment data found.");

        const latest = payments.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )[0];

        setPayment(latest);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, []);

  const handleDownloadInvoice = () => {
    if (!payment) return alert("Payment data not available yet.");
    const token = localStorage.getItem("authToken");
    const transactionId = payment.transaction_id;

    fetch(
      `http://${process.env.REACT_APP_IP_ADDRESS}/api/invoice/pdf/${transactionId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to download invoice.");
        return res.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Invoice_${transactionId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => alert(err.message));
  };

  const handleViewInvoice = () => {
    if (!payment) return alert("Payment data not available yet.");
    const token = localStorage.getItem("authToken");
    const transactionId = payment.transaction_id;

    fetch(
      `http://${process.env.REACT_APP_IP_ADDRESS}/api/invoice/pdf/${transactionId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to view invoice.");
        return res.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setInvoiceUrl(url);
        setShowModal(true);
      })
      .catch((err) => alert(err.message));
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-danger text-center mt-5">Error: {error}</div>;
  if (!payment) return <div className="text-center mt-5">No payment data available.</div>;

  return (
    <div>
      {/* Order Success Message */}
      <div className="text-center">
        <div className="p-5 m-3 bg-success-subtle rounded">
          <FaGifts style={{ fontSize: "60px", color: "#f7d302" }} />
          <h1 style={{ color: "#47f013", fontWeight: "bold" }}>
            Order Placed Successfully!
          </h1>
          <h4 className="text-dark">
            ₹ {payment.amount}
          </h4>
          <p className="text-primary">Your items will be delivered soon...</p>
        </div>
      </div>

      {/* User & Payment Info */}
      <div
        className="m-3 p-4 rounded"
        style={{ backgroundColor: "#c5e0cd", maxWidth: "600px", margin: "auto" }}
      >
        <p><strong>Name:</strong> {user?.name || "N/A"}</p>
        <p><strong>Phone Number:</strong> {user?.phone_number || "N/A"}</p>
        <p><strong>Email:</strong> {user?.email || "N/A"}</p>
        <p><strong>Transaction ID:</strong> {payment.transaction_id}</p>
        <p><strong>Amount Paid:</strong> ₹{payment.amount}</p>
        <p>
          <strong>Order Placed Date:</strong>{" "}
          {new Date(payment.created_at).toISOString().slice(0, 10)}
        </p>
        <p><strong>Address:</strong> [Add user address if available]</p>
      </div>

      {/* Action Buttons */}
      <div className="d-flex justify-content-center gap-3 mb-5">
        <Button
          variant="outline-danger"
          onClick={() => navigate("/")}
          className="d-flex align-items-center gap-2"
        >
          <FaArrowAltCircleLeft /> Continue Shopping
        </Button>

        <Button
          variant="outline-primary"
          onClick={handleDownloadInvoice}
          className="d-flex align-items-center gap-2"
        >
          <FaArrowAltCircleDown /> Download Invoice
        </Button>

        <Button
          variant="outline-success"
          onClick={handleViewInvoice}
          className="d-flex align-items-center gap-2"
        >
          <FaArrowCircleRight /> View Invoice
        </Button>
      </div>

      {/* Invoice Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Invoice</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {invoiceUrl ? (
                  <iframe
                    src={invoiceUrl}
                    width="100%"
                    height="500px"
                    title="Invoice Preview"
                  ></iframe>
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