import React, { useState, useEffect } from "react";
import { Navbar, Nav, Button, Container, Dropdown } from "react-bootstrap";
import { MdOutlineEmail } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaBars, FaRegUserCircle } from "react-icons/fa";
import { useLocation, Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminHeader = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();

  const handleSidebarToggle = () => setShowSidebar(!showSidebar);
  const handleSidebarClose = () => setShowSidebar(false);

  useEffect(() => {
    document.body.style.overflow = showSidebar ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showSidebar]);

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <Navbar
        className="fixed-top w-100"
        style={{
          backgroundColor: "#6C63FF",
          color: "white",
          padding: "10px 20px",
          height: "60px",
          zIndex: 1100,
        }}
      >
        <Container fluid>
          {isAdminRoute && (
            <Button
              variant="outline-light"
              className="d-lg-none"
              onClick={handleSidebarToggle}
              style={{
                backgroundColor: "transparent",
                border: "none",
                padding: 0,
                marginRight: "20px",
              }}
            >
              <FaBars size={24} className="text-white" />
            </Button>
          )}

          <Navbar.Brand
            as={Link}
            to={isAdminRoute ? "/admin/admindashboard" : "/"}
            className="text-white fw-bold"
          >
            Admin Panel
          </Navbar.Brand>

          <div className="d-flex align-items-center ms-auto">
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                id="dropdown-basic"
                className="d-flex align-items-center text-white mx-2 border-0"
                style={{ padding: 0 }}
              >
                <FaRegUserCircle size={24} className="text-white" />{" "}
                {/* Only the icon here */}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/admin/settings">
                  Profile
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/login">
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Nav.Link
              as={Link}
              to="/admin/notifications"
              className="text-white mx-2"
            >
              <IoMdNotificationsOutline size={24} />
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/inbox" className="text-white mx-2">
              <MdOutlineEmail size={24} />
            </Nav.Link>
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
