"use client";
import React from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icons: LucideIcon[];
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    <div className="flex flex-col gap-6">
      {items.map((item, index) => (
        <div key={index} className="group">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger className=" flex flex-col w-full items-center">
                {item.icons?.[0] &&
                  React.createElement(item.icons[0], {
                    className: "block group-hover:hidden",
                  })}
                {item.icons?.[1] &&
                  React.createElement(item.icons[1], {
                    className: "hidden group-hover:block",
                  })}
                <p className="text-[0.6rem]"> {item.title} </p>
              </TooltipTrigger>

              <TooltipContent side="right">
                <p>{item.title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ))}
    </div>
  );
}
