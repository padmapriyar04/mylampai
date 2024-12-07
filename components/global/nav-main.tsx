"use client";
import Link from "next/link";
import React from "react";
import { type LucideIcon } from "lucide-react";
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
              <TooltipTrigger className="w-full">
                <Link
                  href={item.url}
                  className="flex flex-col w-full items-center"
                >
                  {item.icons?.[0] &&
                    React.createElement(item.icons[0], {
                      className: "block group-hover:hidden",
                    })}
                  {item.icons?.[1] &&
                    React.createElement(item.icons[1], {
                      className: "hidden group-hover:block",
                    })}
                  <p className="text-[0.6rem]"> {item.title} </p>
                </Link>
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
