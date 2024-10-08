import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import NewsList from "./NewsList";
import { fetchNewsPage } from "../api/NewsApi";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
export default function News() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const getData = async () => {
      try {
        const newsData = await fetchNewsPage();
        console.log(newsData);
        setData(newsData.data);
      } catch (err) {
        setError(err.message);
      }
    };
    // we are Fetching data every 10 seconds
    const intervalId = setInterval(() => {
      getData();
    }, 10000);
    getData();
    return () => clearInterval(intervalId);
  }, []);
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;
  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">News Page</h1>
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={12} className="text-center">
              <h2>{data.attributes.header[0]?.page_title}</h2>
              <h3>{data.attributes.header[0]?.meta_title}</h3>
              <h4>{data.attributes.header[0]?.meta_keywords}</h4>
              <p>{data.attributes.header[0]?.meta_description}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <div className="text-center mb-4">
        <Link to="/" className="btn btn-primary mx-2">
          Home
        </Link>
        <Link to="/news" className="btn btn-secondary mx-2">
          News
        </Link>
        <Link to="/categories" className="btn btn-info mx-2">
          Categories
        </Link>
      </div>
      <NewsList />
    </Container>
  );
}
