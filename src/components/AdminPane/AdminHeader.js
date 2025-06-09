import React, { useState, useEffect } from "react";
import { Navbar, Nav, Button, Container, Dropdown, InputGroup, Form } from "react-bootstrap";
import { MdOutlineEmail } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaBars, FaRegUserCircle } from "react-icons/fa";
import { useLocation, Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { useSelector } from "react-redux";
  

const AdminHeader = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();
  const { users = [] } = useSelector((state) => state.users || {});

  const handleSidebarToggle = () => setShowSidebar(!showSidebar);
  const handleSidebarClose = () => setShowSidebar(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("All");


  const filteredUsers = users.filter((user) => {
    const matchesSearchQuery =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone_number.toLowerCase().includes(searchQuery.toLowerCase());

    return filterOption === "All"
      ? matchesSearchQuery
      : matchesSearchQuery && user.role === filterOption;
  });

  useEffect(() => {
    document.body.style.overflow = showSidebar ? "scroll" : "scroll";
    return () => {
      document.body.style.overflow = "scroll";
    };
  }, [showSidebar]);

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
        <Navbar
        className="fixed-top w-100"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          color: "black",
          padding: "10px 20px",
          height: "60px",
          zIndex: 1100,
          boxShadow:
            "0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(0, 0, 0, 0.05)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          backdropFilter: "saturate(180%) blur(10px)",
        }}
      >
        <Container fluid>
         <Navbar.Brand
  href="#home"
  style={{ color: "royalblue", fontWeight: "bold" }}
>
  Admin Panel
</Navbar.Brand>

          {isAdminRoute && (
            <Button
              variant="outline-dark"
              className="d-lg-none"
              onClick={handleSidebarToggle}
              style={{
                border: "none",
                padding: 0,
                marginRight: "20px",
              }}
            >
              <FaBars size={20} />
            </Button>
          )}

          {/* Removed the Navbar.Brand content */}

          <div className="d-flex align-items-center ms-auto">
            {/* Admin User Info Box */}
            <div
              style={{
                padding: "4px 10px",
                color: "black",
                marginLeft: "15px",
                display: "flex",
                flexDirection: "column",
                fontSize: "14px",
              }}
            >
              <span style={{ fontWeight: "bold" }}>Admin</span>
              <span style={{ fontSize: "12px" }}>admin@gmail.com</span>
            </div>
          </div>
        </Container>
      </Navbar>

      {isAdminRoute && (
        <AdminSidebar
          showSidebar={showSidebar}
          handleSidebarClose={handleSidebarClose}
        />
      )}
    </>
  );
};

export default AdminHeader;