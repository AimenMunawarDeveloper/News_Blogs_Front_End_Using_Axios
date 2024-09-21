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
                text: news.description, // Plain text for the description
                type: "text",
              },
            ],
          },
        ],
        category: {
          data: {
            id: news.categoryId, // This should work fine
          },
        },
        location: {
          data: {
            id: news.locationId, // This should work fine
          },
        },

        feature_image: {
          data: [
            {
              id: news.imageId, // Assuming you have an image ID; if you're uploading an image, this part will differ
            },
          ],
        },
      },
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to create news");
  }
  const data = await response.json();
  return data;
};
