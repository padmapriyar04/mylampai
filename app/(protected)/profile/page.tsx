"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/utils/userStore";
import { toast } from "sonner";

export default function ProfilePage() {
  const { userData } = useUserStore();

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading....
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center m-auto ">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-purple-600">
          Welcome to Your Profile
        </h1>
        <p className="text-xl text-gray-700 mb-2">Hello, {userData.name}</p>
        <p className="text-md text-gray-600">Email: {userData.email}</p>
        {userData.role === "admin" && (
          <p className="text-md text-gray-600">Role: {userData.role}</p>
        )}
        <p className="text-md text-gray-600">User ID: {userData.id}</p>
      </div>
    </div>
  );
}
