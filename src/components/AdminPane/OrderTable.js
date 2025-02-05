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
} from "react-bootstrap";
import PaginationComponent from "./Pagination";
import { MdModeEditOutline, MdOutlineDeleteOutline } from "react-icons/md";
import { GoPlus } from "react-icons/go";

const OrderTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders = [] } = useSelector((state) => state.orders || {});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("All");
  const [selectedOrders, setSelectedOrders] = useState([]);

  useEffect(() => {
    dispatch(fetchOrdersRequest());
  }, [dispatch]);

  const handleEditSelectedOrders = () => {
    if (selectedOrders.length !== 1) {
      alert("Please select exactly one order to edit.");
      return;
    }

    const orderToEdit = orders.find((order) => order.id === selectedOrders[0]);

    if (!orderToEdit) {
      alert("Order data not found.");
      return;
    }

    navigate("/admin", { state: { order: orderToEdit } });
  };

  const handleDeleteSelectedOrders = async () => {
    if (selectedOrders.length === 0) {
      alert("Please select at least one order to delete.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete selected orders?")) {
      return;
    }

    try {
      await Promise.all(
        selectedOrders.map(async (orderId) => {
          const response = await fetch(
            `http://192.168.1.6:3000/api/orders/delete/${orderId}`,
            {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to delete order");
          }
        })
      );

      alert("Selected orders deleted successfully!");
      dispatch(fetchOrdersRequest());
      setSelectedOrders([]);
    } catch (error) {
      console.error("Error deleting orders:", error);
      alert("Error: Could not delete orders");
    }
  };

  const handleCheckboxChange = (orderId) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId)
        : [...prevSelected, orderId]
    );
  };

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;

  const filteredOrders = orders.filter((order) => {
    const matchesSearchQuery =
      (order?.customerName?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (order?.orderStatus?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (order?.totalAmount?.toString() || "").includes(searchQuery);

    return filterOption === "All"
      ? matchesSearchQuery
      : matchesSearchQuery && order?.orderStatus === filterOption;
  });

  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container-fluid">
      <Row className="align-items-center mb-3">
        <Col xs={12} md={6} className="text-md-start text-center">
          <h1 style={{ fontSize: "2rem", color: " #131523", fontWeight: "bold" }}>
            Orders
          </h1>
        </Col>
        <Col xs={12} md={6} className="text-md-end d-flex justify-content-end mt-2 mt-md-0">
          <Button
            onClick={() => navigate("/admin/addorder")}
            className="d-flex align-items-center mx-auto mx-md-0"
            style={{
              fontSize: "1.1rem",
              padding: "0.5rem 1rem",
              backgroundColor: " #1E5EFF",
              border: "none",
            }}
          >
            <GoPlus style={{ marginRight: "8px", fontSize: "1.5rem" }} />
            Add Order
          </Button>
        </Col>
      </Row>

      <Row className="align-items-center mb-3">
        <Col xs={12} md={6} className="d-flex justify-content-start mb-2 mb-md-0">
          <DropdownButton
            variant="light"
            title={`Filter: ${filterOption}`}
            onSelect={(selectedFilter) => setFilterOption(selectedFilter)}
            style={{ border: "1px solid #1E5EFF", color: " #1E5EFF" }}
          >
            <Dropdown.Item eventKey="All">All</Dropdown.Item>
            <Dropdown.Item eventKey="Pending">Pending</Dropdown.Item>
            <Dropdown.Item eventKey="Completed">Completed</Dropdown.Item>
            <Dropdown.Item eventKey="Cancelled">Cancelled</Dropdown.Item>
          </DropdownButton>

          <InputGroup style={{ width: "300px", marginLeft: "10px" }}>
            <Form.Control
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Col>

        <Col xs={12} md={6} className="d-flex justify-content-end gap-2">
          <Button
            variant="light"
            size="sm"
            onClick={handleEditSelectedOrders}
            style={{ border: "1px solid #1E5EFF" }}
          >
            <MdModeEditOutline style={{ color: " #1E5EFF" }} />
          </Button>
          <Button
            variant="light"
            size="sm"
            onClick={handleDeleteSelectedOrders}
            style={{ border: "1px solid #1E5EFF" }}
          >
            <MdOutlineDeleteOutline style={{ color: " #1E5EFF" }} />
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>
              <Form.Check
                type="checkbox"
                onChange={(e) =>
                  setSelectedOrders(
                    e.target.checked ? currentOrders.map((order) => order.id) : []
                  )
                }
                checked={
                  selectedOrders.length === currentOrders.length && currentOrders.length > 0
                }
              />
            </th>
            <th>Order ID</th>
            <th>Customer Name</th>
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
                <td>{indexOfFirstOrder + index + 1}</td>
                <td>{order.customerName || "N/A"}</td>
                <td>{order.orderStatus || "N/A"}</td>
                <td>${order.totalAmount?.toFixed(2) || "N/A"}</td>
                <td>{order.orderDate || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No orders available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default OrderTable;
