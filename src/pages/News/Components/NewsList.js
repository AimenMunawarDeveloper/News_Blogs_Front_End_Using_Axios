import { useState, useEffect } from "react";
import { fetchCategories } from "../../Categories/api/CategoriesApi";
import { fetchLocations } from "../api/NewsApi";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { fetchNews, createNews } from "../api/NewsApi";
import { deleteNews } from "../api/NewsApi";
import { uploadFeatureImage } from "../api/NewsApi";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { updateNews } from "../api/NewsApi";
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [editNewsModal, setEditNewsModal] = useState(false);
  const [editNews, setEditNews] = useState({
    id: "null",
    title: "",
    slug: "",
    description: "",
    categoryId: "",
    locationId: "",
    feature_image: "",
  });

  const IMAGE_URL = process.env.REACT_APP_BASE_URL;

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
    // we are Fetching data every 10 seconds
    const intervalId = setInterval(() => {
      loadNews();
    }, 10000);
    loadNews();
    return () => clearInterval(intervalId);
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
  const handleModalShow = () => {
    setAddNewsModal(true);
    loadCategoriesAndLocations();
  };
  const handleModalClose = () => {
    setAddNewsModal(false);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewsInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(
      categories,
      locations,
      newsInput.categoryId,
      newsInput.locationId
    );
    const selectedCategory = categories.find(
      (category) => category.id === Number(newsInput.categoryId)
    );
    const selectedLocation = locations.find(
      (location) => location.id === Number(newsInput.locationId)
    );
    console.log(selectedFile);
    let featureImageId = null;
    if (selectedFile) {
      featureImageId = await uploadFeatureImage(selectedFile);
    }
    console.log("selected category", selectedCategory);
    console.log("selectedLocation", selectedLocation);
    console.log("feature image id", featureImageId);
    try {
      await createNews({
        title: newsInput.title,
        slug: newsInput.slug,
        description: newsInput.description,
        categoryId: newsInput.categoryId,
        categoryTitle: selectedCategory?.attributes?.title,
        locationId: newsInput.locationId,
        locationName: selectedLocation?.attributes?.name,
        featureImageId: featureImageId,
      });
      setAddNewsModal(false);
      setNewsInput({
        title: "",
        slug: "",
        description: "",
        categoryId: "",
        locationId: "",
        categoryTitle: "",
        locationName: "",
        featureImageId: "",
      });
      setSelectedFile(null);
      const fileInput = document.querySelector('input[name="feature_image"]');
      if (fileInput) {
        fileInput.value = "";
      }
      setSubmitError(false);
      const newNews = await fetchNews();
      setNews(newNews);
    } catch (error) {
      setSubmitError(true);
    }
  };
  const handleDelete = async (news) => {
    try {
      await deleteNews(news.id);
      const updatedNews = await fetchNews();
      setNews(updatedNews);
    } catch (error) {
      console.log("error in deleting news");
    }
  };
  const handleFileChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      if (isEdit) {
        setEditNews((prevState) => ({
          ...prevState,
          feature_image: file,
        }));
      } else {
        setSelectedFile(file);
        setNewsInput((prevState) => ({
          ...prevState,
          feature_image: file,
        }));
      }
      console.log("Selected file:", file);
    }
  };

  const handleEditModalShow = (news) => {
    console.log("news:", news);
    setEditNews({
      id: news.id,
      title: news.attributes.title,
      slug: news.attributes.slug,
      description: news.attributes.description[0]?.children[0]?.text || "",
      categoryId: news.attributes.category?.data?.id || "",
      locationId: news.attributes.location?.data?.id || "",
      feature_image: news.attributes.feature_image?.data?.attributes?.url || "",
    });
    loadCategoriesAndLocations();
    setEditNewsModal(true);
  };

  const handleEditModalClose = () => {
    setEditNewsModal(false);
  };
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditNews({ ...editNews, [name]: value });
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedCategory = categories.find(
        (category) => category.id === Number(editNews.categoryId)
      );
      const selectedLocation = locations.find(
        (location) => location.id === Number(editNews.locationId)
      );
      console.log("fetaure image in edit", editNews?.feature_image);
      let featureImageId = editNews?.feature_image;
      if (editNews.feature_image instanceof File) {
        featureImageId = await uploadFeatureImage(editNews?.feature_image);
      }
      const updatedNewsData = {
        title: editNews.title,
        slug: editNews.slug,
        description: editNews.description,
        categoryId: editNews.categoryId,
        categoryTitle: selectedCategory?.attributes?.title,
        locationId: editNews.locationId,
        locationName: selectedLocation?.attributes?.name,
        featureImageId: featureImageId,
      };
      console.log("updated news data", updatedNewsData);
      await updateNews(editNews?.id, updatedNewsData);
      const updatedNews = await fetchNews();
      setNews(updatedNews);
      setEditNewsModal(false);
    } catch (error) {
      console.log("Error in updating news:", error);
    }
  };

  return (
    <Container className="my-3">
      <h1>News</h1>
      <Button variant="primary" className="mb-4" onClick={handleModalShow}>
        + Add News
      </Button>
      <Row>
        {news.map((newsItem) => (
          <Col key={newsItem.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title className="mb-4">
                  {newsItem.attributes.feature_image?.data?.length > 0 ? (
                    <img
                      src={`${IMAGE_URL}${newsItem.attributes.feature_image.data[0].attributes.url}`}
                      alt={newsItem.attributes.title}
                      style={{ width: "100%", marginBottom: "15px" }}
                    />
                  ) : (
                    <p>No Feature Image</p>
                  )}
                  <span className="d-flex flex-row justify-content-between">
                    {newsItem.attributes.title}
                    <span className="mb-4">
                      <Button
                        variant="primary"
                        className="mb-2"
                        onClick={() => handleEditModalShow(newsItem)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(newsItem)}
                      >
                        <FaTrashAlt />
                      </Button>
                    </span>
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
                name="categoryId"
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
                name="locationId"
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
              <Form.Label>Feature Image</Form.Label>
              <Form.Control
                type="file"
                name="feature_image"
                onChange={handleFileChange}
              />
            </Form.Group>

            {selectedFile && (
              <div className="mt-3">
                <h5>Preview:</h5>
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Selected Feature"
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

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

      {/* Edit News modal*/}
      <Modal show={editNewsModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit a News</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={editNews.title}
                onChange={handleEditInputChange}
                placeholder="Enter News Title"
                required
              />
            </Form.Group>

            <Form.Group controlId="slug" className="mt-3">
              <Form.Label>Slug</Form.Label>
              <Form.Control
                type="text"
                name="slug"
                value={editNews.slug}
                onChange={handleEditInputChange}
                placeholder="Enter News Slug"
                required
              />
            </Form.Group>

            <Form.Group controlId="description" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={editNews.description}
                onChange={handleEditInputChange}
                placeholder="Enter News Description"
                required
              />
            </Form.Group>

            <Form.Group controlId="category" className="mt-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                name="categoryId"
                value={editNews.categoryId}
                onChange={handleEditInputChange}
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
                name="locationId"
                value={editNews.locationId}
                onChange={handleEditInputChange}
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
              <Form.Label>Feature Image</Form.Label>
              <Form.Control
                type="file"
                name="feature_image"
                onChange={(e) => handleFileChange(e, true)}
              />
              {editNews.feature_image && (
                <img
                  src={
                    editNews.feature_image instanceof File
                      ? URL.createObjectURL(editNews.feature_image)
                      : `${IMAGE_URL}${editNews.feature_image}`
                  }
                  alt="Feature"
                  style={{ width: "100%", marginTop: "10px" }}
                />
              )}
            </Form.Group>

            {selectedFile && (
              <div className="mt-3">
                <h5>Preview:</h5>
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Selected Feature"
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            <Button variant="primary" type="submit" className="mt-3">
              Update News
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default NewsList;
