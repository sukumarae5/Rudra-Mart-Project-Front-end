import React, { useEffect } from "react";
import { Card, Spinner, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProductCategoryRequest } from "../features/categories/categoriesAction";
import { MdCelebration } from "react-icons/md";

const Categorypage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categoryproduct = [], loading, error } = useSelector(
    (state) => state.categoryproducts || {}
  );

  useEffect(() => {
    dispatch(fetchProductCategoryRequest());
  }, [dispatch]);

  const handleCategoryClick = (categoryId, categoryName) => {
    navigate("/subcategories", { state: { categoryId, categoryName } });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <div className="text-danger text-center py-5">Error: {error}</div>;
  }

  return (
    <>
      <div className="container-fluid p-4">
        <h1 className="fw-bold mb-5 display-6">Shop by Category</h1>
        <Row xs={2} sm={3} md={4} lg={5} xl={6} className="g-4">
          {categoryproduct.map((category) => (
            <Col key={category.id}>
              <Card
                className="shadow-sm border-0 text-center h-100 category-card"
                onClick={() => handleCategoryClick(category.id, category.name)}
              >
                {/* Image Container */}
                <div className="category-image-container">
                  <Card.Img
                    src={category.image_url}
                    alt={category.name}
                    className="category-image"
                  />
                </div>

                {/* Title */}
                <Card.Body className="d-flex align-items-center justify-content-center">
                  <Card.Title className="category-title">
                    {category.name}
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Scrolling Banner */}
        <div
          className="text-center p-3 mt-5"
          style={{
            backgroundColor: "#78be20",
            color: "black",
            fontWeight: "bold",
            fontFamily: "sans-serif",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              display: "inline-block",
              animation: "scrollText 10s linear infinite",
            }}
          >
            Congratulations! Shop our customers 🎉
          </div>

          <style>
            {`
              @keyframes scrollText {
                from { transform: translateX(100%); }
                to { transform: translateX(-100%); }
              }

              /* Card hover effect */
              .category-card {
                border-radius: 15px;
                cursor: pointer;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
              }
              .category-card:hover {
                transform: translateY(-8px) scale(1.05);
                box-shadow: 0 8px 20px rgba(0,0,0,0.2);
              }

              /* Image container */
.category-image-container {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 20%;
  background: linear-gradient(135deg, #f8f9fa, #c7f8b3ff); 
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px auto;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05); /* subtle shadow for depth */
}


              /* Image hover zoom */
              .category-image {
                width: 100%;
                height: 100%;
                object-fit: contain;
                padding: 10px;
                transition: transform 0.4s ease;
              }
              .category-card:hover .category-image {
                transform: scale(1.1);
              }

              /* Title */
              .category-title {
                font-size: 15px;
                font-weight: 600;
                color: #333;
                text-align: center;
              }
            `}
          </style>
        </div>
      </div>
    </>
  );
};

export default Categorypage;
