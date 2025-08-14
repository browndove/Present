"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Search,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  Send,
  Plus,
  MessageSquare,
  AlertTriangle,
  Clock,
  Target,
  BookOpen,
  CheckCircle,
  XCircle,
  User,
  Brain,
  Heart,
  Activity,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Types (same as before)
interface Student {
  id: string
  name: string
  email: string
  avatar: string
  year: string
  major: string
  status: "active" | "at-risk" | "improving" | "stable"
  lastSession: Date
  nextSession?: Date
  totalSessions: number
  currentMoodAverage: number
  moodTrend: "up" | "down" | "stable"
  riskLevel: "low" | "medium" | "high" | "critical"
  lastActive: Date
  completedAssignments: number
  pendingAssignments: number
  notes: CounselorNote[]
  assignments: Assignment[]
  recentActivity: ActivityEntry[]
  weeklyMoodSummary: {
    excellent: number
    good: number
    neutral: number
    poor: number
    veryPoor: number
  }
  monthlyProgress: {
    improving: boolean
    stable: boolean
    declining: boolean
    streakDays: number
  }
}

interface CounselorNote {
  id: string
  content: string
  createdAt: Date
  type: "session" | "observation" | "concern" | "progress"
  isPrivate: boolean
}

interface Assignment {
  id: string
  title: string
  description: string
  type: "reflection" | "exercise" | "reading" | "goal-setting" | "mindfulness"
  dueDate: Date
  status: "pending" | "in-progress" | "completed" | "overdue"
  createdAt: Date
  completedAt?: Date
  studentResponse?: string
}

interface ActivityEntry {
  id: string
  type: "mood_entry" | "assignment_completed" | "session_attended" | "message_sent"
  description: string
  timestamp: Date
  impact: "positive" | "negative" | "neutral"
}

