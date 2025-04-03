import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchusersrequest } from "../../features/user/userActions";
import { fetchproductsrequest } from "../../features/product/productActions";
import { fetchOrdersRequest } from "../../features/order/orderActions";
import {
  fetchBestSellingProductsRequest,
  fetchTopCustomersRequest,
} from "../../features/admin/adminActions";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const AdminDashboardpage1 = () => {
  const dispatch = useDispatch();
  const { users = [], customerCount = 0 } = useSelector((state) => state.users);
  const { orders = [] } = useSelector((state) => state.orders);
  console.log(orders)
  const [filter, setFilter] = useState("year");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    dispatch(fetchusersrequest());
    dispatch(fetchproductsrequest());
    dispatch(fetchOrdersRequest());
    dispatch(fetchTopCustomersRequest());
    dispatch(fetchBestSellingProductsRequest());
  }, [dispatch]);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const newUsers = users.filter((user) => {
    const createdAt = new Date(user.created_at);
    return (
      createdAt.getMonth() === currentMonth &&
      createdAt.getFullYear() === currentYear
    );
  }).length;

  const existingUsers = Math.max(customerCount - newUsers, 0);

  const stats = [
    { title: "Total Users", value: customerCount, color: "#1976D2", icon: <PeopleAltIcon /> },
    { title: "New Users", value: newUsers, color: "#FF9800", icon: <PersonAddIcon /> },
    { title: "Existing Users", value: existingUsers, color: "#43A047", icon: <PersonIcon /> },
    { title: "Total Orders", value: orders.length, color: "#D32F2F", icon: <ShoppingCartIcon /> },
  ];

  return (
    <Container sx={{ mt: 4 }}>
      {/* 📌 Stats Cards - Fixed Size */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                background: "#fff",
                borderRadius: 3,
                boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s",
                height: 140, // ✅ Fixed Height
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%", justifyContent: "center" }}>
                <Box
                  sx={{
                    background: `linear-gradient(135deg, ${stat.color} 30%, ${stat.color}CC 100%)`,
                    color: "#fff",
                    width: 55,
                    height: 55,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    boxShadow: `0px 4px 10px ${stat.color}55`,
                  }}
                >
                  {React.cloneElement(stat.icon, { fontSize: "large" })}
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ color: "#777", fontWeight: 600, textAlign: "center" }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "#333", textAlign: "center" }}>
                    {stat.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 📊 Orders Chart with Filters */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ boxShadow: 5, borderRadius: 3, bgcolor: "#FFF", p: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#444" }}>
                  Orders Chart
                </Typography>
                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel>Filter By</InputLabel>
                  <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <MenuItem value="year">This Year</MenuItem>
                    <MenuItem value="month">Last Month</MenuItem>
                    <MenuItem value="thisMonth">This Month</MenuItem>
                    <MenuItem value="day">Last 7 Days</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Typography variant="h4" align="center" sx={{ fontWeight: "bold", color: "#D32F2F", my: 2 }}>
                Total Orders: {orders.length}
              </Typography>

              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <XAxis dataKey="label" type="category" stroke="#37474F" />
                  <YAxis dataKey="orderCount" allowDecimals={false} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter name="Orders" data={filteredOrders} fill="#1976D2" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboardpage1;
