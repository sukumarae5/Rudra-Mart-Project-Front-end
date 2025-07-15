import React, { useEffect, useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";

const CategoryTitleForm = ({ show, handleClose, onSubmit, initialData }) => {
  const [title, setTitle] = useState("");

  useEffect(() => {
if (initialData) setTitle(initialData.name); // ✅ correct
    else setTitle("");
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({ name: title }); // ✅ correct

      setTitle("");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? "Edit" : "Add"} Category Title</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Category Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Button className="mt-3" variant="primary" type="submit">
            {initialData ? "Update" : "Add"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CategoryTitleForm;
