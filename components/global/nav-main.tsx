"use client";
import Link from "next/link";
import React from "react";
import { Bootstrap } from "react-bootstrap-icons";

type typeBootstrap = typeof Bootstrap;

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    view: string;
    icons: typeBootstrap[];
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => {
        if (item.view === "user") {
          return (
            <div key={index} className="group">
              <Link
                href={item.url}
                className="flex flex-col gap-1 w-full items-center"
              >
                <div className="p-[7px] border border-white group-hover:border-slate-200 rounded-lg">
                  {item.icons?.[0] &&
                    React.createElement(item.icons[0], {
                      className:
                        "block w-full w-6 h-6 text-[#697386] group-focus:text-primary group-hover:text-primary group-hover:hidden",
                    })}
                  {item.icons?.[1] &&
                    React.createElement(item.icons[1], {
                      className:
                        "hidden w-full w-6 h-6 text-[#697386] group-focus:text-primary group-hover:text-primary group-hover:block",
                    })}
                </div>
                <p className="text-[0.6rem]"> {item.title} </p>
              </Link>
            </div>
          );
        }
      })}
    </div>
  );
}
