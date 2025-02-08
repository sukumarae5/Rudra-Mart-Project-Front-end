import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
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
import { addToCart } from "../cart/cartActions";
import { addToWishlist } from "../product/productActions";
import { FaEye } from "react-icons/fa";
import { FaRegHeart, FaHeart } from "react-icons/fa";

const ProductCategory = () => {
  const { products = [] } = useSelector((state) => state.products || {});
  const { cartItems = [] } = useSelector((state) => state.cart || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [clickedProducts, setClickedProducts] = useState(new Set());

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
    const isClicked = clickedProducts.has(product.id);
    if (isClicked) {
      setClickedProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    } else {
      setClickedProducts((prev) => new Set(prev).add(product.id));
      dispatch(addToWishlist(product));
    }
  };

  const handleAddToCart = (event, product) => {
    event.stopPropagation();

    const isProductInCart = cartItems.some((item) => item.id === product.id);

    if (isProductInCart) {
      alert("This item is already in the cart.");
    } else {
      dispatch(addToCart(product));
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
      <hr />
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ paddingLeft: "3%" }}
      >
        <h2 style={{ color: "red", fontSize: "30px" }}>Product Category</h2>
        <div>
          <button
            className="btn btn-light"
            onClick={() => scrollCategory("left")}
          >
            <ArrowBackIos />
          </button>
          <button
            className="btn btn-light"
            onClick={() => scrollCategory("right")}
          >
            <ArrowForwardIos />
          </button>
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
                  <span style={{ fontSize: "40px", padding: "15px" }}>
                    {category.categoryicon}
                  </span>
                  <p style={{ margin: 0 }}>{category.context}</p>
                </div>
              ))}
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            {filteredProducts.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "20px",
                }}
              >
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
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "29px",
                        left: "73%",                      
                        gap: "8px",
                        alignItems: "center",
                        marginBottom: "100px",
                      }}
                    >
                     

                      {clickedProducts.has(product.id) ? (
                        <FaHeart
                        style={{
                          fontSize: "1.3rem",
                          padding:"5%",
                          width:"150%",
                            color: "red",
                            cursor: "pointer",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Shadow added
                            borderRadius: "50%",
                        }}
                          onClick={(e) => handleWishlistClick(e, product)}
                        />
                      ) : (
                        <FaRegHeart
                        style={{
                          fontSize: "1.2rem",
                          padding:"10%",                          
                            color: "#575B5A",
                            cursor: "pointer",
                            width:"150%",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Shadow added
                            borderRadius: "50%",

                        }}
                          onClick={(e) => handleWishlistClick(e, product)}
                        />
                      )}
                      <FaEye
                        style={{
                          fontSize: "1.2rem",
                          color: "gray",
                           cursor: "pointer",
                           padding:"2%",
                           width:"150%",
                           boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Shadow added
                          borderRadius: "50%",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(product.id, product);
                        }}
                      />
                    </div>

                    <img
                      src={product.image_url}
                      alt={product.name}
                      style={{
                        width: "120%",
                        padding:"10px",
                        height: "170px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
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
                  </div>
                ))}
              </div>
            ) : (
              <p>No products found in this category.</p>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductCategory;
