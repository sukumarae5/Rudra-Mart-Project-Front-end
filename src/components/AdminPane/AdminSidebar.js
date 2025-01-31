import React, { useState, useEffect } from "react";
import { Nav, Offcanvas, Container } from "react-bootstrap";
import { FaHome, FaProductHunt, FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { IoReorderThree } from "react-icons/io5";
import { BiSolidCategory } from "react-icons/bi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { IoMdMail } from "react-icons/io";
import { Outlet } from "react-router-dom";

const AdminSidebar = ({ showSidebar, handleSidebarClose }) => {
  const location = useLocation();
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);

  // Update screen size on resize
  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Fixed Sidebar for Large Screens */}
      {isLargeScreen && (
        <div
          className="sidebar"
          style={{
            width: "250px",
            height: "100vh",
            position: "fixed",
            top: "60px", // Below navbar
            left: 0,
            backgroundColor: "#F3F3F3",
            boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
            padding: "20px",
            zIndex: 1040,
            overflowY: "scroll", // Enables vertical scrolling
            overflowX: "auto", // Prevents horizontal scrolling
          }}
        >
          <Nav className="flex-column">
            {menuItems.map(({ path, icon, label }) => (
              <Nav.Link
                key={path}
                as={Link}
                to={path}
                className={`d-flex align-items-center gap-2 ${
                  location.pathname === path ? "active fw-bold text-primary" : ""
                }`}
              >
                {icon} <span>{label}</span>
              </Nav.Link>
            ))}
          </Nav>
        </div>
      )}

      {/* Mobile Sidebar (Offcanvas) */}
      <Offcanvas
        show={showSidebar}
        onHide={handleSidebarClose}
        placement="start"
        style={{
          width: "250px",
          backgroundColor: "#F3F3F3",
          top: "60px",
          height: "calc(100vh - 60px)",
          zIndex: 1040,
          overflowY: "auto", // Enables scrolling for long menus
        }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Admin Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {menuItems.map(({ path, icon, label }) => (
              <Nav.Link
                key={path}
                as={Link}
                to={path}
                onClick={handleSidebarClose}
                className={`d-flex align-items-center gap-2 ${
                  location.pathname === path ? "active fw-bold text-primary" : ""
                }`}
              >
                {icon} <span>{label}</span>
              </Nav.Link>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content Area */}
      <div
        className="main-content"
        style={{
          marginLeft: isLargeScreen ? "250px" : "0", // Adjust dynamically
          padding: "20px",
          transition: "margin-left 0.3s ease-in-out",
          marginTop: "60px",
          minHeight: "calc(100vh - 60px)", // Ensures content fills the entire screen
          overflowY: "auto", // Enables vertical scrolling
          overflowX: "auto", // Enables horizontal scrolling if content overflows
        }}
      >
        <Container fluid>
          <Outlet />
        </Container>
      </div>
    </>
  );
};

// Sidebar Menu Items
const menuItems = [
  { path: "/admin/admindashboard", icon: <FaHome />, label: "Dashboard" },
  { path: "/admin/orders", icon: <IoReorderThree />, label: "Orders" },
  { path: "/admin/adminproducts", icon: <FaProductHunt />, label: "Products" },
  { path: "/admin/categories", icon: <BiSolidCategory />, label: "Categories" },
  { path: "/admin/adminusers", icon: <FaUser />, label: "Customers" },
  { path: "/admin/reports", icon: <HiOutlineDocumentReport />, label: "Reports" },
  { path: "/admin/inbox", icon: <IoMdMail />, label: "Inbox" },
  { path: "/admin/settings", icon: <FaUser />, label: "Personal Settings" },
  { path: "/login", icon: <FaUser />, label: "Logout" },
];

export default AdminSidebar;
