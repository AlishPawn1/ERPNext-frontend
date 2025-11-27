import { StockItem } from "@/types/stockItem";
import axios, { AxiosRequestConfig, Method } from "axios";

// Create an axios instance preconfigured to send credentials
const api = axios.create({
  withCredentials: true,
});

async function request<T = unknown>(
  method: Method,
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const resp = await api.request({ method, url, data, ...(config || {}) });
  return resp.data as T;
}

export const fetchStockItems = async () => {
  return request<unknown>("get", "/api/stockItem");
};

export const addStockItem = async (stockItemData: StockItem) => {
  return request<unknown>("post", "/api/stockItem", stockItemData);
};

export const deleteStockItemById = async (id: string) => {
  return request<unknown>(
    "delete",
    `/api/stockItem?item_code=${encodeURIComponent(id)}`
  );
};

export const updateStockItem = async (
  id: string,
  stockItemData: Partial<StockItem>
) => {
  return request<unknown>(
    "put",
    `/api/stockItem?item_code=${encodeURIComponent(id)}`,
    stockItemData
  );
};

export const fetchStockItemByCode = async (item_code: string) => {
  const raw = await api.get(
    `/api/stockItem?item_code=${encodeURIComponent(item_code)}`
  );
  return raw.data?.data ?? raw.data;
};

export const fetchStockUOMForItem = async (item_code: string) => {
  const item = await fetchStockItemByCode(item_code);
  return (
    item?.stock_uom ?? item?.data?.stock_uom ?? item?.item?.stock_uom ?? null
  );
};
