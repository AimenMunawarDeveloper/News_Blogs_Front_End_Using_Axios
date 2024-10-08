import React from "react";
import CategoriesList from "../../Categories/components/CategoriesList";
import NewsList from "../../News/components/NewsList";
import { fetchHomePage } from "../api/HomeApi";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { setToken } from "../../api-helper/api-helper";
export default function Home() {
  setToken();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const getData = async () => {
      try {
        const homeData = await fetchHomePage();
        console.log(homeData.data);
        setData(homeData.data);
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
      <h1 className="text-center mb-4">Home Page</h1>
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
      <CategoriesList />
      <NewsList />
    </Container>
  );
}
