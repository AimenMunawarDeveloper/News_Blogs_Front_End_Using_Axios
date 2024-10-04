import axios from "axios";
import { jsonConfig } from "./api-helper";
const BASE_URL = process.env.REACT_APP_BASE_URL;
export const createNews = async (news) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/news`,
      {
        data: {
          title: news.title,
          slug: news.slug,
          description: [
            {
              type: "paragraph",
              children: [
                {
                  text: news.description,
                  type: "text",
                },
              ],
            },
          ],
          category: news.categoryId ? { id: news.categoryId } : null,
          location: news.locationId ? { id: news.locationId } : null,
          feature_image: news.featureImageId
            ? { id: news.featureImageId }
            : null,
        },
      },
      jsonConfig
    );
    return response.data;
  } catch (error) {
    console.error("Error creating news:", error);
    throw new Error("Failed to create news");
  }
};
export const deleteNews = async (id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/news/${id}`,
      jsonConfig
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting news:", error);
    throw new Error("Error deleting news");
  }
};
export const fetchNews = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/news?populate[0]=category&populate[1]=category.sub_categories&populate[2]=feature_image&populate[3]=location`,
      jsonConfig
    );
    console.log(response.data.data);
    return response.data.data || [];
  } catch (error) {
    console.error("Error in fetching news:", error);
    throw error;
  }
};
export const updateNews = async (id, news) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/news/${id}`,
      {
        data: {
          title: news.title,
          slug: news.slug,
          description: [
            {
              type: "paragraph",
              children: [
                {
                  text: news.description,
                  type: "text",
                },
              ],
            },
          ],
          category: news.categoryId
            ? {
                id: news.categoryId,
              }
            : null,
          location: news.locationId
            ? {
                id: news.locationId,
              }
            : null,
          feature_image: news.featureImageId
            ? {
                id: news.featureImageId,
              }
            : null,
        },
      },
      jsonConfig
    );
    return response.data;
  } catch (error) {
    console.error("Error updating news:", error);
    throw error;
  }
};
