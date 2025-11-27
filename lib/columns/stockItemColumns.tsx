"use client";

import { StockItem } from "@/types/stockItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { PenSquare, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { deleteStockItemById } from "../api/stockitem";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/models/ConfirmationModal";

const StockItemActionCell = ({ itemCode }: { itemCode?: string }) => {
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteStockItemById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-items"] });
      toast.success("Stock item deleted successfully.");
    },
    onError: () => {
      toast.error("Failed to delete stock item. Please try again.");
    },
  });

  const handleDeleteConfirmation = () => {
    if (!itemCode) {
      toast.error("Invalid item identifier.");
      setShowConfirmDeleteModal(false);
      return;
    }

    deleteMutation.mutate(itemCode);
    setShowConfirmDeleteModal(false);
  };

  return (
    <>
      <div className="flex gap-4">
        <Link
          href={`/app/stock-item/${itemCode}/edit`}
          className="hover:bg-warning/10 hover:text-warning cursor-pointer rounded-full p-2 transition-colors duration-300"
        >
          <PenSquare size={16} />
        </Link>

        <div
          onClick={() => setShowConfirmDeleteModal(true)}
          className="hover:bg-danger/10 hover:text-danger cursor-pointer rounded-full p-2 transition-colors duration-300"
        >
          <Trash size={16} />
        </div>
      </div>
      <ConfirmationModal
        isOpen={showConfirmDeleteModal}
        onClose={() => setShowConfirmDeleteModal(false)}
        onConfirm={handleDeleteConfirmation}
        title="Delete Stock Item"
        description={`Are you sure you want to delete ${
          itemCode || "this item"
        }?`}
        confirmButtonVariant="danger"
      />
    </>
  );
};

const stockItemColumns: ColumnDef<StockItem>[] = [
  {
    accessorKey: "item_name",
    header: "Item Name",
    cell: ({ row }) => row.original.item_name ?? row.original.name ?? "—",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
    cell: ({ row }) => row.original.item_code ?? row.original.name ?? "—",
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <StockItemActionCell
        itemCode={row.original.item_code ?? row.original.name}
      />
    ),
    size: 80,
  },
];

export default stockItemColumns;
