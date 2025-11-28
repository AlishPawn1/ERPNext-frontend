import React from "react";

const StockPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Stock</h1>
        <p className="text-sm text-muted-foreground">
          Overview and quick actions for stock management.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded shadow">
          Stock dashboard widgets go here.
        </div>
        <div className="p-4 bg-white rounded shadow">
          Recent transactions or alerts.
        </div>
      </div>
    </div>
  );
};

export default StockPage;
