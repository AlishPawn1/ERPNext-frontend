import { StockItem } from "@/types/stockItem";
import axios from "axios";

export const fetchStockItems = async () => {
  const response = await axios.get("/api/stockItem");
  return response.data;
};

export const addStockItem = async (stockItemData: StockItem) => {
  const response = await axios.post("/api/stockItem", stockItemData);
  return response.data;
};

export const deleteStockItemById = async (id: string) => {
  const response = await axios.delete(`/api/stockItem?item_code=${id}`);
  return response.data;
};

export const updateStockItem = async (
  id: string,
  stockItemData: Partial<StockItem>
) => {
  const response = await axios.put(
    `/api/stockItem?item_code=${id}`,
    stockItemData
  );
  return response.data;
};
