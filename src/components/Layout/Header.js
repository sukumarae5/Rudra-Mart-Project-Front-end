import React, { useState, useEffect } from "react";
import {
  Navbar, Nav, Form, Container, Badge, InputGroup, Modal, Button,
  Dropdown,
} from "react-bootstrap";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { BsCart3 } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { CiUser } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { fetchApiCartDataRequest } from "../../features/cart/cartActions";
import Footer from "./Footer";
import { FaUserCircle } from "react-icons/fa";
import { searchquryproduct } from "../../features/product/productActions";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [locationName, setLocationName] = useState("Downtown");
  const [comingSoonModal, setComingSoonModal] = useState(false);
  const [manualLocation, setManualLocation] = useState(""); // ✅ FIXED

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    dispatch(fetchApiCartDataRequest());
  }, [dispatch]);

  const isLoggedIn = !!localStorage.getItem("authToken");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 3) {
      dispatch(searchquryproduct(searchQuery.trim()))
      navigate("/searchpage");
    } else {
      alert("Enter at least 3 characters.");
    }
  };

  const handleDowntownClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLocationByCoords = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await response.json();
      const address = data.address;
      const fullLocation = [
        address.road,
        address.neighbourhood,
        address.suburb,
        address.city || address.town || address.village,
        address.postcode
      ].filter(Boolean).join(', ');

      const city = address.city || address.town || address.village;

      if (city?.toLowerCase() === 'hyderabad') {
        setLocationName(fullLocation);
        alert(`Location detected: ${fullLocation}`);
        handleCloseModal();
      } else {
        setShowModal(false);
        setComingSoonModal(true);
      }
    } catch (err) {
      console.error('Error fetching reverse geocode:', err);
      alert('Could not fetch your address');
    }
  };

  const handleManualSearch = async () => {
    if (!manualLocation) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(manualLocation)}&format=json&limit=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        handleLocationByCoords(lat, lon);
      } else {
        alert('No results found for the entered location.');
      }
    } catch (error) {
      console.error('Error searching address:', error);
      alert('Error occurred while searching for location.');
    }
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handleLocationByCoords(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve your location. Please allow location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div>
      <Navbar expand="lg" bg="white" fixed="top" className="shadow-sm py-2">
        <Container fluid className="px-3">
          <Navbar.Brand href="/" className="d-flex align-items-center me-3">
            <span className="fw-bold text-primary" style={{ fontSize: "1.3rem" }}>
              Rudra<span className="text-warning">E-Mart</span>
            </span>
            <span
              className="badge bg-warning text-dark ms-2"
              style={{
                fontSize: "0.65rem",
                fontWeight: "600",
                padding: "4px 8px",
                borderRadius: "8px",
              }}
            >
              VIJAYAWADA
            </span>
          </Navbar.Brand>

          <Button
            size="sm"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleDowntownClick}
            style={{
              backgroundColor: isHovered ? "gold" : "transparent",
              borderColor: isHovered ? "gold" : "black",
              color: "black",
              display: "flex",
              alignItems: "center",
              maxWidth: "250px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            <i className="bi bi-geo-alt-fill me-1"></i>
            {locationName}
          </Button>

         <Form className="flex-grow-1 mx-2" onSubmit={handleSearch}>
<InputGroup className="w-10000">
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
  {/* Home Link */}
  <Nav.Link as={Link} to="/" className="d-flex align-items-center me-3">
    <span className="d-none d-sm-inline ms-1">Home</span>
  </Nav.Link>

  {/* Account/Login or Logout */}
  {isLoggedIn ? (
    <Dropdown className="me-3">
      <Dropdown.Toggle variant="light" className="d-flex align-items-center border-0">
        <FaUserCircle size={20} />
        <span className="d-none d-sm-inline ms-2 fs-7">Account</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          navigate("/login");
          window.location.reload();
        }}>
          Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  ) : (
    <Nav.Link as={Link} to="/login" className="d-flex align-items-center me-3">
      <CiUser size={20} />
      <span className="d-none d-sm-inline ms-1" style={{fontSize:"50%"}}>Account</span>
    </Nav.Link>
  )}

  {/* Cart */}
  <Nav.Link as={Link} to="/cartpagemain" className="d-flex align-items-center me-3 position-relative">
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
  </Nav.Link>
</Nav>

        </Container>
      </Navbar>

      {/* Location Detection Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Welcome to FlashCart!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please provide your delivery location to see products at nearby stores</p>
          <Button
            variant="primary"
            className="w-100 mb-3"
            onClick={handleDetectLocation}
          >
            Detect my location
          </Button>
          <InputGroup className="mb-2">
            <Form.Control
              placeholder="Search delivery location"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
            />
            <Button variant="warning" onClick={handleManualSearch}>
              Search
            </Button>
          </InputGroup>
        </Modal.Body>
      </Modal>

      {/* Coming Soon Modal */}
      <Modal show={comingSoonModal} onHide={() => setComingSoonModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Coming Soon</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>We're coming soon to your area. Stay tuned!</p>
          <div className="text-center">
            <Button variant="warning" onClick={() => setComingSoonModal(false)}>
              OK
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <div style={{ paddingTop: "80px" }}>
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default Header;
