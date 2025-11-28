import React from "react";

const page = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          High level overview and quick links.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">Customers</div>
        <div className="p-4 bg-white rounded shadow">Sales</div>
        <div className="p-4 bg-white rounded shadow">Inventory</div>
      </div>
    </div>
  );
};

export default page;
