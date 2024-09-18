const API_URL = "http://localhost:4000/api";
export const deleteCategory = async (id) => {
  try {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error deleting category");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
