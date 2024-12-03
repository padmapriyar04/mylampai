"use client";

import {
  BadgeCheck,
  Bell,
  LogOut,
  Sparkles,
} from "lucide-react";
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
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useUserStore } from "@/utils/userStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  name: string;
  imageUrl?: string;
  role?: string;
}

export function NavUser({ user }: { user: User | null }) {
  const { isMobile } = useSidebar();
  const { data: session } = useSession();
  const { clearUser } = useUserStore();
  const router = useRouter();

  const handleNotifications = async () => {
    toast.success("No notifications available");
  };

  const handleUpgrade = async () => {
    toast.success("Feature coming soon!");
  };

  const handleLogout = async () => {
    try {
      if (session) {
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        clearUser();
        await signOut({ callbackUrl: "/" });
      } else {
        const response = await fetch("/api/auth/logout", {
          method: "POST",
        });
        if (response.ok) {
          clearUser();
          toast.success("Logged out successfully");
          router.push("/");
        } else {
          console.error("Logout failed:", response.statusText);
        }
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="m-4" asChild>
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user?.imageUrl} alt={user?.name} />
            <AvatarFallback className="rounded-lg cursor-default">
              {user?.name
                .split(/\s+/)
                .map((word) => word[0].toUpperCase())
                .join("")}
            </AvatarFallback>
          </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user?.imageUrl} alt={user?.name} />
              <AvatarFallback className="rounded-lg">
                {user?.name
                  .split(/\s+/)
                  .map((word) => word[0].toUpperCase())
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user?.name}</span>
              <span className="truncate text-xs">{user?.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleUpgrade}>
            <Sparkles />
            Upgrade to Pro
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
