import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Modal, Form, Spinner, Row, Col } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { BsPlusCircleFill } from "react-icons/bs";

// API URL
const API_URL = "http://192.168.1.10:8081/api/categories";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [categoryData, setCategoryData] = useState({
    id: null,
    name: "",
    image: null,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => setShowModal(true);
  const closeAddModal = () => {
    setShowModal(false);
    setCategoryData({ id: null, name: "", image: null });
  };

  const openEditModal = (category) => {
    setCategoryData({
      id: category.id,
      name: category.name,
      image: category.image,
    });
    setShowEditModal(true);
  };
  const closeEditModal = () => setShowEditModal(false);

  const handleInputChange = (e) => {
    setCategoryData({ ...categoryData, name: e.target.value });
  };

  const handleFileChange = (e) => {
    setCategoryData({ ...categoryData, image: e.target.files[0] });
  };

  const handleAddCategory = async () => {
    if (!categoryData.name || !categoryData.image) {
      alert("Please fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", categoryData.name);
    formData.append("image", categoryData.image);

    try {
      await axios.post(`${API_URL}/categories`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchCategories();
      closeAddModal();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleUpdateCategory = async () => {
    if (!categoryData.id || !categoryData.name) {
      alert("Please fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", categoryData.name);
    if (categoryData.image instanceof File) {
      formData.append("image", categoryData.image);
    }

    try {
      await axios.put(`${API_URL}/categories/${categoryData.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchCategories();
      closeEditModal();
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Product Categories</h2>
        <Button
          variant="primary"
          className="d-flex align-items-center"
          onClick={openAddModal}
        >
          <BsPlusCircleFill className="me-2" size={20} />
          Add Category
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row xs={1} md={3} lg={4} className="g-4">
          {categories.map((category) => (
            <Col key={category.id}>
              <Card className="shadow-sm border-0 h-100 category-card">
                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={`http://192.168.1.10:8081/uploads/${category.image}`}
                    alt={category.name}
                    className="category-image"
                  />
                  <FaEdit
                    className="edit-icon"
                    onClick={() => openEditModal(category)}
                  />
                </div>
                <Card.Body className="text-center">
                  <Card.Title className="fw-bold">{category.name}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Add Category Modal */}
      <Modal show={showModal} onHide={closeAddModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                value={categoryData.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAddModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddCategory}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Category Modal */}
      <Modal show={showEditModal} onHide={closeEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                value={categoryData.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Upload New Image</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleUpdateCategory}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Custom Styles */}
      <style>
        {`
          .category-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .category-card:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
          }
          .category-image {
            height: 200px;
            object-fit: cover;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
          }
          .edit-icon {
            position: absolute;
            top: 10px;
            right: 10px;
            color: #007bff;
            font-size: 20px;
            cursor: pointer;
            transition: transform 0.2s;
          }
          .edit-icon:hover {
            transform: scale(1.2);
          }
        `}
      </style>
    </div>
  );
};

export default AdminCategories;
