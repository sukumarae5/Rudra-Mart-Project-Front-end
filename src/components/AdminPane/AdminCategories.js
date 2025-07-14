import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Spinner,
  InputGroup,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { BsPlusCircleFill } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCategoryRequest,
  fetchProductCategoryRequest,
} from "../../features/categories/categoriesAction";
import { fetchSubcategoryRequest } from "../../features/subcategories/subcategoryAction";
import { fetchCategoryTitlesRequest } from "../../features/categorytitle/categoryActions";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../AdminPane/Pagination";

const AdminCategories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [showInactive, setShowInactive] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const categoryState = useSelector((state) => state.categoryproducts);
  const subcategoryState = useSelector((state) => state.subcategory);
  const categoryTitleState = useSelector((state) => state.categorytitle);

  const categoryTitles = Array.isArray(categoryTitleState?.titles)
    ? categoryTitleState.titles
    : [];

  const categoryproduct = Array.isArray(categoryState?.categoryproduct)
    ? categoryState.categoryproduct
    : [];

  const subcategories = Array.isArray(subcategoryState?.subcategories)
    ? subcategoryState.subcategories
    : [];

  useEffect(() => {
    dispatch(fetchProductCategoryRequest());
    dispatch(fetchSubcategoryRequest());
    dispatch(fetchCategoryTitlesRequest());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, showInactive]);

  const filteredCategories = categoryproduct.filter(
    (cat) =>
      cat.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (showInactive || cat.status)
  );

  const handleDeleteCategory = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      dispatch(deleteCategoryRequest(id));
    }
  };

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedData = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getTitleById = (id) => {
    const titleObj = categoryTitles.find((t) => t.id === id);
    return titleObj ? titleObj.name : "Unknown Title";
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
          <div
            className="d-flex align-items-center justify-content-end gap-2"
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

        <Col
          xl={3}
          xs={7}
          lg={5}
          md={12}
          className="d-flex justify-content-end gap-3 mt-lg-0 align-items-center"
        >
          <div className="d-flex gap-2 flex-wrap justify-content-end">
            <Button
              className="d-flex align-items-center"
              style={{
                fontSize: "0.9rem",
                padding: "7px 10px",
                backgroundColor: "#1E5EFF",
                border: "none",
                height: "40px",
                whiteSpace: "nowrap",
              }}
              onClick={() => navigate("/admin/addcategoryform")}
            >
              <BsPlusCircleFill className="me-2" size={20} />
              Add Category
            </Button>

            <Button
              className="d-flex align-items-center"
              style={{
                fontSize: "0.9rem",
                padding: "7px 10px",
                backgroundColor: "#28A745",
                border: "none",
                height: "40px",
                whiteSpace: "nowrap",
              }}
              onClick={() => navigate("/admin/addsubcategoryform")}
            >
              <BsPlusCircleFill className="me-2" size={20} />
              Add Subcategory
            </Button>
          </div>
        </Col>
      </Row>

      {categoryState.loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="table-responsive" style={{ minHeight: "200px" }}>
          <Table
            striped
            bordered
            hover
            responsive="md"
            className="text-center align-middle"
            style={{ minWidth: "700px", fontSize: "0.92rem" }}
          >
            <thead className="bg-primary text-white">
              <tr>
                <th className="text-start">Image</th>
                <th>Title</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((category) => (
                  <tr key={category.id}>
                    <td className="text-start">
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="rounded"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td>{getTitleById(category.category_title_id)}</td>
                    <td className="text-wrap">{category.name}</td>
                    <td className="text-wrap">{category.slug || "N/A"}</td>
                    <td className="text-wrap">
                      {category.description || "N/A"}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          category.status ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {category.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="d-flex justify-content-center gap-2 flex-wrap">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() =>
                          navigate(`/admin/editcategoryform/${category.id}`)
                        }
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
