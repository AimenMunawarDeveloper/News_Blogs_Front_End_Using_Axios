import axios from "axios";
import { jsonConfig } from "./api-helper";
const BASE_URL = process.env.REACT_APP_BASE_URL;
export const fetchLocations = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/locations?populate=*`,
      jsonConfig
    );
    return response.data.data || [];
  } catch (error) {
    console.error("Error in fetching locations:", error);
    throw error;
  }
};
