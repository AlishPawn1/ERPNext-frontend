import { z } from "zod";

export const stockItemSchema = z.object({
  item_code: z.string().min(1, "Item code is required"),
  item_name: z.string().min(1, "Item name is required"),
  is_stock_item: z.boolean(),
  stock_uom: z.string().min(1, "Stock UOM is required"),
  uom: z.string().min(1, "UOM is required"),
  item_group: z.string().min(1, "Item group is required"),
});

export type StockItem = z.infer<typeof stockItemSchema>;
