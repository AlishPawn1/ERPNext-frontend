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
    <div>
      <h1 className="text-2xl font-bold mb-4">UOM</h1>
      <div>Total UOM: {data?.length}</div>
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

export default UOM;
