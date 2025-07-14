// ProductPage.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUndo } from "react-icons/fa";
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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import {
  addToCartRequest,
  fetcheckeoutpagedata,
} from "../features/cart/cartActions";

const getProductId = (product) => product.id || product._id;

const ProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  // ✅ Parse image_url safely
  let images = [];
  if (Array.isArray(image_url)) {
    images = image_url;
  } else if (typeof image_url === "string" && image_url.startsWith("[")) {
    try {
      images = JSON.parse(image_url);
    } catch {
      images = [image_url];
    }
  } else if (typeof image_url === "string") {
    images = [image_url];
  }

  const [mainImage, setMainImage] = useState(images[0] || "");

  useEffect(() => {
    setMainImage(images[0] || "");
  }, [product]);

  const relatedProducts = products.filter(
    (p) =>
      p.category_id === category_id && getProductId(p) !== getProductId(product)
  );

  const handleCardClick = (clickedProduct) => {
    setProduct(clickedProduct);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = (e) => {
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

    dispatch(addToCartRequest(user.id, product.id, quantity));
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
          {/* Left - Image and Thumbnails */}
          <Grid item xs={12} md={6}>
            <Box maxWidth={400} mx="auto">
              <ReactImageMagnify
                smallImage={{
                  alt: "Product",
                  isFluidWidth: true,
                  src: mainImage,
                }}
                largeImage={{ src: mainImage, width: 1200, height: 1200 }}
                enlargedImagePosition="beside"
              />
              <Box mt={2} display="flex" gap={1} flexWrap="wrap" justifyContent="center">
                {images.map((img, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={img}
                    alt={`thumb-${index}`}
                    onClick={() => setMainImage(img)}
                    sx={{
                      width: 60,
                      height: 60,
                      border: mainImage === img ? "2px solid #1976d2" : "1px solid #ccc",
                      borderRadius: 1,
                      objectFit: "cover",
                      cursor: "pointer",
                      transition: "0.3s",
                      ":hover": { opacity: 0.8 },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Right - Info and Cart */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" fontWeight="600" mb={1}>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  6,034 ratings ★★★★☆
                </Typography>

                <Typography fontSize={24} fontWeight="bold" color="success.main" mb={1}>
                  ₹{parseFloat(selling_price || price).toLocaleString("en-IN")}
                  {mrp && (
                    <>
                      <Typography
                        component="span"
                        fontSize={16}
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

                <Box my={2} p={2} border="1px solid #ccc" borderRadius={2} bgcolor="#f9f9f9">
                  <Typography fontWeight="bold" mb={1}>Save Extra with 3 Offers</Typography>
                  <Typography variant="body2" color="error">Cashback: 5% with ICICI Amazon Pay</Typography>
                  <Typography variant="body2">Bank Offer: 10% off with SBI Credit Card</Typography>
                </Box>

                <Typography color="textSecondary" mb={2}>
                  {description}
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    p: 2,
                    backgroundColor: "#fafafa",
                    position: "sticky",
                    top: 100,
                  }}
                >
                  <Typography fontSize={22} fontWeight="bold" mb={1}>
                    ₹{parseFloat(selling_price || price).toLocaleString("en-IN")}
                  </Typography>

                  <Typography variant="body2" color="success.main" fontWeight="500">
                    FREE delivery Today 2PM – 4PM on orders over ₹499
                  </Typography>
                  <Typography variant="body2" mb={1}>
                    Delivering to Hyderabad 500009
                  </Typography>

                  <Typography color={stock > 0 ? "green" : "error"} fontWeight="bold" mb={1}>
                    {stock > 0 ? "In Stock" : "Out of Stock"}
                  </Typography>

                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel id="qty-label">Qty</InputLabel>
                    <Select
                      labelId="qty-label"
                      id="quantity"
                      value={quantity}
                      label="Qty"
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    >
                      {[...Array(10)].map((_, i) => (
                        <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      backgroundColor: "#ffd814",
                      color: "#111",
                      fontWeight: "bold",
                      mb: 1,
                      ":hover": { backgroundColor: "#f7ca00" },
                    }}
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>

                  <Box mt={2} display="flex" gap={1} alignItems="center">
                    <FaUndo size={16} />
                    <Typography variant="body2">30-day free return available</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>

      {/* Related Products */}
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
            customLeftArrow={<button className="custom-arrow custom-left">‹</button>}
            customRightArrow={<button className="custom-arrow custom-right">›</button>}
          >
            {relatedProducts.map((related) => {
              let relImages = [];
              try {
                relImages =
                  typeof related.image_url === "string" && related.image_url.startsWith("[")
                    ? JSON.parse(related.image_url)
                    : Array.isArray(related.image_url)
                    ? related.image_url
                    : [related.image_url];
              } catch {
                relImages = [related.image_url];
              }

              return (
                <Box key={getProductId(related)} px={1}>
                  <Card
                    onClick={() => handleCardClick(related)}
                    sx={{
                      width: 220,
                      height: 340,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "transform 0.3s",
                      ":hover": { boxShadow: 6, transform: "translateY(-6px)" },
                      cursor: "pointer",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={relImages[0]}
                      alt={related.name}
                      sx={{ height: 180, objectFit: "cover" }}
                    />
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" noWrap>
                        {related.name}
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
                        {related.description}
                      </Typography>
                      <Typography fontSize={14} fontWeight="bold" color="info.main">
                        ₹{parseFloat(related.selling_price).toLocaleString("en-IN")}
                        <Typography
                          component="span"
                          fontSize={13}
                          color="textSecondary"
                          sx={{ textDecoration: "line-through", ml: 1 }}
                        >
                          ₹{parseFloat(related.mrp).toLocaleString("en-IN")}
                        </Typography>
                        {related.mrp && related.selling_price && (
                          <Typography
                            component="span"
                            fontSize={13}
                            color="warning.main"
                            sx={{ ml: 1 }}
                          >
                            ({Math.round(
                              ((related.mrp - related.selling_price) / related.mrp) * 100
                            )}
                            % OFF)
                          </Typography>
                        )}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              );
            })}
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
