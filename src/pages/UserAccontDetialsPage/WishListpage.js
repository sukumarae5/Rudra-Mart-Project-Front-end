import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Button, Row, Col } from 'react-bootstrap';

const WishListPage = () => {
  const { addToWishlist = [] } = useSelector((state) => state.products);

  return (
    <div>
      {addToWishlist.length > 0 ? (
        <Row>
          <h1>Your Wishlist ({addToWishlist.length} items)</h1>

          {addToWishlist.map((product, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3} style={{ marginBottom: '20px' }}>
              <Card style={{ width: '100%' }}>
                <Card.Img
                  variant="top"
                  src={product?.image_url || 'https://via.placeholder.com/150'}
                  alt={product?.name || "Product Image"}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{product?.name || "Unnamed Product"}</Card.Title>
                  <Card.Text>Price: ${product?.price || "N/A"}</Card.Text>
                  <Button variant="danger">add to cart</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>Your wishlist is empty.</p>
      )}
    </div>
  );
};

export default WishListPage;
