import { StockItem } from "@/types/stockItem";
import axios from "axios";

const api = axios.create({
  withCredentials: true,
});

export const fetchStockItems = async () => {
  const response = await api.get("/api/stockItem");
  return response.data;
};

export const fetchStockItemByCode = async (item_code: string) => {
  const response = await api.get("/api/stockItem", {
    params: { item_code },
  });
  return response.data?.data ?? response.data;
};

export const addStockItem = async (stockItemData: StockItem) => {
  const response = await api.post("/api/stockItem", stockItemData);
  return response.data;
};

export const updateStockItem = async (
  item_code: string,
  stockItemData: Partial<StockItem>
) => {
  const response = await api.put("/api/stockItem", stockItemData, {
    params: { item_code },
  });
  return response.data;
};

export const deleteStockItemById = async (item_code: string) => {
  const response = await api.delete("/api/stockItem", {
    params: { item_code },
  });
  return response.data;
};

export const fetchStockUOMForItem = async (item_code: string) => {
  const item = await fetchStockItemByCode(item_code);
  return (
    item?.stock_uom ?? item?.data?.stock_uom ?? item?.item?.stock_uom ?? null
  );
};
