import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import {
  FaCheckCircle,
  FaTruck,
  FaHome,
  FaUser,
  FaEnvelope,
  FaDownload,
  FaEye,
  FaArrowLeft,
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
    <div className="container mt-4">
      <div className="text-center mb-4">
        <FaCheckCircle size={50} color="green" />
        <h4 className="fw-bold mt-3">Order #{payment.transaction_id} Placed Successfully!</h4>
        <p className="text-muted">
          We’ll email you the tracking details once your item ships.
        </p>
      </div>

      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <div className="row">
            <div className="col-md-6 mb-3">
              <h6 className="text-dark fw-bold"><FaTruck className="me-2" />Delivery Info</h6>
              <p className="mb-1">Standard Shipping</p>
              <p className="text-success fw-bold">
                Arrives by {new Date(payment.created_at).toDateString()}
              </p>
              <small className="text-muted">Sold by Your Store</small><br />
              <small>Order #{payment.transaction_id}</small>
            </div>

            <div className="col-md-6">
              <h6 className="text-dark fw-bold"><FaHome className="me-2" />Shipping Address</h6>
              <p className="mb-1"><FaUser className="me-1" />{user?.name}</p>
              <p className="mb-1 text-muted">[User's Address Placeholder]</p>
              <p className="mb-1"><FaEnvelope className="me-1" />{user?.email}</p>
            </div>
          </div>

          <hr />

          <div className="d-flex justify-content-around text-center mt-3">
            <div>
              <FaCheckCircle color="green" size={24} />
              <div>Placed</div>
            </div>
            <div>
              <FaCheckCircle color="#ccc" size={24} />
              <div>Processing</div>
            </div>
            <div>
              <FaCheckCircle color="#ccc" size={24} />
              <div>Shipped</div>
            </div>
            <div>
              <FaCheckCircle color="#ccc" size={24} />
              <div>Delivered</div>
            </div>
          </div>

          <hr />

          <div className="d-flex justify-content-between">
            <div>
              <strong>Product:</strong> Crayola 83-Piece Bundle Set<br />
              <span className="text-muted">Qty: 1</span>
            </div>
            <div className="fw-bold fs-5 text-primary">₹{payment.amount}</div>
          </div>
        </Card.Body>
      </Card>

      <div className="d-flex justify-content-center gap-3 mb-5">
        <Button variant="outline-danger" onClick={() => navigate("/")}>
          <FaArrowLeft className="me-2" /> Continue Shopping
        </Button>
        <Button variant="outline-primary" onClick={handleDownloadInvoice}>
          <FaDownload className="me-2" /> Download Invoice
        </Button>
        <Button variant="outline-success" onClick={handleViewInvoice}>
          <FaEye className="me-2" /> View Invoice
        </Button>
      </div>

      {/* Modal for Invoice */}
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
