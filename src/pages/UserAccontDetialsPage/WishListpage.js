import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Row, Col, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { fetchApiCartDataRequest } from "../../features/cart/cartActions";
import { motion } from "framer-motion";
import { MdDeleteOutline } from "react-icons/md"; 
import { FiShoppingCart } from "react-icons/fi";
import Button from "react-bootstrap/Button";

const WishListPage = () => {
  const { addToWishlist = [] } = useSelector((state) => state.products);
  const { cartItems = [] } = useSelector((state) => state.cart || {});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = async (event, product) => {
    event.stopPropagation();

    try {
      const userToken = localStorage.getItem("authToken");
      if (!userToken) {
        alert("Session expired or user not authenticated. Please log in.");
        navigate("/login");
        return;
      }

      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        alert("User information is missing or corrupted. Please log in.");
        navigate("/login");
        return;
      }

      const isProductInCart = cartItems.some(
        (item) => item.user_id === user.id && item.product_id === product.id
      );
      if (isProductInCart) {
        alert("Product is already in the cart.");
        return;
      }

      const cartItem = {
        user_id: user.id,
        product_id: product.id,
        quantity: 1,
      };

      const response = await fetch("http://192.168.1.9:8081/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(cartItem),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Error: ${data.message || response.statusText}`);
        return;
      }

      alert("Product successfully added to cart.");
      dispatch(fetchApiCartDataRequest());
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleRemoveFromWishlist = (event, productId) => {
    event.stopPropagation();

    console.log(`Removing product ${productId} from wishlist.`);
  };

  return (
    <Container className="my-5">
      <p className="text-start text-dark fw-bold m-4">
        Wishlist ({addToWishlist.length})
      </p>

      {addToWishlist.length > 0 ? (
        <Row className="justify-content-center">
          {addToWishlist.map((product, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3} xl={3} className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ position: "relative" }} 
              >
                <Card className="shadow-lg border-1 rounded overflow-hidden"
                  style={{
                    width: "100%",
                    maxWidth: "280px",
                    height: "auto",
                    margin: "auto",
                    position: "relative",
                  }}
                >
              
                  <button
                    onClick={(e) => handleRemoveFromWishlist(e, product.id)}
                    className="delete-btn"
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "green",
                      fontSize: "22px",
                    }}
                  >
                    <MdDeleteOutline />
                  </button>

                  <motion.div >
                    <Card.Img
                      className="overflow-hidden"
                      variant="top"
                      src={product?.image_url || "https://via.placeholder.com/150"}
                      alt={product?.name || "Product Image"}
                      style={{
                        width: "100%",
                        height: "170px",
                        objectFit: "cover",
                        borderRadius: "8px 8px 0 0",
                      }}
                    />
                  </motion.div>
                  <Card.Body className="text-center">
                    <motion.button
                      className="btn btn-dark w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                      onClick={(e) => handleAddToCart(e, product)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiShoppingCart color="green" /> Add to Cart
                    </motion.button>
                    <Card.Title className="text-dark fw-bold mt-2 text-start">
                      {product?.name || "Unnamed Product"}
                    </Card.Title>
                    <Card.Text className="text-danger text-start">
                      Price: <span className="text-success fw-bold">${product?.price || "N/A"}</span>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center text-danger fs-4 mt-4">
          Your wishlist is empty.
        </p>
      )}
    </Container>
  );
};

export default WishListPage;
