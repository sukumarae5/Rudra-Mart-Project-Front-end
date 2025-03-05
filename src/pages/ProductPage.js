import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart, FaTruck, FaUndo } from "react-icons/fa";
import ReactImageMagnify from "react-image-magnify";
import { useNavigate } from "react-router-dom";
import { fetcheckeoutpagedata } from "../features/cart/cartActions";

const ProductDetailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct = {} } = useSelector((state) => state.products || {});

  const {
    name: title = "No Title",
    description = "No Description Available",
    image_url = "",
    price = "0",
    stock = 0,
  } = selectedProduct;
  const [mainImage, setMainImage] = useState(image_url);
  const [quantity, setQuantity] = useState(1);

  const checkoutData = useSelector((state) => state.cart.checkoutData || []);

  console.log("Checkout Data:", checkoutData); // Debugging

  const totalAmount = Array.isArray(checkoutData)
    ? checkoutData.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;

  useEffect(() => {
    setMainImage(image_url);
  }, [image_url]);

  useEffect(() => {
    if (selectedProduct && Object.keys(selectedProduct).length > 0) {
      dispatch(fetcheckeoutpagedata(selectedProduct));
    }
  }, [selectedProduct, dispatch]);

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

    console.log("Dispatching checkout data:", checkoutItem); // Debugging

    dispatch(fetcheckeoutpagedata(checkoutItem));
    navigate("/CheckoutPage");
  };

  const totalPrice = parseFloat(price) * quantity;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
        background: "linear-gradient(to right, #2267ac, #37628d)",
      }}
    >
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
        {/* Left Section: Product Image */}
        <div
          style={{
            flex: "1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "30px",
          }}
        >
          {mainImage && (
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: "Product",
                  isFluidWidth: false,
                  src: mainImage,
                  width: 380,
                  height: 380,
                },
                largeImage: { src: mainImage, width: 1000, height: 800 },
                enlargedImagePosition: "beside",
              }}
            />
          )}
        </div>

        {/* Right Section: Product Details */}
        <div style={{ flex: "1", padding: "30px", textAlign: "center" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "bold" }}>{title}</h1>
          <h3 style={{ fontSize: "24px", color: "#28a745" }}>
            Rs. {totalPrice.toFixed(2)}
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

          {/* Quantity Selector & Buy Now Button */}
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
                border: "2px solid #28a745",
                borderRadius: "25px",
                overflow: "hidden",
                background: "#fff",
              }}
            >
              <button
                style={{
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "12px 18px",
                  cursor: "pointer",
                  fontSize: "20px",
                  borderRadius: "20px",
                  transition: "0.3s ease",
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
                  textAlign: "center",
                  minWidth: "50px",
                }}
              >
                {quantity}
              </span>

              <button
                style={{
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "12px 18px",
                  cursor: "pointer",
                  fontSize: "20px",
                  borderRadius: "20px",
                  transition: "0.3s ease",
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
                border: "none",
                padding: "12px 25px",
                marginLeft: "20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "16px",
                transition: "0.3s ease",
              }}
              onClick={handleBuy}
              disabled={stock === 0}
            >
              Buy Now
            </button>

            <button
              style={{
                background: "white",
                border: "2px solid #dc3545",
                color: "#dc3545",
                padding: "10px 15px",
                marginLeft: "10px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "18px",
                transition: "0.3s ease",
              }}
            >
              <FaHeart />
            </button>
          </div>

          {/* Delivery and Return Info */}
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
    </div>
  );
};

export default ProductDetailPage;
