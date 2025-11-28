"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import userSchema, { UserFormData } from "@/schemas/user.schema";
import { fetchUserById, updateUser } from "@/lib/api/users";
import { toast } from "sonner";

const EditUserPage = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = decodeURIComponent(params.id as string);

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserById(userId),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  React.useEffect(() => {
    if (user) {
      reset({
        email: user.email ?? "",
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        enabled: Boolean(user.enabled),
      });
    }
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: (data: Partial<UserFormData>) => updateUser(userId, data),
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      router.push("/app/users/all");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user");
    },
  });

  const onSubmit = (data: UserFormData) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit User</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-6 rounded-lg shadow"
      >
        <div>
          <label htmlFor="email" className="block font-medium mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className={`input-field w-full px-3 py-2 border rounded-md ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            disabled
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block font-medium mb-2">
              First Name
            </label>
            <input
              id="first_name"
              type="text"
              {...register("first_name")}
              className={`input-field w-full px-3 py-2 border rounded-md ${
                errors.first_name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.first_name.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="last_name" className="block font-medium mb-2">
              Last Name
            </label>
            <input
              id="last_name"
              type="text"
              {...register("last_name")}
              className={`input-field w-full px-3 py-2 border rounded-md ${
                errors.last_name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.last_name.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="enabled"
            type="checkbox"
            {...register("enabled")}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="enabled" className="ml-2 font-medium">
            Enabled
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            disabled={mutation.status === "pending"}
          >
            {mutation.status === "pending" ? "Updating..." : "Update User"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/app/users/all")}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            disabled={mutation.status === "pending"}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserPage;
