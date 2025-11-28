"use client";

import { User } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { PenSquare, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/models/ConfirmationModal";
import { deleteUser, updateUser } from "../api/users";
import { AxiosError } from "axios";

const UserActionCell = ({
  name,
  email,
}: {
  name?: string | null;
  email?: string | null;
}) => {
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (identifier: string) => deleteUser(identifier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully.");
    },
    onError: (error: AxiosError | Error) => {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;

        switch (status) {
          case 403:
            toast.error("You don't have permission to delete this user.");
            break;
          case 404:
            toast.error("User not found. It may have already been deleted.");
            break;
          case 409:
            toast.error(
              "Cannot delete user. This user may have associated data."
            );
            break;
          case 500:
            toast.error("Server error. Please try again later.");
            break;
          default:
            toast.error(message || "Failed to delete user. Please try again.");
        }
      } else {
        toast.error(
          error.message || "Failed to delete user. Please try again."
        );
      }
    },
  });

  const handleDeleteConfirmation = () => {
    const identifier = name ?? email ?? undefined;
    if (!identifier) {
      toast.error("Invalid user identifier.");
      setShowConfirmDeleteModal(false);
      return;
    }

    deleteMutation.mutate(identifier);
    setShowConfirmDeleteModal(false);
  };

  const id = encodeURIComponent(name ?? email ?? "");

  return (
    <>
      <div className="flex gap-4">
        <Link
          href={`/app/users/${id}`}
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
        title="Delete User"
        description={`Are you sure you want to delete ${
          name ?? email ?? "this user"
        }?`}
        confirmButtonVariant="danger"
      />
    </>
  );
};

const StatusToggle = ({ row }: { row: { original: User } }) => {
  const queryClient = useQueryClient();
  const id = row.original.name ?? row.original.email ?? "";
  const current = Boolean(row.original.enabled);

  const mutation = useMutation({
    mutationFn: (enabled: boolean) => updateUser(id, { enabled }),
    // optimistic update
    onMutate: async (enabled: boolean) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previous = queryClient.getQueryData<User[]>(["users"]);

      queryClient.setQueryData<User[] | undefined>(["users"], (old) =>
        old?.map((u) => {
          const key = u.name ?? u.email ?? "";
          if (key === id) return { ...u, enabled } as User;
          return u;
        })
      );

      queryClient.setQueryData<User | undefined>(["user", id], (old) =>
        old ? { ...old, enabled } : old
      );

      return { previous };
    },
    onError: (_err, _vars, context: { previous?: User[] } | undefined) => {
      if (context?.previous) {
        queryClient.setQueryData(["users"], context.previous);
      }
      toast.error("Failed to update status");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
    onSuccess: () => {
      toast.success("User status updated");
    },
  });

  const toggle = () => {
    mutation.mutate(!current);
  };

  return (
    <button
      onClick={toggle}
      className={`px-3 py-1 rounded-full text-sm transition ${
        current ? "bg-green-100 text-green-800" : "bg-zinc-100 text-zinc-700"
      }`}
      disabled={mutation.status === "pending"}
      aria-pressed={current}
    >
      {mutation.status === "pending"
        ? "Saving..."
        : current
        ? "Active"
        : "Disabled"}
    </button>
  );
};

const looksLikeEmail = (s?: string | null) =>
  typeof s === "string" && s.includes("@");

const buildFullName = (user: User) => {
  const fullNameRaw = user.full_name ?? user.fullName ?? null;
  // If full_name looks like an email, treat it as an email and not a display name
  if (fullNameRaw && !looksLikeEmail(fullNameRaw)) {
    const trimmed = String(fullNameRaw).trim();
    if (trimmed) return trimmed;
  }

  const first = user.first_name ?? user.firstName ?? "";
  const last = user.last_name ?? user.lastName ?? "";
  const combined = [first, last].filter(Boolean).join(" ").trim();
  if (combined) return combined;

  // prefer username, then extract username from email if possible
  if (user.username) return user.username;
  if (looksLikeEmail(user.email)) return String(user.email).split("@")[0];
  if (user.email) return user.email;
  if (user.name) return user.name;

  return "N/A";
};

const userColumns: ColumnDef<User>[] = [
  {
    id: "full_name",
    header: "Full Name",
    accessorFn: (row) => buildFullName(row),
    cell: ({ row }) => <span>{buildFullName(row.original)}</span>,
  },

  {
    id: "username",
    header: "Username",
    accessorFn: (row) => row.username ?? row.name ?? "",
    cell: ({ row }) => (
      <span>{row.original.username ?? row.original.name}</span>
    ),
  },

  {
    id: "email",
    header: "Email",
    accessorFn: (row) => row.email ?? row.name ?? "",
    cell: ({ row }) => <span>{row.original.email ?? row.original.name}</span>,
  },

  {
    id: "status",
    header: "Status",
    accessorFn: (row) => (row.enabled ? "Active" : "Disabled"),
    cell: ({ row }) => <StatusToggle row={row} />,
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <UserActionCell name={row.original.name} email={row.original.email} />
    ),
    size: 80,
  },
];

export default userColumns;
