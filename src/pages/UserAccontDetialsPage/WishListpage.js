import React, { useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlistRequest, removeWishlistProductRequest } from "../../features/wishlist/wishlistAction";

const WishListPage = () => {
  const dispatch = useDispatch();
  const { wishlistData = [] } = useSelector((state) => state.wishlist || {});
  
  useEffect(() => {
    dispatch(fetchWishlistRequest());
  }, [dispatch]);

  const removeItem = (wishlistid) => {
    console.log(wishlistid);
    dispatch(removeWishlistProductRequest(wishlistid));
  };

  const wishlistItems = Array.isArray(wishlistData[0]) ? wishlistData[0] : wishlistData;

  return (
    <div className="container mt-4">
      {wishlistItems.length > 0 ? (
        <div className="row">
          {wishlistItems.map((ele, index) => (
            <div key={index} className="col-md-4 col-sm-6 col-12 mb-3">
              <Card className="shadow-lg border-0 h-100" style={{ background: "#f8f9fa" }}>
                <Card.Body className="text-center d-flex flex-column justify-content-between">
                  <img
                    className="d-block w-100 rounded"
                    style={{ height: "250px",width:"100%" }}
                    src={ele.image_url}
                    alt={ele.name || `Item ${index + 1}`}
                    loading="lazy"
                  />
                  <Card.Title className="text-dark mt-2">{ele.name || "No Name"}</Card.Title>
                  <Card.Text className="text-success font-weight-bold">Price: ₹{ele.price || "N/A"}</Card.Text>
                  <Button 
                  style={{backgroundColor:"#e3756f"}}
                    className="w-100 mt-2 fw-bold" 
                    onClick={() => removeItem(ele.id)}
                  >
                    Remove from Wishlist
                  </Button>
                </Card.Body>
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
