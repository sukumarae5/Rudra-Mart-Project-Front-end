import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart, FaTruck, FaUndo } from "react-icons/fa";
import ReactImageMagnify from "react-image-magnify";
import { useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Container, Col, Card, Row, Button } from "react-bootstrap";

// Helper to get consistent product ID
const getProductId = (product) => product.id || product._id;

const ProductPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  } = selectedProduct;

  const [mainImage, setMainImage] = useState(image_url);

  useEffect(() => {
    setMainImage(image_url);
  }, [image_url]);

  useEffect(() => {
    if (activeButton) {
      const timeout = setTimeout(() => setActiveButton(""), 200);
      return () => clearTimeout(timeout);
    }
  }, [activeButton]);

  const relatedProducts = products.filter(
    (product) =>
      product.category_id === category_id &&
      getProductId(product) !== getProductId(selectedProduct)
  );

  if (!selectedProduct || Object.keys(selectedProduct).length === 0) {
    return (
      <div style={{ textAlign: "center", color: "red", fontSize: "20px", marginTop: "50px" }}>
        No product selected!
      </div>
    );
  }

  const handleCardClick = (product) => {
    navigate(`/productpage/${getProductId(product)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuantityChange = (type) => {
    setActiveButton(type);
    setQuantity((prev) =>
      type === "increment" ? prev + 1 : prev > 1 ? prev - 1 : 1
    );
  };

  const handleBuy = () => {
    if (!selectedProduct) return;

    const checkoutItem = [
      {
        userId: selectedProduct.user_id || "Guest",
        productId: id,
        productName: title,
        productImage: image_url,
        productPrice: parseFloat(price),
        quantity,
        totalPrice: parseFloat(price) * quantity,
      },
    ];

    // dispatch(FETCH_CHECKEOUTPAGE_DATA(checkoutItem)); // Optional
    navigate("/CheckoutPage");
  };

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1921 }, items: 5 },
    desktop: { breakpoint: { max: 1920, min: 1024 }, items: 5 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 2 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
  };

  return (
    <div>
     <Card
  className="p-4 bg-white"
  style={{
    borderRadius: "10px",
    boxShadow: "0 0 15px rgba(0, 0, 0, 0.15)", // uniform shadow
  }}
>

        <Row>
          {/* Image Section */}
          <Col md={6} className="d-flex justify-content-center align-items-start p-3">
            {mainImage && (
              <div className="w-100" style={{ maxWidth: "400px", objectFit: "contain" }}>
                <ReactImageMagnify
                  {...{
                    smallImage: {
                      alt: "Product",
                      isFluidWidth: true,
                      src: mainImage,
                      width: 400,
                      height: 400,
                    },
                    largeImage: {
                      src: mainImage,
                      width: 1000,
                      height: 1000,
                    },
                    enlargedImagePosition: "beside",
                  }}
                />
              </div>
            )}
          </Col>

          {/* Details Section */}
          <Col md={6} className="p-3 text-start">
            <h1 className="fs-4 fw-bold mb-3">{title}</h1>
            <h3 className="fs-4 text-dark mb-3">Rs. {(price * quantity).toFixed(2)}</h3>
            <p className="text-muted fs-6 mb-3">{description}</p>
            <hr />

            <p className={`fs-5 fw-medium mb-3 ${stock > 0 ? "text-dark" : "text-danger"}`}>
              <strong>Stock:</strong> {stock > 0 ? stock : "Out of Stock"}
            </p>

            {/* Color and Size */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="fw-medium me-2">Colors:</span>
              {["blue", "pink"].map((color) => (
                <div
                  key={color}
                  className="rounded-circle border border-dark"
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: color,
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>

            <div className="d-flex align-items-center gap-2 mb-4">
              <span className="fw-medium me-2">Size:</span>
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <div
                  key={size}
                  className="px-3 py-1 border border-dark rounded fw-medium fs-6 user-select-none"
                  style={{ cursor: "pointer" }}
                >
                  {size}
                </div>
              ))}
            </div>

            {/* Quantity & Buy */}
            <div className="d-flex align-items-center mb-4">
              <div className="d-flex align-items-center border border-secondary">
                <button
                  className="btn px-3 py-2 fs-6 border-end"
                  style={{
                    border: "none",
                    borderRight: "1px solid black",
                    backgroundColor: activeButton === "decrement" ? "#DB4444" : "transparent",
                  }}
                  onClick={() => handleQuantityChange("decrement")}
                >
                  -
                </button>

                <span className="px-4 py-2 fw-bold">{quantity}</span>

                <button
                  className="btn px-3 py-2 fs-6 border-start"
                  style={{
                    border: "none",
                    borderLeft: "1px solid black",
                    backgroundColor: activeButton === "increment" ? "#DB4444" : "transparent",
                  }}
                  onClick={() => handleQuantityChange("increment")}
                >
                  +
                </button>
              </div>

              <Button
                className="text-white px-4 py-2 ms-3"
                style={{ backgroundColor: "#DB4444", fontSize: "16px" }}
                onClick={handleBuy}
                disabled={stock === 0}
              >
                Buy Now
              </Button>

              <button
                className="btn border ms-2"
                style={{ color: "black", padding: "10px 15px" }}
                onClick={() => setIsLiked(!isLiked)}
              >
                <FaHeart
                  style={{
                    fill: isLiked ? "#dc3545" : "transparent",
                    stroke: "black",
                    strokeWidth: "30px",
                  }}
                />
              </button>
            </div>

            {/* Delivery & Return Info */}
            <div
              className="border rounded mb-3"
              style={{
                fontSize: "17px",
                color: "rgb(63, 38, 62)",
                maxWidth: "350px",
              }}
            >
              <div className="d-flex align-items-start p-2">
                <FaTruck className="me-3 mt-1" />
                <div>
                  <div className="fw-bold">Free Delivery</div>
                  <div className="text-muted" style={{ fontSize: "13px" }}>
                    Enter your postal code for Delivery Availability
                  </div>
                </div>
              </div>
              <hr className="m-0 border-top border-dark" />
              <div className="d-flex align-items-start p-2">
                <FaUndo className="me-3 mt-1" />
                <div>
                  <div className="fw-bold">Easy Returns</div>
                  <div className="text-muted" style={{ fontSize: "13px" }}>
                    Free 30 Days Delivery Returns. Details
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Container style={{ marginTop: "50px", textAlign: "center", position: "relative" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>Related Products</h2>
          <Carousel
            responsive={responsive}
            infinite
            autoPlay={false}
            arrows
            customLeftArrow={<button className="custom-arrow custom-left">‹</button>}
            customRightArrow={<button className="custom-arrow custom-right">›</button>}
          >
            {relatedProducts.map((product) => (
              <div key={getProductId(product)} style={{ padding: "10px", height: "100%" }}>
                <Card
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(product);
                  }}
                  style={{
                    height: "300px",
                    width: "100%",
                    cursor: "pointer",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.2s ease",
                  }}
                >
                  <div style={{ height: "180px", overflow: "hidden" }}>
                    <Card.Img
                      variant="top"
                      src={product.image_url}
                      onError={(e) => (e.target.src = "/placeholder.jpg")}
                      alt={product.name}
                      style={{ height: "100%", width: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <Card.Body style={{ padding: "10px" }}>
                    <Card.Title style={{ fontSize: "14px", fontWeight: "600" }}>
                      {product.name}
                    </Card.Title>
                    <Card.Text style={{ color: "#28a745", fontWeight: "bold", fontSize: "14px" }}>
                      Rs. {parseFloat(product.price).toLocaleString("en-IN")}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </Carousel>

          {/* Carousel Arrow Styles */}
          <style>{`
            .custom-arrow {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              z-index: 10;
              background: #fff;
              border: 1px solid #ccc;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              font-size: 22px;
              font-weight: bold;
              cursor: pointer;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
            }
            .custom-left {
              left: 10px;
            }
            .custom-right {
              right: 10px;
            }
          `}</style>
        </Container>
      )}
    </div>
  );
};

export default ProductPage;
