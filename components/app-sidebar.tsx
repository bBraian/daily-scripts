"use client";

import * as React from "react";
import { BookOpen, Home, Settings2, SquareTerminal } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { AuthContext } from "@/app/context/AuthContext";
import { Skeleton } from "./ui/skeleton";

const navMain = [
  {
    navGroup: "Apps",
    nav: [
      {
        title: "Home",
        url: "/",
        icon: Home,
      },
      {
        title: "Scripts",
        url: "/scripts",
        icon: SquareTerminal,
        items: [
          {
            title: "Listagem",
            url: "/scripts",
          },
          {
            title: "Novo",
            url: "/scripts/new",
          },
          {
            title: "Rodar",
            url: "/scripts/run",
          },
        ],
      },
      {
        title: "Documentation",
        url: "#",
        icon: BookOpen,
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
        title: "Settings",
        url: "#",
        icon: Settings2,
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
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { loading, user, userCollections, activeUserCollection } =
    React.useContext(AuthContext);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {loading ? (
          <div className="w-full h-12 p-2 flex gap-2 items-center">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-32 h-4" />
          </div>
        ) : (
          <TeamSwitcher
            collections={userCollections}
            active={activeUserCollection}
          />
        )}
      </SidebarHeader>

      <SidebarContent>
        <NavMain navMain={navMain} />
      </SidebarContent>

      <SidebarFooter>
        {loading ? (
          <div className="w-full h-12 p-2 flex gap-2 items-center">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <div className="flex flex-col h-full justify-between">
              <Skeleton className="w-20 h-3.5" />
              <Skeleton className="w-32 h-2.5" />
            </div>
          </div>
        ) : (
          <NavUser user={{ ...user, avatar: null }} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
