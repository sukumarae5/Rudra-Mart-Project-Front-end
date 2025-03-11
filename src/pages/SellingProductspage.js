import React, { useEffect, useState } from "react";
import { Button, Card, Row, Col, Container } from "react-bootstrap";
import { FaEye, FaRegHeart, FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {fetchproductsrequest,addToWishlist,setSelectedProduct,} from "../features/product/productActions"; 
import { fetchApiCartDataRequest } from "../features/cart/cartActions";
import { useNavigate } from "react-router-dom";

const SellingProductspage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Fetch products from Redux store
    const { products = [], loading, error } = useSelector((state) => state.products || {});
    const { cartItems = [] } = useSelector((state) => state.cart || {});

    // Local state
    const [hoveredCard, setHoveredCard] = useState(null);
    const [viewAll, setViewAll] = useState(false);
    const [clickedProducts, setClickedProducts] = useState(new Set());

    // Fetch products on mount
    useEffect(() => {
        dispatch(fetchproductsrequest());
    }, [dispatch]);

    // Handle Add to Cart
    const handleAddToCart = async (event, product) => {
        event.stopPropagation();

        try {
            const userToken = localStorage.getItem("authToken");
            if (!userToken) {
                alert("Session expired. Please log in.");
                navigate("/login");
                return;
            }

            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user.id) {
                alert("User information is missing. Please log in.");
                navigate("/login");
                return;
            }

            const isProductInCart = cartItems.some(
                (item) => item.user_id === user.id && item.product_id === product.id
            );
            if (isProductInCart) {
                alert("Product is already in the cart.");
                return;
            }

            const response = await fetch("http://192.168.1.9:8081/api/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({ user_id: user.id, product_id: product.id, quantity: 1 }),
            });

            const data = await response.json();
            if (!response.ok) {
                alert(`Error: ${data.message || response.statusText}`);
                return;
            }

            alert("Product successfully added to cart.");
            dispatch(fetchApiCartDataRequest());
        } catch (error) {
            console.error("Error adding product to cart:", error);
            alert(`Error: ${error.message}`);
        }
    };

    // Handle clicking on a product
    const handleCardClick = (product) => {
        dispatch(setSelectedProduct(product));
        navigate("/productpage");
    };

    // Handle Wishlist Click
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

    return (
        <div>
            <div className="d-flex justify-content-around">
                <h1 style={{ fontWeight: "bold", fontSize: "30px", marginRight: "500px" }}>
                    Best Selling Products
                </h1>
                <Row className="mt-4">
                    <Col md={12} className="text-center">
                        <Button variant="danger" onClick={() => setViewAll((prev) => !prev)}>
                            {viewAll ? "Show Less" : "View All Products"}
                        </Button>
                    </Col>
                </Row>
            </div>

            <Container className="mt-4">
                <Row className="justify-content-center">
                    {loading ? (
                        <h3>Loading products...</h3>
                    ) : error ? (
                        <h3>Error fetching products: {error}</h3>
                    ) : (
                        products.slice(0, viewAll ? products.length : 4).map((product) => (
                            <Col key={product.id} md={3} className="mb-4">
                                <ProductCard
                                    product={product}
                                    hoveredCard={hoveredCard}
                                    setHoveredCard={setHoveredCard}
                                    handleCardClick={handleCardClick}
                                    handleWishlistClick={handleWishlistClick}
                                    clickedProducts={clickedProducts}
                                    handleAddToCart={handleAddToCart}
                                />
                            </Col>
                        ))
                    )}
                </Row>
            </Container>
        </div>
    );
};

// Separate Product Card Component
const ProductCard = ({
    product,
    hoveredCard,
    setHoveredCard,
    handleCardClick,
    handleWishlistClick,
    clickedProducts,
    handleAddToCart,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    return (
        <Card
        className="border-0 bg-light-pink"
        style={{ cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", position: "relative" }}
        onMouseEnter={() => setHoveredCard(product.id)}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={() => handleCardClick(product)}
    >
        {/* Wishlist & View Icons */}
        <div
            style={{
                position: "absolute",
                top: "20px",
                right: "15px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
            }}
        >
            {clickedProducts.has(product.id) ? (
                <FaHeart
                    style={{ fontSize: "1.5rem", color: "red", cursor: "pointer" }}
                    onClick={(e) => handleWishlistClick(e, product)}
                />
            ) : (
                <FaRegHeart
                    style={{ fontSize: "1.5rem", color: "#575B5A", cursor: "pointer" }}
                    onClick={(e) => handleWishlistClick(e, product)}
                />
            )}
            <FaEye
                style={{ fontSize: "1.5rem", color: "gray", cursor: "pointer" }}
                onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(product);
                }}
            />
        </div>
    
        <Card.Img
            variant="top"
            src={product.image_url}
            style={{ height: "200px", objectFit: "cover" }}
        />
        <Card.Body>
            <Card.Title>{product.name}</Card.Title>
            <Card.Text>Price: ₹{product.price}</Card.Text>
            <button
                style={{
                    marginTop: "10px",
                    width: "100%",
                    padding: "10px",
                    background: "#ff5a5f",
                    color: "white",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    transition: "opacity 0.3s, background 0.3s",
                    opacity: hoveredCard === product.id || isClicked ? "1" : "0",
                }}
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => !isClicked && setIsVisible(false)}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsClicked(true);
                    handleAddToCart(e, product);
                }}
            >
                Add to Cart
            </button>
        </Card.Body>
    </Card>
      
    );
};

export default SellingProductspage;
