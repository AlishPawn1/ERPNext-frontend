"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import userSchema, { UserFormData } from "@/schemas/user.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addUser } from "@/lib/api/users";
import { AxiosError } from "axios";

const AddUserPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: { enabled: true },
  });
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: UserFormData) => addUser(data),
    onSuccess: () => {
      toast.success("User created successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      router.push("/app/users/all");
    },
    onError: (error: AxiosError | Error) => {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;

        switch (status) {
          case 409:
            toast.error("A user with this email already exists.");
            break;
          case 400:
            toast.error(
              message || "Invalid user data. Please check your input."
            );
            break;
          case 403:
            toast.error("You don't have permission to create users.");
            break;
          case 500:
            toast.error("Server error. Please try again later.");
            break;
          default:
            toast.error(message || "Failed to create user. Please try again.");
        }
      } else {
        toast.error(
          error.message || "Failed to create user. Please try again."
        );
      }
    },
  });

  const onSubmit = (data: UserFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add User</h1>

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
            placeholder="user@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block font-medium mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="first_name"
              type="text"
              {...register("first_name")}
              className={`input-field w-full px-3 py-2 border rounded-md ${
                errors.first_name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="John"
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.first_name.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="last_name" className="block font-medium mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              id="last_name"
              type="text"
              {...register("last_name")}
              className={`input-field w-full px-3 py-2 border rounded-md ${
                errors.last_name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Doe"
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.last_name.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block font-medium mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className={`input-field w-full px-3 py-2 border rounded-md ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Leave blank to auto-generate a password
          </p>
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
          {errors.enabled && (
            <p className="text-red-500 text-sm ml-2">
              {errors.enabled.message}
            </p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            disabled={mutation.status === "pending"}
          >
            {mutation.status === "pending" ? "Creating..." : "Create User"}
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

export default AddUserPage;
