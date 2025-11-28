"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchStockItems } from "@/lib/api/stockitem";
import Link from "next/link";
import { DataTable } from "@/components/general/DataTable";
import stockItemColumns from "@/lib/columns/stockItemColumns";

const StockItem = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["stock-items"],
    queryFn: fetchStockItems,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading stock items</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Stock Items</h1>
        <Link
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          href="/app/stock-item/add"
        >
          Add Stock Item
        </Link>
      </div>

      <div className="mb-4">
        <DataTable columns={stockItemColumns} data={data?.data ?? []} />
      </div>

      <div className="text-sm text-zinc-600">
        Total Stock Items: {data?.data.length}
      </div>
      <div className="mt-6">
        <ul className="space-y-2">
          {data?.data.map((item: { name: string }, index: number) => (
            <li key={index} className="p-3 bg-white rounded border">
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StockItem;
