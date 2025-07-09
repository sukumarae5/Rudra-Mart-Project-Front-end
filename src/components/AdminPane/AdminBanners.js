import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FiImage, FiPlusCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // ← Import navigate hook

const AdminBanners = () => {
  const navigate = useNavigate(); // ← Initialize navigate

  const handleAddBannerClick = () => {
    navigate("/admin/addbanners"); // ← Navigate to add banner page
  };

  return (
    <Container fluid className="py-4 px-3 px-md-5">
      {/* Page Header */}
      <Row className="align-items-center mb-4">
        <Col xs={12} md={6}>
          <h3 className="fw-bold mb-1">Banner Management</h3>
          <p className="text-muted mb-0">
            Add and manage promotional banners displayed on the homepage.
          </p>
        </Col>
        <Col
          xs={12}
          md={6}
          className="d-flex justify-content-md-end justify-content-start mt-3 mt-md-0"
        >
          <Button
            variant="primary"
            className="d-flex align-items-center gap-2 shadow-sm"
            onClick={handleAddBannerClick} // ← Attach handler
          >
            <FiPlusCircle size={18} />
            Add New Banner
          </Button>
        </Col>
      </Row>

      {/* No Banners Placeholder */}
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <Card className="text-center py-5 px-4 shadow-sm">
            <FiImage size={60} className="mb-3 text-muted" />
            <h5 className="mb-2">No banners found</h5>
            <p className="text-muted mb-4">
              Start by adding your first banner to highlight key promotions or messages.
            </p>
            <Button
              variant="outline-primary"
              className="d-flex align-items-center gap-2 mx-auto"
              onClick={handleAddBannerClick} // ← Same handler here
            >
              <FiPlusCircle size={18} />
              Add Banner
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminBanners;
