import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlistRequest, removeWishlistProductRequest } from "../../features/wishlist/wishlistAction";
import { MdCancel } from "react-icons/md";
import { setSelectedProduct } from "../../features/product/productActions";
import { useNavigate } from "react-router-dom";

const WishListPage = () => {
  const dispatch = useDispatch();
  const { wishlistData = [] } = useSelector((state) => state.wishlist || {});
    const [hoveredCard, setHoveredCard] = useState(null);
  const navigate=useNavigate()
  useEffect(() => {
    dispatch(fetchWishlistRequest());
  }, [dispatch]);

  const removeItem = (product_id
  ) => {
    console.log(product_id);
    dispatch(removeWishlistProductRequest(product_id));
  };

  const wishlistItems = Array.isArray(wishlistData[0]) ? wishlistData[0] : wishlistData;
 const handleCardClick = (productId, product) => {
    dispatch(setSelectedProduct(product)); 
    navigate('/productpage');
  };
  return (
    <div className="container mt-4">
      {wishlistItems.length > 0 ? (
        <div className="row">
          {wishlistItems.map((ele, index) => (
            
            <div key={index} className="col-md-4 col-sm-6 col-12 mb-3" 
            >
              

              <Card className="shadow-lg border-0 h-70" style={{ background: "#f8f9fa" }}>
              <a style={{color:"#6e6c6b", fontSize:"102%",paddingLeft:"90%" ,paddingTop:"5%"}}
                    onClick={() => removeItem(ele.id)}
                    >
                    <MdCancel />

                  </a>
                  <h2>{ele.product}</h2>
              <div   onMouseEnter={() => setHoveredCard(ele.product_id
)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={() => handleCardClick(ele.product_id
                        , ele)}>
              
                <Card.Body className="text-center d-flex flex-column justify-content-between">
                  <img
                    className="d-block w-100 rounded"
                    style={{ height: "200px",width:"50%" }}
                    src={ele.image_url}
                    alt={ele.name || `Item ${index + 1}`}
                    loading="lazy"
                    />
                  <Card.Title className="text-dark mt-2">{ele.name || "No Name"}</Card.Title>
                  <Card.Text className="text-success font-weight-bold">Price: ₹{ele.price || "N/A"}</Card.Text>

                </Card.Body>
            </div>
              </Card>
                    </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted bg-light p-3 rounded shadow">No items in wishlist.</p>
      )}
    </div>
  );
};

export default WishListPage;
