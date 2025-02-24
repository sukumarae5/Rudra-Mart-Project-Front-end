import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchproductsrequest } from "../../features/product/productActions";
import {
  Button,
  Form,
  InputGroup,
  Dropdown,
  DropdownButton,
  Row,
  Col,
} from "react-bootstrap";
import PaginationComponent from "./Pagination";
import { MdModeEditOutline, MdOutlineDeleteOutline } from "react-icons/md";
import { GoPlus } from "react-icons/go";

const ProductTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products = [] } = useSelector((state) => state.products || {});

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("All");
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchproductsrequest());
  }, [dispatch]);

  const handleEditProduct = (product) => {
    navigate("/admin/editproduct", { state: { product } });
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const response = await fetch(
        `http://192.168.1.17:3000/api/products/deleteproduct/${productId}`,
        { method: "DELETE", headers: { "Content-Type": "application/json" } }
      );

      const data = await response.json();
      if (!response.ok) {
        alert(`Error: ${data.error || "Failed to delete product"}`);
        return;
      }

      alert("Product deleted successfully!");
      dispatch(fetchproductsrequest());
    } catch (error) {
      alert("Error: Could not delete product");
    }
  };

  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <div className="container-fluid px-4">
      {/* Header Section */}
      <Row className="align-items-center mb-3">
        <Col>
          <h1
            style={{ fontSize: "2rem", color: " #131523", fontWeight: "bold" }}
          >
            Products
          </h1>
        </Col>
        <Col xs={12} md="auto" className="text-end">
          <Button
            onClick={() => navigate("/admin/addproducts")}
            className="d-flex align-items-center"
            style={{
              backgroundColor: "#1E5EFF",
              border: "none",
              padding: "10px 20px",
            }}
          >
            <GoPlus size={22} style={{ marginRight: "8px" }} />
            Add Product
          </Button>
        </Col>
      </Row>

      {/* Search & Filters */}
      <Row className="mb-3">
        <Col md={6} className="d-flex">
          <DropdownButton
            variant="outline-primary"
            title={`Filter: ${filterOption}`}
            onSelect={(selectedFilter) => setFilterOption(selectedFilter)}
          >
            <Dropdown.Item eventKey="All">All</Dropdown.Item>
            <Dropdown.Item eventKey="Category1">Category 1</Dropdown.Item>
            <Dropdown.Item eventKey="Category2">Category 2</Dropdown.Item>
          </DropdownButton>
          <InputGroup className="ms-3" style={{ maxWidth: "300px" }}>
            <Form.Control
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Col>

        {/* Bulk Actions */}
        <Col md={6} className="text-end">
          <Button
            variant="outline-primary"
            size="sm"
            disabled={selectedProducts.length !== 1}
            onClick={() => {
              const product = products.find(
                (p) => p.id === selectedProducts[0]
              );
              if (product) handleEditProduct(product);
            }}
          >
            <MdModeEditOutline size={20} />
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            className="ms-2"
            disabled={selectedProducts.length === 0}
            onClick={() => selectedProducts.forEach(handleDeleteProduct)}
          >
            <MdOutlineDeleteOutline size={20} />
          </Button>
        </Col>
      </Row>

      {/* Table */}
      <div className="table-responsive">
        <Table striped bordered hover className="custom-table">
          <thead>
            <tr>
              <th>
                <Form.Check
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedProducts(
                      e.target.checked ? currentProducts.map((p) => p.id) : []
                    )
                  }
                  checked={
                    selectedProducts.length === currentProducts.length &&
                    currentProducts.length > 0
                  }
                />
              </th>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price ($)</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product, index) => (
                <tr key={product.id}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleCheckboxChange(product.id)}
                    />
                  </td>
                  <td>{indexOfFirstProduct + index + 1}</td>
                  <td>
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="product-img"
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>{product.name || "N/A"}</td>
                  <td>{product.description || "N/A"}</td>
                  <td>{product.price || "N/A"}</td>
                  <td>{product.stock || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No products available.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Custom Styles */}
      <style>
        {`
          .custom-table th {
            background-color: #f8f9fa;
            text-align: center;
          }
          .custom-table tbody tr:hover {
            background-color: #f1f3f5;
          }
          .product-img {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 8px;
          }
        `}
      </style>
    </div>
  );
};

export default ProductTable;
