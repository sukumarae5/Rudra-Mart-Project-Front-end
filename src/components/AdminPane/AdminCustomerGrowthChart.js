import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchusersrequest } from "../../features/user/userActions";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Box,
} from "@mui/material";

const AdminCustomerGrowthChart = () => {
  const dispatch = useDispatch();
  const { users = [], customerCount = 0 } = useSelector((state) => state.users);

  const [timeRange, setTimeRange] = useState("year"); // Default: Last 12 months
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    dispatch(fetchusersrequest());
  }, [dispatch]);

  useEffect(() => {
    const now = new Date();
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    if (timeRange === "year") {
      // **Last 12 Months Data**
      let monthlyData = Array.from({ length: 12 }, (_, i) => ({
        month: months[i],
        newCustomers: 0,
        existingCustomers: 0,
      }));

      users.forEach((user) => {
        const createdAt = new Date(user.created_at);
        if (!isNaN(createdAt) && createdAt.getFullYear() === now.getFullYear()) {
          monthlyData[createdAt.getMonth()].newCustomers += 1;
        }
      });

      let cumulativeCustomers = 0;
      monthlyData = monthlyData.map((data) => {
        cumulativeCustomers += data.newCustomers;
        return {
          ...data,
          existingCustomers: Math.max(customerCount - cumulativeCustomers, 0),
        };
      });

      setChartData(monthlyData);
    } else if (timeRange === "thisMonth") {
      // **This Month's Data**
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      let dailyData = Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        newCustomers: 0,
        existingCustomers: 0,
      }));

      users.forEach((user) => {
        const createdAt = new Date(user.created_at);
        if (
          !isNaN(createdAt) &&
          createdAt.getMonth() === now.getMonth() &&
          createdAt.getFullYear() === now.getFullYear()
        ) {
          dailyData[createdAt.getDate() - 1].newCustomers += 1;
        }
      });

      let cumulativeCustomers = 0;
      dailyData = dailyData.map((data) => {
        cumulativeCustomers += data.newCustomers;
        return {
          ...data,
          existingCustomers: Math.max(customerCount - cumulativeCustomers, 0),
        };
      });

      setChartData(dailyData);
    }
  }, [users, customerCount, timeRange]);

  return (
    <Card sx={{ boxShadow: 5, borderRadius: 3, bgcolor: "#FFF" }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#444" }}>
            Customer Growth
          </Typography>
          <FormControl
            size="small"
            sx={{ minWidth: 180, background: "#fff", borderRadius: 1 }}
          >
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="year">Last 12 Months</MenuItem>
              <MenuItem value="thisMonth">This Month</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis
              dataKey={timeRange === "year" ? "month" : "day"}
              tickFormatter={(val) =>
                timeRange === "year"
                  ? val
                  : `${new Date().toLocaleString("default", {
                      month: "short",
                    })} ${val}`
              }
              stroke="#37474F"
            />
            <YAxis allowDecimals={false} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Legend />

            {/* Adjusted barSize for better visualization */}
            <Bar
              dataKey="existingCustomers"
              fill="#B0BEC5"
              name="Returning Customers"
              barSize={12}
            />
            <Bar
              dataKey="newCustomers"
              fill="#1976D2"
              name="New Customers"
              barSize={12}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AdminCustomerGrowthChart;
