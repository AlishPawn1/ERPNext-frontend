import axios from "axios";

export const fetchUOM = async () => {
  const response = await axios.get("/api/uom");
  return response.data.data;
};
