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
} from "react-bootstrap";
import PaginationComponent from "./Pagination";
import { MdModeEditOutline, MdOutlineDeleteOutline } from "react-icons/md";
import { IoMdSearch } from "react-icons/io";
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
            `http://192.168.1.6:3000/api/users/delete/${userId}`,
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
          <h1
            style={{ fontSize: "2rem", color: "#007bff", fontWeight: "bold" }}
          >
            Users
          </h1>
        </Col>
        <Col
          xs={12}
          md={6}
          className="text-md-end d-flex justify-content-end mt-2 mt-md-0"
        >
          <Button
            onClick={() => navigate("/admin/addusers")}
            className="d-flex align-items-center mx-auto mx-md-0"
            style={{
              fontSize: "1.1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#28a745",
              border: "none",
            }}
          >
            <GoPlus style={{ marginRight: "8px", fontSize: "1.5rem" }} />
            Add User Details
          </Button>
        </Col>
      </Row>

      {/* Filters, Search, and Bulk Actions */}
      <Row className="align-items-center mb-3">
        {/* Filter & Search */}
        <Col
          xs={12}
          md={6}
          className="d-flex justify-content-start mb-2 mb-md-0"
        >
          <DropdownButton
            variant="light" // White background
            title={`Filter: ${filterOption}`}
            onSelect={(selectedFilter) => setFilterOption(selectedFilter)}
            style={{ border: "1px solid #007bff", color: "#007bff" }} // Blue border and text
          >
            <Dropdown.Item eventKey="All">All</Dropdown.Item>
            <Dropdown.Item eventKey="Admin">Admin</Dropdown.Item>
            <Dropdown.Item eventKey="User">User</Dropdown.Item>
          </DropdownButton>

          <InputGroup style={{ width: "300px", marginLeft: "10px" }}>
            <InputGroup.Text>
              <IoMdSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Col>

        {/* Bulk Edit & Delete Buttons */}
        <Col xs={12} md={6} className="d-flex justify-content-end gap-2">
          <Button
            variant="light"
            size="sm"
            onClick={handleEditSelectedUsers}
            style={{ border: "1px solid #007bff" }}
          >
            <MdModeEditOutline style={{ color: "#007bff" }} />
          </Button>
          <Button
            variant="light"
            size="sm"
            onClick={handleDeleteSelectedUsers}
            style={{ border: "1px solid #007bff" }}
          >
            <MdOutlineDeleteOutline style={{ color: "#007bff" }} />
          </Button>
        </Col>
      </Row>

      {/* Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>
              <Form.Check
                type="checkbox"
                onChange={(e) =>
                  setSelectedUsers(
                    e.target.checked ? currentUsers.map((user) => user.id) : []
                  )
                }
                checked={
                  selectedUsers.length === currentUsers.length &&
                  currentUsers.length > 0
                }
              />
            </th>
            <th>Id</th>
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
                <td>{user.name || "N/A"}</td>
                <td>{user.email || "N/A"}</td>
                <td>{user.password}</td>
                <td>{user.phone_number || "N/A"}</td>
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
    </div>
  );
};

export default UserTable;
