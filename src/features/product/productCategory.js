import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Badge } from "react-bootstrap";
import { IoBagOutline } from "react-icons/io5";
import { IoIosDesktop } from "react-icons/io";
import { IoBookOutline } from "react-icons/io5";
import { BsSmartwatch } from "react-icons/bs";
import { CiCamera } from "react-icons/ci";
import { GiLighter } from "react-icons/gi";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { IoHeadsetOutline } from "react-icons/io5";
import { IoGiftOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { setSelectedProduct } from "./productActions";
import { CiMobile4 } from "react-icons/ci";
import { fetchApiCartDataRequest } from "../cart/cartActions";
import { FaEye } from "react-icons/fa";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import {
  addToWishlistRequest,
  removeWishlistProductRequest,
} from "../wishlist/wishlistAction";

// Material UI imports
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const ProductCategory = () => {
  const { products = [] } = useSelector((state) => state.products || {});
  const { cartItems = [] } = useSelector((state) => state.cart || {});
  const { wishlistData = [] } = useSelector((state) => state.wishlist || {});
  const wishlistItems = Array.isArray(wishlistData[0])
    ? wishlistData[0]
    : wishlistData;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const categoryCardClick = (categoryid) => {
    const filtered = products.filter(
      (product) => String(product.category_id) === String(categoryid)
    );
    setFilteredProducts(filtered);
    setActiveCategory(categoryid);
  };

  const scrollCategory = (direction) => {
    const container = document.getElementById("scroll-category-product");
    const scrollAmount = 300;
    if (direction === "left") {
      container.scrollLeft -= scrollAmount;
    } else if (direction === "right") {
      container.scrollLeft += scrollAmount;
    }
  };

  const handleCardClick = (productId, product) => {
    dispatch(setSelectedProduct(product));
    navigate("/productpage");
  };

  const handleWishlistClick = (e, product) => {
    e.stopPropagation();
    const userData = localStorage.getItem("user");
    if (!userData) {
      showSnackbar("User not found. Please log in.", "error");
      return;
    }

    const user = JSON.parse(userData);
    if (!user?.id || !product?.id) {
      showSnackbar("Invalid user or product data", "error");
      return;
    }

    dispatch(addToWishlistRequest(product.id));
    showSnackbar("Added to wishlist!", "success");
  };

  const handleAddToCart = async (event, product) => {
    event.stopPropagation();

    try {
      const userToken = localStorage.getItem("authToken");
      if (!userToken) {
        showSnackbar("Session expired. Please log in.", "error");
        navigate("/login");
        return;
      }

      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        showSnackbar("User info missing. Please log in.", "error");
        navigate("/login");
        return;
      }

      const isProductInCart = cartItems.some(
        (item) => item.user_id === user.id && item.product_id === product.id
      );
      if (isProductInCart) {
        showSnackbar("Product already in cart", "warning");
        return;
      }

      const cartItem = {
        user_id: user.id,
        product_id: product.id,
        quantity: 1,
      };

      const response = await fetch(
        `http://${process.env.REACT_APP_IP_ADDRESS}/api/cart/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(cartItem),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        showSnackbar(`Error: ${data.message || response.statusText}`, "error");
        return;
      }

      dispatch(fetchApiCartDataRequest());
      showSnackbar("Product added to cart!", "success");
    } catch (error) {
      console.error("Add to cart error:", error);
      showSnackbar(`Error: ${error.message}`, "error");
    }
  };

  const removeItem = (event, productid) => {
    event.stopPropagation();

    const wishlistItem = wishlistItems.find(
      (item) => Number(item.product_id) === Number(productid)
    );
console.log(wishlistItem)
    if (wishlistItem) {
      dispatch(removeWishlistProductRequest(wishlistItem.id));
      showSnackbar("Removed from wishlist", "info");
    } else {
      showSnackbar("Product not found in wishlist", "warning");
    }
  };

  const categories = [
    { categoryicon: <CiMobile4 />, context: "Phone", categoryid: "1" },
    { categoryicon: <IoIosDesktop />, context: "Computer", categoryid: "2" },
    { categoryicon: <BsSmartwatch />, context: "Smartwatch", categoryid: "5" },
    { categoryicon: <CiCamera />, context: "Camera", categoryid: "3" },
    { categoryicon: <IoHeadsetOutline />, context: "Headphone", categoryid: "6" },
    { categoryicon: <GiLighter />, context: "Lighter", categoryid: "4" },
    { categoryicon: <IoBagOutline />, context: "Handbag", categoryid: "7" },
    { categoryicon: <IoBookOutline />, context: "Books", categoryid: "8" },
    { categoryicon: <IoGiftOutline />, context: "Gifts", categoryid: "9" },
  ];

  return (
    <div>
      <div className="d-flex align-items-center">
        <Badge bg="danger" style={{ width: "20px", height: "50px", marginLeft: "30px", marginRight: "10px" }}></Badge>
        <p style={{ color: "#DB4444", fontWeight: "bold", fontSize: "20px" }}>Categorys</p>
      </div>

      <div className="d-flex justify-content-between align-items-center" style={{ paddingLeft: "3%" }}>
        <h2 style={{ fontSize: "30px" }}>Browse By Category</h2>
        <div>
          <button className="btn btn-light" onClick={() => scrollCategory("left")}><ArrowBackIos /></button>
          <button className="btn btn-light" onClick={() => scrollCategory("right")}><ArrowForwardIos /></button>
        </div>
      </div>

      <Container>
        <Row>
          <Col>
            <div
              id="scroll-category-product"
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-start",
                scrollBehavior: "smooth",
                padding: "0 20px",
                whiteSpace: "nowrap",
                overflowX: "auto",
              }}
            >
              {categories.map((category, index) => (
                <div
                  key={index}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#DB4444"}
                  onMouseLeave={(e) =>
                    e.currentTarget.style.background =
                      activeCategory === category.categoryid ? "#a4a7ab" : "white"
                  }
                  style={{
                    padding: "4%",
                    borderWidth: "2px",
                    borderStyle: "solid",
                    background: activeCategory === category.categoryid ? "#a4a7ab" : "white",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => categoryCardClick(category.categoryid)}
                >
                  <span style={{ fontSize: "40px", padding: "15px" }}>{category.categoryicon}</span>
                  <p style={{ margin: 0 }}>{category.context}</p>
                </div>
              ))}
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            {filteredProducts.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
                {filteredProducts.map((product, index) => (
                  <div
                    key={index}
                    onMouseEnter={() => setHoveredCard(product.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => handleCardClick(product.id, product)}
                    style={{
                      padding: "15px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      background: "#f9f9f9",
                      textAlign: "center",
                      position: "relative",
                    }}>
                    <div
                      style={{
                        position: "absolute",
                        top: "7px",
                        left: "90%",
                        gap: "8px",
                        alignItems: "center",
                        marginBottom: "100px",
                      }}
                    >
                      {wishlistItems.some(item => item.product_id === product.id) ? (
                        <FaHeart
                          style={{ fontSize: "1.3rem", padding: "10%", width: "150%", color: "red", cursor: "pointer", borderRadius: "50%" }}
                          onClick={(e) => removeItem(e, product.id)}
                        />
                      ) : (
                        <FaRegHeart
                          style={{ fontSize: "1.2rem", color: "#575B5A", cursor: "pointer", borderRadius: "40%" }}
                          onClick={(e) => handleWishlistClick(e, product)}
                        />
                      )}

                      <FaEye
                        style={{ fontSize: "1.2rem", color: "gray", cursor: "pointer", borderRadius: "40%" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(product.id, product);
                        }}
                      />
                    </div>

                    <img
                      src={product.image_url}
                      alt={product.name}
                      style={{ width: "99%", padding: "10px", height: "170px", objectFit: "cover", borderRadius: "8px", marginBottom: "10px" }}
                    />

                    <div
                      style={{
                        position: "relative",
                        textAlign: "center",
                        top: "0",
                        left: "0",
                        width: "100%",
                        backgroundColor: "black",
                        color: "white",
                        padding: "12px 0",
                        display: hoveredCard === product.id ? "block" : "none",
                        cursor: "pointer",
                      }}
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      Add to Cart
                    </div>
                    <h5 style={{ margin: "10px 0" }}>{product.name}</h5>
                    <p>Price: ${product.price}</p>
                    <p>${product.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No products found in this category.</p>
            )}
          </Col>
        </Row>
      </Container>

      {/* Snackbar Component */}
      <Snackbar
  open={snackbarOpen}
  autoHideDuration={3000}
  onClose={() => setSnackbarOpen(false)}
  anchorOrigin={{ vertical: "top", horizontal: "center" }}
>
  <MuiAlert
    onClose={() => setSnackbarOpen(false)}
    severity={snackbarSeverity}
    elevation={6}
    variant="filled"
    sx={{ width: "100%", textAlign: "center" }}
  >
    {snackbarMessage}
  </MuiAlert>
</Snackbar>

    </div>
  );
};

export default ProductCategory;
