import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header"; // Regular user header
import AdminHeader from "../AdminPane/AdminHeader";



const AppLayout = () => {
  const location = useLocation();
  const userRole = location.pathname.includes("/admin") ? "admin" : "user";

  return (
    <div>
      {userRole === "admin" ? <AdminHeader /> : <Header />}
     
    </div>
  );
};

export default AppLayout;
