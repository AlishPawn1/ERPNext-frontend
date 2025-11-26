"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StockItem, stockItemSchema } from "@/schemas/stockItem.schema";
import { fetchStockItemGroups } from "@/lib/api/stockItemGroup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addStockItem } from "@/lib/api/stockitem";

// Define the type for item groups
export type StockItemGroup = {
  name: string;
  // add more fields if your API returns more
};

const StockItemForm = () => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StockItem>({
    resolver: zodResolver(stockItemSchema),
  });

  // Fetch item groups
  const { data: itemGroups } = useQuery<StockItemGroup[]>({
    queryKey: ["stock-item-groups"],
    queryFn: fetchStockItemGroups,
  });

  // Mutation for adding a stock item
  const mutation = useMutation({
    mutationFn: (stockItemData: StockItem) => addStockItem(stockItemData),
    onSuccess: () => {
      toast.success("Stock item created successfully!");
      queryClient.invalidateQueries({ queryKey: ["stock-items"] });
      reset();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to create stock item";
      toast.error(message);
    },
  });

  const onSubmit = (data: StockItem) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Stock Item</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Item Code */}
        <div>
          <label className="block font-medium">Item Code</label>
          <input
            {...register("item_code")}
            className="w-full border rounded px-2 py-1"
          />
          {errors.item_code && (
            <p className="text-red-500">{errors.item_code.message}</p>
          )}
        </div>

        {/* Item Name */}
        <div>
          <label className="block font-medium">Item Name</label>
          <input
            {...register("item_name")}
            className="w-full border rounded px-2 py-1"
          />
          {errors.item_name && (
            <p className="text-red-500">{errors.item_name.message}</p>
          )}
        </div>

        {/* Is Stock Item */}
        <div>
          <label className="block font-medium">Is Stock Item</label>
          <input
            type="number"
            {...register("is_stock_item", { valueAsNumber: true })}
            className="w-full border rounded px-2 py-1"
          />
          {errors.is_stock_item && (
            <p className="text-red-500">{errors.is_stock_item.message}</p>
          )}
        </div>

        {/* Stock UOM */}
        <div>
          <label className="block font-medium">Stock UOM</label>
          <input
            {...register("stock_uom")}
            className="w-full border rounded px-2 py-1"
          />
          {errors.stock_uom && (
            <p className="text-red-500">{errors.stock_uom.message}</p>
          )}
        </div>

        {/* UOM */}
        <div>
          <label className="block font-medium">UOM</label>
          <input
            {...register("uom")}
            className="w-full border rounded px-2 py-1"
          />
          {errors.uom && <p className="text-red-500">{errors.uom.message}</p>}
        </div>

        {/* Item Group */}
        <div>
          <label className="block font-medium">Item Group</label>
          <select
            {...register("item_group")}
            className="w-full border rounded px-2 py-1"
            defaultValue=""
          >
            <option value="" disabled>
              Select Item Group
            </option>
            {itemGroups?.map((item, index) => (
              <option key={index} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.item_group && (
            <p className="text-red-500">{errors.item_group.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {mutation.isPending ? "Creating..." : "Create Stock Item"}
        </button>
      </form>
    </div>
  );
};

export default StockItemForm;
