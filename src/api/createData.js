const API_URL = "http://localhost:4000/api";
export const createCategory = async (category) => {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        title: category.title,
        slug: category.slug,
      },
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to create category");
  }
  const data = await response.json();
  return data;
};
export const createNews = async (news) => {
  console.log("news input", news);
  console.log("Category ID:", news.categoryId);
  console.log("Location ID:", news.locationId);
  console.log("festaure image url", news.feature_image);
  const response = await fetch(`${API_URL}/news`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
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
        feature_image: news.featureImageId ? { id: news.featureImageId } : null,
      },
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to create news");
  }
  const data = await response.json();
  return data;
};
export const uploadFeatureImage = async (file) => {
  const formData = new FormData();
  formData.append("files", file);

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const errorMessage = await response.text();
    console.error("Error uploading image:", errorMessage);
    throw new Error("Failed to upload image");
  }
  const data = await response.json();
  return data[0].id;
};
