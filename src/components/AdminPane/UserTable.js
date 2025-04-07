import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchusersrequest } from "../../features/user/userActions";
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

const UserTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users = [] } = useSelector((state) => state.users || {});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("All");
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    dispatch(fetchusersrequest());
  }, [dispatch]);

  const handleEditSelectedUsers = () => {
    if (selectedUsers.length !== 1) {
      alert("Please select exactly one user to edit.");
      return;
    }

    const userToEdit = users.find((user) => user.id === selectedUsers[0]);
    if (!userToEdit) {
      alert("User data not found.");
      return;
    }

    navigate("/admin/edituser", { state: { user: userToEdit } });
  };

  const handleDeleteSelectedUsers = async () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user to delete.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete selected users?")) {
      return;
    }

    try {
      await Promise.all(
        selectedUsers.map(async (userId) => {
          const response = await fetch(
            `http://192.168.1.12:8081/api/users/delete/${userId}`,
            {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
            }
          );

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "Failed to delete user");
          }
        })
      );

      alert("Selected users deleted successfully!");
      dispatch(fetchusersrequest());
      setSelectedUsers([]);
    } catch (error) {

      console.error("Error deleting users:", error);
      alert("Error: Could not delete users");
    }
  };

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;

  const filteredUsers = users.filter((user) => {
    const matchesSearchQuery =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone_number.toLowerCase().includes(searchQuery.toLowerCase());

    return filterOption === "All"
      ? matchesSearchQuery
      : matchesSearchQuery && user.role === filterOption;
  });

  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container-fluid">
      {/* Header Section */}
      <Row className="align-items-center mb-3">
        <Col xs={12} md={6} className="text-md-start text-center">
          <h2
            className="fw-bold"
            style={{ fontSize: "2rem", color: " #131523", fontWeight: "bold" }}
          >
            Users
          </h2>
        </Col>
        <Col xs={12} md={6} className="d-flex justify-content-end">
          <Button
            onClick={() => navigate("/admin/addusers")}
            className="d-flex align-items-center"
            style={{
              fontSize: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#1E5EFF",
              border: "none",
            }}
          >
            <GoPlus className="me-2" size={20} />
            Add User
          </Button>
        </Col>
      </Row>

      {/* Filters, Search, and Bulk Actions */}
      <Card className="p-4 shadow-lg border-0 rounded-3">
        <Row className="align-items-center">
          <Col xs={12} md={6} className="d-flex mb-2 mb-md-0">
            <DropdownButton
              variant="outline-primary"
              title={`Filter: ${filterOption}`}
              onSelect={(selectedFilter) => setFilterOption(selectedFilter)}
            >
              <Dropdown.Item eventKey="All">All</Dropdown.Item>
              <Dropdown.Item eventKey="Admin">Admin</Dropdown.Item>
              <Dropdown.Item eventKey="User">User</Dropdown.Item>
            </DropdownButton>

            <InputGroup className="ms-3">
              <Form.Control
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </Col>

          {/* Bulk Actions */}
          <Col xs={12} md={6} className="d-flex justify-content-end">
            <Button
              variant="outline-primary"
              className="me-2"
              disabled={selectedUsers.length !== 1}
              onClick={handleEditSelectedUsers}
            >
              <MdModeEditOutline size={20} />
            </Button>
            <Button
              variant="outline-danger"
              disabled={selectedUsers.length === 0}
              onClick={handleDeleteSelectedUsers}
            >
              <MdOutlineDeleteOutline size={20} />
            </Button>
          </Col>
        </Row>

        {/* Table */}
        <Table striped bordered hover responsive className="mt-3 shadow-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th>
                <Form.Check
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedUsers(
                      e.target.checked
                        ? currentUsers.map((user) => user.id)
                        : []
                    )
                  }
                  checked={
                    selectedUsers.length === currentUsers.length &&
                    currentUsers.length > 0
                  }
                />
              </th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleCheckboxChange(user.id)}
                    />
                  </td>
                  <td>{indexOfFirstUser + index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  <td>{user.phone_number}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No users available.
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
      </Card>
    </div>
  );
};

export default UserTable;
