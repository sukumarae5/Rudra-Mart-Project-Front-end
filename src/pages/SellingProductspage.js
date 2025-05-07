import React, { useEffect, useState, useMemo } from "react";
import {
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    IconButton,
    Button,
    Snackbar,
    Box,
    Badge as MuiBadge,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { FaEye, FaRegHeart, FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchproductsrequest,
    setSelectedProduct,
} from "../features/product/productActions";
import { fetchApiCartDataRequest } from "../features/cart/cartActions";
import {
    addToWishlistRequest,
    removeWishlistProductRequest,
} from "../features/wishlist/wishlistAction";
import { useNavigate } from "react-router-dom";

const SellingProductspage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { products = [], loading, error } = useSelector((state) => state.products || {});
    const { cartItems = [] } = useSelector((state) => state.cart || {});
    const { wishlistData = [] } = useSelector((state) => state.wishlist || {});
    const wishlistItems = Array.isArray(wishlistData[0]) ? wishlistData[0] : wishlistData;

    const [viewAll, setViewAll] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const showSnackbar = (message, severity = "success") => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

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
            showSnackbar("Please log in to add to cart.", "error");
            navigate("/login");
            return;
        }

        if (cartItems.some((item) => item.user_id === user.id && item.product_id === product.id)) {
            showSnackbar("Product already in cart.", "warning");
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

            showSnackbar("Product added to cart!");
            dispatch(fetchApiCartDataRequest());
        } catch (error) {
            console.error("Add to cart error:", error);
            showSnackbar(error.message, "error");
        }
    };

    const handleCardClick = (product) => {
        dispatch(setSelectedProduct(product));
        navigate("/productpage");
    };

    const handleWishlistClick = (e, product) => {
        e.stopPropagation();
        dispatch(addToWishlistRequest(product.id));
        showSnackbar("Added to wishlist!");
    };

    const removeItem = (event, productId) => {
        event.stopPropagation();
        console.log(productId)
        const wishlistItem = wishlistItems.find((item) => Number(item.product_id) === Number(productId));
        if (wishlistItem) {
            dispatch(removeWishlistProductRequest(wishlistItem.wishlist_id));
            showSnackbar("Removed from wishlist.", "info");
        }
    };

    return (
        <Box sx={{ px: 3, py: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <MuiBadge
                    sx={{
                        width: "10px",
                        height: "40px",
                        backgroundColor: "red",
                        borderRadius: "2px",
                        mr: 2,
                    }}
                />
                <Typography variant="h6" color="error" fontWeight="bold">
                    This Month
                </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Typography variant="h4" fontWeight="bold">
                    Best Selling Products
                </Typography>
                <Button variant="contained" color="error" onClick={() => setViewAll((prev) => !prev)}>
                    {viewAll ? "Show Less" : "View All Products"}
                </Button>
            </Box>

            <Grid container spacing={3}>
                {loading ? (
                    <Typography variant="h6">Loading products...</Typography>
                ) : error ? (
                    <Typography variant="h6" color="error">Error: {error}</Typography>
                ) : (
                    memoizedProducts.map((product) => (
                        <Grid item xs={12} sm={6} md={3} key={product.id}>
                            <ProductCard
                                product={product}
                                handleWishlistClick={handleWishlistClick}
                                removeItem={removeItem}
                                handleAddToCart={handleAddToCart}
                                handleCardClick={handleCardClick}
                                wishlistItems={wishlistItems}
                            />
                        </Grid>
                    ))
                )}
            </Grid>

            {/* Snackbar */}
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
        </Box>
    );
};

const ProductCard = ({ product, handleWishlistClick, removeItem, handleAddToCart, handleCardClick, wishlistItems }) => {
    const isInWishlist = useMemo(() => wishlistItems.some((item) => item.product_id === product.id), [wishlistItems, product.id]);

    return (
        <Card
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: 3,
                position: "relative",
                cursor: "pointer",
                transition: "transform 0.2s ease",
                "&:hover": { transform: "scale(1.02)" },
            }}
            onClick={() => handleCardClick(product)}
        >
            <Box sx={{ position: "absolute", top: 10, right: 10, zIndex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                <IconButton onClick={(e) => isInWishlist ? removeItem(e, product.id) : handleWishlistClick(e, product)}>
                    {isInWishlist ? <FaHeart color="red" /> : <FaRegHeart />}
                </IconButton>
                <IconButton onClick={(e) => { e.stopPropagation(); handleCardClick(product); }}>
                    <FaEye />
                </IconButton>
            </Box>

            <CardMedia
                component="img"
                image={product.image_url}
                alt={product.name}
                sx={{ height: 200, objectFit: "cover" }}
            />

            <CardContent>
                <Typography variant="h6" fontWeight="bold" noWrap>
                    {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {product.description}
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                    ₹{product.price}
                </Typography>
            </CardContent>

            <CardActions>
                <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    onClick={(e) => handleAddToCart(e, product)}
                >
                    Add to Cart
                </Button>
            </CardActions>
        </Card>
    );
};

export default SellingProductspage;
