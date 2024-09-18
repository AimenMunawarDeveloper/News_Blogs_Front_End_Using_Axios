import { useState, useEffect } from "react";
import { fetchNews } from "../api/fetchData";
import { Container, Spinner, Alert, Row, Col, Card } from "react-bootstrap";
const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    loadNews();
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
  return (
    <Container className="my-5">
      <h1>News</h1>
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
                  {newsItem.attributes.title}
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
                    {newsItem.attributes?.location?.data?.attributes?.name ||
                      "No location"}
                    <br />
                    Category:{" "}
                    {newsItem.attributes?.category?.data?.attributes?.title ||
                      "No category"}
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
    </Container>
  );
};

export default NewsList;
