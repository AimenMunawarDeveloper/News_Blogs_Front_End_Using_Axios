import axios from "axios";
import { jsonConfig } from "../../api-helper/api-helper";
const BASE_URL = process.env.REACT_APP_BASE_URL;
export const fetchCategoryPage = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/category-page?populate=*`,
      jsonConfig
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching category page:", error);
    throw new Error("Network response was not ok");
  }
};
export const fetchCategories = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/categories?populate=*`,
      jsonConfig
    );
    return response.data.data || [];
  } catch (error) {
    console.error("Error in fetching categories:", error);
    throw error;
  }
};
export const createCategory = async (category) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/categories`,
      {
        data: {
          title: category.title,
          slug: category.slug,
        },
      },
      jsonConfig
    );
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }
};
export const updateCategory = async (id, category) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/categories/${id}`,
      {
        data: {
          title: category.title,
          slug: category.slug,
        },
      },
      jsonConfig
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};
export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/categories/${id}`,
      jsonConfig
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Error deleting category");
  }
};
