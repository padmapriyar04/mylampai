"use client";
import { useUserStore } from "@/utils/userStore";
import { useSession } from "next-auth/react";
import FullScreenLoader from "@/components/global/FullScreenLoader";

export default function ProfilePage() {
  const { userData } = useUserStore();
  const { data: session } = useSession();

  if (!userData && !session) {
    return <FullScreenLoader message="Loading your profile..." />;
  }

  return (
    <div className="flex items-center justify-center w-full">
      <div className="bg-white p-8 rounded-sm shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-primary">
          Welcome to your profile
        </h1>
        <p className="text-xl text-slate-500 mb-2">
          Hello, {userData ? userData.name : session?.user.name}
        </p>
        <p className="text-md text-slate-500">
          Email: {userData ? userData.email : session?.user.email}
        </p>
      </div>
    </div>
  );
}
