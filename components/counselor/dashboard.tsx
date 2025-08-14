"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Types
interface Student {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  studentId: string
  year: string
  major: string
  gpa: number
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  riskLevel: "low" | "medium" | "high" | "crisis"
  status: "active" | "monitoring" | "closed"
  lastSession: Date
  totalSessions: number
  nextAppointment?: Date
  progressScore: number
  attendanceRate: number
}

interface Session {
  id: string
  studentId: string
  counselorId: string
  date: Date
  duration: number
  type: "individual" | "group" | "crisis" | "intake"
  status: "scheduled" | "completed" | "cancelled" | "no-show"
  notes?: string
  goals: string[]
  interventions: string[]
  homework?: string
  nextSteps?: string
}

// Mock Data
const mockStudents: Student[] = [
  {
    id: "student1",
    name: "Sarah Johnson",
    email: "sarah.j@university.edu",
    phone: "(555) 123-4567",
    avatar: "/placeholder.svg?height=40&width=40",
    studentId: "SJ2024001",
    year: "Junior",
    major: "Psychology",
    gpa: 3.2,
    emergencyContact: {
      name: "Mary Johnson",
      relationship: "Mother",
      phone: "(555) 987-6543",
    },
    riskLevel: "medium",
    status: "active",
    lastSession: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    totalSessions: 8,
    nextAppointment: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    progressScore: 75,
    attendanceRate: 88,
  },
  {
    id: "student2",
    name: "Michael Chen",
    email: "m.chen@university.edu",
    phone: "(555) 234-5678",
    avatar: "/placeholder.svg?height=40&width=40",
    studentId: "MC2024002",
    year: "Senior",
    major: "Computer Science",
    gpa: 2.8,
    emergencyContact: {
      name: "David Chen",
      relationship: "Father",
      phone: "(555) 876-5432",
    },
    riskLevel: "high",
    status: "active",
    lastSession: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    totalSessions: 12,
    nextAppointment: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    progressScore: 45,
    attendanceRate: 67,
  },
  {
    id: "student3",
    name: "Emma Rodriguez",
    email: "e.rodriguez@university.edu",
    phone: "(555) 345-6789",
    avatar: "/placeholder.svg?height=40&width=40",
    studentId: "ER2024003",
    year: "Sophomore",
    major: "Biology",
    gpa: 3.7,
    emergencyContact: {
      name: "Carlos Rodriguez",
      relationship: "Father",
      phone: "(555) 765-4321",
    },
    riskLevel: "low",
    status: "monitoring",
    lastSession: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    totalSessions: 5,
    progressScore: 92,
    attendanceRate: 100,
  },
  {
    id: "student4",
    name: "James Wilson",
    email: "j.wilson@university.edu",
    phone: "(555) 456-7890",
    avatar: "/placeholder.svg?height=40&width=40",
    studentId: "JW2024004",
    year: "Freshman",
    major: "Engineering",
    gpa: 2.1,
    emergencyContact: {
      name: "Patricia Wilson",
      relationship: "Mother",
      phone: "(555) 654-3210",
    },
    riskLevel: "crisis",
    status: "active",
    lastSession: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    totalSessions: 15,
    nextAppointment: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    progressScore: 30,
    attendanceRate: 73,
  },
]

const mockSessions: Session[] = [
  {
    id: "session1",
    studentId: "student1",
    counselorId: "counselor1",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    duration: 50,
    type: "individual",
    status: "scheduled",
    goals: ["Improve study habits", "Manage anxiety"],
    interventions: ["CBT techniques", "Mindfulness exercises"],
  },
  {
    id: "session2",
    studentId: "student2",
    counselorId: "counselor1",
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    duration: 50,
    type: "individual",
    status: "scheduled",
    goals: ["Academic planning", "Stress management"],
    interventions: ["Goal setting", "Time management"],
  },
  {
    id: "session3",
    studentId: "student4",
    counselorId: "counselor1",
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    duration: 50,
    type: "crisis",
    status: "scheduled",
    goals: ["Crisis intervention", "Safety planning"],
    interventions: ["Crisis counseling", "Support network activation"],
  },
]

