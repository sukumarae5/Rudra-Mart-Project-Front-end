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
  Alert,
  Pagination,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDeliveriesRequest,
  deleteDeliveryRequest,
} from "../../features/delivery/deliveryActions";
import {
  deleteDeliveryBoyRequest,
  fetchDeliveryBoysRequest,
} from "../../features/deliveryboydetails/deliveryBoyActions";
import { BiSearch } from "react-icons/bi";
import { MdModeEditOutline, MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const AdminDeliveryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { deliveries, loading, error } = useSelector((state) => state.delivery);
  const { deliveryBoys } = useSelector((state) => state.deliveryBoy);

  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [deliveryPage, setDeliveryPage] = useState(1);
  const [boyPage, setBoyPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchDeliveriesRequest("All"));
    dispatch(fetchDeliveryBoysRequest());
  }, [dispatch]);

  const handleStatusFilterChange = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    dispatch(fetchDeliveriesRequest(status));
    setDeliveryPage(1); // Reset page on filter
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this delivery?")) {
      dispatch(deleteDeliveryRequest(id));
    }
  };

  const filteredDeliveries = deliveries.filter((d) =>
    d.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedDeliveries = filteredDeliveries.slice(
    (deliveryPage - 1) * itemsPerPage,
    deliveryPage * itemsPerPage
  );
  const deliveryPages = Math.ceil(filteredDeliveries.length / itemsPerPage);

  const paginatedBoys = deliveryBoys.slice(
    (boyPage - 1) * itemsPerPage,
    boyPage * itemsPerPage
  );
  const boyPages = Math.ceil(deliveryBoys.length / itemsPerPage);

  const renderPagination = (totalPages, currentPage, setPage) => (
    <Pagination className="justify-content-end">
      <Pagination.First onClick={() => setPage(1)} disabled={currentPage === 1} />
      <Pagination.Prev onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
      {Array.from({ length: totalPages }, (_, i) => (
        <Pagination.Item
          key={i + 1}
          active={currentPage === i + 1}
          onClick={() => setPage(i + 1)}
        >
          {i + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
      <Pagination.Last onClick={() => setPage(totalPages)} disabled={currentPage === totalPages} />
    </Pagination>
  );

  return (
    <div className="container py-4">
      {/* Delivery Table */}
      <Card className="border-0 shadow-sm rounded-4 p-4 mb-4">
        <Row className="align-items-center mb-3">
          <Col xs={12} md={6}>
            <h4 className="fw-bold">Delivery Management</h4>
          </Col>
        </Row>

        <Row className="align-items-center g-2 mb-3">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>
                <BiSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by customer..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setDeliveryPage(1); // Reset page on search
                }}
              />
            </InputGroup>
          </Col>

          <Col md={3} className="ms-auto">
            <Form.Select
              value={selectedStatus}
              onChange={handleStatusFilterChange}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Failed">Failed</option>
            </Form.Select>
          </Col>
        </Row>

        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="table-responsive">
          <Table bordered hover className="align-middle text-center">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Status</th>
                <th>Delivery Person</th>
                <th>Customer</th>
                <th>Address</th>
                <th>Estimated Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDeliveries.length > 0 ? (
                paginatedDeliveries.map((d) => (
                  <tr key={d.delivery_id}>
                    <td>#{d.order_id}</td>
                    <td>
                      <span className={`badge rounded-pill 
                        ${d.status === "Delivered"
                          ? "bg-success"
                          : d.status === "Pending"
                          ? "bg-warning text-dark"
                          : d.status === "Failed"
                          ? "bg-danger"
                          : "bg-secondary"}`}>
                        {d.status}
                      </span>
                    </td>
                    <td>{d.delivery_boy_name || "N/A"}</td>
                    <td>{d.customer_name || "N/A"}</td>
                    <td>{d.address}</td>
                    <td>{d.estimated_time}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() =>
                            navigate(`/admin/editdelivery/${d.delivery_id}`, {
                              state: { delivery: d },
                            })
                          }
                        >
                          <MdModeEditOutline size={18} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(d.delivery_id)}
                        >
                          <MdOutlineDeleteOutline size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No deliveries found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {renderPagination(deliveryPages, deliveryPage, setDeliveryPage)}
      </Card>

      {/* Delivery Boy Table */}
      <Card className="border-0 shadow-sm rounded-4 p-4">
        <Row className="align-items-center justify-content-between mb-3">
          <Col>
            <h5 className="fw-semibold">Delivery Boys</h5>
          </Col>
          <Col className="text-end">
            <Button
              variant="success"
              onClick={() => navigate("/admin/add-delivery-boy")}
            >
              + Add Delivery Boy
            </Button>
          </Col>
        </Row>

        <div className="table-responsive">
          <Table bordered hover className="align-middle text-center">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBoys.length > 0 ? (
                paginatedBoys.map((boy) => (
                  <tr key={boy.id}>
                    <td>{boy.id}</td>
                    <td>{boy.name}</td>
                    <td>{boy.phone}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() =>
                            navigate(`/admin/edit-delivery-boy/${boy.id}`, {
                              state: { boy },
                            })
                          }
                        >
                          <MdModeEditOutline size={18} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            if (
                              window.confirm("Are you sure you want to delete this delivery boy?")
                            ) {
                              dispatch(deleteDeliveryBoyRequest(boy.id));
                            }
                          }}
                        >
                          <MdOutlineDeleteOutline size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No delivery boys found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {renderPagination(boyPages, boyPage, setBoyPage)}
      </Card>
    </div>
  );
};

export default AdminDeliveryPage;
