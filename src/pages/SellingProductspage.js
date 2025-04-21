import React, { useEffect, useState, useMemo } from "react";
import { Button, Card, Row, Col, Container, Badge } from "react-bootstrap";
import { FaEye, FaRegHeart, FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchproductsrequest,
    setSelectedProduct,
} from "../features/product/productActions";
import { fetchApiCartDataRequest } from "../features/cart/cartActions";
import { useNavigate } from "react-router-dom";
import {
    addToWishlistRequest,
    removeWishlistProductRequest,
} from "../features/wishlist/wishlistAction";

const SellingProductspage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { products = [], loading, error } = useSelector((state) => state.products || {});
    const { cartItems = [] } = useSelector((state) => state.cart || {});
    const { wishlistData = [] } = useSelector((state) => state.wishlist || {});
    const wishlistItems = Array.isArray(wishlistData[0]) ? wishlistData[0] : wishlistData;

    const [viewAll, setViewAll] = useState(false);

    useEffect(() => {
        dispatch(fetchproductsrequest());
    }, [dispatch]);

    const memoizedProducts = useMemo(() => {
        return viewAll ? products : products.slice(0, 4);
    }, [products, viewAll]);

    const handleAddToCart = async (event, product) => {
        event.stopPropagation();
        const userToken = localStorage.getItem("authToken");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!userToken || !user?.id) {
            alert("Session expired. Please log in.");
            navigate("/login");
            return;
        }

        if (cartItems.some((item) => item.user_id === user.id && item.product_id === product.id)) {
            alert("Product is already in the cart.");
            return;
        }

        try {
            const response = await fetch(`http://${process.env.REACT_APP_IP_ADDRESS}/api/cart/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({ user_id: user.id, product_id: product.id, quantity: 1 }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || response.statusText);
            alert("Product successfully added to cart.");
            dispatch(fetchApiCartDataRequest());
        } catch (error) {
            console.error("Error adding product to cart:", error);
            alert(`Error: ${error.message}`);
        }
    };

    const handleCardClick = (product) => {
        dispatch(setSelectedProduct(product));
        navigate("/productpage");
    };

    const handleWishlistClick = (e, product) => {
        e.stopPropagation();
        dispatch(addToWishlistRequest(product.id));
    };

    const removeItem = (event, productId) => {
        event.stopPropagation();
        const wishlistItem = wishlistItems.find((item) => Number(item.product_id) === Number(productId));
        if (wishlistItem && window.confirm("Remove product from wishlist?")) {
            dispatch(removeWishlistProductRequest(wishlistItem.id));
        }
    };

    return (
        <div>
            <div className="d-flex align-items-center">
                <Badge bg="danger" style={{ width: "20px", height: "50px", marginLeft: "30px", marginRight: "10px" }} />
                <p style={{ color: "#DB4444", fontWeight: "bold", fontSize: "20px" }}>This Month</p>
            </div>
            <div className="d-flex justify-content-around">
                <h1 style={{ fontWeight: "bold", fontSize: "30px", marginRight: "700px" }}>Best Selling Products</h1>
                <Button variant="danger" onClick={() => setViewAll((prev) => !prev)}>
                    {viewAll ? "Show Less" : "View All Products"}
                </Button>
            </div>

            <Container className="mt-4">
                <Row className="justify-content-center">
                    {loading ? (
                        <h3>Loading products...</h3>
                    ) : error ? (
                        <h3>Error fetching products: {error}</h3>
                    ) : (
                        memoizedProducts.map((product) => (
                            <Col key={product.id} md={3} className="mb-4">
                                <ProductCard
                                    product={product}
                                    handleWishlistClick={handleWishlistClick}
                                    removeItem={removeItem}
                                    handleAddToCart={handleAddToCart}
                                    handleCardClick={handleCardClick}
                                    wishlistItems={wishlistItems}
                                />
                            </Col>
                        ))
                    )}
                </Row>
            </Container>
        </div>
    );
};

const ProductCard = ({ product, handleWishlistClick, removeItem, handleAddToCart, handleCardClick, wishlistItems }) => {
    const isInWishlist = useMemo(() => wishlistItems.some((item) => item.product_id === product.id), [wishlistItems, product.id]);

    return (
        <Card className="border-0 bg-light-pink" style={{ cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", position: "relative" }}>
            <div style={{ position: "absolute", top: "20px", right: "15px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {isInWishlist ? (
                    <FaHeart style={{ fontSize: "1.5rem", color: "red", cursor: "pointer" }} onClick={(e) => removeItem(e, product.id)} />
                ) : (
                    <FaRegHeart style={{ fontSize: "1.5rem", color: "#575B5A", cursor: "pointer" }} onClick={(e) => handleWishlistClick(e, product)} />
                )}
                <FaEye style={{ fontSize: "1.5rem", color: "gray", cursor: "pointer" }} onClick={() => handleCardClick(product)} />
            </div>
            <Card.Img variant="top" src={product.image_url} style={{ height: "200px", objectFit: "cover" }} />
            <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>Price: ₹{product.price}</Card.Text>
                <Button variant="danger" className="w-100" onClick={(e) => handleAddToCart(e, product)}>
                    Add to Cart
                </Button>
            </Card.Body>
        </Card>
    );
};

export default SellingProductspage;