// Mock data for enhanced reporting
const monthlyData = [
  { month: "Jan", sessions: 45, newStudents: 8, crisisInterventions: 2 },
  { month: "Feb", sessions: 52, newStudents: 12, crisisInterventions: 1 },
  { month: "Mar", sessions: 48, newStudents: 6, crisisInterventions: 3 },
  { month: "Apr", sessions: 61, newStudents: 15, crisisInterventions: 2 },
  { month: "May", sessions: 38, newStudents: 4, crisisInterventions: 1 },
  { month: "Jun", sessions: 29, newStudents: 2, crisisInterventions: 0 },
]

const interventionTypes = [
  { type: "Cognitive Behavioral Therapy", count: 45, percentage: 35 },
  { type: "Crisis Intervention", count: 28, percentage: 22 },
  { type: "Academic Counseling", count: 22, percentage: 17 },
  { type: "Anxiety Management", count: 18, percentage: 14 },
  { type: "Depression Support", count: 15, percentage: 12 },
]

const outcomeMetrics = [
  { metric: "Students Showing Improvement", current: 78, previous: 72, trend: "up" },
  { metric: "Average Session Attendance", current: 85, previous: 82, trend: "up" },
  { metric: "Crisis Interventions", current: 6, previous: 9, trend: "down" },
  { metric: "Student Retention Rate", current: 94, previous: 91, trend: "up" },
  
  { metric: "Referral Success Rate", current: 89, previous: 85, trend: "up" },
]

