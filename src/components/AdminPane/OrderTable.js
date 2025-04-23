import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllOrderRequest } from "../../features/order/orderActions";
import {
  Button,
  Form,
  InputGroup,
  Dropdown,
  DropdownButton,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import PaginationComponent from "./Pagination";
import { MdModeEditOutline, MdOutlineDeleteOutline } from "react-icons/md";

const OrderTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allOrders = [], loading, error } = useSelector((state) => state.orders || {});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("All");
  const [selectedOrders, setSelectedOrders] = useState([]);

  useEffect(() => {
    dispatch(fetchAllOrderRequest());
  }, [dispatch]);

  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;

  const filteredOrders = allOrders.filter((order) => {
    const matchesSearchQuery =
      (order?.status?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (order?.total_price?.toString() || "").includes(searchQuery);

    return filterOption === "All"
      ? matchesSearchQuery
      : matchesSearchQuery && order?.status === filterOption;
  });

  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedOrders([]);
  };

  const handleDeleteOrder = async (orderId) => {
    const confirmed = window.confirm("Are you sure you want to delete this order?");
    if (!confirmed) return;

    try {
      // Uncomment and implement delete API here
      // await deleteOrder(orderId);
      alert("Order deleted successfully!");
      dispatch(fetchAllOrderRequest());
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order.");
    }
  };

  return (
    <div className="container-fluid p-4">
      <Row>
        <Col>
          <Card className="p-4 shadow-lg border-0 rounded-3">
            <Row className="align-items-center mb-3">
              <Col xs={12} md={6}>
                <h1 className="fw-bold" style={{ fontSize: "2rem", color: "#131523" }}>
                  Orders
                </h1>
              </Col>
            </Row>

            <Row className="align-items-center mb-3">
              <Col xs={12} md={6} className="d-flex align-items-center gap-3">
                <DropdownButton
                  variant="outline-primary"
                  title={`Filter: ${filterOption}`}
                  onSelect={(selectedFilter) => setFilterOption(selectedFilter)}
                >
                  <Dropdown.Item eventKey="All">All</Dropdown.Item>
                  <Dropdown.Item eventKey="Pending">Pending</Dropdown.Item>
                  <Dropdown.Item eventKey="Processing">Processing</Dropdown.Item>
                  <Dropdown.Item eventKey="Confirmed">Confirmed</Dropdown.Item>
                  <Dropdown.Item eventKey="Shipped">Shipped</Dropdown.Item>
                  <Dropdown.Item eventKey="Delivered">Delivered</Dropdown.Item>
                  <Dropdown.Item eventKey="Cancelled">Cancelled</Dropdown.Item>
                  <Dropdown.Item eventKey="Returned">Returned</Dropdown.Item>
                </DropdownButton>

                <InputGroup className="w-50">
                  <Form.Control
                    type="text"
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>
              </Col>
            </Row>

            {loading ? (
              <p>Loading orders...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : (
              <Table striped bordered hover responsive className="rounded shadow-sm">
                <thead className="bg-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer ID</th>
                    <th>Status</th>
                    <th>Total Amount</th>
                    <th>Order Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.length > 0 ? (
                    currentOrders.map((order) => (
                      <tr key={order.order_id}>
                        <td className="fw-bold">{order.order_id}</td>
                        <td>{order.user_id || "N/A"}</td>
                        <td
                          className={`fw-bold ${
                            order.status === "Completed"
                              ? "text-success"
                              : order.status === "Pending"
                              ? "text-warning"
                              : "text-danger"
                          }`}
                        >
                          {order.status || "N/A"}
                        </td>
                        <td className="fw-bold">₹{order.total_price}</td>
                        <td>{new Date(order.order_created_at).toLocaleDateString()}</td>
                        <td className="d-flex gap-2 justify-content-center">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            title="Edit Order"
                            onClick={() =>
                              navigate(`/admin/editorders`, {
                                state: { order },
                              })
                            }
                          >
                            <MdModeEditOutline size={18} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            title="Delete Order"
                            onClick={() => handleDeleteOrder(order.order_id)}
                          >
                            <MdOutlineDeleteOutline size={18} />
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            title="Update Tracking"
                            onClick={() =>
                              navigate("/admin/AdminUpdateTracking", {
                                state: {
                                  orderId: order.order_id,
                                  email: order.email || "", // if available
                                  phone: order.phone || "", // if available
                                },
                              })
                            }
                          >
                            🚚
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-4">
                        No orders available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}

            <div className="d-flex justify-content-end mt-3">
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderTable;
