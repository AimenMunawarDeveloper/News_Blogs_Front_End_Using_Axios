import axios from "axios";
import { formDataConfig } from "./api-helper";
const BASE_URL = process.env.REACT_APP_BASE_URL;
export const uploadFeatureImage = async (file) => {
  const formData = new FormData();
  formData.append("files", file);
  try {
    const response = await axios.post(
      `${BASE_URL}/api/upload`,
      formData,
      formDataConfig
    );
    return response.data[0].id;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};
