import React, { useEffect } from "react";
import { Card, Spinner, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProductCategoryRequest } from "../features/categories/categoriesAction";

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
    <div className="container-fluid p-4">
      <h2 className="fw-bold mb-5">Shop by Category</h2>
      <Row xs={1} md={3} lg={6}>
        {categoryproduct.map((category) => (
          <Col key={category.id} className="mb-4">
            <Card
              className="shadow-sm border-0 h-100"
              style={{ cursor: "pointer" }}
              onClick={() => handleCategoryClick(category.id, category.name)}       
            >  
            
              <Card.Img
                variant="top"
                src={category.image_url}
                alt={category.name}
                style={{
                  height: "90px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
              <Card.Body>
                <Card.Title className="text-center">{category.name}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Categorypage;
