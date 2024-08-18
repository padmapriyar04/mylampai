"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/utils/userStore";
import { toast } from "sonner";

export default function ProfilePage() {
  const { userData } = useUserStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user/profile");

        if (response.ok) {
          const data = await response.json();
          console.log("userData", data);
        } else if (response.status === 404) {
          toast.error("User not found. Try logging in again.");
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to load user data. Please try again later.");
        setLoading(false);
      }
    };
    if (!userData) fetchUser();
  }, [userData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        User not found
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-purple-600">
          Welcome to Your Profile
        </h1>
        <p className="text-xl text-gray-700 mb-2">Hello, {userData.name}</p>
        <p className="text-md text-gray-600">Email: {userData.email}</p>
        <p className="text-md text-gray-600">Role: {userData.role}</p>
        <p className="text-md text-gray-600">User ID: {userData.id}</p>
      </div>
    </div>
  );
}
