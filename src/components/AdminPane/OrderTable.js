import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchOrdersRequest } from "../../features/order/orderActions";
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
import { GoPlus } from "react-icons/go";

const OrderTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get orders state from Redux store
  const { orders = [], loading, error } = useSelector((state) => state.order || {});

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("All");
  const [selectedOrders, setSelectedOrders] = useState([]);

  useEffect(() => {
    if (!orders.length) dispatch(fetchOrdersRequest());
  }, [dispatch, orders.length]);

  const handleCheckboxChange = (orderId) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId)
        : [...prevSelected, orderId]
    );
  };

  // Filter Orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearchQuery =
      (order?.user_id?.toString() || "").includes(searchQuery.toLowerCase()) ||
      (order?.status?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (order?.total_price?.toString() || "").includes(searchQuery);

    return filterOption === "All"
      ? matchesSearchQuery
      : matchesSearchQuery && order?.status === filterOption;
  });

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container-fluid p-4">
      <Card className="p-4 shadow-lg border-0 rounded-3">
        {/* Header Section */}
        <Row className="align-items-center mb-3">
          <Col xs={12} md={6}>
            <h1 className="fw-bold" style={{ fontSize: "2rem", color: "#131523", fontWeight: "bold" }}>
              Orders
            </h1>
          </Col>
          <Col xs={12} md={6} className="text-md-end d-flex justify-content-end">
            <Button
              onClick={() => navigate("/admin/addorder")}
              className="d-flex align-items-center btn-primary shadow"
              style={{ fontSize: "1rem", padding: "0.6rem 1.2rem", borderRadius: "8px", border: "none" }}
            >
              <GoPlus className="me-2" size={22} />
              Add Order
            </Button>
          </Col>
        </Row>

        {/* Filters & Search */}
        <Row className="align-items-center mb-3">
          <Col xs={12} md={6} className="d-flex align-items-center gap-3">
            <DropdownButton
              variant="outline-primary"
              title={`Filter: ${filterOption}`}
              onSelect={(selectedFilter) => setFilterOption(selectedFilter)}
            >
              <Dropdown.Item eventKey="All">All</Dropdown.Item>
              <Dropdown.Item eventKey="Pending">Pending</Dropdown.Item>
              <Dropdown.Item eventKey="Completed">Completed</Dropdown.Item>
              <Dropdown.Item eventKey="Cancelled">Cancelled</Dropdown.Item>
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

          {/* Action Buttons */}
          <Col xs={12} md={6} className="d-flex justify-content-end gap-3">
            <Button variant="outline-primary" size="sm">
              <MdModeEditOutline size={20} />
            </Button>
            <Button variant="outline-danger" size="sm">
              <MdOutlineDeleteOutline size={20} />
            </Button>
          </Col>
        </Row>

        {/* Order Table */}
        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <Table striped bordered hover responsive className="rounded shadow-sm">
            <thead className="bg-light">
              <tr>
                <th>
                  <Form.Check
                    type="checkbox"
                    onChange={(e) =>
                      setSelectedOrders(
                        e.target.checked ? currentOrders.map((order) => order.id) : []
                      )
                    }
                    checked={selectedOrders.length === currentOrders.length && currentOrders.length > 0}
                  />
                </th>
                <th>Order #</th>
                <th>Customer ID</th>
                <th>Status</th>
                <th>Total Amount</th>
                <th>Order Date</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.length > 0 ? (
                currentOrders.map((order, index) => (
                  <tr key={order.id}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleCheckboxChange(order.id)}
                      />
                    </td>
                    <td className="fw-bold">{indexOfFirstOrder + index + 1}</td>
                    <td>{order.user_id || "N/A"}</td>
                    <td className={`fw-bold ${order.status === "Completed" ? "text-success" : order.status === "Pending" ? "text-warning" : "text-danger"}`}>
                      {order.status || "N/A"}
                    </td>
                    <td className="fw-bold">${order.total_price?.toFixed(2) || "N/A"}</td>
                    <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No orders available.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}

        {/* Pagination */}
        <div className="d-flex justify-content-end mt-3">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </Card>
    </div>
  );
};

export default OrderTable;
