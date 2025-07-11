// ProductPage.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  FaTruck, FaUndo } from "react-icons/fa";
import ReactImageMagnify from "react-image-magnify";
import { useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import {
  addToCartRequest,
  fetcheckeoutpagedata,
} from "../features/cart/cartActions";

const getProductId = (product) => product.id || product._id;

const ProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [activeButton, setActiveButton] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { cartItems = [] } = useSelector((state) => state.cart || {});

  const products = useSelector((state) => state.products?.products || []);
  const selectedProductFromRedux = useSelector(
    (state) => state.products?.selectedProduct || {}
  );

  const [product, setProduct] = useState(selectedProductFromRedux);

  useEffect(() => {
    setProduct(selectedProductFromRedux);
  }, [selectedProductFromRedux]);

  const {
    name: title = "No Title",
    description = "No Description Available",
    image_url = "",
    price = "0",
    stock = 0,
    category_id,
    id,
    user_id,
    mrp,
    selling_price,
  } = product || {};

  const [mainImage, setMainImage] = useState(image_url);

  useEffect(() => {
    setMainImage(product?.image_url || "");
  }, [product]);

  const relatedProducts = products.filter(
    (p) =>
      p.category_id === category_id && getProductId(p) !== getProductId(product)
  );

  const handleCardClick = (clickedProduct) => {
    setProduct(clickedProduct);
    setQuantity(1);
    setIsLiked(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuantityChange = (type) => {
    setActiveButton(type);
    setQuantity((prev) =>
      type === "increment" ? prev + 1 : Math.max(prev - 1, 1)
    );
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    const userToken = localStorage.getItem("authToken");

    if (!userToken) {
      alert("Please log in");
      navigate("/login");
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));

    const isProductInCart = cartItems.some(
      (item) => item.user_id === user.id && item.product_id === product.id
    );

    if (isProductInCart) {
      alert("Product already in cart");
      return;
    }

    dispatch(addToCartRequest(user.id, product.id, 1));
  };

  const handleBuy = () => {
    if (!product) return;

    const checkoutItem = [
      {
        userId: user_id || "Guest",
        productId: id,
        productName: title,
        productImage: image_url,
        productPrice: parseFloat(price),
        quantity,
        totalPrice: parseFloat(price) * quantity,
      },
    ];

    navigate("/CheckoutPage");
    dispatch(fetcheckeoutpagedata(checkoutItem));
  };

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1921 }, items: 5 },
    desktop: { breakpoint: { max: 1920, min: 1024 }, items: 4 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 2 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
  };

  if (!product || Object.keys(product).length === 0) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography color="error" fontSize={20}>
          No product selected!
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Card elevation={4} sx={{ borderRadius: 3, p: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box maxWidth={400} mx="auto">
              <ReactImageMagnify
                smallImage={{ alt: "Product", isFluidWidth: true, src: mainImage }}
                largeImage={{ src: mainImage, width: 1200, height: 1200 }}
                enlargedImagePosition="beside"
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold" mb={2}>
              {title}
            </Typography>

            <Typography fontSize={18} fontWeight="bold" color="info.main">
              ₹{parseFloat(selling_price || price).toLocaleString("en-IN")}
              {mrp && (
                <>
                  <Typography
                    component="span"
                    fontSize={15}
                    color="textSecondary"
                    sx={{ textDecoration: "line-through", ml: 1 }}
                  >
                    ₹{parseFloat(mrp).toLocaleString("en-IN")}
                  </Typography>
                  <Typography
                    component="span"
                    fontSize={14}
                    color="warning.main"
                    sx={{ ml: 1 }}
                  >
                    ({Math.round(((mrp - (selling_price || price)) / mrp) * 100)}% OFF)
                  </Typography>
                </>
              )}
            </Typography>

            <Typography color="textSecondary" mb={2}>
              {description}
            </Typography>

            <Typography mb={2} color={stock > 0 ? "textPrimary" : "error"} fontWeight="bold">
              Stock: {stock > 0 ? stock : "Out of Stock"}
            </Typography>

            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Box display="flex" border="1px solid #aaa" borderRadius={1}>
                <Button onClick={() => handleQuantityChange("decrement")} sx={{ minWidth: 40, bgcolor: activeButton === "decrement" ? "#fbe57b" : "transparent", color: "black", borderRight: "1px solid #000" }}>-</Button>
                <Box px={3} py={1.5}>{quantity}</Box>
                <Button onClick={() => handleQuantityChange("increment")} sx={{ minWidth: 40, bgcolor: activeButton === "increment" ? "#fbe57b" : "transparent", color: "black", borderLeft: "1px solid #000" }}>+</Button>
              </Box>

              <Button variant="contained" color="primary" onClick={handleBuy} disabled={stock === 0}>Buy Now</Button>
              <Button variant="outlined" color="warning" onClick={(e) => handleAddToCart(e, product)}>Add</Button>
              {/* <IconButton onClick={() => setIsLiked(!isLiked)}>
                <FaHeart style={{ fill: isLiked ? "#dc3545" : "transparent", stroke: "black", strokeWidth: "30px" }} />
              </IconButton> */}
            </Box>

            <Box border="1px solid #ccc" borderRadius={2} p={2} maxWidth={350}>
              <Box display="flex" gap={2} mb={1}>
                <FaTruck size={20} />
                <Box>
                  <Typography fontWeight="bold">Free Delivery</Typography>
                  <Typography variant="body2" color="textSecondary">Enter your postal code for Delivery Availability</Typography>
                </Box>
              </Box>
              <hr />
              <Box display="flex" gap={2} mt={1}>
                <FaUndo size={20} />
                <Box>
                  <Typography fontWeight="bold">Easy Returns</Typography>
                  <Typography variant="body2" color="textSecondary">Free 30 Days Delivery Returns. Details</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {relatedProducts.length > 0 && (
        <Container sx={{ mt: 6 }}>
          <Typography variant="h5" textAlign="center" mb={3}>Related Products</Typography>
          <Carousel
            responsive={responsive}
            infinite
            autoPlay={false}
            arrows
            customLeftArrow={<button className="custom-arrow custom-left">‹</button>}
            customRightArrow={<button className="custom-arrow custom-right">›</button>}
          >
            {relatedProducts.map((related) => (
              <Box key={getProductId(related)} px={1}>
                <Card onClick={() => handleCardClick(related)} sx={{ width: 220, height: 340, display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "transform 0.3s", ":hover": { boxShadow: 6, transform: "translateY(-6px)" }, cursor: "pointer" }}>
                  <CardMedia component="img" image={related.image_url} alt={related.name} sx={{ height: 180, objectFit: "cover" }} />
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" noWrap>{related.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{related.description}</Typography>
                    <Typography fontSize={14} fontWeight="bold" color="info.main">
                      ₹{parseFloat(related.selling_price).toLocaleString("en-IN")}
                      <Typography component="span" fontSize={13} color="textSecondary" sx={{ textDecoration: "line-through", ml: 1 }}>
                        ₹{parseFloat(related.mrp).toLocaleString("en-IN")}
                      </Typography>
                      {related.mrp && related.selling_price && (
                        <Typography component="span" fontSize={13} color="warning.main" sx={{ ml: 1 }}>
                          ({Math.round(((related.mrp - related.selling_price) / related.mrp) * 100)}% OFF)
                        </Typography>
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Carousel>
        </Container>
      )}

      <style>{`
        .custom-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          background: #6d6db7;
          border: 1px solid #ccc;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          font-size: 24px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .custom-left {
          left: 10px;
        }
        .custom-right {
          right: 10px;
        }
      `}</style>
    </Box>
  );
};

export default ProductPage;
