import React from "react";
import CategoriesList from "../components/CategoriesList";
import NewsList from "../components/NewsList";
import { fetchHomePage } from "../api/fetchPages";
import { useState, useEffect } from "react";

export default function Home() {
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
    getData();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>Home Page</h1>
      <div>
        <h1>{data.attributes.header[0]?.page_title}</h1>
        <h2>{data.attributes.header[0]?.meta_title}</h2>
        <h3>{data.attributes.header[0]?.meta_keywords}</h3>
        <h4>{data.attributes.header[0]?.meta_description}</h4>
      </div>
      <a href="/">Home</a>
      <br />
      <a href="/news">News</a>
      <br />
      <a href="/categories">Categories</a>
      <CategoriesList />
      <NewsList />
    </div>
  );
}
