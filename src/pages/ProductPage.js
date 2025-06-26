import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Badge,
  ListGroup,
} from "react-bootstrap";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const ProductPage = () => {
  return (
    <Container fluid className="p-3" style={{ fontFamily: "Amazon Ember, Arial, sans-serif" }}>
      <Row>
        {/* Left Side: Thumbnails */}
        <Col xs={2}>
          <img
            src="https://m.media-amazon.com/images/I/51keZdyLRdL._SX679_.jpg"
            alt="Thumbnail"
            className="img-thumbnail my-1"
            style={{ cursor: "pointer" }}
          />
          <img
            src="https://m.media-amazon.com/images/I/41RfnzN8RML._SX679_.jpg"
            alt="Thumbnail"
            className="img-thumbnail my-1"
            style={{ cursor: "pointer" }}
          />
        </Col>

        {/* Main Image */}
        <Col xs={3}>
          <img
            src="https://m.media-amazon.com/images/I/51keZdyLRdL._SX679_.jpg"
            alt="Fresh Mango"
            className="img-fluid"
            style={{ maxHeight: "300px", objectFit: "contain" }}
          />
        </Col>

        {/* Product Details */}
        <Col xs={5}>
          <h5>Fresh Mango Raw, 500 g (4-5 pcs)</h5>
          <div className="d-flex align-items-center mt-1">
            <span>Fresh</span>
            <div className="d-flex align-items-center ms-2 text-warning">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStarHalfAlt />
              <span className="text-dark ms-1">3.9</span>
            </div>
            <span className="ms-1 text-primary">7,827 ratings</span>
          </div>
          <div className="text-secondary">10K+ bought in past month</div>

          <div className="mt-3">
            <span className="text-danger fs-4">-49%</span>
            <span className="fs-3 ms-2">₹28.00</span> <span className="text-muted fs-6"> (₹5.60 /100 g)</span>
            <div className="text-muted">M.R.P.: <s>₹55.00</s></div>
            <div className="mt-2">
              <Badge bg="danger">Cashback:</Badge> Get 5% back with Amazon Pay ICICI Bank credit card for Prime
              members. 3% back for others. Not applicable on EMI orders...
            </div>
            <div className="mt-3">
              <ListGroup variant="flush">
                <ListGroup.Item>Free Delivery</ListGroup.Item>
                <ListGroup.Item>Non-Returnable</ListGroup.Item>
                <ListGroup.Item>Amazon Delivered</ListGroup.Item>
                <ListGroup.Item>Secure transaction</ListGroup.Item>
              </ListGroup>
            </div>
            <div className="mt-3">
              <h5 className="text-success">In Stock</h5>
              <div>Sold by <a href="#">More Nallakunta DS</a> and Fulfilled by Amazon.</div>
              <div className="text-success mt-2">This is a <b>Vegetarian</b> product.</div>
              <ListGroup variant="flush" className="mt-2">
                <ListGroup.Item>100% Carbide Free</ListGroup.Item>
                <ListGroup.Item>Excellent source of Vitamin A and C</ListGroup.Item>
                <ListGroup.Item>Can be used to make chutney or pickle</ListGroup.Item>
              </ListGroup>
            </div>
          </div>
        </Col>

        {/* Right Side: Price & Add to Cart */}
        <Col xs={2}>
          <div className="border p-3 rounded">
            <div className="fs-4">₹28.00</div>
            <div className="text-muted">(₹5.60 /100 g)</div>
            <div className="text-success mt-1">FREE delivery starting from Today 2 PM – 4 PM</div>
            <div className="text-muted">on orders over ₹499. Order within 1 hr 35 mins</div>
            <div className="text-muted">Delivering to Hyderabad 500003</div>
            <div className="text-success mt-2">In Stock</div>
            <Form.Select className="mt-2">
              <option>Qty: 1</option>
              <option>Qty: 2</option>
              <option>Qty: 3</option>
            </Form.Select>
            <Button variant="warning" className="w-100 mt-3">Add to cart</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductPage;
