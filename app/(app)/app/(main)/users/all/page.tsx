"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@/types/user";
import Link from "next/link";
import { DataTable } from "@/components/general/DataTable";
import userColumns from "@/lib/columns/userColumns";
import { fetchUsers } from "@/lib/api/users";

const AllUsersPage = () => {
  const { data, isLoading, error } = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  const users: User[] = data ?? [];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Users</h1>
        <Link
          href="/app/users/add"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add User
        </Link>
      </div>
      <div className="bg-white rounded shadow overflow-auto">
        <DataTable columns={userColumns} data={users} />
      </div>
    </div>
  );
};

export default AllUsersPage;
