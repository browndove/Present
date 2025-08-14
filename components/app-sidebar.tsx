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
import { ur } from "zod/v4/locales"

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
          url: "/student/daily-checkin",
        },
        {
          title: "Mood History",
          url: "/student/mood-history",
        },
        {
          title: "New Journal Entry",
          url: "/student/new-entry",
        },
        {
          title: "My Entries",
          url: "/student/my-entry",
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
      items: [
        {
          url: "/student/Mental-chat",
          title: "Mental Chat",
          description: "Your AI-powered mental health companion",
        },
      ],
    },
    {
      title: "Sessions & Support",
      url: "/appointments",
      icon: Calendar,
      items: [
        {
          title: "Schedule Session",
          url: "/student/appointment",
        },
        {
          title: "Upcoming Sessions",
          url: "/appointments/upcoming",
        },
        {
          title: "Therapist Chat",
          url: "/student/messaging",
        },
        {
          title: "Support Groups",
          url: "/student/support-groups",
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
          title: "Peer Connections",
          url: "/student/peers",
        },
        {
          title: "Success Stories",
          url: "/student/succes",
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