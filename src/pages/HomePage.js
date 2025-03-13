import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Badge, Carousel, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductCategory from '../features/product/productCategory';
import { fetchproductsrequest, setSelectedProduct } from '../features/product/productActions';
import image1 from '../assets/images/image12.jpg';
import image2 from '../assets/images/image16.png';
import image3 from '../assets/images/image18.png';
import image4 from '../assets/images/image17.png';
import image5 from '../assets/images/image19.png';
import { fetchApiCartDataRequest  } from '../features/cart/cartActions';
import { addToWishlist } from "../features/product/productActions";
import { FaEye } from "react-icons/fa";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import SellingProductspage from './SellingProductspage';
import Categories from './Categories';
import ExploreOurProductspage from './ExploreOurProductspage';
import NewArrivalpage from './NewArrivalpage';


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
    const { cartItems = [] } = useSelector((state) => state.cart || {});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [viewAll, setViewAll] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [cartItem, setCartItems] = useState([]);
  const [ratings, setRatings] = useState({});
  const [clickedProducts, setClickedProducts] = useState(new Set()); // Initialize clickedProducts state
  
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
        const response = await fetch("http://192.168.1.10:8081/api/cart/add", {
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
    
  
  const handleRating = (rating, productId) => {
    setRatings((prevRatings) => ({ ...prevRatings, [productId]: rating }));
  };

  const handleCardClick = (productId, product) => {
    dispatch(setSelectedProduct(product)); 
    navigate('/productpage');
  };

  const handleWishlistClick = (e, product) => {
    e.stopPropagation(); // Prevent card click navigation
    const isClicked = clickedProducts.has(product.id);
    if (isClicked) {
      setClickedProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    } else {
      setClickedProducts((prev) => new Set(prev).add(product.id));
      dispatch(addToWishlist(product));
    }
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
          <Col md={9} className="pr-15">
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
        <div className="d-flex align-items-center">
  <Badge bg="danger" style={{ width: "20px", height: "50px",marginLeft: "20px" , marginRight:"10px"}}>  </Badge>
  <p style={{ color: "#DB4444", fontWeight: "bold", fontSize: "20px", }}>
  todays
  </p>
</div>   
          <Row className="align-items-center">
            <Col md={3}>
              <h1 className="text-left" style={{ color: "#DB4444", fontSize: '30px', marginLeft:"10px"}}>
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

        <Container fluid className="py-4">
          <Row className="justify-content-center">
            <Col lg={12} md={12}>
              <div
                id="product-scroll-container"
                className="d-flex overflow-auto gap-3"
                style={{ scrollBehavior: 'smooth', whiteSpace: 'nowrap' }}
              >
                {loading ? (
                  <div className="text-center w-100">Loading products...</div>
                ) : error ? (
                  <div className="text-center w-100">{error}</div>
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <div
                      key={product.id}
                      className="card col-lg-2 col-md-3 col-sm-4 col-6 p-2"
                      style={{
                        minWidth: '250px',
                        maxWidth: '300px',
                        minHeight: '400px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                        position: 'relative',
                        display: 'inline-block',
                        transition: 'transform 0.3s ease',
                      }}
                      onMouseEnter={() => setHoveredCard(product.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={() => handleCardClick(product.id, product)}
                    >
                      <div style={{
                        position: "absolute",
                        top: "22px",
                        left: "81%",                        
                        gap: "11px",
                        color: "#dae2d7",
                        alignItems: "center",
                        marginBottom: "100px",
                      }}>

                      {clickedProducts.has(product.id) ? (
                        
                        <FaHeart
                        style={{
                          fontSize: "1.3rem",
                          padding:"10%",
                          width:"150%",
                            color: "red",
                            cursor: "pointer",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Shadow added
                            borderRadius: "50%",
                        }}
                        onClick={(e) => handleWishlistClick(e, product)}
                        />
                      ) : (
                        <FaRegHeart
                        style={{
                          fontSize: "1.2rem",
                          padding:"10%",                          
                            color: "#575B5A",
                            cursor: "pointer",
                            width:"150%",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Shadow added
                            borderRadius: "50%",
                        }}
                        onClick={(e) => handleWishlistClick(e, product)}
                        />
                      )}
                      <FaEye
                      style={{
                      fontSize: "1.2rem",
                     color: "gray",
                      cursor: "pointer",
                      padding:"2%",
                      width:"150%",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Shadow added
                            borderRadius: "50%",
                      }}
                       onClick={(e) => {
                       e.stopPropagation();
                      handleCardClick(product.id, product);
                        }}
                        />
                      
                      </div>
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="card-img-top img-fluid"
                        style={{
                          width:"100%",
                        paddingTop:"10px",
                        height: '200px',
                        borderTopLeftRadius: '10px',
                        borderTopRightRadius: '10px',                       
                                              }}
                      />
                      {hoveredCard === product.id && (
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
                      )}
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
          {/* View All Button */}
          <Row className="mt-4">
            <Col md={12} className="text-center">
              <button className="btn btn-danger" onClick={() => setViewAll((prev) => !prev)}>
                {viewAll ? 'Show Less' : 'View All Products'}
              </button>
            </Col>
          </Row>
          {viewAll && (
            <Row className="mt-4 col-lg-12 col-md-12">
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
                      <div style={{
                        position: "absolute",
                        top: "29px",
                        left: "80%",                      
                        gap: "8px",
                        alignItems: "center",
                        marginBottom: "100px",
                      }}>

                      {clickedProducts.has(product.id) ? (
                        
                        <FaHeart
                        style={{
                          fontSize: "1.3rem",
                          padding:"10%",
                          width:"150%",
                            color: "red",
                            cursor: "pointer",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Shadow added
                            borderRadius: "50%",
                        }}
                        onClick={(e) => handleWishlistClick(e, product)}
                        />
                      ) : (
                        <FaRegHeart
                        style={{
                          fontSize: "1.2rem",
                          padding:"10%",                          
                            color: "#575B5A",
                            cursor: "pointer",
                            width:"150%",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Shadow added
                            borderRadius: "50%",

                        }}
                        onClick={(e) => handleWishlistClick(e, product)}
                        />
                      )}
                      <FaEye
                      style={{
                        fontSize: "1.2rem",
                        color: "gray",
                         cursor: "pointer",
                         padding:"2%",
                         width:"150%",
                         boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Shadow added
                        borderRadius: "50%",
                      }}
                       onClick={(e) => {
                       e.stopPropagation();
                      handleCardClick(product.id, product);
                        }}
                        />
                      
                      </div>
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="card-img-top"
                      style={{
                        width:"100%",
                        paddingTop:"10px",
                        height: '200px',
                        borderTopLeftRadius: '10px',
                        borderTopRightRadius: '10px',
                      }}
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
                            cursor: 'pointer',
                            opacity: 0.9,
                          }}
                          onClick={(e) => handleAddToCart(e, product)}
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
      <ProductCategory />
      <br />
      <SellingProductspage/>
    <Categories/>
    <br/>
    <ExploreOurProductspage/>
    <br/>
    <NewArrivalpage/>
    </div>
  );
};

export default HomePage;
