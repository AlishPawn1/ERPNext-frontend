"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUOM } from "@/lib/api/UOM";

const UOM = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["uom"],
    queryFn: fetchUOM,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading UOM</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Units of Measure</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {data?.map((item: { name: string }, index: number) => (
          <div key={index} className="p-3 bg-white rounded border">
            {item.name}
          </div>
        ))}
      </div>
      <div className="text-sm text-zinc-600">Total UOM: {data?.length}</div>
    </div>
  );
};

export default UOM;