// Mock Data with calm analytics
const mockStudents: Student[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@university.edu",
    avatar: "/placeholder.svg?height=40&width=40",
    year: "Junior",
    major: "Psychology",
    status: "improving",
    lastSession: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    nextSession: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    totalSessions: 8,
    currentMoodAverage: 3.8,
    moodTrend: "up",
    riskLevel: "low",
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    completedAssignments: 12,
    pendingAssignments: 2,
    weeklyMoodSummary: {
      excellent: 2,
      good: 3,
      neutral: 1,
      poor: 1,
      veryPoor: 0,
    },
    monthlyProgress: {
      improving: true,
      stable: false,
      declining: false,
      streakDays: 12,
    },
    notes: [
      {
        id: "n1",
        content: "Student showing significant improvement in anxiety management. Coping strategies are working well.",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        type: "progress",
        isPrivate: false,
      },
      {
        id: "n2",
        content: "Discussed upcoming midterms. Student feels more prepared this semester.",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        type: "session",
        isPrivate: false,
      },
    ],
    assignments: [
      {
        id: "a1",
        title: "Daily Gratitude Journal",
        description: "Write down 3 things you're grateful for each day",
        type: "reflection",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: "in-progress",
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
      {
        id: "a2",
        title: "Mindfulness Exercise",
        description: "Practice 10-minute daily meditation",
        type: "mindfulness",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: "pending",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    ],
    recentActivity: [
      {
        id: "act1",
        type: "mood_entry",
        description: "Logged mood: Happy (4/5)",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        impact: "positive",
      },
      {
        id: "act2",
        type: "assignment_completed",
        description: "Completed reflection exercise",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        impact: "positive",
      },
    ],
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@university.edu",
    avatar: "/placeholder.svg?height=40&width=40",
    year: "Senior",
    major: "Computer Science",
    status: "at-risk",
    lastSession: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    nextSession: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    totalSessions: 12,
    currentMoodAverage: 2.3,
    moodTrend: "down",
    riskLevel: "high",
    lastActive: new Date(Date.now() - 6 * 60 * 60 * 1000),
    completedAssignments: 5,
    pendingAssignments: 4,
    weeklyMoodSummary: {
      excellent: 0,
      good: 1,
      neutral: 2,
      poor: 3,
      veryPoor: 1,
    },
    monthlyProgress: {
      improving: false,
      stable: false,
      declining: true,
      streakDays: 3,
    },
    notes: [
      {
        id: "n3",
        content: "Student expressing increased stress about graduation and job search. Needs additional support.",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        type: "concern",
        isPrivate: true,
      },
    ],
    assignments: [
      {
        id: "a3",
        title: "Stress Management Plan",
        description: "Develop a personalized stress management strategy",
        type: "goal-setting",
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: "overdue",
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    ],
    recentActivity: [
      {
        id: "act3",
        type: "mood_entry",
        description: "Logged mood: Sad (2/5)",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        impact: "negative",
      },
    ],
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    email: "e.rodriguez@university.edu",
    avatar: "/placeholder.svg?height=40&width=40",
    year: "Sophomore",
    major: "Biology",
    status: "stable",
    lastSession: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    totalSessions: 5,
    currentMoodAverage: 4.1,
    moodTrend: "stable",
    riskLevel: "low",
    lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
    completedAssignments: 8,
    pendingAssignments: 1,
    weeklyMoodSummary: {
      excellent: 3,
      good: 3,
      neutral: 1,
      poor: 0,
      veryPoor: 0,
    },
    monthlyProgress: {
      improving: false,
      stable: true,
      declining: false,
      streakDays: 21,
    },
    notes: [],
    assignments: [],
    recentActivity: [],
  },
]

export default function StudentMonitoringPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [newNote, setNewNote] = useState("")
  const [noteType, setNoteType] = useState<CounselorNote["type"]>("observation")
  const [isNotePrivate, setIsNotePrivate] = useState(false)
  const [showNewAssignmentDialog, setShowNewAssignmentDialog] = useState(false)
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    type: "reflection" as Assignment["type"],
    dueDate: "",
  })
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [messageContent, setMessageContent] = useState("")
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setShowMobileSidebar(false)
      }
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Filter students based on search
  const filteredStudents = mockStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.major.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedStudent) return

    const note: CounselorNote = {
      id: Date.now().toString(),
      content: newNote,
      createdAt: new Date(),
      type: noteType,
      isPrivate: isNotePrivate,
    }

    selectedStudent.notes.unshift(note)
    setNewNote("")
  }

  const handleCreateAssignment = () => {
    if (!newAssignment.title.trim() || !selectedStudent) return

    const assignment: Assignment = {
      id: Date.now().toString(),
      title: newAssignment.title,
      description: newAssignment.description,
      type: newAssignment.type,
      dueDate: new Date(newAssignment.dueDate),
      status: "pending",
      createdAt: new Date(),
    }

    selectedStudent.assignments.push(assignment)
    selectedStudent.pendingAssignments++

    setNewAssignment({
      title: "",
      description: "",
      type: "reflection",
      dueDate: "",
    })
    setShowNewAssignmentDialog(false)
  }

  const handleSendMessage = () => {
    if (!messageContent.trim()) return
    console.log("Sending message:", messageContent)
    setMessageContent("")
    setShowMessageDialog(false)
  }

  const getStatusColor = (status: Student["status"]) => {
    switch (status) {
      case "improving":
        return "bg-green-100 text-green-800"
      case "stable":
        return "bg-blue-100 text-blue-800"
      case "at-risk":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskColor = (risk: Student["riskLevel"]) => {
    switch (risk) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTrendIcon = (trend: Student["moodTrend"]) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const formatDateShort = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isMobile && (
                <Button variant="ghost" size="sm" onClick={() => setShowMobileSidebar(true)} className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Student Monitoring</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Track student progress and provide support</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Badge variant="secondary" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
                {filteredStudents.length} Students
              </Badge>
              <Badge variant="secondary" className="px-2 sm:px-3 py-1 text-xs sm:text-sm hidden sm:inline-flex">
                {filteredStudents.filter((s) => s.riskLevel === "high" || s.riskLevel === "critical").length} At Risk
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Mobile Sidebar Overlay */}
        {isMobile && showMobileSidebar && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowMobileSidebar(false)} />
        )}

        {/* Student List Sidebar */}
        <div
          className={cn(
            "bg-white border-r flex flex-col transition-transform duration-300",
            isMobile ? "fixed inset-y-0 left-0 z-50 w-80 transform" : "w-80",
            isMobile && !showMobileSidebar && "-translate-x-full",
            isMobile && showMobileSidebar && "translate-x-0",
          )}
        >
          {/* Mobile Header */}
          {isMobile && (
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Students</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowMobileSidebar(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Student List */}
          <div className="flex-1 overflow-y-auto">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className={cn(
                  "p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors",
                  selectedStudent?.id === student.id && "bg-blue-50 border-blue-200",
                )}
                onClick={() => {
                  setSelectedStudent(student)
                  if (isMobile) {
                    setShowMobileSidebar(false)
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={student.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 truncate">{student.name}</h3>
                      {student.riskLevel === "high" || student.riskLevel === "critical" ? (
                        <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      ) : null}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600 truncate">
                        {student.year} • {student.major}
                      </p>
                      <Badge className={getStatusColor(student.status)} variant="secondary">
                        {student.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        {getTrendIcon(student.moodTrend)}
                        <span>{student.currentMoodAverage.toFixed(1)}/5</span>
                      </div>
                      <span className="truncate ml-2">{formatDateShort(student.lastActive)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {selectedStudent ? (
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Student Header */}
              <div className="bg-white rounded-lg p-4 sm:p-6 border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-4">
                    {isMobile && (
                      <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(null)} className="md:hidden">
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                    )}
                    <Avatar className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0">
                      <AvatarImage src={selectedStudent.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-lg">
                        {selectedStudent.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{selectedStudent.name}</h2>
                      <p className="text-gray-600 truncate">
                        {selectedStudent.year} • {selectedStudent.major}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{selectedStudent.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="gap-2 bg-transparent">
                          <MessageSquare className="h-4 w-4" />
                          <span className="hidden sm:inline">Message</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-[95vw] max-w-md mx-auto">
                        <DialogHeader>
                          <DialogTitle>Send Message to {selectedStudent.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            placeholder="Type your message..."
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                            rows={4}
                          />
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSendMessage}>
                              <Send className="h-4 w-4 mr-2" />
                              Send
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button className="gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="hidden sm:inline">Schedule Session</span>
                      <span className="sm:hidden">Schedule</span>
                    </Button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Heart className="h-4 w-4 text-gray-600" />
                      <span className="text-xs sm:text-sm font-medium text-gray-600">Current Mood</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-lg sm:text-2xl font-bold text-gray-900">
                        {selectedStudent.currentMoodAverage.toFixed(1)}
                      </span>
                      <span className="text-gray-500 text-sm">/5</span>
                      {getTrendIcon(selectedStudent.moodTrend)}
                    </div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-gray-600" />
                      <span className="text-xs sm:text-sm font-medium text-gray-600">Risk Level</span>
                    </div>
                    <Badge className={getRiskColor(selectedStudent.riskLevel)} variant="secondary">
                      {selectedStudent.riskLevel}
                    </Badge>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <User className="h-4 w-4 text-gray-600" />
                      <span className="text-xs sm:text-sm font-medium text-gray-600">Sessions</span>
                    </div>
                    <span className="text-lg sm:text-2xl font-bold text-gray-900">{selectedStudent.totalSessions}</span>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-gray-600" />
                      <span className="text-xs sm:text-sm font-medium text-gray-600">Assignments</span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      {selectedStudent.completedAssignments} done, {selectedStudent.pendingAssignments} pending
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Calm Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Brain className="h-5 w-5" />
                      Mood Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Weekly Summary */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">
                        This Week's Mood Distribution
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Excellent Days</span>
                          <span className="font-medium">{selectedStudent.weeklyMoodSummary.excellent}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Good Days</span>
                          <span className="font-medium">{selectedStudent.weeklyMoodSummary.good}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Neutral Days</span>
                          <span className="font-medium">{selectedStudent.weeklyMoodSummary.neutral}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Difficult Days</span>
                          <span className="font-medium">{selectedStudent.weeklyMoodSummary.poor}</span>
                        </div>
                        {selectedStudent.weeklyMoodSummary.veryPoor > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Very Difficult Days</span>
                            <span className="font-medium text-red-600">
                              {selectedStudent.weeklyMoodSummary.veryPoor}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress Indicators */}
                    <div className="pt-4 border-t">
                      <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Monthly Progress</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-3 h-3 rounded-full",
                              selectedStudent.monthlyProgress.improving && "bg-green-500",
                              selectedStudent.monthlyProgress.stable && "bg-blue-500",
                              selectedStudent.monthlyProgress.declining && "bg-red-500",
                            )}
                          />
                          <span className="text-sm text-gray-700">
                            {selectedStudent.monthlyProgress.improving && "Showing improvement"}
                            {selectedStudent.monthlyProgress.stable && "Maintaining stability"}
                            {selectedStudent.monthlyProgress.declining && "Needs attention"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Check-in Streak</span>
                          <span className="font-medium">{selectedStudent.monthlyProgress.streakDays} days</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Activity className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedStudent.recentActivity.length > 0 ? (
                        selectedStudent.recentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                                activity.impact === "positive" && "bg-green-500",
                                activity.impact === "negative" && "bg-red-500",
                                activity.impact === "neutral" && "bg-gray-500",
                              )}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 break-words">{activity.description}</p>
                              <p className="text-xs text-gray-500 mt-1">{formatDate(activity.timestamp)}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-8 text-sm">No recent activity</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Counselor Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <FileText className="h-5 w-5" />
                      Counselor Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Add New Note */}
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Add a note about this student..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          rows={3}
                          className="resize-none"
                        />
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <Select value={noteType} onValueChange={(value: any) => setNoteType(value)}>
                              <SelectTrigger className="w-full sm:w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="session">Session</SelectItem>
                                <SelectItem value="observation">Observation</SelectItem>
                                <SelectItem value="concern">Concern</SelectItem>
                                <SelectItem value="progress">Progress</SelectItem>
                              </SelectContent>
                            </Select>
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={isNotePrivate}
                                onChange={(e) => setIsNotePrivate(e.target.checked)}
                                className="rounded"
                              />
                              Private
                            </label>
                          </div>
                          <Button onClick={handleAddNote} disabled={!newNote.trim()} className="w-full sm:w-auto">
                            Add Note
                          </Button>
                        </div>
                      </div>

                      {/* Notes List */}
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {selectedStudent.notes.map((note) => (
                          <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                              <Badge variant="outline" className="text-xs w-fit">
                                {note.type}
                              </Badge>
                              <div className="flex items-center gap-2">
                                {note.isPrivate && (
                                  <Badge variant="secondary" className="text-xs">
                                    Private
                                  </Badge>
                                )}
                                <span className="text-xs text-gray-500">{formatDate(note.createdAt)}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-900 break-words">{note.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Assignments */}
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <Target className="h-5 w-5" />
                        Assignments
                      </CardTitle>
                      <Dialog open={showNewAssignmentDialog} onOpenChange={setShowNewAssignmentDialog}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="gap-2 w-full sm:w-auto">
                            <Plus className="h-4 w-4" />
                            New Assignment
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[95vw] max-w-md mx-auto">
                          <DialogHeader>
                            <DialogTitle>Create New Assignment</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Title</Label>
                              <Input
                                value={newAssignment.title}
                                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                                placeholder="Assignment title"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea
                                value={newAssignment.description}
                                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                                placeholder="Assignment description"
                                rows={3}
                                className="resize-none"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Type</Label>
                              <Select
                                value={newAssignment.type}
                                onValueChange={(value: any) => setNewAssignment({ ...newAssignment, type: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="reflection">Reflection</SelectItem>
                                  <SelectItem value="exercise">Exercise</SelectItem>
                                  <SelectItem value="reading">Reading</SelectItem>
                                  <SelectItem value="goal-setting">Goal Setting</SelectItem>
                                  <SelectItem value="mindfulness">Mindfulness</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Due Date</Label>
                              <Input
                                type="date"
                                value={newAssignment.dueDate}
                                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                                min={new Date().toISOString().split("T")[0]}
                              />
                            </div>
                            <div className="flex flex-col sm:flex-row justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setShowNewAssignmentDialog(false)}
                                className="w-full sm:w-auto"
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleCreateAssignment} className="w-full sm:w-auto">
                                Create Assignment
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedStudent.assignments.length > 0 ? (
                        selectedStudent.assignments.map((assignment) => (
                          <div key={assignment.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                              <h4 className="font-medium text-gray-900 break-words">{assignment.title}</h4>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "w-fit",
                                  assignment.status === "completed" && "bg-green-100 text-green-800",
                                  assignment.status === "overdue" && "bg-red-100 text-red-800",
                                  assignment.status === "in-progress" && "bg-blue-100 text-blue-800",
                                  assignment.status === "pending" && "bg-gray-100 text-gray-800",
                                )}
                              >
                                {assignment.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                                {assignment.status === "overdue" && <XCircle className="h-3 w-3 mr-1" />}
                                {assignment.status === "in-progress" && <Clock className="h-3 w-3 mr-1" />}
                                {assignment.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2 break-words">{assignment.description}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 gap-1">
                              <span className="capitalize">{assignment.type}</span>
                              <span>Due: {assignment.dueDate.toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-8 text-sm">No assignments yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-4">
              <div className="text-center">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Student</h3>
                <p className="text-gray-500 text-sm sm:text-base">
                  Choose a student from the list to view their details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
