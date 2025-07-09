import React, { useState, useEffect } from "react";
import { Nav, Offcanvas, Container } from "react-bootstrap";
import { FaHome, FaProductHunt, FaUser } from "react-icons/fa";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  HiOutlineArrowRight,
  HiOutlineDocumentReport,
  HiOutlineLogout,
  HiOutlinePhotograph,
  HiOutlineShoppingBag,
  HiOutlineTag,
  HiOutlineTruck,
  HiOutlineUserGroup,
  HiOutlineViewGrid,
} from "react-icons/hi";

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
            backgroundColor: "rgb(250, 253, 254)",
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
                className={`d-flex align-items-center gap-2 ${
                  location.pathname === path ? "fw-bold text-primary" : "text-dark"
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
          backgroundColor: "rgb(247, 248, 249)",
          top: "60px",
          height: "calc(100vh - 60px)",
          zIndex: 1040,
          overflowY: "auto",
        }}
      >
        <Offcanvas.Header closeButton className="custom-close-btn">
          <Offcanvas.Title className="text-dark">Admin Menu</Offcanvas.Title>
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
                  location.pathname === path ? "fw-bold text-primary" : "text-dark"
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
  { path: "/admin/admindashboard", icon: <HiOutlineViewGrid size={18} />, label: "Dashboard" },
  { path: "/admin/adminproducts", icon: <HiOutlineShoppingBag size={18} />, label: "Products" },
  { path: "/admin/categories", icon: <HiOutlineTag size={18} />, label: "Categories" },
  { path: "/admin/subcategories", icon: <HiOutlineTag size={18} />, label: "Subcategories" },
  { path: "/admin/adminorders", icon: <HiOutlineShoppingBag size={18} />, label: "Orders" },
  { path: "/admin/adminreports", icon: <HiOutlineTruck size={18} />, label: "Delivery" },
  { path: "/admin/adminusers", icon: <HiOutlineUserGroup size={18} />, label: "Users" },
  { path: "/admin/adminbanners", icon: <HiOutlinePhotograph size={18} />, label: "Banners" },
  { path: "/", icon: <HiOutlineArrowRight size={18} />, label: "Back to store" },
  { path: "/", icon: <HiOutlineLogout size={18} />, label: "Logout" },
];

export default AdminSidebar;
