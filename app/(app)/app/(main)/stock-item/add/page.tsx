"use client";

import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StockItem, stockItemSchema } from "@/schemas/stockItem.schema";
import { fetchStockItemGroups } from "@/lib/api/stockItemGroup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addStockItem } from "@/lib/api/stockitem";
import { fetchUOM } from "@/lib/api/UOM";
import { ReusableDropdown } from "@/components/general/ReusableDropDown";

export type StockItemGroup = {
  name: string;
};

export type UOM = {
  name: string;
};

const StockItemForm = () => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<StockItem>({
    resolver: zodResolver(stockItemSchema),
  });

  const watchedUom = useWatch({ control, name: "uom" }) as string | undefined;
  const watchedItemGroup = useWatch({ control, name: "item_group" }) as
    | string
    | undefined;

  // Fetch item groups
  const { data: itemGroups } = useQuery<StockItemGroup[]>({
    queryKey: ["stock-item-groups"],
    queryFn: fetchStockItemGroups,
  });

  const { data: uom, isLoading: uomLoading } = useQuery<UOM[]>({
    queryKey: ["uom-list"],
    queryFn: fetchUOM,
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
    // Ensure backend receives `stock_uom`. Use `uom` as the single UOM.
    const payload: StockItem = {
      ...data,
      stock_uom: data.uom,
    };

    mutation.mutate(payload);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Stock Item</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Item Code */}
        <div>
          <label className="block font-medium">Item Code</label>
          <input {...register("item_code")} className="input-field" />
          {errors.item_code && (
            <p className="text-red-500">{errors.item_code.message}</p>
          )}
        </div>

        {/* Item Name */}
        <div>
          <label className="block font-medium">Item Name</label>
          <input {...register("item_name")} className="input-field" />
          {errors.item_name && (
            <p className="text-red-500">{errors.item_name.message}</p>
          )}
        </div>

        {/* Is Stock Item (checkbox) */}
        <div>
          <div className="flex items-center space-x-2">
            <label htmlFor="isStockItem" className="block font-medium">
              Is Stock Item
            </label>
            <input
              type="checkbox"
              {...register("is_stock_item")}
              className="checkbox-field"
              id="isStockItem"
            />
          </div>
          {errors.is_stock_item && (
            <p className="text-red-500">{errors.is_stock_item.message}</p>
          )}
        </div>

        {/* UOM */}
        <div>
          <label className="block font-medium">UOM</label>
          {uomLoading ? (
            <div className="input-field">Loading...</div>
          ) : (
            <>
              <ReusableDropdown
                items={uom?.map((item) => item.name) ?? []}
                placeholder="Select UOM"
                value={(watchedUom as string) ?? null}
                onSelect={(item: string) => {
                  // keep both logical fields in sync so zod validation passes
                  setValue("uom", item);
                  setValue("stock_uom", item);
                }}
                className="w-full"
                disabled={uomLoading}
              />
              <input type="hidden" {...register("uom")} />
              <input type="hidden" {...register("stock_uom")} />
            </>
          )}
          {errors.uom && <p className="text-red-500">{errors.uom.message}</p>}
        </div>

        {/* Item Group */}
        <div>
          <label className="block font-medium">Item Group</label>
          <ReusableDropdown
            items={itemGroups?.map((item) => item.name) ?? []}
            placeholder="Select Item Group"
            value={watchedItemGroup ?? null}
            onSelect={(item: string) => setValue("item_group", item)}
            className="w-full"
            disabled={!itemGroups}
          />
          <input type="hidden" {...register("item_group")} />
          {errors.item_group && (
            <p className="text-red-500">{errors.item_group.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={mutation.status === "pending"}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {mutation.status === "pending" ? "Creating..." : "Create Stock Item"}
        </button>
      </form>
    </div>
  );
};

export default StockItemForm;