export default function CounselorsDashboard() {
  // State
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterRisk, setFilterRisk] = useState<string>("all")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedReportPeriod, setSelectedReportPeriod] = useState("current-month")

  // Data state
  const [students] = useState<Student[]>(mockStudents)
  const [sessions] = useState<Session[]>(mockSessions)

  // Helper functions
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "crisis":
        return "bg-red-50 text-red-800 border-red-200"
      case "high":
        return "bg-orange-50 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-50 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-50 text-green-800 border-green-200"
      default:
        return "bg-gray-50 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-50 text-blue-800"
      case "monitoring":
        return "bg-purple-50 text-purple-800"
      case "closed":
        return "bg-gray-50 text-gray-800"
      default:
        return "bg-gray-50 text-gray-800"
    }
  }

  const getSessionStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-50 text-blue-800"
      case "completed":
        return "bg-green-50 text-green-800"
      case "cancelled":
        return "bg-red-50 text-red-800"
      case "no-show":
        return "bg-orange-50 text-orange-800"
      default:
        return "bg-gray-50 text-gray-800"
    }
  }

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getSessionsForDate = (date: Date) => {
    return sessions.filter((session) => {
      const sessionDate = new Date(session.date)
      return sessionDate.toDateString() === date.toDateString()
    })
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || student.status === filterStatus
    const matchesRisk = filterRisk === "all" || student.riskLevel === filterRisk

    return matchesSearch && matchesStatus && matchesRisk
  })

  // Stats calculations
  const totalStudents = students.length
  const activeStudents = students.filter((s) => s.status === "active").length
  const highRiskStudents = students.filter((s) => s.riskLevel === "high" || s.riskLevel === "crisis").length
  const todaySessions = sessions.filter((s) => {
    const today = new Date()
    const sessionDate = new Date(s.date)
    return sessionDate.toDateString() === today.toDateString()
  }).length

  const averageProgress = Math.round(students.reduce((acc, s) => acc + s.progressScore, 0) / students.length)
  const averageAttendance = Math.round(students.reduce((acc, s) => acc + s.attendanceRate, 0) / students.length)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Counselor Dashboard</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Dr. Jennifer Martinez • Student Counseling Services
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{formatDate(new Date())}</p>
                <p className="text-sm text-gray-500">{todaySessions} sessions today</p>
              </div>
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback className="bg-gray-600 text-white font-semibold">JM</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 sm:space-y-12">
        {/* Breadcrumb */}
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <span className="text-gray-500">Student Services</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Counselor Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Calendar Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Schedule</h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Manage your counseling sessions and appointments
              </p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              >
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              >
                Next
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader className="bg-gray-900 text-white">
              <CardTitle className="text-lg sm:text-xl">
                {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div
                    key={day}
                    className="bg-gray-100 p-2 sm:p-4 text-center text-xs sm:text-sm font-medium text-gray-700"
                  >
                    <span className="hidden sm:inline">
                      {day === "Sun"
                        ? "Sunday"
                        : day === "Mon"
                          ? "Monday"
                          : day === "Tue"
                            ? "Tuesday"
                            : day === "Wed"
                              ? "Wednesday"
                              : day === "Thu"
                                ? "Thursday"
                                : day === "Fri"
                                  ? "Friday"
                                  : "Saturday"}
                    </span>
                    <span className="sm:hidden">{day}</span>
                  </div>
                ))}
                {getDaysInMonth(currentMonth).map((date, index) => {
                  if (!date) {
                    return <div key={index} className="bg-white p-2 sm:p-4 h-16 sm:h-28"></div>
                  }

                  const daysSessions = getSessionsForDate(date)
                  const isToday = date.toDateString() === new Date().toDateString()

                  return (
                    <div
                      key={index}
                      className={cn(
                        "bg-white p-2 sm:p-4 h-16 sm:h-28 cursor-pointer hover:bg-gray-50 transition-colors",
                        isToday && "bg-blue-50 ring-1 ring-blue-200",
                      )}
                      onClick={() => setSelectedDate(date)}
                    >
                      <div className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-gray-900">
                        {date.getDate()}
                      </div>
                      <div className="space-y-1 hidden sm:block">
                        {daysSessions.slice(0, 2).map((session) => {
                          const student = students.find((s) => s.id === session.studentId)
                          return (
                            <div
                              key={session.id}
                              className={cn(
                                "text-xs p-1 rounded truncate border",
                                getSessionStatusColor(session.status),
                              )}
                            >
                              {formatTime(new Date(session.date))} - {student?.name}
                            </div>
                          )
                        })}
                        {daysSessions.length > 2 && (
                          <div className="text-xs text-gray-500">+{daysSessions.length - 2} more</div>
                        )}
                      </div>
                      {daysSessions.length > 0 && (
                        <div className="sm:hidden">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Analytics Overview */}
        <section>
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Analytics Overview</h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Key performance indicators and student progress metrics
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="text-center">
                  <p className="text-2xl sm:text-4xl font-bold text-gray-900">{totalStudents}</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 font-medium">Total Students</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="text-center">
                  <p className="text-2xl sm:text-4xl font-bold text-blue-600">{activeStudents}</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 font-medium">Active Cases</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="text-center">
                  <p className="text-2xl sm:text-4xl font-bold text-red-600">{highRiskStudents}</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 font-medium">High Risk</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="text-center">
                  <p className="text-2xl sm:text-4xl font-bold text-green-600">{averageProgress}%</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 font-medium">Avg Progress</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card>
              <CardHeader className="bg-gray-100">
                <CardTitle className="text-base sm:text-lg">Student Progress Distribution</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Excellent (80-100%)</span>
                      <span className="font-bold">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                      <div className="bg-green-600 h-2 sm:h-3 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Good (60-79%)</span>
                      <span className="font-bold">40%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                      <div className="bg-blue-600 h-2 sm:h-3 rounded-full" style={{ width: "40%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Moderate (40-59%)</span>
                      <span className="font-bold">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                      <div className="bg-yellow-600 h-2 sm:h-3 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Needs Attention (0-39%)</span>
                      <span className="font-bold">10%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                      <div className="bg-red-600 h-2 sm:h-3 rounded-full" style={{ width: "10%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-gray-100">
                <CardTitle className="text-base sm:text-lg">Risk Level Distribution</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Low Risk</span>
                      <span className="font-bold">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                      <div className="bg-green-600 h-2 sm:h-3 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Medium Risk</span>
                      <span className="font-bold">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                      <div className="bg-yellow-600 h-2 sm:h-3 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">High Risk</span>
                      <span className="font-bold">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                      <div className="bg-orange-600 h-2 sm:h-3 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Crisis</span>
                      <span className="font-bold">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                      <div className="bg-red-600 h-2 sm:h-3 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-gray-100">
                <CardTitle className="text-base sm:text-lg">Session Attendance</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Attended</span>
                      <span className="font-bold">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                      <div className="bg-green-600 h-2 sm:h-3 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Cancelled</span>
                      <span className="font-bold">10%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                      <div className="bg-yellow-600 h-2 sm:h-3 rounded-full" style={{ width: "10%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">No Show</span>
                      <span className="font-bold">5%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                      <div className="bg-red-600 h-2 sm:h-3 rounded-full" style={{ width: "5%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Student Records */}
        <section>
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Student Records</h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Comprehensive student profiles and case management
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6 sm:mb-8">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="monitoring">Monitoring</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterRisk} onValueChange={setFilterRisk}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Risk Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="crisis">Crisis</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="w-full sm:w-auto">Add Student</Button>
              </div>
            </CardContent>
          </Card>

          {/* Students Table */}
          <Card>
            <CardHeader className="bg-gray-900 text-white">
              <CardTitle className="text-base sm:text-lg">Students ({filteredStudents.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-semibold text-gray-700 text-sm">
                        Student
                      </th>
                      <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-semibold text-gray-700 text-sm">
                        Status
                      </th>
                      <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-semibold text-gray-700 text-sm">Risk</th>
                      <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-semibold text-gray-700 text-sm">
                        Progress
                      </th>
                      <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-semibold text-gray-700 text-sm">
                        Last Session
                      </th>
                      <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-semibold text-gray-700 text-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student, index) => (
                      <tr
                        key={student.id}
                        className={cn(
                          "border-b border-gray-100 hover:bg-gray-50 transition-colors",
                          index % 2 === 0 && "bg-gray-25",
                        )}
                      >
                        <td className="py-4 sm:py-6 px-3 sm:px-6">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                              <AvatarImage src={student.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-gray-100 text-gray-700 text-xs sm:text-sm font-semibold">
                                {student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{student.name}</p>
                              <p className="text-xs text-gray-500">
                                {student.studentId} • {student.year}
                              </p>
                              <p className="text-xs text-gray-500 sm:hidden">{student.major}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 sm:py-6 px-3 sm:px-6">
                          <Badge className={cn(getStatusColor(student.status), "text-xs")}>{student.status}</Badge>
                        </td>
                        <td className="py-4 sm:py-6 px-3 sm:px-6">
                          <Badge className={cn(getRiskColor(student.riskLevel), "text-xs")}>{student.riskLevel}</Badge>
                        </td>
                        <td className="py-4 sm:py-6 px-3 sm:px-6">
                          <div className="flex items-center space-x-2">
                            <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${student.progressScore}%` }}
                              ></div>
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-gray-700">
                              {student.progressScore}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 sm:py-6 px-3 sm:px-6">
                          <span className="text-xs sm:text-sm text-gray-600">{formatDate(student.lastSession)}</span>
                        </td>
                        <td className="py-4 sm:py-6 px-3 sm:px-6">
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedStudent(student)}
                              className="text-xs"
                            >
                              View
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs bg-transparent">
                              Schedule
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Case Management */}
        <section>
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Case Management</h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Active cases and recent documentation</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <Card>
              <CardHeader className="bg-red-50">
                <CardTitle className="text-base sm:text-lg text-red-800">Cases Requiring Attention</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  {students
                    .filter((s) => s.status === "active" && (s.riskLevel === "high" || s.riskLevel === "crisis"))
                    .map((student) => (
                      <div key={student.id} className="p-4 sm:p-5 border border-red-200 rounded-lg bg-red-50">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{student.name}</h4>
                          <Badge className={cn(getRiskColor(student.riskLevel), "text-xs w-fit")}>
                            {student.riskLevel}
                          </Badge>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-700 space-y-1 sm:space-y-2">
                          <p>
                            <span className="font-medium">Last session:</span> {formatDate(student.lastSession)}
                          </p>
                          <p>
                            <span className="font-medium">Progress:</span> {student.progressScore}%
                          </p>
                          <p>
                            <span className="font-medium">Attendance:</span> {student.attendanceRate}%
                          </p>
                        </div>
                        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                          <Button size="sm" variant="outline" className="text-xs bg-transparent">
                            View Notes
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs bg-transparent">
                            Schedule Emergency
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-base sm:text-lg text-blue-800">Recent Case Notes</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <div className="p-4 sm:p-5 border rounded-lg bg-blue-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Sarah Johnson</h4>
                      <span className="text-xs sm:text-sm text-gray-500 font-medium">2 days ago</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 mb-3">
                      Student showed significant improvement in anxiety management. Discussed coping strategies.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-100 text-blue-700 text-xs">Individual Session</Badge>
                      <Badge className="bg-green-100 text-green-700 text-xs">Progress</Badge>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 border rounded-lg bg-red-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Michael Chen</h4>
                      <span className="text-xs sm:text-sm text-gray-500 font-medium">1 day ago</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 mb-3">
                      Crisis intervention session. Safety plan activated. Emergency contact notified.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-red-100 text-red-700 text-xs">Crisis Session</Badge>
                      <Badge className="bg-orange-100 text-orange-700 text-xs">Safety Plan</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Enhanced Institutional Reporting */}
        <section>
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Institutional Reporting</h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Comprehensive analytics and performance metrics for institutional oversight
            </p>
          </div>

          {/* Report Period Selector */}
          <div className="mb-6 sm:mb-8">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Reporting Period</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Select the time period for detailed analysis</p>
                  </div>
                  <Select value={selectedReportPeriod} onValueChange={setSelectedReportPeriod}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current-month">Current Month</SelectItem>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                      <SelectItem value="semester">This Semester</SelectItem>
                      <SelectItem value="academic-year">Academic Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trends Chart */}
          <div className="mb-6 sm:mb-8">
            <Card>
              <CardHeader className="bg-gray-100">
                <CardTitle className="text-base sm:text-xl">Monthly Activity Trends</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-8">
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-6 mb-4 sm:mb-6">
                  {monthlyData.map((month, index) => (
                    <div key={month.month} className="text-center">
                      <div className="mb-2 sm:mb-4">
                        <div className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">{month.month}</div>
                        <div className="relative">
                          <div className="w-full bg-gray-200 rounded-full h-16 sm:h-24 flex items-end justify-center">
                            <div
                              className="bg-blue-600 rounded-full w-4 sm:w-8 transition-all duration-500"
                              style={{ height: `${(month.sessions / 70) * 100}%` }}
                            ></div>
                          </div>
                          <div className="absolute top-0 left-0 w-full text-xs font-bold text-blue-700 pt-1">
                            {month.sessions}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">New:</span>
                          <span className="font-semibold text-green-600">{month.newStudents}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Crisis:</span>
                          <span className="font-semibold text-red-600">{month.crisisInterventions}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center text-xs sm:text-sm text-gray-600">
                  <span className="font-medium">Sessions per month</span> • Blue bars represent total counseling
                  sessions
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Performance Indicators */}
          <div className="mb-6 sm:mb-8">
            <Card>
              <CardHeader className="bg-gray-100">
                <CardTitle className="text-base sm:text-xl">Key Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                  {outcomeMetrics.map((metric, index) => (
                    <div key={index} className="bg-gray-50 p-4 sm:p-6 rounded-lg border">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <h4 className="font-semibold text-gray-900 text-xs sm:text-sm">{metric.metric}</h4>
                        <div
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-bold",
                            metric.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
                          )}
                        >
                          {metric.trend === "up" ? "↗" : "↘"} {metric.trend === "up" ? "+" : "-"}
                          {Math.abs(metric.current - metric.previous)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                          {typeof metric.current === "number" && metric.current < 10
                            ? metric.current
                            : `${metric.current}${typeof metric.current === "number" && metric.current >= 10 ? "%" : ""}`}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          Previous:{" "}
                          {typeof metric.previous === "number" && metric.previous < 10
                            ? metric.previous
                            : `${metric.previous}${typeof metric.previous === "number" && metric.previous >= 10 ? "%" : ""}`}
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={cn("h-2 rounded-full", metric.trend === "up" ? "bg-green-600" : "bg-red-600")}
                            style={{
                              width: `${typeof metric.current === "number" ? (metric.current > 10 ? metric.current : metric.current * 10) : 75}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Intervention Analysis */}
          <div className="mb-6 sm:mb-8">
            <Card>
              <CardHeader className="bg-gray-100">
                <CardTitle className="text-base sm:text-xl">Intervention Type Analysis</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-8">
                <div className="space-y-4 sm:space-y-6">
                  {interventionTypes.map((intervention, index) => (
                    <div key={index} className="bg-gray-50 p-4 sm:p-6 rounded-lg border">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{intervention.type}</h4>
                          <p className="text-xs sm:text-sm text-gray-600">{intervention.count} sessions this period</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="text-xl sm:text-2xl font-bold text-gray-700">{intervention.percentage}%</div>
                          <div className="text-xs sm:text-sm text-gray-600">of total interventions</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                        <div
                          className="bg-gray-600 h-2 sm:h-3 rounded-full transition-all duration-700"
                          style={{ width: `${intervention.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Reporting Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card>
              <CardHeader className="bg-gray-100">
                <CardTitle className="text-base sm:text-lg">Caseload Analytics</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Total Active Cases</span>
                      <span className="text-lg sm:text-xl font-bold text-gray-700">{activeStudents}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Avg Sessions per Student</span>
                      <span className="text-lg sm:text-xl font-bold text-gray-700">
                        {Math.round(students.reduce((acc, s) => acc + s.totalSessions, 0) / students.length)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Crisis Interventions</span>
                      <span className="text-lg sm:text-xl font-bold text-gray-700">3</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Referrals Made</span>
                      <span className="text-lg sm:text-xl font-bold text-gray-700">7</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Capacity Utilization</span>
                      <span className="text-lg sm:text-xl font-bold text-gray-700">85%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-gray-100">
                <CardTitle className="text-base sm:text-lg">Demographic Insights</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">By Academic Year</h4>
                    <div className="space-y-2 sm:space-y-3">
                      {[
                        { year: "Freshman", percentage: 25, count: 1 },
                        { year: "Sophomore", percentage: 25, count: 1 },
                        { year: "Junior", percentage: 25, count: 1 },
                        { year: "Senior", percentage: 25, count: 1 },
                      ].map((item, index) => (
                        <div key={index} className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-1 sm:mb-2">
                            <span className="text-xs sm:text-sm font-medium text-gray-700">{item.year}</span>
                            <span className="text-xs sm:text-sm font-bold text-gray-700">{item.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gray-600 h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                      Service Utilization
                    </h4>
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-gray-700 mb-1">92%</div>
                        <div className="text-xs sm:text-sm text-gray-600">Students completing treatment</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-gray-100">
                <CardTitle className="text-base sm:text-lg">Outcome Measurements</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Students Improved</span>
                      <span className="text-lg sm:text-xl font-bold text-green-700">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Students Stable</span>
                      <span className="text-lg sm:text-xl font-bold text-blue-700">20%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "20%" }}></div>
                    </div>
                  </div>
                  <div className="bg-red-50 p-3 sm:p-4 rounded-lg border border-red-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Students Declined</span>
                      <span className="text-lg sm:text-xl font-bold text-red-700">5%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: "5%" }}></div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg border border-yellow-200">
                   
                  </div>
                  <div className="bg-purple-50 p-3 sm:p-4 rounded-lg border border-purple-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Retention Rate</span>
                      <span className="text-lg sm:text-xl font-bold text-purple-700">95%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export and Compliance */}
          <div className="mt-6 sm:mt-8">
            <Card>
              <CardHeader className="bg-gray-900 text-white">
                <CardTitle className="text-base sm:text-lg">Report Generation & Compliance</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <Button className="h-12 sm:h-16 bg-gray-700 hover:bg-gray-800">
                    <div className="text-center">
                      <div className="font-semibold text-xs sm:text-sm">Monthly Report</div>
                      <div className="text-xs opacity-90 hidden sm:block">Comprehensive monthly analysis</div>
                    </div>
                  </Button>
                  <Button className="h-12 sm:h-16 bg-gray-700 hover:bg-gray-800">
                    <div className="text-center">
                      <div className="font-semibold text-xs sm:text-sm">Compliance Export</div>
                      <div className="text-xs opacity-90 hidden sm:block">Regulatory reporting data</div>
                    </div>
                  </Button>
                  <Button className="h-12 sm:h-16 bg-gray-700 hover:bg-gray-800">
                    <div className="text-center">
                      <div className="font-semibold text-xs sm:text-sm">Outcome Analysis</div>
                      <div className="text-xs opacity-90 hidden sm:block">Student progress metrics</div>
                    </div>
                  </Button>
                  <Button className="h-12 sm:h-16 bg-gray-700 hover:bg-gray-800">
                    <div className="text-center">
                      <div className="font-semibold text-xs sm:text-sm">Custom Report</div>
                      <div className="text-xs opacity-90 hidden sm:block">Build your own analysis</div>
                    </div>
                  </Button>
                </div>
                
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
