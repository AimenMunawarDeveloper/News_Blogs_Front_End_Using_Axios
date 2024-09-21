import { useState, useEffect } from "react";
import { fetchNews, fetchCategories, fetchLocations } from "../api/fetchData";
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
  ToastContainer,
} from "react-bootstrap";
import { createNews } from "../api/createData";
import { deleteNews } from "../api/deleteData";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addNewsModal, setAddNewsModal] = useState(false);
  const [newsInput, setNewsInput] = useState({
    title: "",
    slug: "",
    description: "",
    categoryId: "",
    locationId: "",
    feature_image: "",
  });
  const [submitError, setSubmitError] = useState(false);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const API_URL = "http://localhost:4000";

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetchNews();
        setNews(response);
      } catch (error) {
        setError("Failed to load the news");
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    const loadCategoriesAndLocations = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        const locationsData = await fetchLocations();
        setLocations(locationsData);
      } catch (error) {
        console.error("Error fetching categories or locations:", error);
      }
    };

    loadNews();
    loadCategoriesAndLocations();
  }, []);

  if (loading)
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading news...</p>
      </Container>
    );
  if (error)
    return (
      <Container className="text-center my-5">
        <Alert variant="danger">
          {" "}
          <p>{error}</p>
        </Alert>
      </Container>
    );
  if (!news || news.length === 0) {
    return (
      <Container className="text-center my-5">
        <Alert variant="info">
          {" "}
          <p>No news available</p>
        </Alert>
      </Container>
    );
  }
  const handleModalShow = () => {
    setAddNewsModal(true);
  };

  const handleModalClose = () => {
    setAddNewsModal(false);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewsInput((prevState) => ({
      ...prevState,
      [name]: value, // This will capture the categoryId and locationId
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createNews({
        title: newsInput.title,
        slug: newsInput.slug,
        description: newsInput.description,
        categoryId: newsInput.categoryId, // Use categoryId from state
        locationId: newsInput.locationId, // Use locationId from state
        feature_image: newsInput.feature_image,
      });
      setAddNewsModal(false);
      setNewsInput({
        title: "",
        slug: "",
        description: "",
        categoryId: "", // Reset categoryId
        locationId: "", // Reset locationId
        feature_image: "",
      });
      setSubmitError(false);
      const newNews = await fetchNews();
      setNews(newNews);
    } catch (error) {
      setSubmitError(true);
    }
  };
  const handleDelete = async (category) => {
    try {
      await deleteNews(category.id);
      const updatedNews = await fetchNews();
      setNews(updatedNews);
    } catch (error) {
      console.log("error in updating news");
    }
  };

  return (
    <Container className="my-5">
      <h1>News</h1>
      <Button variant="primary" className="mb-4" onClick={handleModalShow}>
        + Add News
      </Button>
      <Row>
        {news.map((newsItem) => (
          <Col key={newsItem.id}>
            <Card>
              <Card.Body>
                <Card.Title className="mb-4">
                  {newsItem.attributes.feature_image?.data?.length > 0 ? (
                    <img
                      src={`${API_URL}${newsItem.attributes.feature_image.data[0].attributes.url}`}
                      alt={newsItem.attributes.title}
                      style={{ width: "100%", marginBottom: "15px" }}
                    />
                  ) : (
                    <p>No Feature Image</p>
                  )}
                  <span className="d-flex flex-row justify-content-between">
                    {newsItem.attributes.title}
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(newsItem)}
                    >
                      <FaTrashAlt />
                    </Button>
                  </span>
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  <small>Slug: {newsItem.attributes.slug}</small>
                </Card.Subtitle>
                <Card.Text>
                  <small>
                    Created At:{" "}
                    {new Date(newsItem.attributes.createdAt).toLocaleString()}
                    <br />
                    Updated At:{" "}
                    {new Date(newsItem.attributes.updatedAt).toLocaleString()}
                    <br />
                    Published At:{" "}
                    {new Date(newsItem.attributes.publishedAt).toLocaleString()}
                    <br />
                    Location:{" "}
                    {newsItem.attributes.location?.data?.attributes?.name ||
                      "No location"}
                    <br />
                    Category:{" "}
                    {newsItem.attributes.category?.data?.attributes?.title ||
                      "No category"}
                    <br />
                    Sub-Category:{" "}
                    {newsItem.attributes?.category?.data?.attributes
                      ?.sub_categories?.data?.length > 0
                      ? newsItem.attributes.category.data.attributes.sub_categories.data
                          .map((subCat) => subCat.attributes.title)
                          .join(", ")
                      : "No sub-categories"}
                    <br />
                    Description:{" "}
                    {newsItem.attributes.description &&
                    newsItem.attributes.description.length > 0
                      ? newsItem.attributes.description.map((desc, index) =>
                          desc.children.map((child, childIndex) => (
                            <span key={`desc-${index}-child-${childIndex}`}>
                              {child.text}
                            </span>
                          ))
                        )
                      : "No description"}
                    <br />
                  </small>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Add News modal*/}
      {/* Add News modal*/}
      <Modal show={addNewsModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add News</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newsInput.title}
                onChange={handleInputChange}
                placeholder="Enter News Title"
                required
              />
            </Form.Group>

            <Form.Group controlId="slug" className="mt-3">
              <Form.Label>Slug</Form.Label>
              <Form.Control
                type="text"
                name="slug"
                value={newsInput.slug}
                onChange={handleInputChange}
                placeholder="Enter News Slug"
                required
              />
            </Form.Group>

            <Form.Group controlId="description" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={newsInput.description}
                onChange={handleInputChange}
                placeholder="Enter News Description"
                required
              />
            </Form.Group>

            <Form.Group controlId="category" className="mt-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                name="categoryId" // Make sure this matches the state
                value={newsInput.categoryId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.attributes.title}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="location" className="mt-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                as="select"
                name="locationId" // Make sure this matches the state
                value={newsInput.locationId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.attributes.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="feature_image" className="mt-3">
              <Form.Label>Feature Image URL</Form.Label>
              <Form.Control
                type="text"
                name="feature_image"
                value={newsInput.feature_image}
                onChange={handleInputChange}
                placeholder="Enter News Feature Image"
                required
              />
            </Form.Group>

            {submitError && (
              <Alert variant="danger" className="mt-3">
                Failed to create news. Please try again.
              </Alert>
            )}

            <Button variant="primary" type="submit" className="mt-3">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default NewsList;
