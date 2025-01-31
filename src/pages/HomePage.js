import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Carousel, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductCategory from '../features/product/productCategory';
import { fetchproductsrequest, setSelectedProduct } from '../features/product/productActions';
import image1 from '../assets/images/image12.jpg';
import image2 from '../assets/images/image16.png';
import image3 from '../assets/images/image18.png';
import image4 from '../assets/images/image17.png';
import image5 from '../assets/images/image19.png';
import { fetchcartproductsendsuccess, fetchcartproductsuccess } from '../features/cart/cartActions';


const renderStars = (rating, onClick, productId) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        style={{
          color: i <= rating ? 'gold' : 'gray',
          fontSize: '1.5rem',
          cursor: 'pointer',
        }}
        onClick={() => onClick(i, productId)}
      >
        ★
      </span>
    );
  }
  return stars;
};

const HomePage = () => {
  const { products = [], error = null, loading = false } = useSelector((state) => state.products || {});
    
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [viewAll, setViewAll] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [ratings, setRatings] = useState({});

  
  
    
  useEffect(() => {
    dispatch(fetchproductsrequest());
  }, [dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateTimeUnits = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return { days, hours, minutes, secs };
  };

  const { days, hours, minutes, secs } = calculateTimeUnits(timeLeft);

  const scrollProducts = (direction) => {
    const container = document.getElementById('product-scroll-container');
    const scrollAmount = 300;
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  };

  const addToCart = (product) => {
    
    setCartItems((prevCartItems) => [...prevCartItems, product]);
    dispatch(fetchcartproductsendsuccess(product))
  };

  const handleRating = (rating, productId) => {
    setRatings((prevRatings) => ({ ...prevRatings, [productId]: rating }));
  };

  const handleCardClick = (productId, product) => {
    console.log(product); // Debugging: Check if product is being passed correctly
    dispatch(setSelectedProduct(product)); // Pass the full product object
    
    // Navigate to the product detail page
    navigate('/productpage');
  };

  return (
    <div>
      <Container fluid className="mt-4 mb-4">
        <Row>
          <Col md={3} className="bg-gray-100 p-12">
            <ul className="list-none space-y-2">
              {[{ label: "Women's Fashion", path: '/womens-fashion' },
                { label: "Men's Fashion", path: '/mens-fashion' },
                { label: 'Electronics', path: '/electronics' },
                { label: 'Home & Lifestyle', path: '/home-lifestyle' },
                { label: 'Medicine', path: '/medicine' },
                { label: 'Sports & Outdoor', path: '/sports-outdoor' },
                { label: 'Baby & Toys', path: '/baby-toys' },
                { label: 'Groceries & Pets', path: '/groceries-pets' },
                { label: 'Health & Beauty', path: '/health-beauty' }].map((category, index) => (
                <li key={index}>
                  <Link to={category.path} className="text-dark hover:underline">
                    {category.label} <ArrowRight />
                  </Link>
                </li>
              ))}
            </ul>
          </Col>
          <Col md={9} className="pr-20">
            <Carousel>
              {[image1, image2, image3, image4, image5].map((image, index) => (
                <Carousel.Item key={index}>
                  <img className="d-block w-100 object-cover h-344" src={image} alt={`Slide ${index + 1}`} />
                  <Carousel.Caption>
                    <a href="#" className="absolute top-0 left-0 m-2 underline-offset-1">
                      Shop Now <ArrowRight />
                    </a>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>

        <Container fluid className="mt-4">
          <Row className="align-items-center">
            <Col md={3}>
              <h1 className="text-left" style={{ color: 'red', fontSize: '30px' }}>
                <b>Flash Sale</b>
              </h1>
            </Col>
            <Col md={6} className="text-center">
              <div className="d-flex justify-content-center">
                {[{ value: days, label: 'Days' }, { value: hours, label: 'Hours' },
                  { value: minutes, label: 'Minutes' }, { value: secs, label: 'Seconds' }].map((unit, index) => (
                  <div key={index} className="mx-2 text-center">
                    <div style={{ fontSize: '1rem', fontWeight: '500', color: '#555' }}>{unit.label}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d9534f' }}>
                      {unit.value < 10 ? `0${unit.value}` : unit.value}
                    </div>
                  </div>
                ))}
              </div>
            </Col>
            <Col md={3} className="text-right">
              <button className="btn btn-light mx-2" onClick={() => scrollProducts('left')}>
                <ArrowBackIos />
              </button>
              <button className="btn btn-light mx-2" onClick={() => scrollProducts('right')}>
                <ArrowForwardIos />
              </button>
            </Col>
          </Row>
        </Container>

        <Container fluid className="mt-4 mb-4 ">
          <Row>
            <Col md={12} className="position-relative ">
              <div
              
                id="product-scroll-container"
                className="d-flex overflow-auto "
                style={{ scrollBehavior: 'smooth', whiteSpace: 'nowrap', padding: '0 50px' }}
              >
                {loading ? (
                  <div className="text-center w-100">Loading products...</div>
                ) : error ? (
                  <div className="text-center w-100">{error}</div>
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <div
  key={product.id}
  className="card m-2 col-lg-3 col-md-4 col-sm-12 col-xs-12 col-xm-12"
  style={{
    height: '400px',
    width: '300px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    position: 'relative',
  }}
  onMouseEnter={() => setHoveredCard(product.id)}
  onMouseLeave={() => setHoveredCard(null)}
  onClick={() => handleCardClick(product.id, product)} // Pass the entire product object
>
  <img
    src={product.image_url}
    alt={product.name}
    className="card-img-top"
    style={{ width: 'auto', height: '200px', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
  />
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
      display: hoveredCard === product.id ? 'block' : 'none',
      cursor: 'pointer',
    }}
    onClick={(e) => {
      e.stopPropagation(); // Prevent card click navigation
      addToCart(product);
    }}
  >
    Add to Cart
  </div>
  <div className="card-body">
    <h5 className="card-title">{product.name}</h5>
    <p className="card-text">{product.description}</p>
    <p className="card-text">
      <strong>Price:</strong> ₹{product.price}
    </p>
    <div className="d-flex justify-content-start">
      {renderStars(ratings[product.id] || 0, handleRating, product.id)}
    </div>
  </div>
</div>

                  ))
                ) : (
                  <div className="text-center w-100">No products available.</div>
                )}
              </div>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={12} className="text-center">
              <button className="btn btn-danger" onClick={() => setViewAll((prev) => !prev)}>
                {viewAll ? 'Show Less' : 'View All Products'}
              </button>
            </Col>
          </Row>

          {viewAll && (
            <Row className="mt-4 col-lg-12 col-md-6">
              {products.map((product) => (
                <Col key={product.id} md={3} className="mb-4">
                  <div
                    className="card"
                    style={{
                      borderRadius: '10px',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                      padding: '10px',
                      position: 'relative',
                    }}
                    onMouseEnter={() => setHoveredCard(product.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => handleCardClick(product.id, product)} 
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="card-img-top"
                      style={{ height: '200px', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
                    />
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
                        display: hoveredCard === product.id ? 'block' : 'none',
                        cursor: 'pointer',
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click navigation
                        addToCart(product);
                      }}
                    >
                      Add to Cart
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">Price: ₹{product.price}</p>
                      <div className="d-flex justify-content-start">
                        {renderStars(ratings[product.id] || 0, handleRating, product.id)}
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </Container>
      <div>        
      </div>
      
      <ProductCategory />
      <br></br>
          </div>
  );
};

export default HomePage;
