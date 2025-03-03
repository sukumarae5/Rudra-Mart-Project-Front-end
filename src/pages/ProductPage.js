import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaStar, FaHeart, FaTruck, FaUndo } from "react-icons/fa";
import ReactImageMagnify from "react-image-magnify";

const ProductDetailPage = () => {
  const { selectedProduct = {} } = useSelector((state) => state.products || {});
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(""); // Added state to manage main image

  console.log(selectedProduct);

  if (!selectedProduct || Object.keys(selectedProduct).length === 0) {
    return <div>No product selected!</div>;
  }

  const {
    images = [],
    title,
    rating = 0,
    reviews = 0,
    price,
    description,
    colors = [],
    sizes = [],
  } = selectedProduct;

  const fallbackImage = selectedProduct; // Placeholder if no images exist
  const defaultMainImage =
    images.length > 0 ? images[0].image_url : fallbackImage;

  // Set the default main image if no image has been selected
  if (!mainImage) {
    setMainImage(defaultMainImage);
  }

  const handleQuantityChange = (type) => {
    setQuantity((prev) =>
      type === "increment" ? prev + 1 : prev > 1 ? prev - 1 : 1
    );
  };

  // Calculate the total price based on the quantity
  const totalPrice = price * quantity;

  return (
    <div className="container my-4">
      <div className="row">
        {/* Left Side: Product Images */}
        <div className="col-md-6">
          <div className="d-flex flex-column align-items-center">
            {/* Small Images */}
            <div className="d-flex mb-3">
              {images.length > 0 ? (
                images.slice(0, 4).map((img, index) => (
                  <img
                    key={index}
                    src={img.image_url}
                    alt={`Product thumbnail ${index + 1}`}
                    className="img-thumbnail me-2"
                    style={{
                      width: "80px",
                      height: "80px",
                      cursor: "pointer",
                    }}
                    onClick={() => setMainImage(img.image_url)}
                  />
                ))
              ) : (
                <p>{title}</p>
              )}
            </div>
            {/* Main Image */}
            <img
              src={mainImage.image_url}
              alt="Product"
              className="img-fluid"
              style={{
                width: "450px",
                height: "450px",
                border: "1px solid #ccc",
                borderRadius: "10px",
              }}
            />
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div className="col-md-6">
          {/* Product Title */}
          <h1 className="text-center mb-3">{title}</h1>
          {/* Rating and Reviews */}
          <div className="d-flex align-items-center justify-content-center mb-3">
            <div className="text-warning d-flex align-items-center me-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} color={i < rating ? "#ffc107" : "#e4e5e9"} />
              ))}
              <span className="ms-2">({rating.toFixed(1)})</span>
            </div>
            <span className="ms-3">{reviews} reviews</span>
          </div>
          {/* Price */}
          <h3 className="text-success mb-3 text-center">
            ${totalPrice.toFixed(2)}
          </h3>{" "}
          {/* Display total price */}
          {/* Description */}
          <p className="text-center mb-3">{description}</p>
          <hr />
          {/* Color Selection */}
          <div className="mb-3 text-center">
            <strong>Color:</strong>
            <div className="d-flex justify-content-center mt-2">
              {colors.map((color, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedColor(color)}
                  className={`me-2 rounded-circle border ${
                    selectedColor === color ? "border-primary" : ""
                  }`}
                  style={{
                    width: "30px",
                    height: "30px",
                    backgroundColor: color,
                    cursor: "pointer",
                  }}
                >
                  <radio>{color}</radio>
                </div>
              ))}
            </div>
          </div>
          {/* Size Selection */}
          <div className="mb-3 text-center">
            <strong>Size:</strong>
            <div className="d-flex justify-content-center mt-2">
              {sizes.map((size, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSize(size)}
                  className={`btn btn-outline-secondary me-2 ${
                    selectedSize === size ? "active" : ""
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          {/* Quantity Selector, Buy Now, and Favorite Buttons */}
          <div className="d-flex align-items-center justify-content-center mb-4">
            {/* Quantity Selector */}
            <div className="d-flex align-items-center me-3">
              <button
                className="btn btn-outline-success"
                onClick={() => handleQuantityChange("decrement")}
              >
                -
              </button>
              <span className="px-3">{quantity}</span>
              <button
                className="btn btn-outline-success"
                onClick={() => handleQuantityChange("increment")}
              >
                +
              </button>
            </div>

            {/* Buy Now Button */}
            <button className="btn btn-warning me-3">Buy Now</button>

            {/* Favorite Icon */}
            <button className="btn btn-outline-danger">
              <FaHeart />
            </button>
          </div>
          {/* Delivery and Return Info */}
          <div
            className="d-flex flex-column align-items-center mt-4"
            style={{ width: "100%" }}
          >
            <div style={{ textAlign: "center", marginTop: "20px" }}>
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
    </div>
  );
};

export default ProductDetailPage;
