import React, { useState, useEffect } from "react";
import {
  Navbar, Nav, Form, Container, Badge, InputGroup, Modal, Button,
} from "react-bootstrap";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { CiUser } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { fetchApiCartDataRequest } from "../../features/cart/cartActions";
import Footer from "./Footer";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems || []);
  console.log("suumar anna",cartItems)
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    dispatch(fetchApiCartDataRequest());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 3) {
      navigate("/searchpage");
    } else {
      alert("Enter at least 3 characters.");
    }
  };

  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  return (
    <div>
      <Navbar expand="lg" bg="white" fixed="top" className="shadow-sm py-2">
        <Container fluid className="px-3">
          <Navbar.Brand href="/" className="d-flex align-items-center me-3">
            <span className="fw-bold text-primary" style={{ fontSize: "1.3rem" }}>
              Rudra<span className="text-warning">E-Mart</span>
            </span>
            <span className="badge bg-warning text-dark ms-2" style={{
              fontSize: "0.65rem", fontWeight: "600", padding: "4px 8px", borderRadius: "8px",
            }}>
              VIJAYAWADA
            </span>
          </Navbar.Brand>

          <div className="d-none d-lg-flex align-items-center me-3">
            <span
              className="border rounded px-2 py-1 small d-flex align-items-center"
              style={{ cursor: "pointer" }}
              onClick={handleModalOpen}
            >
              <FaMapMarkerAlt className="me-1" />
              Downtown
            </span>
          </div>

          <Form className="flex-grow-1 mx-2" onSubmit={handleSearch}>
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0">
                <BiSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search for groceries, electronics, fashion, home & kitchen..."
                className="border-start-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </Form>

          <Nav className="ms-auto d-flex align-items-center">
            <Nav.Link as={Link} to="/login" className="d-flex align-items-center me-3">
              <CiUser size={20} />
              <span className="d-none d-sm-inline ms-1">Account</span>
            </Nav.Link>

            <Nav.Link as={Link} to="/cart" className="me-2">
              <div className="d-flex align-items-center position-relative">
                <BsCart3 size={20} />
                <Badge
                  pill
                  bg="danger"
                  className="position-absolute"
                  style={{
                    fontSize: "0.65rem",
                    top: "-6px",
                    right: "-10px",
                  }}
                >
                  {cartCount}
                </Badge>
                <span className="d-none d-sm-inline ms-1">Cart</span>
              </div>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Your Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>This is a placeholder modal. You can display a location selector or map here.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleModalClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <div style={{ paddingTop: "80px" }}>
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default Header;
