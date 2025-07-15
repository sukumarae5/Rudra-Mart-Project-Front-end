import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategoryTitlesRequest,
  addCategoryTitleRequest,
  updateCategoryTitleRequest,
  deleteCategoryTitleRequest,
} from "../../features/categorytitle/categoryActions";
import CategoryTitleForm from "./CategoryTitleForm";
import { FaEdit, FaTrash } from "react-icons/fa";

const AdminCategoryTitle = () => {
  const dispatch = useDispatch();

  const categoryTitleState = useSelector((state) => state.categorytitle);
  const titles = Array.isArray(categoryTitleState?.titles) ? categoryTitleState.titles : [];
  const loading = categoryTitleState?.loading;

  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    dispatch(fetchCategoryTitlesRequest());
  }, [dispatch]);

  const handleAdd = () => {
    setEditData(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditData(item);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this title?")) {
      dispatch(deleteCategoryTitleRequest(id));
    }
  };

  const handleFormSubmit = (formData) => {
    if (editData) {
      dispatch(updateCategoryTitleRequest(editData.id, formData));
    } else {
      dispatch(addCategoryTitleRequest(formData));
    }
    setShowForm(false);
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Category Titles</h5>
        <Button variant="secondary" size="sm" onClick={handleAdd}>
          Add Category Title
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="secondary" />
        </div>
      ) : titles.length > 0 ? (
        <Table bordered hover responsive className="mb-0">
          <thead>
            <tr>
              <th>Id</th>
              <th>Title</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {titles.map((title, index) => (
              <tr key={title.id}>
                <td>{index + 1}</td>
                <td>{title.name}</td>
                <td className="text-center">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleEdit(title)}
                    className="me-2"
                    title="Edit"
                  >
                    <FaEdit className="me-1" /> 
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(title.id)}
                    title="Delete"
                  >
                    <FaTrash className="me-1" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="text-center text-muted mt-4">
          No category titles available.
        </div>
      )}

      <CategoryTitleForm
        show={showForm}
        handleClose={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        initialData={editData}
      />
    </Container>
  );
};

export default AdminCategoryTitle;
