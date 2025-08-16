import axios from "axios";

export const fetchCustomers = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:5000/api/customers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        limit: 100, // Fetch all customers (adjust as needed)
      },
    });
    return response.data.items;
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    return [];
  }
};