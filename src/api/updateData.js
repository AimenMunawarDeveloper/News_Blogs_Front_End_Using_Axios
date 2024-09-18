const API_URL = "http://localhost:4000/api";
export const updateCategory = async (id, category) => {
  try {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "PUT",
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
      throw new Error("Error updating category");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};
