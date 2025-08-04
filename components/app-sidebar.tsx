"use client"

import * as React from "react"
import {
  Heart,
  Home,
  BookOpen,
  Calendar,
  Target,
  Settings,
  Phone,
  Activity,
  HelpCircle,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Mental Health App Data
const data = {
  user: {
    name: "Alex Johnson",
    email: "alex@student.edu",
    avatar: "/avatars/student.jpg",
  },
  teams: [
    {
      name: "MindFlow",
      logo: Heart,
      plan: "Student",
    }
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "student/dashboard",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Today's Overview",
          url: "student/dashboard",
        },
        {
          title: "Quick Check-in",
          url: "student/dashboard/checkin",
        },
        {
          title: "Recent Activity",
          url: "student/dashboard/activity",
        },
      ],
    },
    {
      title: "Tracking & Journal",
      url: "/tracking",
      icon: Activity,
      items: [
        {
          title: "Daily Check-in",
          url: "/tracking/checkin",
        },
        {
          title: "Mood History",
          url: "/student/history",
        },
        {
          title: "New Journal Entry",
          url: "/student/new",
        },
        {
          title: "My Entries",
          url: "/student/entries",
        },
        {
          title: "Analytics",
          url: "/student/analytics",
        },
      ],
    },
    {
      title: "Student Companion",
      url: "/student/Mental-chat",
      icon: Target,
    },
    {
      title: "Sessions & Support",
      url: "/appointments",
      icon: Calendar,
      items: [
        {
          title: "Schedule Session",
          url: "/appointments/book",
        },
        {
          title: "Upcoming Sessions",
          url: "/appointments/upcoming",
        },
        {
          title: "Therapist Chat",
          url: "/messages/therapist",
        },
        {
          title: "Support Groups",
          url: "/messages/groups",
        },
        {
          title: "Crisis Support",
          url: "/messages/crisis",
        },
      ],
    },
    {
      title: "Resources & Community",
      url: "/resources",
      icon: BookOpen,
      items: [
        {
          title: "Educational Content",
          url: "/resources/education",
        },
        {
          title: "Worksheets",
          url: "/resources/worksheets",
        },
        {
          title: "Support Forums",
          url: "/community/forums",
        },
        {
          title: "Peer Connections",
          url: "/community/peers",
        },
        {
          title: "Success Stories",
          url: "/community/stories",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      items: [
        {
          title: "Profile",
          url: "/settings/profile",
        },
        {
          title: "Privacy",
          url: "/settings/privacy",
        },
        {
          title: "Notifications",
          url: "/settings/notifications",
        },
        {
          title: "Export Data",
          url: "/settings/export",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Crisis Support",
      url: "/crisis",
      icon: Phone,
    },
    {
      name: "Help & Support",
      url: "/help",
      icon: HelpCircle,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}