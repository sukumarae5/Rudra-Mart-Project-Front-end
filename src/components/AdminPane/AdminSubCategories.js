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
import { FaEdit } from "react-icons/fa";
import { BsPlusCircleFill } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteSubcategoryRequest,
  fetchSubcategoryRequest,
} from "../../features/subcategories/subcategoryAction";
import { fetchProductCategoryRequest } from "../../features/categories/categoriesAction";
import PaginationComponent from "../AdminPane/Pagination";
import { FaTrash } from "react-icons/fa";

const AdminSubcategories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [showInactive, setShowInactive] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { subcategories, loading } = useSelector((state) => state.subcategory);
  const categoryState = useSelector((state) => state.categoryproducts);
  const categoryMap = new Map();

  if (Array.isArray(categoryState.categoryproduct)) {
    categoryState.categoryproduct.forEach((cat) =>
      categoryMap.set(cat.id, cat.name)
    );
  }

  useEffect(() => {
    dispatch(fetchSubcategoryRequest());
    dispatch(fetchProductCategoryRequest());
  }, [dispatch]);
  const handleDeleteSubcategory = (id) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      dispatch(deleteSubcategoryRequest(id));
    }
  };

  useEffect(() => {
    setCurrentPage(1); // reset pagination when filters change
  }, [searchQuery, showInactive]);

  const filteredSubcategories = subcategories.filter(
    (sub) =>
      sub.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (showInactive || sub.status)
  );

  const totalPages = Math.ceil(filteredSubcategories.length / itemsPerPage);
  const paginatedData = filteredSubcategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
              placeholder="Search subcategories..."
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

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <Table
            responsive
            className="text-center align-middle border"
            style={{ minWidth: "800px" }}
          >
            <thead className="bg-primary text-white">
              <tr>
                <th className="text-start">Image</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((sub) => (
                  <tr key={sub.id}>
                    <td className="text-start">
                      <img
                        src={sub.image_url}
                        alt={sub.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    </td>
                    <td>{sub.name}</td>
                    <td>{sub.slug || "N/A"}</td>
                    <td>{categoryMap.get(sub.category_id) || "N/A"}</td>
                    <td>{sub.status ? "Active" : "Inactive"}</td>
                    <td className="d-flex justify-content-center gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() =>
                          navigate(`/admin/editsubcategoryform/${sub.id}`)
                        }
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteSubcategory(sub.id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No subcategories found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Pagination */}
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

export default AdminSubcategories;
