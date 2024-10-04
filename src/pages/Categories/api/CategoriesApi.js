import axios from "axios";
import { jsonConfig } from "../../../api/api-helper";
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
