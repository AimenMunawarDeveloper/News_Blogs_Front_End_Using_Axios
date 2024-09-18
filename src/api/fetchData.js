const API_URL = "http://localhost:4000/api";
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories?populate=*`);
    if (!response.ok) {
      throw new Error("Response is not OK");
    }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.log("Error in fetching categories");
    throw error;
  }
};
export const fetchNews = async () => {
  try {
    const response = await fetch(`${API_URL}/news?populate=*`);
    if (!response.ok) {
      throw new Error("Response is not OK");
    }
    const result = await response.json();
    console.log(result.data);
    return result.data || [];
  } catch (error) {
    console.log("Error in fetching news");
    throw error;
  }
};
