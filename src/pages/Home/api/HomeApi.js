import axios from "axios";
import { jsonConfig } from "../../../api/api-helper";
const BASE_URL = process.env.REACT_APP_BASE_URL;
export const fetchHomePage = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/home-page?populate=*`,
      jsonConfig
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching home page:", error);
    throw new Error("Network response was not ok");
  }
};
