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
            top: "60px",
            left: 0,
            backgroundColor: "rgb(6, 107, 133)", // Corrected color
            boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
            padding: "20px",
            zIndex: 1040,
            overflowY: "auto",
          }}
        >
          <Nav className="flex-column">
            {menuItems.map(({ path, icon, label }) => (
              <Nav.Link
                key={path}
                as={Link}
                to={path}
                className={`d-flex align-items-center gap-2 text-white ${
                  location.pathname === path ? "fw-bold text-primary" : ""
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
          backgroundColor: "rgb(6, 107, 133)", // Same as large screen sidebar
          top: "60px",
          height: "calc(100vh - 60px)",
          zIndex: 1040,
          overflowY: "auto",
        }}
      >
        <Offcanvas.Header closeButton className="custom-close-btn">
          <Offcanvas.Title className="text-white">Admin Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {menuItems.map(({ path, icon, label }) => (
              <Nav.Link
                key={path}
                as={Link}
                to={path}
                onClick={handleSidebarClose}
                className={`d-flex align-items-center gap-2 text-white ${
                  location.pathname === path ? "fw-bold text-primary" : ""
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
        style={{
          marginLeft: isLargeScreen ? "150px" : "0", 
          marginTop: "40px",
          minHeight: "calc(100vh - 60px)",
          overflowY: "auto",
        }}
      >
        <Container fluid>
          <Outlet />
        </Container>
      </div>

      {/* Custom Styles */}
      <style>
        {`
          .custom-close-btn .btn-close {
            filter: invert(1); /* Makes the close button white */
          }
        `}
      </style>
    </>
  );
};

// Sidebar Menu Items
const menuItems = [
  { path: "/admin/admindashboard", icon: <FaHome />, label: "Dashboard" },
  { path: "/admin/adminorders", icon: <IoReorderThree />, label: "Orders" },
  { path: "/admin/adminproducts", icon: <FaProductHunt />, label: "Products" },
  { path: "/admin/categories", icon: <BiSolidCategory />, label: "Categories" },
  { path: "/admin/adminusers", icon: <FaUser />, label: "Customers" },
  { path: "/admin/adminreports", icon: <HiOutlineDocumentReport />, label: "Reports" },
  { path: "/admin/admininbox", icon: <IoMdMail />, label: "Inbox" },
  { path: "/admin/adminprofile", icon: <FaUser />, label: "Personal Settings" },
  { path: "/login", icon: <FaUser />, label: "Logout" },
];

export default AdminSidebar;
