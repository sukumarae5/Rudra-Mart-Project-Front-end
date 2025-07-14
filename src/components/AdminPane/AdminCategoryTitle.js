import React, { useEffect, useState } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategoryTitlesRequest,
  addCategoryTitleRequest,
  updateCategoryTitleRequest,
  deleteCategoryTitleRequest,
} from "../../features/categorytitle/categoryActions";
import CategoryTitleForm from "./CategoryTitleForm";

const AdminCategoryTitle = () => {
  const dispatch = useDispatch();

  const categoryTitleState = useSelector((state) => state.categorytitle);

  const titles = Array.isArray(categoryTitleState?.titles)
    ? categoryTitleState.titles
    : [];

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
    <div>
      <h4>Category Titles</h4>
      <Button className="mb-3" onClick={handleAdd}>Add Category Title</Button>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {titles.map((title, index) => (
              <tr key={title.id}>
                <td>{index + 1}</td>
                <td>{title.name}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handleEdit(title.id)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(title.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <CategoryTitleForm
        show={showForm}
        handleClose={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        initialData={editData}
      />
    </div>
  );
};

export default AdminCategoryTitle;
