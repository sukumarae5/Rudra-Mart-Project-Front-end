import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  InputGroup,
  Dropdown,
  DropdownButton,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProductsWithCategoryRequest } from "../../features/product/productActions";
import PaginationComponent from "./Pagination";
import { GoPlus } from "react-icons/go";
import { MdModeEditOutline, MdOutlineDeleteOutline } from "react-icons/md";

const ProductTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productsWithCategory = [] } = useSelector(
    (state) => state.products || {}
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    dispatch(fetchProductsWithCategoryRequest());
  }, [dispatch]);

  useEffect(() => {
    if (productsWithCategory.length > 0) {
      const uniqueCategories = [
        ...new Set(productsWithCategory.map((p) => p.category_name)),
      ];
      setCategories(uniqueCategories);
    }
  }, [productsWithCategory]);

  // Filter & Search
  const filteredProducts = productsWithCategory.filter((product) => {
    const matchesSearchQuery = product.product_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return filterCategory === "All"
      ? matchesSearchQuery
      : matchesSearchQuery && product.category_name === filterCategory;
  });

  // Pagination Logic
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Select or Deselect all products
  const handleSelectAll = () => {
    if (selectedProducts.length === currentProducts.length) {
      setSelectedProducts([]); // Deselect all
    } else {
      setSelectedProducts(currentProducts.map((product) => product.product_id)); // Select all
    }
  };

  // Handle checkbox selection for individual products
  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  // Handle Edit Button
  const handleEditSelectedProduct = () => {
    if (selectedProducts.length !== 1) {
      alert("Please select exactly one product to edit.");
      return;
    }
    const productToEdit = productsWithCategory.find(
      (product) => product.product_id === selectedProducts[0]
    );
    if (!productToEdit) {
      alert("Product data not found.");
      return;
    }
    navigate("/admin/editproduct", { state: { product: productToEdit } });
  };

  // Handle Delete Button
  const handleDeleteSelectedProducts = async () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product to delete.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete selected products?")) {
      return;
    }

    try {
      await Promise.all(
        selectedProducts.map(async (productId) => {
          const response = await fetch(
            `http://192.168.1.12:8081/api/products/deleteproduct/${productId}`,
            {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to delete product");
          }
        })
      );

      alert("Selected products deleted successfully!");
      dispatch(fetchProductsWithCategoryRequest());
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error deleting products:", error);
      alert("Error: Could not delete products");
    }
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <Row className="align-items-center mb-3">
        <Col xs={12} md={6}>
          <h2 className="fw-bold text-dark">Products</h2>
        </Col>
        <Col xs={12} md={6} className="d-flex justify-content-end">
          <Button
            onClick={() => navigate("/admin/addproducts")}
            className="d-flex align-items-center"
            style={{
              fontSize: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#1E5EFF",
              border: "none",
            }}
          >
            <GoPlus className="me-2" size={20} />
            Add Product
          </Button>
        </Col>
      </Row>

      {/* Filter, Search, and Actions */}
      <Card className="p-4 shadow-lg border-0 rounded-3">
        <Row className="mb-3">
          <Col>
            <DropdownButton
              variant="outline-primary"
              title={`Filter: ${filterCategory}`}
              onSelect={(selectedFilter) => setFilterCategory(selectedFilter)}
            >
              <Dropdown.Item eventKey="All">All</Dropdown.Item>
              {categories.map((category, index) => (
                <Dropdown.Item key={index} eventKey={category}>
                  {category}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Col>
          <Col>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col xs={12} md={6} className="d-flex justify-content-end">
            <Button
              variant="outline-primary"
              className="me-2"
              disabled={selectedProducts.length !== 1}
              onClick={handleEditSelectedProduct}
            >
              <MdModeEditOutline size={20} />
            </Button>
            <Button
              variant="outline-danger"
              disabled={selectedProducts.length === 0}
              onClick={handleDeleteSelectedProducts}
            >
              <MdOutlineDeleteOutline size={20} />
            </Button>
          </Col>
        </Row>

        {/* Product Table */}
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th>
                <Form.Check
                  type="checkbox"
                  checked={
                    selectedProducts.length === currentProducts.length &&
                    currentProducts.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price (Rs)</th>
              <th>Stock</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <tr key={product.product_id}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedProducts.includes(product.product_id)}
                      onChange={() => handleCheckboxChange(product.product_id)}
                    />
                  </td>
                  <td>{product.product_id}</td>
                  <td>
                    <img
                      src={product.product_image || "/placeholder.png"}
                      alt={product.product_name}
                      style={{ width: "50px", height: "50px" }}
                    />
                  </td>
                  <td>{product.product_name}</td>
                  <td>{product.product_description}</td>
                  <td>{product.product_price}</td>
                  <td>{product.stock}</td>
                  <td title={`Category ID: ${product.category_id}`}>
                    {product.category_name}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No products available.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </Card>
    </div>
  );
};

export default ProductTable;
