
import React from "react";

import {
  Container,
  Typography,
 
} from "@mui/material";

import AdminDashboardPage from "../../pages/AdminPages/AdminDashboardPage";
import AdminDashboardpage1 from "./AdminDashboardpage1";

const Dashboard = () => {
 

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: 4, p: 3, borderRadius: 3, bgcolor: "#F5F7FA" }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#333" }}
      >
        Admin Dashboard
      </Typography>

      
      <AdminDashboardpage1/>
      <AdminDashboardPage />
    </Container>
  );
};

export default Dashboard;

