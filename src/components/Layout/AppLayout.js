import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header"; // Regular user header
import AdminHeader from "../AdminPane/AdminHeader";
import CheckoutPage from "../../pages/CheckoutPage";


const AppLayout = () => {
  const location = useLocation();
  const userRole = location.pathname.includes("/admin") ? "admin" : "user";
  const checkout=location.pathname.includes("/CheckoutPage")
  return (
    <div>
      {userRole === "admin" ? <AdminHeader /> : <Header />}
    </div>
  );
};

export default AppLayout;
