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
import { IoMdSearch } from "react-icons/io";
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
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://192.168.1.6:3000/api/products/deleteproduct/${productId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(`Error: ${data.error || "Failed to delete product"}`);
        return;
      }

      alert("Product deleted successfully!");
      dispatch(fetchproductsrequest());
    } catch (error) {
      console.error("Error deleting product:", error);
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

  const filteredProducts = products.filter((product) => {
    const matchesSearchQuery =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    return filterOption === "All"
      ? matchesSearchQuery
      : matchesSearchQuery && product.category === filterOption;
  });

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const addProductDetails = () => {
    navigate("/admin/addproducts");
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product to delete.");
      return;
    }
    selectedProducts.forEach(async (productId) => {
      await handleDeleteProduct(productId);
    });
  };

  return (
    <div className="container-fluid">
      {/* Header Section */}
      <Row className="align-items-center mb-3">
        <Col xs={12} md={6} className="text-md-start text-center">
          <h1 style={{ fontSize: "2rem", color: "#007bff", fontWeight: "bold" }}>
            Products
          </h1>
        </Col>
        <Col xs={12} md={6} className="text-md-end d-flex justify-content-end mt-2 mt-md-0">
          <Button
            onClick={addProductDetails}
            className="d-flex align-items-center mx-auto mx-md-0"
            style={{
              fontSize: "1.1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#28a745",
              border: "none",
            }}
          >
            <GoPlus style={{ marginRight: "8px", fontSize: "1.5rem" }} />
            Add Product Details
          </Button>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Row className="align-items-center mb-3">
        <Col xs={12} md={6} className="d-flex justify-content-start mb-2 mb-md-0">
          <DropdownButton
            variant="light"
            title={`Filter: ${filterOption}`}
            onSelect={(selectedFilter) => setFilterOption(selectedFilter)}
            style={{ border: "1px solid #007bff", color: "#007bff" }}
          >
            <Dropdown.Item eventKey="All">All</Dropdown.Item>
            <Dropdown.Item eventKey="Category1">Category 1</Dropdown.Item>
            <Dropdown.Item eventKey="Category2">Category 2</Dropdown.Item>
          </DropdownButton>

          <InputGroup style={{ width: "300px", marginLeft: "10px" }}>
            <InputGroup.Text>
              <IoMdSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Col>

        {/* Bulk Actions */}
        <Col xs={12} md={6} className="d-flex justify-content-end gap-2">
          {/* Disable edit button if no product is selected */}
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              if (selectedProducts.length === 1) {
                const product = products.find((prod) => prod.id === selectedProducts[0]);
                handleEditProduct (product);
              } else {
                alert("Please select one product to edit.");
              }
            }}
            style={{ border: "1px solid #007bff" }}
          >
            <MdModeEditOutline  style={{ color: "#007bff" }}/>
          </Button>
          <Button
            variant="light"
            size="sm"
            onClick={handleBulkDelete}
            style={{ border: "1px solid #007bff" }}
          >
            <MdOutlineDeleteOutline style={{ color: "#007bff" }} />
          </Button>
        </Col>
      </Row>

      {/* Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>
              <Form.Check
                type="checkbox"
                onChange={(e) =>
                  setSelectedProducts(
                    e.target.checked ? currentProducts.map((prod) => prod.id) : []
                  )
                }
                checked={
                  selectedProducts.length === currentProducts.length &&
                  currentProducts.length > 0
                }
              />
            </th>
            <th>Id</th>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
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
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  ) : (
                    'N/A'
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

      {/* Pagination */}
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductTable;
