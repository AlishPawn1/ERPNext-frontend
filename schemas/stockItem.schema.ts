import { z } from "zod";

export const stockItemSchema = z.object({
  item_code: z.string().min(1, "Item code is required"),
  item_name: z.string().min(1, "Item name is required"),
  is_stock_item: z.union([z.number(), z.boolean()]), // you used 3, could be number or boolean in some systems
  stock_uom: z.string().min(1, "Stock UOM is required"),
  uom: z.string().min(1, "UOM is required"),
  item_group: z.string().min(1, "Item group is required"),
});

export type StockItem = z.infer<typeof stockItemSchema>;
