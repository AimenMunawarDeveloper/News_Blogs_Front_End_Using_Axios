import React, { useEffect, useState } from "react";
import { fetchCategories } from "../api/fetchData";
import { createCategory } from "../api/createData";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Card,
  Spinner,
  Alert,
  Button,
  Modal,
  Form,
  Toast,
  Nav,
  Navbar,
  ToastContainer,
} from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { updateCategory } from "../api/updateData";
import { deleteCategory } from "../api/deleteData";

const ReadCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addCategoryModal, setAddCategoryModal] = useState(false);
  const [inputCategory, setInputCategory] = useState({ title: "", slug: "" });
  const [submitError, setSubmitError] = useState(false);
  const [editCategoryModal, setEditCategoryModal] = useState(false);
  const [editCategory, setEditCategory] = useState({
    id: "null",
    title: "",
    slug: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  const createToast = (text, variant) => {
    setToastText(text);
    setToastVariant(variant);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        setError("Failed to load categories");
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading)
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading categories...</p>
      </Container>
    );

  if (error)
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  if (!categories || categories.length === 0) {
    return (
      <Container className="text-center my-5">
        <Alert variant="info">No categories available</Alert>
      </Container>
    );
  }

  const handleModalShow = () => {
    setAddCategoryModal(true);
  };

  const handleModalClose = () => {
    setAddCategoryModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputCategory({ ...inputCategory, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCategory(inputCategory);
      setAddCategoryModal(false);
      setInputCategory({ title: "", slug: "" });
      setSubmitError(false);
      const newCategories = await fetchCategories();
      setCategories(newCategories);
      createToast("Category added successfully!", "success");
    } catch (error) {
      setSubmitError(true);
      createToast("Error in adding the category!", "danger");
    }
  };
  const handleEditModalShow = (category) => {
    setEditCategory({
      id: category.id,
      title: category.attributes.title,
      slug: category.attributes.slug,
    });
    setEditCategoryModal(true);
  };
  const handleEditModalClose = () => {
    setEditCategoryModal(false);
  };
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditCategory({ ...editCategory, [name]: value });
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCategory(editCategory.id, {
        title: editCategory.title,
        slug: editCategory.slug,
      });
      const updatedCategories = await fetchCategories();
      setCategories(updatedCategories);
      setEditCategoryModal(false);
      createToast("Category updated successfully!", "success");
    } catch (error) {
      console.log("error in updating categories");
      createToast("Error in updating category!", "danger");
    }
  };
  const handleDelete = async (category) => {
    try {
      await deleteCategory(category.id);
      const updatedCategories = await fetchCategories();
      setCategories(updatedCategories);
      createToast("Category deleted successfully", "success");
    } catch (error) {
      console.log("error in updating categories");
      createToast("Error in deleting category", "danger");
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4">Categories</h2>
      <Button variant="primary" className="mb-4" onClick={handleModalShow}>
        + Add Category
      </Button>
      <Row>
        {categories.map((category) => (
          <Col md={4} key={category.id} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title className="d-flex flex-row justify-content-between">
                  {category.attributes.title}
                  <span className="mb-4">
                    <Button
                      variant="primary"
                      className="me-2"
                      onClick={() => handleEditModalShow(category)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(category)}
                    >
                      <FaTrashAlt />
                    </Button>
                  </span>
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  <small>Slug: {category.attributes.slug}</small>
                </Card.Subtitle>
                <Card.Text>
                  <small>
                    Created At:{" "}
                    {new Date(category.attributes.createdAt).toLocaleString()}
                    <br />
                    Updated At:{" "}
                    {new Date(category.attributes.updatedAt).toLocaleString()}
                    <br />
                    Published At:{" "}
                    {new Date(category.attributes.publishedAt).toLocaleString()}
                  </small>
                </Card.Text>
                <ListGroup variant="flush">
                  {category.attributes?.news?.data.length > 0 && (
                    <ListGroup.Item>
                      <h5>News of this category:</h5>
                      <ListGroup>
                        {category.attributes.news.data.map((newsItem) => (
                          <ListGroup.Item key={newsItem.id}>
                            <strong>Title: </strong>
                            {newsItem.attributes.title} <br />
                            <strong>Slug: </strong>
                            {newsItem.attributes.slug}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </ListGroup.Item>
                  )}
                  {category.attributes?.sub_categories?.data.length > 0 && (
                    <ListGroup.Item>
                      <h5>Sub-Categories of this category:</h5>
                      <ListGroup>
                        {category.attributes.sub_categories.data.map((sub) => (
                          <ListGroup.Item key={sub.id}>
                            {sub.attributes.title} (Slug: {sub.attributes.slug})
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Add Category modal*/}
      <Modal show={addCategoryModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add a new category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Category Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={inputCategory.title}
                onChange={handleInputChange}
                placeholder="Enter Category Title"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Category Slug</Form.Label>
              <Form.Control
                type="text"
                name="slug"
                value={inputCategory.slug}
                onChange={handleInputChange}
                placeholder="Enter Category Slug"
                required
              />
            </Form.Group>
            <Container className="d-flex flex-row justify-content-end mt-4">
              <Button variant="primary" type="submit" className="m-2">
                Save
              </Button>
              <Button
                variant="secondary"
                className="m-2"
                onClick={handleModalClose}
              >
                Close
              </Button>
            </Container>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Category modal*/}
      <Modal show={editCategoryModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit a category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Category Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={editCategory.title}
                onChange={handleEditInputChange}
                placeholder="Enter Category Title"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Category Slug</Form.Label>
              <Form.Control
                type="text"
                name="slug"
                value={editCategory.slug}
                onChange={handleEditInputChange}
                placeholder="Enter Category Slug"
                required
              />
            </Form.Group>
            <Container className="d-flex flex-row justify-content-end mt-4">
              <Button variant="primary" type="submit" className="m-2">
                Save Changes
              </Button>
              <Button
                variant="secondary"
                className="m-2"
                onClick={handleEditModalClose}
              >
                Close
              </Button>
            </Container>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer position="top-end" className="p-5">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          className={`bg-${toastVariant}`}
        >
          <Toast.Body>{toastText}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default ReadCategories;
