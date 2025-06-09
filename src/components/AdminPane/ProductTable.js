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
import { BiSearch } from "react-icons/bi";

const ProductTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productsWithCategory = [] } = useSelector(
    (state) => state.products || {}
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [showInactive, setShowInactive] = useState(false);

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

  const filteredProducts = productsWithCategory.filter((product) => {
    const matchesSearchQuery = product.product_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return filterCategory === "All"
      ? matchesSearchQuery
      : matchesSearchQuery && product.category_name === filterCategory;
  });

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="container-fluid px-1">
      <Card className="border-0 rounded-3">
        <Row className="mb-3">
          <Col>
            <h1>Admin Dashboard</h1>
          </Col>
        </Row>

        <Row className="align-items-center mb-3 g-1">
          {/* Search */}
          <Col xs={12} sm={12} md={6} lg={5} xl={6}>
            <InputGroup style={{ height: "38px" }}>
              <InputGroup.Text>
                <BiSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </Col>

          {/* Category Filter */}
          <Col xs={6} sm={6} md={3} lg={2}>
            <DropdownButton
              variant="outline-secondary"
              title={`Category: ${filterCategory}`}
              onSelect={(selectedFilter) => setFilterCategory(selectedFilter)}
              style={{ height: "38px" }}
            >
              <Dropdown.Item eventKey="All">All</Dropdown.Item>
              {categories.map((category, index) => (
                <Dropdown.Item key={index} eventKey={category}>
                  {category}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Col>

          {/* Show Inactive Toggle */}
          <Col xs={6} sm={6} md={3} lg={2}>
            <div
              className="d-flex align-items-center justify-content-end gap-1"
              style={{ minHeight: "44px" }}
            >
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

          {/* Reload & Add Product */}
          <Col xl={2} md={12} lg={3} sm={12} className="d-flex justify-content-end gap-3 mt-lg-0 align-items-center">
            <Button
              variant="outline-secondary"
              onClick={() => window.location.reload()}
              className="d-flex justify-content-center align-items-center"
              style={{ width: "44px", height: "38px", fontSize: "1.0rem" }}
              aria-label="Reload page"
            >
              ⟳
            </Button>

            <Button
              onClick={() => navigate("/admin/addproducts")}
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
              <GoPlus className="me-2" size={25} />
              Add Product
            </Button>
          </Col>
        </Row>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <Table
            responsive
            className="text-center align-middle border"
            style={{ minWidth: "700px" }}
          >
            <thead className="bg-primary text-white">
              <tr>
                <th className="text-start" style={{ minWidth: "70px" }}>Image</th>
                <th style={{ minWidth: "150px" }}>Name</th>
                <th style={{ minWidth: "130px" }}>Category</th>
                <th style={{ minWidth: "100px" }}>Price (Rs)</th>
                <th style={{ minWidth: "80px" }}>Stock</th>
                <th style={{ minWidth: "100px" }}>Status</th>
                <th style={{ minWidth: "120px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr key={product.product_id}>
                    <td className="text-start">
                      <img
                        src={product.product_image || "/placeholder.png"}
                        alt={product.product_name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    </td>
                    <td className="text-break">{product.product_name}</td>
                    <td>{product.category_name}</td>
                    <td>₹ {product.product_price.toLocaleString()}</td>
                    <td>{product.stock}</td>
                    <td>{product.status || "Active"}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() =>
                            navigate("/admin/editproduct", { state: { product } })
                          }
                          aria-label={`Edit ${product.product_name}`}
                        >
                          <MdModeEditOutline size={20} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete ${product.product_name}?`
                              )
                            ) {
                              // Add delete logic here
                            }
                          }}
                          aria-label={`Delete ${product.product_name}`}
                        >
                          <MdOutlineDeleteOutline size={20} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
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
      </Card>
    </div>
  );
};

export default ProductTable;
