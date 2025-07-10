import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  InputGroup,
  Row,
  Col,
  Card,
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteOrderRequest,
  fetchAllOrderRequest,
} from "../../features/order/orderActions";
import { MdModeEditOutline, MdOutlineDeleteOutline } from "react-icons/md";
import { BiSearch } from "react-icons/bi";
import PaginationComponent from "./Pagination";

const OrderTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allOrders = [], loading, error } = useSelector(
    (state) => state.orders || {}
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInactive, setShowInactive] = useState(true);

  const itemsPerPage = 10;
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;

  useEffect(() => {
    dispatch(fetchAllOrderRequest());
  }, [dispatch]);

  const filteredOrders = allOrders.filter((order) => {
    const matchesSearch =
      order?.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order?.total?.toString().includes(searchQuery) ||
      order?.order_id?.toString().includes(searchQuery);

    return showInactive ? matchesSearch : matchesSearch && order?.status !== "Inactive";
  });

  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handleDeleteOrder = (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteOrderRequest(id));
    }
  };

  return (
    <div className="container py-4">
      <Card className="p-4 border-0 shadow-sm rounded-4">
        {/* Header Row */}
        <Row className="align-items-center mb-3 g-2">
          <Col xs={12} md={6} lg={5}>
            <InputGroup>
              <InputGroup.Text>
                <BiSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </Col>

          <Col xs={7} md={4} className="d-flex align-items-center gap-2">
            <Form.Check
              type="switch"
              id="show-inactive-switch"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
            />
            <label htmlFor="show-inactive-switch" className="mb-0">
              Show Inactive
            </label>
          </Col>

          <Col xs={5} md={3} className="text-end">
            <Button
              variant="success"
              className="px-3"
              onClick={() => navigate("/admin/addorderform")}
            >
              + Add Order
            </Button>
          </Col>
        </Row>

        {/* Table */}
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <div className="table-responsive">
            <Table
              bordered
              hover
              responsive
              className="align-middle text-center"
              style={{ minWidth: "900px", fontSize: "0.92rem" }}
            >
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total (₹)</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr key={order.order_id}>
                      <td className="fw-semibold">#{order.order_id}</td>
                      <td>{order.customer_name || order.user_id || "N/A"}</td>
                      <td>₹{order.total}</td>
                      <td>
                        <span
                          className={`badge rounded-pill ${
                            order.status === "Delivered"
                              ? "bg-success"
                              : order.status === "Cancelled"
                              ? "bg-danger"
                              : order.status === "Pending"
                              ? "bg-warning text-dark"
                              : "bg-secondary"
                          }`}
                        >
                          {order.status || "N/A"}
                        </span>
                      </td>
                      <td>{order.payment_status || "Pending"}</td>
                      <td>{new Date(order.order_date).toLocaleDateString()}</td>
                      <td className="d-flex justify-content-center gap-2 flex-wrap">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() =>
                            navigate("/admin/editorders", {
                              state: { order },
                            })
                          }
                        >
                          <MdModeEditOutline size={18} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteOrder(order.order_id)}
                        >
                          <MdOutlineDeleteOutline size={18} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-end mt-3">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default OrderTable;
