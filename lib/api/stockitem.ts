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

export const fetchStockItemByCode = async (item_code: string) => {
  const response = await axios.get(
    `/api/stockItem?item_code=${encodeURIComponent(item_code)}`
  );
  // response shape may be { data } or the item directly depending on backend
  return response.data?.data ?? response.data;
};

export const fetchStockUOMForItem = async (item_code: string) => {
  const item = await fetchStockItemByCode(item_code);
  // Try common property paths to be resilient to API shape
  return (
    item?.stock_uom ?? item?.data?.stock_uom ?? item?.item?.stock_uom ?? null
  );
};
