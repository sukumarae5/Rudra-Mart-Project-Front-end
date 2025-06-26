import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  Form,
  Spinner,
  Table,
  InputGroup,
  Row,
  Col,
} from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { BsPlusCircleFill } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { fetchProductCategoryRequest } from "../../features/categories/categoriesAction";
import { useDispatch, useSelector } from "react-redux";

const API_URL = `http://${process.env.REACT_APP_IP_ADDRESS}/api/categories`;

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [categoryData, setCategoryData] = useState({
    id: null,
    name: "",
    image: null,
  });
   const { categoryproduct = [],  error } = useSelector(
    (state) => state.categoryproducts || {}
  );
  console.log(categoryproduct)
  const dispatch=useDispatch()

  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
      dispatch(fetchProductCategoryRequest());
    }, [dispatch]);
  

  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_URL);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categoryproduct.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (showInactive || cat.status)
  );

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

  const handleInputChange = (e) =>
    setCategoryData({ ...categoryData, name: e.target.value });

  const handleFileChange = (e) =>
    setCategoryData({ ...categoryData, image: e.target.files[0] });

  const handleAddCategory = async () => {
    if (!categoryData.name || !categoryData.image) {
      alert("Please fill all fields.");
      return;
    }
    const formData = new FormData();
    formData.append("name", categoryData.name);
    formData.append("image", categoryData.image);
    try {
      await axios.post(API_URL, formData, {
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
      await axios.put(`${API_URL}/${categoryData.id}`, formData, {
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
      <Row className="align-items-center mb-3 g-1">
        <Col xs={12} sm={12} md={6} lg={5} xl={7}>
          <InputGroup style={{ height: "38px" }}>
            <InputGroup.Text>
              <BiSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Col>

        <Col xs={5} sm={2} md={3} lg={2} xl={2}>
          <div className="d-flex align-items-center justify-content-end gap-2" style={{ minHeight: "44px" }}>
            <Form.Check
              type="switch"
              id="show-inactive-switch"
              checked={showInactive}
              className="fs-5"
              onChange={(e) => setShowInactive(e.target.checked)}
              style={{ transform: "scale(1.2)" }}
            />
            <label htmlFor="show-inactive-switch" className="text-center">
              Show Inactive
            </label>
          </div>
        </Col>

        <Col xl={3} xs={7} lg={5} md={12} className="d-flex justify-content-end gap-3 mt-lg-0 align-items-center">
          <Button
            variant="outline-secondary"
            onClick={fetchCategories}
            className="d-flex justify-content-center align-items-center"
            style={{ width: "44px", height: "38px", fontSize: "1.0rem" }}
            aria-label="Reload page"
          >
            ⟳
          </Button>

          <Button
            onClick={openAddModal}
            className="d-flex align-items-center"
            style={{
              fontSize: "0.9rem",
              padding: "7px 10px",
              backgroundColor: "#1E5EFF",
              border: "none",
              height: "40px",
              whiteSpace: "nowrap",
            }}
          >
            <BsPlusCircleFill className="me-2" size={20} />
            Add Category
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <Table responsive className="text-center align-middle border" style={{ minWidth: "700px" }}>
            <thead className="bg-primary text-white">
              <tr>
                <th className="text-start">Image</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categoryproduct.length > 0 ? (
                categoryproduct.map((category) => (
                  <tr key={category.id}>
                    <td className="text-start">
                      <img
                        src={category.image_url}
                        alt={category.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    </td>
                    <td>{category.name}</td>
                    <td>{category.slug || "N/A"}</td>
                    <td>{category.description || "N/A"}</td>
                    <td>{category.status ? "Active" : "Inactive"}</td>
                    <td>
                      <Button variant="outline-primary" size="sm" onClick={() => openEditModal(category)}>
                        <FaEdit />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}

      {/* Add Modal */}
      <Modal show={showModal} onHide={closeAddModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control type="text" value={categoryData.name} onChange={handleInputChange} />
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

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={closeEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control type="text" value={categoryData.name} onChange={handleInputChange} />
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
    </div>
  );
};

export default AdminCategories;
