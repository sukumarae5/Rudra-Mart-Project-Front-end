import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  InputGroup,
  Row,
  Col,
  Card,
  Dropdown,
  DropdownButton,
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteOrderRequest,
  fetchAllOrderRequest,
} from "../../features/order/orderActions";
import { MdModeEditOutline, MdOutlineDeleteOutline } from "react-icons/md";
import PaginationComponent from "./Pagination";
import { BiSearch } from "react-icons/bi";

const OrderTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allOrders = [], loading, error } = useSelector((state) => state.orders || {});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("All");

  const itemsPerPage = 10;
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;

  useEffect(() => {
    dispatch(fetchAllOrderRequest());
  }, [dispatch]);

  const filteredOrders = allOrders.filter((order) => {
    const matchesSearch =
      order?.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order?.total?.toString().includes(searchQuery);
    return filterOption === "All"
      ? matchesSearch
      : matchesSearch && order?.status === filterOption;
  });

  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handleDeleteOrder = (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteOrderRequest(id));
    }
  };

  return (
    <div className="container-fluid mt-3">
      <Card className="p-4 shadow border-0 rounded-3">
        <Row className="align-items-center mb-4">
          <Col>
            <h4 className="fw-bold">Admin Dashboard</h4>
          </Col>
        </Row>

        <Row className="align-items-center mb-3">
          <Col xs={12} md={6}>
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

          <Col md={3}>
            <Form.Select
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Returned">Returned</option>
            </Form.Select>
          </Col>
        </Row>

        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <div className="table-responsive">
            <Table
              striped
              bordered
              hover
              responsive
              className="align-middle text-center"
            >
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total (₹)</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr key={order.order_id}>
                      <td className="fw-semibold">#{order.order_id}</td>
                      <td>{order.user_id || "N/A"}</td>
                      <td>{order.status || "N/A"}</td>
                      <td>₹{order.total}</td>
                      <td>{new Date(order.order_date).toLocaleDateString()}</td>
                      <td className="d-flex justify-content-center gap-2">
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
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}

        <div className="d-flex justify-content-end mt-3">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </Card>
    </div>
  );
};

export default OrderTable;
