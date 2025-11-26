"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchStockItemGroups } from "@/lib/api/stockItemGroup";

const StockItemGroup = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["stock-items-groups"],
    queryFn: fetchStockItemGroups,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading stock items</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Stock Items Group</h1>
      <div>Total Stock Items Groups: {data?.length}</div>
      <ul>
        {data?.map((item: { name: string }, index: number) => (
          <li key={index}>
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockItemGroup;
