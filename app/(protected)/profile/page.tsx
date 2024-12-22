"use client";
import { useUserStore } from "@/utils/userStore";
import FullScreenLoader from "@/components/global/FullScreenLoader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { userData } = useUserStore();

  if (!userData) {
    return <FullScreenLoader message="Loading your profile..." />;
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col border rounded-lg p-8 gap-4 mx-auto max-w-xl">
        <h1 className="text-3xl font-bold text-primary">
          Welcome to your profile
        </h1>
        <div className="flex items-start gap-4">
          <Avatar className="h-24 w-24 rounded-lg shadow-lg ">
            <AvatarImage src={userData?.image} alt={userData?.name} />
            <AvatarFallback className="rounded-lg cursor-default">
              {userData?.name ? userData?.name : "User"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start gap-2">
            <p className="text-xl text-muted-foreground">
              Hello, {userData.name || "User"}
            </p>
            <p className="text-md text-muted-foreground">
              Email: {userData.email && userData.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
