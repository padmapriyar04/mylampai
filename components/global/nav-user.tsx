"use client";
import { BadgeCheck, Bell, LogOut, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useUserStore } from "@/utils/userStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { removeCookie } from "@/utils/cookieUtils";

export function NavUser() {
  const { userData, clearUser, setUser } = useUserStore();
  const router = useRouter();

  const handleNotifications = async () => {
    toast.success("No notifications available");
  };

  const handleUpgrade = async () => {
    toast.success("Feature coming soon!");
  };

  const handleLogout = async () => {
    try {
      removeCookie("accessToken");
      clearUser();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="" asChild>
        <Avatar className="h-10 w-10 rounded-lg border">
          <AvatarImage src={userData?.image} alt={userData?.name} />
          <AvatarFallback className="rounded-lg cursor-default">
            {userData?.name
              ? userData?.name
                  .split(/\s+/)
                  .map((word) => word[0].toUpperCase())
                  .join("")
              : "UR"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={"right"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={userData?.image} alt={userData?.name} />
              <AvatarFallback className="rounded-lg">
                {userData?.name
                  ? userData?.name
                      .split(/\s+/)
                      .map((word) => word[0].toUpperCase())
                      .join("")
                  : "US"}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{userData?.name}</span>
              <span className="truncate text-xs">{userData?.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleUpgrade}>
            <Sparkles />
            Upgrade to Premium
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={"/profile"}>
            <DropdownMenuItem>
              <BadgeCheck />
              Profile
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={handleNotifications}>
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
