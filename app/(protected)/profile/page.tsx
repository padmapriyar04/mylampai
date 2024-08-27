"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/utils/userStore";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { userData } = useUserStore();
  const { data: session } = useSession();
  
  console.log(session);

  if (!userData && !session) {
    return (
      <div className="flex justify-center m-auto items-center h-screen font-bold text-2xl text-white">
        Loading....
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center m-auto ">
      <div className="bg-white p-8 rounded-sm shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-purple-600">
          Welcome to Your Profile
        </h1>
        <p className="text-xl text-gray-700 mb-2">
          Hello, {userData ? userData.name : session?.user.name}
        </p>
        <p className="text-md text-gray-600">
          Email: {userData ? userData.email : session?.user.email}
        </p>
        {userData && userData.role === "admin" && (
          <>
            <p className="text-md text-gray-600">User ID: {userData.id}</p>
            <p className="text-md text-gray-600">Role: {userData.role}</p>
          </>
        )}
      </div>
    </div>
  );
}
