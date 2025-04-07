import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlistRequest,
  removeWishlistProductRequest,
} from "../../features/wishlist/wishlistAction";
import { MdCancel } from "react-icons/md";
import { setSelectedProduct } from "../../features/product/productActions";
import { useNavigate } from "react-router-dom";
import { fetcheckeoutpagedata } from "../../features/cart/cartActions";

const WishListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { wishlistData = [] } = useSelector((state) => state.wishlist || {});
  const { products = [] } = useSelector((state) => state.products || {});

  const [hoveredCard, setHoveredCard] = useState(null);

  // Normalize wishlist data (in case it's wrapped in another array)
  const wishlistItems = Array.isArray(wishlistData[0])
    ? wishlistData[0]
    : wishlistData;

  // Extract numeric product IDs
  const wishlistProductIds = wishlistItems
    .map((item) => Number(item.product_id))
    .filter(Boolean);

  // Debug logs
  console.log("Wishlist Product IDs:", wishlistProductIds);
  console.log("All Products:", products.map(p => ({ id: p.id, name: p.name })));

  // Filter products that are in the wishlist
  const matchedProducts = products.filter((product) =>
    wishlistProductIds.includes(Number(product.id))
  );

  console.log("Matched Products:", matchedProducts);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchWishlistRequest());
    // dispatch(fetchProductsRequest()); // ensure products are loaded
  }, [dispatch]);

  // Remove item from wishlist
  const removeItem = (product_id) => {
    dispatch(removeWishlistProductRequest(product_id));
  };

  // Navigate to product details page
  const handleCardClick = (productId, product) => {
    dispatch(setSelectedProduct(product));
    navigate("/productpage");
  };
  const handleBuy = (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.user_id || "Guest";
    const quantity = 1;
  
    const checkoutItem = [
      {
        userId,
        productId: product.id,
        productName: product.name || "Unknown",
        productImage: product.image_url || "",
        productPrice: parseFloat(product.price || 0),
        quantity,
        totalPrice: parseFloat(product.price || 0) * quantity,
      },
    ];
  
    dispatch(fetcheckeoutpagedata(checkoutItem));
    navigate("/CheckoutPage");
  };

  return (
    <div className="container mt-4">
      {matchedProducts.length > 0 ? (
        <div className="row">
          {matchedProducts.map((product, index) => (
            <div key={index} className="col-md-4 col-sm-6 col-12 mb-3">
              <Card
                className="shadow-lg border-0 h-100"
                style={{ background: "#f8f9fa" }}
              >
                <div className="d-flex justify-content-end p-2">
                  <button
                    onClick={() => removeItem(product.product_id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#6e6c6b",
                      fontSize: "20px",
                      cursor: "pointer",
                    }}
                  >
                    <MdCancel />
                  </button>
                </div>

                <Card.Body className="text-center d-flex flex-column justify-content-between">
                  <div
                    onMouseEnter={() => setHoveredCard(product.product_id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => handleCardClick(product.product_id, product)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      className="d-block w-100 rounded"
                      style={{ height: "200px", objectFit: "cover" }}
                      src={product.image_url}
                      alt={product.name}
                      loading="lazy"
                    />

                    <Card.Title className="text-dark mt-2">
                      {product.name}
                    </Card.Title>

                    <Card.Text className="text-muted small">
                      <strong>Description:</strong>{" "}
                      {product.description?.length > 60
                        ? `${product.description.slice(0, 60)}...`
                        : product.description}
                    </Card.Text>

                    <Card.Text className="text-success font-weight-bold">
                      Price: ₹{product.price}
                    </Card.Text>

                    <Card.Text className="text-secondary">
                      <strong>Stock:</strong> {product.stock}
                    </Card.Text>
                  </div>

                  <div className="d-flex justify-content-center gap-2 mt-2" style={{marginLeft: "20px",
                borderRadius: "8px",
                fontSize: "10px",}}> 
                    <Button variant="outline-danger">Add to Cart</Button>
                    <Button variant="outline-info"
              style={{
                // background: "linear-gradient(135deg,rgb(255, 181, 70), #ff5722)",
                // color: "white",
                padding: "10px 16px",
                marginLeft: "20px",
                borderRadius: "8px",
                fontSize: "16px",
              }}
              onClick={()=>handleBuy(product)}
              disabled={product.stock === 0}
            >
              Buy Now
            </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted bg-light p-3 rounded shadow">
          No items in wishlist.
        </p>
      )}
    </div>
  );
};

export default WishListPage;