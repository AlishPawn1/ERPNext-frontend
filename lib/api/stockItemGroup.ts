import axios from "axios";

export const fetchStockItemGroups = async () => {
  const response = await axios.get("/api/stockItemGroup");
  return response.data.data;
};
