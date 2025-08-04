"use client"

import { useState, useEffect } from "react"
import {
  Heart,
  Phone,
  Calendar,
  BookOpen,
  Activity,
  Zap,
  Moon,
  TrendingUp,
  MessageCircle,
  CheckCircle,
  Clock,
  Edit3,
  Target,
  Brain,
  Flame,
  Sun,
  ChevronRight,
  Star,
  Shield,
  BarChart3,
  Users,
  Timer,
  Footprints,
  Droplets,
  Coffee,
  Plus,
  Filter,
  Download,
  Share,
  RefreshCw,
  TrendingDown,
  Minus,
} from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { HeaderActions } from "@/components/header-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/context/AuthContext"
import { toast } from "@/hooks/use-toast"


export default function Page() {
  const { user, logout } = useAuth()

  // If no user is logged in, return null or a loading state
  if (!user) {
    return null
  }

  // Generate fallback initials from fullName
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Determine profile link based on user role
  const getProfileLink = () => {
    if (user.role === 'student') {
      return '/student/profile'
    } else if (user.role === 'counselor') {
      return '/counselor/profile'
    }
    return '/profile' // fallback
  }

  // Handle logout with toast notification
  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Failed to log out')
      console.error('Logout error:', error)
    }
  }

  const initials = getInitials(user.fullName || user.email)

  const [currentTime, setCurrentTime] = useState(new Date())
  const [quickCheckExpanded, setQuickCheckExpanded] = useState(false)
  const [moodValue, setMoodValue] = useState([3])
  const [energyValue, setEnergyValue] = useState([5])
  const [anxietyLevel, setAnxietyLevel] = useState<string>("")
  const [sleepRating, setSleepRating] = useState(0)
  const [selectedEmotion, setSelectedEmotion] = useState<string>("")
  const [quickNote, setQuickNote] = useState("")
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [showAllActivities, setShowAllActivities] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatTimeShort = (date: Date) => {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const moodEmojis = ["😢", "😔", "😐", "🙂", "😊"]
  const anxietyLevels = [
    { label: "Low", value: "low", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    { label: "Medium", value: "medium", color: "bg-amber-100 text-amber-800 border-amber-200" },
    { label: "High", value: "high", color: "bg-red-100 text-red-800 border-red-200" },
  ]

  const emotions = [
    "Anxious",
    "Hopeful",
    "Tired",
    "Motivated",
    "Grateful",
    "Overwhelmed",
    "Peaceful",
    "Frustrated",
    "Excited",
    "Lonely",
    "Confident",
    "Worried",
  ]

  const physicalSymptoms = [
    { id: "headache", label: "Headache" },
    { id: "tension", label: "Muscle tension" },
    { id: "fatigue", label: "Fatigue" },
    { id: "nausea", label: "Nausea" },
    { id: "insomnia", label: "Sleep issues" },
    { id: "appetite", label: "Appetite changes" },
  ]

  const weeklyStats = [
    { label: "Sessions Completed", value: 3, total: 4, icon: MessageCircle, color: "text-blue-600", trend: "up" },
    { label: "Journal Entries", value: 7, total: 7, icon: BookOpen, color: "text-purple-600", trend: "up" },
    { label: "Meditation Minutes", value: 105, total: 140, icon: Brain, color: "text-emerald-600", trend: "up" },
    { label: "Mood Check-ins", value: 6, total: 7, icon: Heart, color: "text-pink-600", trend: "stable" },
    { label: "Goals Achieved", value: 4, total: 6, icon: Target, color: "text-orange-600", trend: "up" },
    { label: "Crisis Contacts", value: 0, total: 0, icon: Phone, color: "text-red-600", trend: "stable" },
  ]

  const monthlyStats = [
    { label: "Total Sessions", value: "12", change: "+3 from last month" },
    { label: "Avg Mood Rating", value: "3.8/5", change: "+0.4 improvement" },
    { label: "Meditation Streak", value: "21 days", change: "Personal best!" },
    { label: "Journal Consistency", value: "89%", change: "+12% improvement" },
    { label: "Sleep Quality", value: "4.2/5", change: "+0.3 improvement" },
    { label: "Energy Levels", value: "6.5/10", change: "+1.2 improvement" },
  ]

  const recentActivities = [
    {
      id: 1,
      type: "check-in",
      title: "Mood check-in completed",
      description: "Feeling good, energy level moderate",
      time: "2 hours ago",
      icon: Heart,
      color: "text-blue-600",
      actionable: false,
    },
    {
      id: 2,
      type: "exercise",
      title: "Breathing exercise completed",
      description: "10-minute mindfulness session",
      time: "Yesterday, 7:30 PM",
      icon: Activity,
      color: "text-emerald-600",
      actionable: true,
    },
    {
      id: 3,
      type: "journal",
      title: "Journal entry created",
      description: "Reflecting on today's challenges and growth",
      time: "Yesterday, 8:15 PM",
      icon: BookOpen,
      color: "text-purple-600",
      actionable: false,
    },
    {
      id: 4,
      type: "session",
      title: "Therapy session attended",
      description: "Session with Dr. Sarah Chen - Cognitive Behavioral Therapy",
      time: "2 days ago",
      icon: MessageCircle,
      color: "text-indigo-600",
      actionable: false,
    },
    {
      id: 5,
      type: "goal",
      title: "Wellness goal achieved",
      description: "30-day meditation streak completed",
      time: "3 days ago",
      icon: Target,
      color: "text-orange-600",
      actionable: false,
    },
    {
      id: 6,
      type: "resource",
      title: "Educational content viewed",
      description: "Article: 'Managing Anxiety in Daily Life'",
      time: "4 days ago",
      icon: BookOpen,
      color: "text-slate-600",
      actionable: true,
    },
    {
      id: 7,
      type: "community",
      title: "Support group participation",
      description: "Weekly anxiety support group session",
      time: "5 days ago",
      icon: Users,
      color: "text-teal-600",
      actionable: false,
    },
  ]

  const upcomingReminders = [
    { id: 1, title: "Therapy session with Dr. Chen", time: "Tomorrow, 2:00 PM", type: "session" },
    { id: 2, title: "Evening journal reflection", time: "Today, 8:00 PM", type: "journal" },
    { id: 3, title: "Weekly mood pattern review", time: "Friday, 10:00 AM", type: "review" },
    { id: 4, title: "Medication reminder", time: "Daily, 9:00 AM", type: "medication" },
  ]

  const handleQuickCheckSubmit = () => {
    // Simulate API call
    console.log({
      mood: moodValue[0],
      energy: energyValue[0],
      anxiety: anxietyLevel,
      sleep: sleepRating,
      emotion: selectedEmotion,
      note: quickNote,
      symptoms: selectedSymptoms,
      timestamp: new Date().toISOString(),
    })

    // Reset form and collapse
    setQuickCheckExpanded(false)
    setMoodValue([3])
    setEnergyValue([5])
    setAnxietyLevel("")
    setSleepRating(0)
    setSelectedEmotion("")
    setQuickNote("")
    setSelectedSymptoms([])

    // Show success feedback (you could add a toast here)
    alert("Check-in submitted successfully!")
  }

  const handleSymptomChange = (symptomId: string, checked: boolean) => {
    if (checked) {
      setSelectedSymptoms([...selectedSymptoms, symptomId])
    } else {
      setSelectedSymptoms(selectedSymptoms.filter((id) => id !== symptomId))
    }
  }

  const exportData = () => {
    // Simulate data export
    const data = {
      weeklyStats,
      monthlyStats,
      recentActivities,
      exportDate: new Date().toISOString(),
    }
    console.log("Exporting data:", data)
    alert("Data export initiated. You'll receive an email with your wellness report.")
  }

  const shareProgress = () => {
    // Simulate sharing functionality
    alert("Progress report prepared for sharing with your healthcare provider.")
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-white">
          <div className="flex items-center gap-2 px-3 sm:px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb className="hidden sm:block">
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Mental Health Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Today's Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            {/* Mobile title */}
            <div className="sm:hidden">
              <h1 className="text-sm font-medium text-slate-900">Dashboard</h1>
            </div>
          </div>
          {/* Header Actions - Search, Notifications, Profile */}
          <div className="ml-auto px-3 sm:px-4">
            <HeaderActions />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 sm:gap-6 p-3 sm:p-4 lg:p-6 pt-4 sm:pt-6">
          {/* Crisis Support - Always Visible */}
          <Alert className="border-red-200 bg-red-50/80 backdrop-blur-sm">
            <Phone className="h-4 w-4 text-red-600 flex-shrink-0" />
            <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
              <span className="text-red-900 font-medium text-sm leading-relaxed">
                Crisis support available 24/7 • Call 988 or text HOME to 741741
              </span>
              <Button size="sm" variant="destructive" className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">
                Get Help Now
              </Button>
            </AlertDescription>
          </Alert>

          {/* Welcome Header */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-900 truncate">
                  Good morning, {user.fullName}!
                </h1>
                <p className="text-slate-600 mt-1 text-sm sm:text-base">{formatTime(currentTime)}</p>
              </div>
              <div className="flex flex-col gap-3 sm:items-end">
                <div className="flex items-center space-x-2 text-slate-600">
                  <Sun className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">72°F, Sunny</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportData}
                    className="text-xs sm:text-sm bg-transparent"
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareProgress}
                    className="text-xs sm:text-sm bg-transparent"
                  >
                    <Share className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm bg-transparent">
                    <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Analytics
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Overview */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-4 lg:pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <CardTitle className="text-lg lg:text-xl font-semibold text-slate-900">Today's Overview</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="text-xs lg:text-sm">
                    <RefreshCw className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                    Refresh
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs lg:text-sm">
                    <Edit3 className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 lg:space-y-8">
              {/* Daily Wellness Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div className="space-y-3 p-4 bg-slate-50/50 rounded-lg border border-slate-100">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-slate-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-700">Overall Mood</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🙂</span>
                    <div className="min-w-0 flex-1">
                      <span className="text-lg font-semibold text-slate-900 block">Good</span>
                      <p className="text-xs text-emerald-600">↗ +15% this week</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-4 bg-slate-50/50 rounded-lg border border-slate-100">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-slate-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-700">Energy Level</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                        <div key={i} className={`w-1.5 h-4 rounded-sm ${i <= 7 ? "bg-emerald-500" : "bg-slate-200"}`} />
                      ))}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-medium text-slate-900 block">7/10</span>
                      <p className="text-xs text-emerald-600">↗ +1.2 avg</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-4 bg-slate-50/50 rounded-lg border border-slate-100">
                  <div className="flex items-center space-x-2">
                    <Moon className="h-4 w-4 text-slate-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-700">Sleep Quality</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i <= 4 ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                        />
                      ))}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-medium text-slate-900 block">7.5 hrs</span>
                      <p className="text-xs text-blue-600">↗ +0.3 quality</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-4 bg-slate-50/50 rounded-lg border border-slate-100">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-slate-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-700">Safety Status</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0"></div>
                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-medium text-emerald-700 block">Stable</span>
                      <p className="text-xs text-slate-500">No concerns</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Weekly Statistics */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="text-lg font-medium text-slate-900">This Week's Progress</h3>
                  <Button variant="ghost" size="sm" className="self-start sm:self-auto">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {weeklyStats.map((stat, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <stat.icon className={`h-4 w-4 ${stat.color} flex-shrink-0`} />
                          <span className="text-sm font-medium text-slate-700 truncate">{stat.label}</span>
                        </div>
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          {stat.trend === "up" && <TrendingUp className="h-3 w-3 text-emerald-500" />}
                          {stat.trend === "down" && <TrendingDown className="h-3 w-3 text-red-500" />}
                          {stat.trend === "stable" && <Minus className="h-3 w-3 text-slate-400" />}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-semibold text-slate-900">{stat.value}</span>
                        {stat.total > 0 && <span className="text-sm text-slate-500">/ {stat.total}</span>}
                      </div>
                      {stat.total > 0 && <Progress value={(stat.value / stat.total) * 100} className="h-2 mt-2" />}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Goal Progress & Appointments */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h3 className="text-base lg:text-lg font-medium text-slate-900">Today's Habits</h3>
                    <Button variant="ghost" size="sm" className="self-start sm:self-auto">
                      <Plus className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                      Add Habit
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-emerald-600" />
                        <div>
                          <span className="text-xs lg:text-sm font-medium text-slate-900">Morning meditation</span>
                          <p className="text-xs text-slate-600">Completed at 7:15 AM • 10 minutes</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-xs">
                        ✓ Done
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
                        <div>
                          <span className="text-xs lg:text-sm font-medium text-slate-900">Journal entry</span>
                          <p className="text-xs text-slate-600">Completed at 8:30 PM yesterday</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                        ✓ Done
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-4 w-4 lg:h-5 lg:w-5 text-slate-400" />
                        <div>
                          <span className="text-xs lg:text-sm font-medium text-slate-700">Exercise (30 min)</span>
                          <p className="text-xs text-slate-600">Scheduled for 6:00 PM</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-slate-300 text-slate-600 text-xs">
                        Pending
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Droplets className="h-4 w-4 lg:h-5 lg:w-5 text-amber-600" />
                        <div>
                          <span className="text-xs lg:text-sm font-medium text-slate-900">Hydration goal</span>
                          <p className="text-xs text-slate-600">6 of 8 glasses completed</p>
                        </div>
                      </div>
                      <Progress value={75} className="w-12 lg:w-16 h-2" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base lg:text-lg font-medium text-slate-900">Appointments & Insights</h3>
                  <div className="space-y-3">
                    <div className="p-3 lg:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs lg:text-sm font-medium text-blue-900">Next Session</span>
                        <Calendar className="h-3 w-3 lg:h-4 lg:w-4 text-blue-600" />
                      </div>
                      <p className="text-xs lg:text-sm text-blue-800 mb-2">Tomorrow 2:00 PM with Dr. Smith</p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button size="sm" variant="outline" className="text-xs bg-transparent">
                          Reschedule
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs bg-transparent">
                          Add Notes
                        </Button>
                      </div>
                    </div>

                    <div className="p-3 lg:p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs lg:text-sm font-medium text-emerald-900">Mood Trend</span>
                        <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-emerald-600" />
                      </div>
                      <p className="text-xs lg:text-sm text-emerald-800 mb-1">15% improvement this week</p>
                      <p className="text-xs text-emerald-700">Best day: Wednesday (4.2/5)</p>
                    </div>

                    <div className="p-3 lg:p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs lg:text-sm font-medium text-orange-900">Active Streaks</span>
                        <Flame className="h-3 w-3 lg:h-4 lg:w-4 text-orange-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs lg:text-sm text-orange-800">📝 7 days journaling</p>
                        <p className="text-xs lg:text-sm text-orange-800">🧘 21 days meditation</p>
                        <p className="text-xs lg:text-sm text-orange-800">💤 5 days good sleep</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Monthly Statistics */}
              <div className="space-y-4">
                <h3 className="text-base lg:text-lg font-medium text-slate-900">Monthly Overview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                  {monthlyStats.map((stat, index) => (
                    <div key={index} className="p-3 lg:p-4 border border-slate-200 rounded-lg">
                      <div className="space-y-2">
                        <span className="text-xs lg:text-sm font-medium text-slate-700">{stat.label}</span>
                        <div className="flex items-center justify-between">
                          <span className="text-lg lg:text-xl font-semibold text-slate-900">{stat.value}</span>
                        </div>
                        <p className="text-xs text-emerald-600">{stat.change}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Quick Stats & Weather Correlation */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                <div className="text-center p-3 lg:p-4 bg-slate-50 rounded-lg">
                  <Footprints className="h-5 w-5 lg:h-6 lg:w-6 text-slate-600 mx-auto mb-2" />
                  <p className="text-lg lg:text-2xl font-semibold text-slate-900">8,247</p>
                  <p className="text-xs text-slate-600">Steps today</p>
                  <p className="text-xs text-emerald-600">+12% vs avg</p>
                </div>
                <div className="text-center p-3 lg:p-4 bg-slate-50 rounded-lg">
                  <Timer className="h-5 w-5 lg:h-6 lg:w-6 text-slate-600 mx-auto mb-2" />
                  <p className="text-lg lg:text-2xl font-semibold text-slate-900">45</p>
                  <p className="text-xs text-slate-600">Active minutes</p>
                  <p className="text-xs text-blue-600">Goal: 60 min</p>
                </div>
                <div className="text-center p-3 lg:p-4 bg-slate-50 rounded-lg">
                  <Coffee className="h-5 w-5 lg:h-6 lg:w-6 text-slate-600 mx-auto mb-2" />
                  <p className="text-lg lg:text-2xl font-semibold text-slate-900">2</p>
                  <p className="text-xs text-slate-600">Caffeine intake</p>
                  <p className="text-xs text-amber-600">Moderate level</p>
                </div>
                <div className="text-center p-3 lg:p-4 bg-amber-50 rounded-lg">
                  <Sun className="h-5 w-5 lg:h-6 lg:w-6 text-amber-600 mx-auto mb-2" />
                  <p className="text-xs lg:text-sm font-medium text-amber-900">Weather Impact</p>
                  <p className="text-xs text-amber-800">+20% mood on sunny days</p>
                  <p className="text-xs text-amber-700">UV index: 6 (High)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Check-in */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-lg lg:text-xl font-semibold text-slate-900">Quick Check-in</CardTitle>
                  <p className="text-xs lg:text-sm text-slate-600">How are you feeling right now?</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setQuickCheckExpanded(!quickCheckExpanded)}>
                  {quickCheckExpanded ? "Collapse" : "Expand"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 lg:space-y-6">
              {!quickCheckExpanded ? (
                /* Collapsed Quick Check-in */
                <div className="space-y-6">
                  <div className="flex justify-center space-x-3 sm:space-x-4">
                    {moodEmojis.map((emoji, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="lg"
                        className="w-14 h-14 sm:w-16 sm:h-16 text-2xl border-slate-200 hover:bg-slate-50 bg-transparent touch-manipulation"
                        onClick={() => {
                          setMoodValue([index + 1])
                          setQuickCheckExpanded(true)
                        }}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                  <div className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-500 touch-manipulation"
                      onClick={() => setQuickCheckExpanded(true)}
                    >
                      Add more details
                    </Button>
                  </div>
                </div>
              ) : (
                /* Expanded Quick Check-in */
                <div className="space-y-6 lg:space-y-8">
                  {/* Mood Scale */}
                  <div className="space-y-4">
                    <label className="text-xs lg:text-sm font-medium text-slate-700">Mood (1-5 scale)</label>
                    <div className="flex items-center space-x-4">
                      <span className="text-xl lg:text-2xl">{moodEmojis[moodValue[0] - 1]}</span>
                      <Slider
                        value={moodValue}
                        onValueChange={setMoodValue}
                        max={5}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs lg:text-sm font-medium text-slate-900 w-8">{moodValue[0]}/5</span>
                    </div>
                  </div>

                  {/* Energy Level */}
                  <div className="space-y-4">
                    <label className="text-xs lg:text-sm font-medium text-slate-700">Energy Level (1-10 scale)</label>
                    <div className="flex items-center space-x-4">
                      <Zap className="h-4 w-4 lg:h-5 lg:w-5 text-slate-500" />
                      <Slider
                        value={energyValue}
                        onValueChange={setEnergyValue}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs lg:text-sm font-medium text-slate-900 w-12">{energyValue[0]}/10</span>
                    </div>
                  </div>

                  {/* Anxiety Level */}
                  <div className="space-y-4">
                    <label className="text-xs lg:text-sm font-medium text-slate-700">Anxiety Level</label>
                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                      {anxietyLevels.map((level) => (
                        <Button
                          key={level.value}
                          variant={anxietyLevel === level.value ? "default" : "outline"}
                          size="sm"
                          className={`flex-1 ${anxietyLevel === level.value ? level.color : "border-slate-200 hover:bg-slate-50"}`}
                          onClick={() => setAnxietyLevel(level.value)}
                        >
                          {level.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Sleep Quality */}
                  <div className="space-y-4">
                    <label className="text-xs lg:text-sm font-medium text-slate-700">Sleep Quality (last night)</label>
                    <div className="flex justify-center space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          variant="ghost"
                          size="sm"
                          className="p-1"
                          onClick={() => setSleepRating(rating)}
                        >
                          <Star
                            className={`w-5 h-5 lg:w-6 lg:h-6 ${
                              rating <= sleepRating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                            }`}
                          />
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Emotion Picker */}
                  <div className="space-y-4">
                    <label className="text-xs lg:text-sm font-medium text-slate-700">How are you feeling?</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {emotions.map((emotion) => (
                        <Button
                          key={emotion}
                          variant={selectedEmotion === emotion ? "default" : "outline"}
                          size="sm"
                          className="text-xs border-slate-200 hover:bg-slate-50"
                          onClick={() => setSelectedEmotion(emotion)}
                        >
                          {emotion}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Note */}
                  <div className="space-y-4">
                    <label className="text-xs lg:text-sm font-medium text-slate-700">
                      Anything specific? (optional)
                    </label>
                    <Textarea
                      placeholder="Brief note about your current state..."
                      value={quickNote}
                      onChange={(e) => setQuickNote(e.target.value)}
                      maxLength={150}
                      className="resize-none border-slate-200"
                    />
                    <p className="text-xs text-slate-500 text-right">{quickNote.length}/150</p>
                  </div>

                  {/* Physical Symptoms */}
                  <div className="space-y-4">
                    <label className="text-xs lg:text-sm font-medium text-slate-700">Physical symptoms</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {physicalSymptoms.map((symptom) => (
                        <div key={symptom.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={symptom.id}
                            checked={selectedSymptoms.includes(symptom.id)}
                            onCheckedChange={(checked) => handleSymptomChange(symptom.id, checked as boolean)}
                          />
                          <label htmlFor={symptom.id} className="text-xs lg:text-sm text-slate-700 cursor-pointer">
                            {symptom.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trigger Identification */}
                  <div className="space-y-4">
                    <label className="text-xs lg:text-sm font-medium text-slate-700">
                      What influenced your mood today?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        "Work stress",
                        "Relationships",
                        "Health",
                        "Weather",
                        "Sleep",
                        "Exercise",
                        "Social media",
                        "News",
                        "Other",
                      ].map((trigger) => (
                        <Button
                          key={trigger}
                          variant="outline"
                          size="sm"
                          className="text-xs border-slate-200 hover:bg-slate-50 bg-transparent"
                        >
                          {trigger}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button onClick={handleQuickCheckSubmit} className="flex-1">
                      Submit Check-in
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setQuickCheckExpanded(false)}
                      className="flex-1 sm:flex-none"
                    >
                      Skip for now
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-4 lg:pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-lg lg:text-xl font-semibold text-slate-900">Recent Activities</CardTitle>
                  <p className="text-xs lg:text-sm text-slate-600">Your wellness journey over the past week</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowAllActivities(!showAllActivities)}>
                    {showAllActivities ? "Show less" : "View all"}
                    <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4 ml-1" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Filter className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(showAllActivities ? recentActivities : recentActivities.slice(0, 5)).map((activity, index) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer touch-manipulation"
                  >
                    <div className={`p-2 rounded-lg bg-slate-50 ${activity.color} flex-shrink-0`}>
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex flex-col gap-1">
                        <h4 className="text-sm font-medium text-slate-900 leading-tight">{activity.title}</h4>
                        <span className="text-xs text-slate-500">{activity.time}</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{activity.description}</p>
                      {activity.actionable && (
                        <div className="flex flex-col gap-2 mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs text-slate-500 justify-start p-0 touch-manipulation"
                          >
                            {activity.type === "exercise" ? "Do this exercise again" : "View details"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs text-slate-500 justify-start p-0 touch-manipulation"
                          >
                            Share with therapist
                          </Button>
                        </div>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0 mt-1" />
                  </div>
                ))}
              </div>

              {/* Upcoming Reminders */}
              <div className="mt-6 lg:mt-8 space-y-4">
                <h4 className="text-base lg:text-lg font-medium text-slate-900">Upcoming Reminders</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {upcomingReminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <div>
                        <p className="text-xs lg:text-sm font-medium text-blue-900">{reminder.title}</p>
                        <p className="text-xs text-blue-700">{reminder.time}</p>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs bg-transparent w-full sm:w-auto">
                        {reminder.type === "session" ? "Reschedule" : "Snooze"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Insights */}
              <div className="mt-6 lg:mt-8 p-3 lg:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-xs lg:text-sm font-medium text-blue-900">Weekly Insight</h4>
                    <p className="text-xs lg:text-sm text-blue-800 mt-1">
                      Your mood improved by 40% after journaling sessions this week. Your most productive therapy
                      sessions occur on Wednesdays. Consider scheduling important discussions then.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 mt-3">
                      <Button size="sm" variant="outline" className="text-xs bg-transparent">
                        View detailed analysis
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs bg-transparent">
                        Share with Dr. Smith
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
