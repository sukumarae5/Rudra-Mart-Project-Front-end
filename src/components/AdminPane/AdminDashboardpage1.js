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
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
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
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const AdminDashboardpage1 = () => {
  const dispatch = useDispatch();
  const { users = [], customerCount = 0 } = useSelector((state) => state.users);
  console.log(users)
  const { orders = [] } = useSelector((state) => state.orders);
  const [filter, setFilter] = useState("year");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    dispatch(fetchusersrequest());
    dispatch(fetchproductsrequest());
    dispatch(fetchOrdersRequest());
    dispatch(fetchTopCustomersRequest());
    dispatch(fetchBestSellingProductsRequest());
  }, [dispatch]);

  useEffect(() => {
    const now = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    if (filter === "year") {
      let monthlyData = Array(12).fill(0);
      orders.forEach((order) => {
        const date = new Date(order.created_at);
        if (!isNaN(date) && date.getFullYear() === now.getFullYear()) {
          monthlyData[date.getMonth()] += 1;
        }
      });
      setFilteredOrders(months.map((month, index) => ({ label: month, orderCount: monthlyData[index] })));
    } else if (filter === "month") {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const daysInLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      let dailyData = Array(daysInLastMonth).fill(0);

      orders.forEach((order) => {
        const date = new Date(order.created_at);
        if (!isNaN(date) && date.getMonth() === lastMonth.getMonth()) {
          dailyData[date.getDate() - 1] += 1;
        }
      });

      setFilteredOrders(dailyData.map((count, index) => ({ label: index + 1, orderCount: count })));
    } else if (filter === "thisMonth") {
      const currentMonth = now.getMonth();
      const daysInThisMonth = new Date(now.getFullYear(), currentMonth + 1, 0).getDate();
      let dailyData = Array(daysInThisMonth).fill(0);

      orders.forEach((order) => {
        const date = new Date(order.created_at);
        if (!isNaN(date) && date.getMonth() === currentMonth) {
          dailyData[date.getDate() - 1] += 1;
        }
      });

      setFilteredOrders(dailyData.map((count, index) => ({ label: index + 1, orderCount: count })));
    } else if (filter === "day") {
      let last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const pastDate = new Date(now);
        pastDate.setDate(now.getDate() - i);
        last7Days.push({ date: pastDate.toISOString().split("T")[0], orderCount: 0 });
      }

      orders.forEach((order) => {
        const date = new Date(order.created_at).toISOString().split("T")[0];
        last7Days = last7Days.map((entry) =>
          entry.date === date ? { ...entry, orderCount: entry.orderCount + 1 } : entry
        );
      });

      setFilteredOrders(last7Days.map((entry) => ({ label: entry.date, orderCount: entry.orderCount })));
    }
  }, [orders, filter]);

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

  const confirmedOrders = orders.filter((order) => order.status === "Confirmed").length;
  const shippedOrders = orders.filter((order) => order.status === "Shipped").length;
  const stats = [
    { title: "Total Users", value: customerCount, color: "#1976D2", icon: <PeopleAltIcon /> },
    { title: "Total Orders", value: orders.length, color: "#D32F2F", icon: <ShoppingCartIcon /> },
    { title: "Confirmed Orders", value: confirmedOrders, color: "#009688", icon: <CheckCircleIcon /> },
    { title: "Shipped Orders", value: shippedOrders, color: "#3F51B5", icon: <LocalShippingIcon /> },
  ];

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card
              sx={{
                background: "#fff",
                borderRadius: 3,
                boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s",
                height: 140,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "center" }}>
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

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ boxShadow: 5, borderRadius: 3, bgcolor: "#FFF", p: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#444" }}>Orders Chart</Typography>
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

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredOrders}>
                  <XAxis dataKey="label" stroke="#37474F" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="orderCount" stroke="#1976D2" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboardpage1;
