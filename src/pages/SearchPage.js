import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { fetchApiCartDataRequest, fetcheckeoutpagedata } from '../features/cart/cartActions';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const SearchPage = () => {
  const { products = [] } = useSelector((state) => state.products);
  const { cartItems = [] } = useSelector((state) => state.cart);
  const { searchproduct = '' } = useSelector((state) => state.products);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const showSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    if (!searchproduct) return;

    const lowerCaseSearch = searchproduct.toLowerCase();
    const matchingProducts = products.filter(
      (product) => product?.name?.toLowerCase().includes(lowerCaseSearch)
    );
    setFilteredProducts(matchingProducts);
  }, [products, searchproduct]);

  const handleAddToCart = async (event, product) => {
    event.stopPropagation();

    try {
      const userToken = localStorage.getItem('authToken');
      if (!userToken) {
        showSnackbar('Session expired or user not authenticated. Please log in.', 'error');
        navigate('/login');
        return;
      }

      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        showSnackbar('User information missing. Please log in again.', 'error');
        navigate('/login');
        return;
      }

      const isProductInCart = cartItems.some(
        (item) => item.user_id === user.id && item.product_id === product.id
      );

      if (isProductInCart) {
        showSnackbar('Product is already in the cart.', 'warning');
        return;
      }

      const cartItem = {
        user_id: user.id,
        product_id: product.id,
        quantity: 1,
      };

      const response = await fetch(`http://${process.env.REACT_APP_IP_ADDRESS}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(cartItem),
      });

      const data = await response.json();

      if (!response.ok) {
        showSnackbar(`Error: ${data.message || response.statusText}`, 'error');
        return;
      }

      showSnackbar('Product successfully added to cart.', 'success');
      dispatch(fetchApiCartDataRequest());
    } catch (error) {
      console.error('Error adding product to cart:', error);
      showSnackbar(`Error: ${error.message}`, 'error');
    }
  };

  const handleBuy = (event, productid) => {
    event.stopPropagation();

    const product = products.find((p) => p.id === productid);
    if (!product) {
      showSnackbar('Product not found', 'error');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      showSnackbar('User not authenticated. Please log in.', 'error');
      navigate('/login');
      return;
    }

    const Buynowdata = [
      {
        user_id: user.id,
        productId: product.id,
        productName: product?.name || 'Unknown',
        productImage: product?.image_url || '',
        productPrice: parseFloat(product?.price || 0),
        quantity: 1,
        totalPrice: parseFloat(product?.price || 0),
      },
    ];

    dispatch(fetcheckeoutpagedata(Buynowdata));
    navigate('/CheckoutPage');
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f8ea', minHeight: '100vh' }}>
      <h2 style={{ color: '#2d6a4f', textAlign: 'center' }}>Search Results: {searchproduct}</h2>
      {filteredProducts.length > 0 ? (
        <div>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              style={{
                display: 'flex',
                border: '1px solid #a3b18a',
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '20px',
                backgroundColor: '#ffffff',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                alignItems: 'center',
              }}
            >
              <div style={{ flex: '1' }}>
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '2px solid #588157',
                  }}
                />
              </div>
              <div style={{ flex: '3', marginLeft: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#344e41' }}>{product.name}</h3>
                <p style={{ color: '#40916c', fontWeight: 'bold' }}>₹{product.price}</p>
                <p style={{ fontSize: '14px', color: '#555' }}>RAM: {product.ram} | Storage: {product.storage}</p>
                <p style={{ color: '#dda15e' }}>{product.ratings} Ratings</p>
                <p style={{ fontSize: '14px', color: '#666' }}>{product.description}</p>
                <p style={{ fontSize: '14px', color: '#666' }}>{product.stock}</p>
                <div style={{ display: 'flex' }}>
                  <Button
                    style={{
                      background: 'linear-gradient(90deg, #6a994e 0%, #40916c 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 15px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginTop: '10px',
                    }}
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    style={{
                      background: 'linear-gradient(90deg, rgb(241, 14, 14) 0%, rgb(245, 72, 72) 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 15px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginTop: '10px',
                      marginLeft: '10px',
                    }}
                    onClick={(e) => handleBuy(e, product.id)}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#a3b18a', textAlign: 'center' }}>No matching products found.</p>
      )}

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default SearchPage;
