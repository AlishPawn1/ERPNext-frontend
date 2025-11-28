"use client";

import React, { useState } from "react";
import { ReusableDropdown } from "./ReusableDropDown";
import { Button } from "./Button";
import type { FieldDef } from "@/types/field";
import { toast } from "sonner";

export function CustomizeFieldForm() {
  // ---- REQUIRED STATES ----
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [docTypes] = useState<string[]>([]);

  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);

  const [fields] = useState<FieldDef[]>([]);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState("Data");
  const [defaultValue, setDefaultValue] = useState<string | number | null>(
    null
  );

  const [label, setLabel] = useState("");
  const [mandatory, setMandatory] = useState(false);

  const [saving, setSaving] = useState(false);

  // ---- HANDLER ----
  const handleSave = async () => {
    setSaving(true);

    setSaving(false);
    toast.success("Field saved successfully!");
  };

  return (
    <div className="max-w-3xl space-y-6 rounded-md bg-surface p-6 shadow-sm">
      <h2 className="text-lg font-medium">Add / Customize Field</h2>

      {/* MODE SWITCH */}
      <div className="flex gap-3">
        <button
          type="button"
          className={`px-3 py-1 rounded ${
            mode === "add" ? "bg-primary text-white" : "bg-transparent"
          }`}
          onClick={() => setMode("add")}
        >
          Add New Field
        </button>

        <button
          type="button"
          className={`px-3 py-1 rounded ${
            mode === "edit" ? "bg-primary text-white" : "bg-transparent"
          }`}
          onClick={() => setMode("edit")}
        >
          Edit Existing Field
        </button>
      </div>

      {/* DOC TYPE + FIELD */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* DOC TYPE */}
        <div>
          <label className="text-sm text-muted-foreground">DocType</label>
          <ReusableDropdown
            items={docTypes}
            placeholder="Select DocType"
            value={selectedDocType ?? undefined}
            onSelect={(d) => setSelectedDocType(d)}
          />
        </div>

        {/* FIELD / NEW FIELD */}
        <div>
          {mode === "edit" ? (
            <>
              <label className="text-sm text-muted-foreground">Field</label>
              <ReusableDropdown
                items={fields.map((f) => f.name)}
                placeholder={
                  selectedDocType ? "Select Field" : "Choose DocType first"
                }
                value={selectedField ?? undefined}
                onSelect={(f) => setSelectedField(f)}
                disabled={!selectedDocType}
              />
            </>
          ) : (
            <>
              <label className="text-sm text-muted-foreground">
                New Field Name
              </label>
              <input
                className="input-field w-full"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                placeholder="e.g. preferred_vendor"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Internal name: lowercase, numbers, underscore only. Example:{" "}
                <code>preferred_vendor</code>
              </p>
            </>
          )}
        </div>
      </div>

      {/* ADD MODE EXTRA FIELDS */}
      {mode === "add" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="text-sm text-muted-foreground">Field Type</label>
            <ReusableDropdown
              items={[
                "Data",
                "Text",
                "Link",
                "Int",
                "Float",
                "Date",
                "Select",
                "Check",
              ]}
              value={newFieldType}
              onSelect={(v) => setNewFieldType(v)}
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">
              Default Value
            </label>
            <input
              className="input-field w-full"
              value={defaultValue ?? ""}
              onChange={(e) => setDefaultValue(e.target.value)}
              placeholder="Optional default"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Label</label>
            <input
              className="input-field w-full"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Field label (optional)"
            />
          </div>
        </div>
      )}

      {/* EDIT MODE FIELDS */}
      {mode === "edit" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm text-muted-foreground">Label</label>
            <input
              className="input-field w-full"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Field label"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="mandatory"
              type="checkbox"
              checked={mandatory}
              onChange={(e) => setMandatory(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="mandatory" className="text-sm">
              Mandatory
            </label>
          </div>
        </div>
      )}

      {/* ACTION */}
      <div className="flex items-center justify-end gap-3">
        <Button
          text={mode === "add" ? "Add Field" : "Save"}
          variant="primary"
          onClick={handleSave}
          isLoading={saving}
        />
      </div>
    </div>
  );
}

export default CustomizeFieldForm;
