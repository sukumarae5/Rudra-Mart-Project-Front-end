import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Toolbar,
  TextField,
  Select,
  MenuItem,
  Button,
  Fab,
  Pagination,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchusersrequest } from "../../features/user/userActions";

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
            `http://192.168.1.10:8081/api/users/admindelete/${userId}`,
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
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone_number.toLowerCase().includes(searchQuery.toLowerCase());

    return filterOption === "All" ? matchSearch : matchSearch && user.role === filterOption;
  });

  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Users
      </Typography>

      <Card variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Toolbar sx={{ flexDirection: "column", gap: 2 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            flexWrap="wrap"
            width="100%"
            gap={2}
          >
            <TextField
              label="Search users"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              sx={{
                minWidth: 200,
                height: "40px",
                "@media (max-width:600px)": { minWidth: "100%" },
              }}
            />

            <Select
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              displayEmpty
              size="small"
              sx={{
                minWidth: 120,
                height: "40px",
                "@media (max-width:600px)": { minWidth: "100%" },
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="User">User</MenuItem>
            </Select>

            <Box>
              <IconButton
                color="primary"
                disabled={selectedUsers.length !== 1}
                onClick={handleEditSelectedUsers}
              >
                <Edit />
              </IconButton>
              <IconButton
                color="error"
                disabled={selectedUsers.length === 0}
                onClick={handleDeleteSelectedUsers}
              >
                <Delete />
              </IconButton>
            </Box>
          </Box>
        </Toolbar>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedUsers.length > 0 &&
                      selectedUsers.length < currentUsers.length
                    }
                    checked={
                      currentUsers.length > 0 &&
                      selectedUsers.length === currentUsers.length
                    }
                    onChange={(e) =>
                      setSelectedUsers(
                        e.target.checked ? currentUsers.map((u) => u.id) : []
                      )
                    }
                  />
                </TableCell>
                <TableCell>S.NO</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Password</TableCell>
                <TableCell>Phone Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user, index) => (
                  <TableRow key={user.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleCheckboxChange(user.id)}
                      />
                    </TableCell>
                    <TableCell>{indexOfFirstUser + index + 1}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.password}</TableCell>
                    <TableCell>{user.phone_number}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No users available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            color="primary"
          />
        </Box>
      </Card>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 32, right: 32 }}
        onClick={() => navigate("/admin/addusers")}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default UserTable;
