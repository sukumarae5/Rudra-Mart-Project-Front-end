import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart, FaTruck, FaUndo } from "react-icons/fa";
import ReactImageMagnify from "react-image-magnify";
import { useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { fetcheckeoutpagedata } from "../features/cart/cartActions";

// ✅ Corrected imports: use action creators instead of slice files

const ProductPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
  } = selectedProduct;

  const [mainImage, setMainImage] = useState(image_url);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setMainImage(image_url);
  }, [image_url]);

  useEffect(() => {
    if (selectedProduct && Object.keys(selectedProduct).length > 0) {
      dispatch(fetcheckeoutpagedata([selectedProduct]));
    }
  }, [selectedProduct, dispatch]);

  const relatedProducts = products.filter(
    (product) =>
      product.category_id === category_id && product.id !== selectedProduct.id
  );

  if (!selectedProduct || Object.keys(selectedProduct).length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          color: "red",
          fontSize: "20px",
          marginTop: "50px",
        }}
      >
        No product selected!
      </div>
    );
  }

  const handleCardClick = (product) => {
   
    navigate(`/productpage/${product.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuantityChange = (type) => {
    setQuantity((prev) =>
      type === "increment" ? prev + 1 : prev > 1 ? prev - 1 : 1
    );
  };

  const handleBuy = () => {
    if (!selectedProduct || Object.keys(selectedProduct).length === 0) {
      console.error("No product selected to checkout!");
      return;
    }

    const checkoutItem = [
      {
        userId: selectedProduct.user_id || "Guest",
        productId: selectedProduct.id,
        productName: selectedProduct.name || "Unknown",
        productImage: selectedProduct.image_url || "",
        productPrice: parseFloat(selectedProduct.price || 0),
        quantity,
        totalPrice: parseFloat(selectedProduct.price || 0) * quantity,
      },
    ];

    navigate("/CheckoutPage");
  };

  const handleWishlist = () => {
    console.log("Add to wishlist clicked:", selectedProduct.id);
    // Add dispatch for wishlist logic here if needed
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1921 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 1920, min: 1024 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 1,
    },
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "40px",
        background: "linear-gradient(to right, #2267ac, #37628d)",
      }}
    >
      {/* Product Detail Section */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          background: "white",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
          maxWidth: "1000px",
          minHeight: "550px",
        }}
      >
        {/* Product Image */}
        <div
          style={{
            flex: "1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "30px",
          }}
        >
          {mainImage ? (
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: "Product",
                  isFluidWidth: false,
                  src: mainImage,
                  width: 380,
                  height: 380,
                },
                largeImage: {
                  src: mainImage,
                  width: 1000,
                  height: 800,
                },
                enlargedImagePosition: "beside",
              }}
            />
          ) : (
            <img
              src="/placeholder.jpg"
              alt="No Product"
              width="380"
              height="380"
            />
          )}
        </div>

        {/* Product Details */}
        <div style={{ flex: "1", padding: "30px", textAlign: "center" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "bold" }}>{title}</h1>
          <h3 style={{ fontSize: "24px", color: "#28a745" }}>
            Rs. {(price * quantity).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </h3>
          <p style={{ color: "#555", fontSize: "16px" }}>{description}</p>
          <p
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: stock > 0 ? "#28a745" : "#dc3545",
            }}
          >
            <strong>Stock:</strong> {stock > 0 ? stock : "Out of Stock"}
          </p>

          {/* Quantity & Buy Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "30px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderRadius: "25px",
                background: "#fff",
              }}
            >
              <button
                style={{
                  background: "#28a745",
                  color: "white",
                  padding: "12px 18px",
                  fontSize: "20px",
                }}
                onClick={() => handleQuantityChange("decrement")}
              >
                -
              </button>
              <span
                style={{
                  padding: "10px 25px",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                {quantity}
              </span>
              <button
                style={{
                  background: "#28a745",
                  color: "white",
                  padding: "12px 18px",
                  fontSize: "20px",
                }}
                onClick={() => handleQuantityChange("increment")}
              >
                +
              </button>
            </div>

            <button
              style={{
                background: "linear-gradient(135deg, #ff9800, #ff5722)",
                color: "white",
                padding: "12px 25px",
                marginLeft: "20px",
                borderRadius: "8px",
                fontSize: "16px",
              }}
              onClick={handleBuy}
              disabled={stock === 0}
            >
              Buy Now
            </button>

            <button
              style={{
                border: "2px solid #dc3545",
                color: "#dc3545",
                padding: "10px 15px",
                marginLeft: "10px",
                borderRadius: "50%",
              }}
              onClick={handleWishlist}
            >
              <FaHeart />
            </button>
          </div>

          {/* Delivery Info */}
          <div
            style={{
              marginTop: "30px",
              fontSize: "16px",
              color: "rgb(63, 38, 62)",
            }}
          >
            <p>
              <FaTruck /> Free Delivery
            </p>
            <p>
              <FaUndo /> Easy Returns
            </p>
          </div>
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div style={{ marginTop: "50px", textAlign: "center", width: "100%" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>
            Related Products
          </h2>
          <Carousel responsive={responsive} infinite autoPlay={false} arrows>
            {relatedProducts.map((product) => (
              <div
                key={product.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(product);
                }}
                style={{
                  background: "white",
                  padding: "15px",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                  margin: "10px",
                }}
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
                <h3 style={{ fontSize: "16px", margin: "10px 0" }}>
                  {product.name}
                </h3>
                <p style={{ color: "#28a745", fontWeight: "bold" }}>
                  Rs. {parseFloat(product.price).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
