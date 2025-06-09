import React, { useEffect } from "react";
import { Card, Spinner, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductCategoryRequest } from "../features/categories/categoriesAction";

const Categorypage = () => {
  const dispatch = useDispatch();

  // Access redux state slice for categories
  const { categoryproduct = [], loading, error } = useSelector(
    (state) => state.categoryproducts || {}
  );

  // Trigger saga fetch on mount
  useEffect(() => {
    dispatch(fetchProductCategoryRequest());
  }, [dispatch]);

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
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold">Shop by Category</h2>
      </div>

      <Row xs={1} md={3} lg={6}>
        {categoryproduct.map((category) => (
          <Col key={category.id} className="mb-4">
            <Card className="shadow-sm border-0 h-100">
              <div className="position-relative">
                <Card.Img
                  variant="top"
                  src={`http://192.168.1.9:8082/uploads/${category.image}`}
                  alt={category.name}
                  style={{
                    maxWidth: "100%",
                    height: "90px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              </div>
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
