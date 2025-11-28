import CustomizeFieldForm from "@/components/general/CustomizeFieldForm";
import React from "react";

const customizeField = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Customize Field</h1>
        <p className="text-sm text-muted-foreground">
          Edit labels and properties for fields on doctypes.
        </p>
      </div>

      <CustomizeFieldForm />
    </div>
  );
};

export default customizeField;
