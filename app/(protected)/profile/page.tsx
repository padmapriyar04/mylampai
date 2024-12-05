"use client";
import { useUserStore } from "@/utils/userStore";
import FullScreenLoader from "@/components/global/FullScreenLoader";

export default function ProfilePage() {
  const { userData } = useUserStore();

  if (!userData) {
    return <FullScreenLoader message="Loading your profile..." />;
  }

  return (
    <div className="flex items-center justify-center w-full">
      <div className="bg-white p-8 rounded-sm shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-primary">
          Welcome to your profile
        </h1>
        <p className="text-xl text-slate-500 mb-2">
          Hello, {userData.name && userData.name}
        </p>
        <p className="text-md text-slate-500">
          Email: {userData.email && userData.email}
        </p>
      </div>
    </div>
  );
}
