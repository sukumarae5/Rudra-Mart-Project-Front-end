import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Row, Col, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { fetchApiCartDataRequest } from "../../features/cart/cartActions";

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
    
        // API call to add product to cart
        const response = await fetch("http://192.168.1.12/api/cart/add", {
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
  return (
    <Container className="mt-4">
      <h1 className="text-center text-primary fw-bold">Your Wishlist ({addToWishlist.length} items)</h1>

      {addToWishlist.length > 0 ? (
        <Row className="justify-content-center">
          {addToWishlist.map((product, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="shadow-lg border-0 rounded">
                <Card.Img
                  variant="top"
                  src={product?.image_url || "https://via.placeholder.com/150"}
                  alt={product?.name || "Product Image"}
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px 8px 0 0",
                  }}
                />
                <Card.Body className="text-center">
                  <Card.Title className="text-dark fw-bold">
                    {product?.name || "Unnamed Product"}
                  </Card.Title>
                  <Card.Text className="text-muted">
                    Price: <span className="text-success fw-bold">${product?.price || "N/A"}</span>
                  </Card.Text>
                  <div
                          className="add-to-cart-btn"
                          style={{
                            position: 'relative',
                            top: '0',
                            left: '0',
                            width: '100%',
                            backgroundColor: 'black',
                            color: 'white',
                            textAlign: 'center',
                            padding: '10px 0',
                            cursor: 'pointer',
                            opacity: 0.9,
                          }}
                          onClick={(e) => handleAddToCart(e, product)}
                        >
                          Add to Cart
                        </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center text-danger fs-4 mt-4">Your wishlist is empty.</p>
      )}
    </Container>
  );
};

export default WishListPage;
