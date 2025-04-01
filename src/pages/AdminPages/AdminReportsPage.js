import React from "react";
import { Container, Typography } from "@mui/material";
import AdminDashboardPage from "../AdminPages/AdminDashboardPage";
import AdminDashboardpage1 from "../../components/AdminPane/AdminDashboardpage1";
import AdminCustomerGrowthChart from "../../components/AdminPane/AdminCustomerGrowthChart";

const AdminReportsPage = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        p: 3,
        borderRadius: 3,
        bgcolor: "#F5F7FA",
      }}
    >
      {/* Page Title */}
      <Typography
        variant="h4"
        align="center"
        sx={{ fontWeight: "bold", color: "#333", mb: 3 }}
      >
        Admin Reports
      </Typography>

      {/* Customer Growth Chart */}
      <AdminCustomerGrowthChart />

      <br></br>
      <br></br>
      {/* Additional Admin Data */}
      <AdminDashboardpage1 />

      {/* Dashboard with Best-Selling Products & Top Customers */}
      <AdminDashboardPage />
    </Container>
  );
};

export default AdminReportsPage;
