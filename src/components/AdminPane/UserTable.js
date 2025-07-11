import { useEffect, useState } from "react";
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
  IconButton,
  Toolbar,
  TextField,
  Select,
  MenuItem,
  Fab,
  Pagination,
  Tooltip,
  Paper,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteUsersRequest,
  fetchusersrequest,
} from "../../features/user/userActions";

const UserTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users = [] } = useSelector((state) => state.users || {});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("All");

  useEffect(() => {
    dispatch(fetchusersrequest());
  }, [dispatch]);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phonenumber?.toLowerCase().includes(searchQuery.toLowerCase());

    return filterOption === "All"
      ? matchSearch
      : matchSearch && user.role === filterOption;
  });

  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleEdit = (user) => {
    navigate("/admin/edituser", { state: { user } });
  };

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUsersRequest([userId]));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={3} color="primary.dark">
        Manage Users
      </Typography>

      <Card
        variant="outlined"
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          boxShadow: 4,
          backgroundColor: "#fff",
        }}
      >
        {/* Filters */}
        <Toolbar sx={{ px: 0, mb: 2 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            flexWrap="wrap"
            width="100%"
            gap={2}
          >
            <TextField
              label="Search by name, email or phone"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              sx={{ minWidth: 220 }}
            />

            <Select
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              displayEmpty
              size="small"
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="All">All Roles</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="User">User</MenuItem>
            </Select>
          </Box>
        </Toolbar>

        {/* Table */}
        <TableContainer
          component={Paper}
          elevation={1}
          sx={{ borderRadius: 2 }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f1f1f1" }}>
                <TableCell sx={{ fontWeight: "bold" }}>S.No</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user, index) => (
                  <TableRow
                    key={user.id}
                    hover
                    sx={{
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    <TableCell>{indexOfFirstUser + index + 1}</TableCell>
                    <TableCell>
                      <Typography fontWeight={500}>{user.name}</Typography>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phonenumber}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" fontStyle="italic">
                      No users available.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            color="primary"
          />
        </Box>
      </Card>

      {/* Floating Action Button */}
      <Tooltip title="Add New User">
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: "fixed", bottom: 32, right: 32 }}
          onClick={() => navigate("/admin/addusers")}
        >
          <Add />
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default UserTable;
