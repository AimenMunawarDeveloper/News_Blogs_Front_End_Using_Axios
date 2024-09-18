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
