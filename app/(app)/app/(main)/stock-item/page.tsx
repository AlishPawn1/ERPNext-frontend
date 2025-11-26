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
    <div>
      <h1 className="text-2xl font-bold mb-4">Stock Items</h1>
      <Link
        className="py-4 px-8 bg-black text-white inline-block"
        href="/app/stock-item/add"
      >
        Add Stock Item
      </Link>
      <DataTable columns={stockItemColumns} data={data?.data ?? []} />
      <div className="">Total Stock Items: {data?.data.length}</div>
      <div className="">
        <ul>
          {data?.data.map((item: { name: string }, index: number) => (
            <li key={index}>
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StockItem;
