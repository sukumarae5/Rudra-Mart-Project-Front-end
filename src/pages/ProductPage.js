import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaHeart, FaTruck, FaUndo } from "react-icons/fa";
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
  IconButton,
  Typography,
} from "@mui/material";

const getProductId = (product) => product.id || product._id;

const ProductPage = () => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [activeButton, setActiveButton] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { products = [], selectedProduct = {} } = useSelector(
    (state) => state.products || {}
  );

  const {
    name: title = "No Title",
    description = "No Description Available",
    image_url = "",
    price = "0",
    stock = 0,
    category_id,
    id,
    user_id,
  } = selectedProduct;

  const [mainImage, setMainImage] = useState(image_url);

  useEffect(() => {
    setMainImage(image_url);
  }, [image_url]);

  const relatedProducts = products.filter(
    (product) =>
      product.category_id === category_id &&
      getProductId(product) !== getProductId(selectedProduct)
  );

  const handleCardClick = (product) => {
    navigate(`/productpage/${getProductId(product)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuantityChange = (type) => {
    setActiveButton(type);
    setQuantity((prev) =>
      type === "increment" ? prev + 1 : Math.max(prev - 1, 1)
    );
  };

  const handleBuy = () => {
    if (!selectedProduct) return;

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
  };

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1921 }, items: 5 },
    desktop: { breakpoint: { max: 1920, min: 1024 }, items: 4 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 2 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
  };

  if (!selectedProduct || Object.keys(selectedProduct).length === 0) {
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
                smallImage={{
                  alt: "Product",
                  isFluidWidth: true,
                  src: mainImage,
                }}
                largeImage={{
                  src: mainImage,
                  width: 1200,
                  height: 1200,
                }}
                enlargedImagePosition="beside"
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold" mb={2}>
              {title}
            </Typography>

            <Typography variant="h5" color="primary" mb={2}>
              ₹ {(price * quantity).toFixed(2)}
            </Typography>

            <Typography color="textSecondary" mb={2}>
              {description}
            </Typography>

            <Typography
              mb={2}
              color={stock > 0 ? "textPrimary" : "error"}
              fontWeight="bold"
            >
              Stock: {stock > 0 ? stock : "Out of Stock"}
            </Typography>

            <Box display="flex" gap={2} mb={2}>
              <Typography>Colors:</Typography>
              {["blue", "pink"].map((color) => (
                <Box
                  key={color}
                  sx={{
                    width: 24,
                    height: 24,
                    bgcolor: color,
                    borderRadius: "50%",
                    border: "2px solid #333",
                    cursor: "pointer",
                  }}
                />
              ))}
            </Box>

            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <Typography>Size:</Typography>
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <Box
                  key={size}
                  px={2}
                  py={0.5}
                  sx={{
                    border: "1px solid #444",
                    borderRadius: 1,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  {size}
                </Box>
              ))}
            </Box>

            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Box display="flex" border="1px solid #aaa" borderRadius={1}>
                <Button
                  onClick={() => handleQuantityChange("decrement")}
                  sx={{
                    minWidth: 40,
                    bgcolor:
                      activeButton === "decrement" ? "#DB4444" : "transparent",
                    color: "black",
                    borderRight: "1px solid #000",
                  }}
                >
                  -
                </Button>
                <Box px={3} py={1.5}>{quantity}</Box>
                <Button
                  onClick={() => handleQuantityChange("increment")}
                  sx={{
                    minWidth: 40,
                    bgcolor:
                      activeButton === "increment" ? "#DB4444" : "transparent",
                    color: "black",
                    borderLeft: "1px solid #000",
                  }}
                >
                  +
                </Button>
              </Box>

              <Button
                variant="contained"
                color="error"
                onClick={handleBuy}
                disabled={stock === 0}
              >
                Buy Now
              </Button>

              <IconButton onClick={() => setIsLiked(!isLiked)}>
                <FaHeart
                  style={{
                    fill: isLiked ? "#dc3545" : "transparent",
                    stroke: "black",
                    strokeWidth: "30px",
                  }}
                />
              </IconButton>
            </Box>

            <Box border="1px solid #ccc" borderRadius={2} p={2} maxWidth={350}>
              <Box display="flex" gap={2} mb={1}>
                <FaTruck size={20} />
                <Box>
                  <Typography fontWeight="bold">Free Delivery</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Enter your postal code for Delivery Availability
                  </Typography>
                </Box>
              </Box>
              <hr />
              <Box display="flex" gap={2} mt={1}>
                <FaUndo size={20} />
                <Box>
                  <Typography fontWeight="bold">Easy Returns</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Free 30 Days Delivery Returns. Details
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <Container sx={{ mt: 6 }}>
          <Typography variant="h5" textAlign="center" mb={3}>
            Related Products
          </Typography>
          <Carousel
            responsive={responsive}
            infinite
            autoPlay={false}
            arrows
            customLeftArrow={
              <button className="custom-arrow custom-left">‹</button>
            }
            customRightArrow={
              <button className="custom-arrow custom-right">›</button>
            }
          >
            {relatedProducts.map((product) => (
              <Box key={getProductId(product)} px={1}>
                <Card
                  onClick={() => handleCardClick(product)}
                  sx={{
                    width: 220,
                    height: 340,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform 0.3s",
                    ":hover": {
                      boxShadow: 6,
                      transform: "translateY(-6px)",
                    },
                    cursor: "pointer",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={product.image_url}
                    alt={product.name}
                    sx={{
                      height: 180,
                      width: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => (e.target.src = "/placeholder.jpg")}
                  />
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold" noWrap>
                      {product.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {product.description}
                    </Typography>
                    <Typography fontSize={14} color="green" fontWeight="bold">
                      ₹{parseFloat(product.price).toLocaleString("en-IN")}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Carousel>
        </Container>
      )}

      {/* Carousel Arrows */}
      <style>{`
        .custom-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          background: white;
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
