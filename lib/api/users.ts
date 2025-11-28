import axios from "axios";

/**
 * Fetch all users with complete details including full_name and username
 */
export const fetchUsers = async () => {
  try {
    // First, get the list of all user emails/names
    const response = await axios.get("/api/users");
    const usersList = response.data.data;

    // Then fetch detailed info for each user
    const usersWithDetails = await Promise.all(
      usersList.map(async (user: { name: string }) => {
        try {
          const detailResponse = await axios.get(`/api/users/${user.name}`);
          return detailResponse.data.data;
        } catch (error) {
          console.error(`Failed to fetch details for ${user.name}:`, error);
          // Return minimal user object on error
          return {
            name: user.name,
            email: user.name,
            enabled: false,
            username: null,
            full_name: null,
            first_name: null,
            last_name: null,
          };
        }
      })
    );

    return usersWithDetails;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

/**
 * Fetch a single user by their email/name
 */
export const fetchUserById = async (id: string) => {
  try {
    const response = await axios.get(`/api/users/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch user ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a user by their email/name
 */
export const deleteUser = async (id: string) => {
  try {
    const response = await axios.delete(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete user ${id}:`, error);
    throw error;
  }
};

/**
 * Add a new user
 */
export const addUser = async (user: {
  email: string;
  first_name?: string;
  last_name?: string;
  enabled?: boolean;
  password?: string;
}) => {
  try {
    const response = await axios.post("/api/users", user);
    return response.data;
  } catch (error) {
    console.error("Failed to add user:", error);
    throw error;
  }
};

/**
 * Update a user's properties
 */
export const updateUser = async (
  id: string,
  updates: Partial<{
    enabled: boolean;
    first_name: string;
    last_name: string;
    username: string;
  }>
) => {
  try {
    const response = await axios.put(`/api/users/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error(`Failed to update user ${id}:`, error);
    throw error;
  }
};
