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
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDeliveriesRequest,
  updateDeliveryRequest,
  deleteDeliveryRequest,
} from "../../features/delivery/deliveryActions";
import { deleteDeliveryBoyRequest, fetchDeliveryBoysRequest } from "../../features/deliveryboydetails/deliveryBoyActions";
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
  const [editStates, setEditStates] = useState({});

  useEffect(() => {
    dispatch(fetchDeliveriesRequest("All"));
    dispatch(fetchDeliveryBoysRequest());
  }, [dispatch]);

  const handleStatusFilterChange = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    dispatch(fetchDeliveriesRequest(status));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this delivery?")) {
      dispatch(deleteDeliveryRequest(id));
    }
  };

  const filteredDeliveries = deliveries.filter((d) =>
    d.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid px-1">
      <Card className="border-0 rounded-3 mt-3 p-3">
        <Row className="mb-3">
          <Col>
            <h3 className="fw-bold">Admin Dashboard</h3>
          </Col>
        </Row>

        <Row className="align-items-center mb-3 g-1">
          <Col md={6}>
            <InputGroup style={{ height: "38px" }}>
              <InputGroup.Text>
                <BiSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search deliveries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>

          <Col md={3} className="ms-auto">
            <Form.Select
              value={selectedStatus}
              onChange={handleStatusFilterChange}
              style={{ height: "38px" }}
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
          <Table striped bordered hover responsive className="text-center" style={{ minWidth: "850px" }}>
            <thead className="table-light">
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
              {filteredDeliveries.length > 0 ? (
                filteredDeliveries.map((d) => (
                  <tr key={d.delivery_id}>
                    <td>#{d.order_id}</td>
                    <td>{d.status}</td>
                    <td>{d.delivery_boy_name}</td>
                    <td>{d.customer_name}</td>
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
                          <MdModeEditOutline size={20} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(d.delivery_id)}
                        >
                          <MdOutlineDeleteOutline size={20} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No deliveries found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Delivery Boy Details Section */}
      <Card className="border-0 rounded-3 mt-4 p-3">
        <h5 className="mb-3">Delivery Boy Details</h5>

        <Button
          variant="success"
          className="mb-3"
          onClick={() => navigate("/admin/add-delivery-boy")}
        >
          + Add Delivery Boy
        </Button>

        <div className="table-responsive">
          <Table striped bordered hover responsive className="align-middle text-center">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveryBoys.length > 0 ? (
                deliveryBoys.map((boy) => (
                  <tr key={boy.id}>
                    <td>{boy.id}</td>
                    <td>{boy.name}</td>
                    <td>{boy.phone}</td>
                   
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() =>
                          navigate(`/admin/edit-delivery-boy/${boy.id}`, {
                            state: { boy },
                          })
                        }
                      >
                        Edit
                      </Button>
                      <Button
      variant="outline-danger"
      size="sm"
      onClick={() => {
        if (window.confirm("Are you sure you want to delete this delivery boy?")) {
          dispatch(deleteDeliveryBoyRequest(boy.id));
        }
      }}
    >
      Delete
    </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No delivery boys found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default AdminDeliveryPage;
