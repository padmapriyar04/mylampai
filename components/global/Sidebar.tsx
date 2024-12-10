"use client";
import * as React from "react";
import { Bookmark, BookmarkMinus } from "lucide-react";
import { NavMain } from "@/components/global/nav-main";
import { NavUser } from "@/components/global/nav-user";
import Image from "next/image";
import { House, HouseFill, FileEarmarkText, FileEarmarkTextFill, CameraVideo, CameraVideoFill, Briefcase, BriefcaseFill, PersonCheck, PersonFillCheck } from "react-bootstrap-icons";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/home",
      view: "user",
      icons: [House, HouseFill],
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Talent Match",
      url: "/talentmatch",
      view: "user",
      icons: [PersonCheck, PersonFillCheck],
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
    {
      title: "Interview",
      url: "/interview",
      view: "user",
      icons: [CameraVideo, CameraVideoFill],
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Resume",
      url: "/cvreviewer",
      view: "user",
      icons: [FileEarmarkText, FileEarmarkTextFill],
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Career",
      url: "/career",
      view: "user",
      icons: [Briefcase, BriefcaseFill],
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Talent Pool",
      url: "/talentpool",
      view: "recruiter",
      icons: [Bookmark, BookmarkMinus],
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
    {
      title: "Create Job",
      url: "/job",
      view: "recruiter",
      icons: [Bookmark, BookmarkMinus],
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar() {
  return (
    <div className="flex flex-col items-center justify-between py-4 max-w-20 w-full">
      <div className="flex items-center flex-col gap-4">
        <div className="shadow-lg">
          <Image
            src={"/sidebar/wize_logo_whitebg.svg"}
            alt="wiZe logo"
            width={50}
            height={50}
          />
        </div>
        <NavMain items={data.navMain} />
      </div>
      <NavUser />
    </div>
  );
}
