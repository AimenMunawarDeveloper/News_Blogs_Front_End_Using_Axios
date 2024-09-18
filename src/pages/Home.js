import React from "react";
import CategoriesList from "../components/CategoriesList";
import NewsList from "../components/NewsList";
export default function Home() {
  console.log("home");
  return (
    <div>
      <CategoriesList />
      <NewsList />
    </div>
  );
}
