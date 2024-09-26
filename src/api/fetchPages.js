const API_URL = "http://localhost:4000/api";

export const fetchHomePage = async () => {
  const response = await fetch(`${API_URL}/home-page?populate=*`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
};
export const fetchNewsPage = async () => {
  const response = await fetch(`${API_URL}/news-page?populate=*`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
};
export const fetchCategoryPage = async () => {
  const response = await fetch(`${API_URL}/category-page?populate=*`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
};
