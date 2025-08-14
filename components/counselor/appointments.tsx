"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Video,
  MapPin,
  Clock,
  CalendarIcon,
  Phone,
  MessageSquare,
  FileText,
  CheckCircle,
  XCircle,
  RotateCcw,
  Play,
  AlertTriangle,
  MoreVertical,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Types
interface Appointment {
  id: string
  studentId: string
  studentName: string
  studentEmail: string
  studentPhone: string
  studentAvatar: string
  studentYear: string
  studentMajor: string
  date: Date
  time: string
  duration: number
  sessionType: "video" | "in-person" | "phone"
  appointmentType: "individual" | "group" | "crisis" | "intake" | "follow-up"
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled" | "no-show" | "rescheduled"
  priority: "low" | "medium" | "high" | "urgent"
  reason: string
  notes?: string
  location?: string
  meetingLink?: string
  isRecurring: boolean
  recurringPattern?: "weekly" | "biweekly" | "monthly"
  createdAt: Date
  lastModified: Date
  reminderSent: boolean
  canStart: boolean
}

// Mock Data
const mockAppointments: Appointment[] = [
  {
    id: "apt1",
    studentId: "student1",
    studentName: "Sarah Johnson",
    studentEmail: "sarah.j@university.edu",
    studentPhone: "(555) 123-4567",
    studentAvatar: "/placeholder.svg?height=40&width=40",
    studentYear: "Junior",
    studentMajor: "Psychology",
    date: new Date(),
    time: "10:00 AM",
    duration: 50,
    sessionType: "video",
    appointmentType: "individual",
    status: "confirmed",
    priority: "medium",
    reason: "Anxiety management and academic stress",
    notes: "Student requested morning appointment",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    isRecurring: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    reminderSent: true,
    canStart: true,
  },
  {
    id: "apt2",
    studentId: "student2",
    studentName: "Michael Chen",
    studentEmail: "m.chen@university.edu",
    studentPhone: "(555) 234-5678",
    studentAvatar: "/placeholder.svg?height=40&width=40",
    studentYear: "Senior",
    studentMajor: "Computer Science",
    date: new Date(Date.now() + 1 * 60 * 60 * 1000),
    time: "2:00 PM",
    duration: 50,
    sessionType: "in-person",
    appointmentType: "crisis",
    status: "confirmed",
    priority: "urgent",
    reason: "Crisis intervention - academic failure concerns",
    notes: "Emergency session scheduled",
    location: "Office 201, Student Services Building",
    isRecurring: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    reminderSent: true,
    canStart: false,
  },
  {
    id: "apt3",
    studentId: "student3",
    studentName: "Emma Rodriguez",
    studentEmail: "e.rodriguez@university.edu",
    studentPhone: "(555) 345-6789",
    studentAvatar: "/placeholder.svg?height=40&width=40",
    studentYear: "Sophomore",
    studentMajor: "Biology",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    time: "11:00 AM",
    duration: 50,
    sessionType: "video",
    appointmentType: "follow-up",
    status: "pending",
    priority: "low",
    reason: "Follow-up on previous session progress",
    meetingLink: "https://meet.google.com/xyz-uvwx-rst",
    isRecurring: true,
    recurringPattern: "weekly",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    reminderSent: false,
    canStart: false,
  },
  {
    id: "apt4",
    studentId: "student4",
    studentName: "James Wilson",
    studentEmail: "j.wilson@university.edu",
    studentPhone: "(555) 456-7890",
    studentAvatar: "/placeholder.svg?height=40&width=40",
    studentYear: "Freshman",
    studentMajor: "Engineering",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    time: "3:00 PM",
    duration: 50,
    sessionType: "phone",
    appointmentType: "individual",
    status: "completed",
    priority: "medium",
    reason: "Academic adjustment and time management",
    notes: "Student showed good progress. Scheduled follow-up in 2 weeks.",
    isRecurring: false,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    reminderSent: true,
    canStart: false,
  },
  {
    id: "apt5",
    studentId: "student5",
    studentName: "Lisa Park",
    studentEmail: "l.park@university.edu",
    studentPhone: "(555) 567-8901",
    studentAvatar: "/placeholder.svg?height=40&width=40",
    studentYear: "Junior",
    studentMajor: "Art",
    date: new Date(Date.now() + 30 * 60 * 1000),
    time: "1:00 PM",
    duration: 50,
    sessionType: "in-person",
    appointmentType: "intake",
    status: "confirmed",
    priority: "high",
    reason: "Initial consultation - depression screening",
    location: "Office 201, Student Services Building",
    isRecurring: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    reminderSent: false,
    canStart: true,
  },
]

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [selectedTab, setSelectedTab] = useState("today")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  const [showNotesDialog, setShowNotesDialog] = useState(false)
  const [rescheduleDate, setRescheduleDate] = useState<Date>()
  const [rescheduleTime, setRescheduleTime] = useState("")
  const [appointmentNotes, setAppointmentNotes] = useState("")

  // Helper functions
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "no-show":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-blue-100 text-blue-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSessionIcon = (sessionType: string) => {
    switch (sessionType) {
      case "video":
        return <Video className="h-4 w-4" />
      case "in-person":
        return <MapPin className="h-4 w-4" />
      case "phone":
        return <Phone className="h-4 w-4" />
      default:
        return <Video className="h-4 w-4" />
    }
  }

  // Filter appointments based on tab
  const getFilteredAppointments = () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    let filtered = appointments

    switch (selectedTab) {
      case "today":
        filtered = appointments.filter((apt) => apt.date.toDateString() === today.toDateString())
        break
      case "upcoming":
        filtered = appointments.filter((apt) => apt.date > today && apt.date <= nextWeek)
        break
      case "pending":
        filtered = appointments.filter((apt) => apt.status === "pending")
        break
      case "completed":
        filtered = appointments.filter((apt) => apt.status === "completed")
        break
      default:
        filtered = appointments
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (apt) =>
          apt.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.reason.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return filtered.sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  // Actions
  const handleStartAppointment = (appointment: Appointment) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointment.id ? { ...apt, status: "in-progress" as const } : apt)),
    )

    if (appointment.sessionType === "video" && appointment.meetingLink) {
      window.open(appointment.meetingLink, "_blank")
    }
  }

  const handleCompleteAppointment = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: "completed" as const } : apt)),
    )
  }

  const handleAcceptAppointment = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: "confirmed" as const } : apt)),
    )
  }

  const handleDeclineAppointment = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: "cancelled" as const } : apt)),
    )
  }

  const handleReschedule = () => {
    if (selectedAppointment && rescheduleDate && rescheduleTime) {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === selectedAppointment.id
            ? { ...apt, date: rescheduleDate, time: rescheduleTime, status: "rescheduled" as const }
            : apt,
        ),
      )
      setShowRescheduleDialog(false)
      setSelectedAppointment(null)
      setRescheduleDate(undefined)
      setRescheduleTime("")
    }
  }

  const handleSaveNotes = () => {
    if (selectedAppointment) {
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === selectedAppointment.id ? { ...apt, notes: appointmentNotes } : apt)),
      )
      setShowNotesDialog(false)
      setSelectedAppointment(null)
      setAppointmentNotes("")
    }
  }

  const filteredAppointments = getFilteredAppointments()

  // Stats
  const todayCount = appointments.filter((apt) => apt.date.toDateString() === new Date().toDateString()).length
  const pendingCount = appointments.filter((apt) => apt.status === "pending").length
  const inProgressCount = appointments.filter((apt) => apt.status === "in-progress").length
  const urgentCount = appointments.filter((apt) => apt.priority === "urgent").length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Appointments</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your counseling sessions</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">Schedule New</Button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-8 max-w-7xl mx-auto">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{todayCount}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Today</p>
                </div>
                <CalendarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{pendingCount}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Pending</p>
                </div>
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{inProgressCount}</p>
                  <p className="text-xs sm:text-sm text-gray-600">In Progress</p>
                </div>
                <Play className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{urgentCount}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Urgent</p>
                </div>
                <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-4 sm:mb-6">
          <Input
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="today" className="text-xs sm:text-sm">
              Today
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="text-xs sm:text-sm">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs sm:text-sm">
              Pending
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs sm:text-sm">
              Completed
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab}>
            <div className="space-y-4">
              {filteredAppointments.length === 0 ? (
                <Card>
                  <CardContent className="p-8 sm:p-12 text-center">
                    <p className="text-gray-500">No appointments found</p>
                  </CardContent>
                </Card>
              ) : (
                filteredAppointments.map((appointment) => (
                  <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      {/* Mobile Layout */}
                      <div className="block sm:hidden">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3 flex-1">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={appointment.studentAvatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-sm">
                                {appointment.studentName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900 text-sm truncate">
                                  {appointment.studentName}
                                </h3>
                                <Badge className={getPriorityColor(appointment.priority)} variant="secondary">
                                  {appointment.priority}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 mb-1">
                                {appointment.studentYear} • {appointment.studentMajor}
                              </p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {appointment.status === "pending" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleAcceptAppointment(appointment.id)}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Accept
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDeclineAppointment(appointment.id)}>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Decline
                                  </DropdownMenuItem>
                                </>
                              )}
                              {appointment.status === "confirmed" && appointment.canStart && (
                                <DropdownMenuItem onClick={() => handleStartAppointment(appointment)}>
                                  <Play className="h-4 w-4 mr-2" />
                                  Start Session
                                </DropdownMenuItem>
                              )}
                              {appointment.status === "in-progress" && (
                                <DropdownMenuItem onClick={() => handleCompleteAppointment(appointment.id)}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Complete
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedAppointment(appointment)
                                  setShowRescheduleDialog(true)
                                }}
                              >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Reschedule
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedAppointment(appointment)
                                  setAppointmentNotes(appointment.notes || "")
                                  setShowNotesDialog(true)
                                }}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Notes
                              </DropdownMenuItem>
                              {appointment.sessionType === "video" && appointment.meetingLink && (
                                <DropdownMenuItem onClick={() => window.open(appointment.meetingLink, "_blank")}>
                                  <Video className="h-4 w-4 mr-2" />
                                  Join Video
                                </DropdownMenuItem>
                              )}
                              {appointment.sessionType === "phone" && (
                                <DropdownMenuItem
                                  onClick={() => (window.location.href = `tel:${appointment.studentPhone}`)}
                                >
                                  <Phone className="h-4 w-4 mr-2" />
                                  Call
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => (window.location.href = `mailto:${appointment.studentEmail}`)}
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Email
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="space-y-2 mb-3">
                          <p className="text-sm text-gray-700 line-clamp-2">{appointment.reason}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getSessionIcon(appointment.sessionType)}
                              <span className="text-xs text-gray-600 capitalize">{appointment.sessionType}</span>
                            </div>
                            <Badge className={getStatusColor(appointment.status)} variant="secondary">
                              {appointment.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>
                              {formatDate(appointment.date)} • {appointment.time}
                            </span>
                            <span>{appointment.duration} min</span>
                          </div>
                        </div>

                        {/* Primary Action Button for Mobile */}
                        <div className="flex gap-2">
                          {appointment.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleAcceptAppointment(appointment.id)}
                                className="bg-green-600 hover:bg-green-700 flex-1"
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeclineAppointment(appointment.id)}
                                className="border-red-200 text-red-700 hover:bg-red-50 flex-1"
                              >
                                Decline
                              </Button>
                            </>
                          )}
                          {appointment.status === "confirmed" && appointment.canStart && (
                            <Button
                              size="sm"
                              onClick={() => handleStartAppointment(appointment)}
                              className="bg-blue-600 hover:bg-blue-700 flex-1"
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Start Session
                            </Button>
                          )}
                          {appointment.status === "in-progress" && (
                            <Button
                              size="sm"
                              onClick={() => handleCompleteAppointment(appointment.id)}
                              className="bg-green-600 hover:bg-green-700 flex-1"
                            >
                              Complete
                            </Button>
                          )}
                          {appointment.status === "completed" && (
                            <Button size="sm" variant="outline" className="flex-1 bg-transparent" disabled>
                              Completed
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden sm:block">
                        <div className="flex items-center justify-between">
                          {/* Student Info */}
                          <div className="flex items-center space-x-4 flex-1">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={appointment.studentAvatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                                {appointment.studentName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">{appointment.studentName}</h3>
                                <Badge className={getPriorityColor(appointment.priority)} variant="secondary">
                                  {appointment.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">{appointment.reason}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>
                                  {appointment.studentYear} • {appointment.studentMajor}
                                </span>
                                <span>{appointment.studentEmail}</span>
                              </div>
                            </div>
                          </div>

                          {/* Appointment Details */}
                          <div className="flex items-center gap-6">
                            {/* Date & Time */}
                            <div className="text-center">
                              <p className="text-sm font-medium text-gray-900">{formatDate(appointment.date)}</p>
                              <p className="text-xs text-gray-500">{appointment.time}</p>
                            </div>

                            {/* Session Type */}
                            <div className="flex items-center gap-2">
                              {getSessionIcon(appointment.sessionType)}
                              <div>
                                <p className="text-sm font-medium capitalize">{appointment.sessionType}</p>
                                <p className="text-xs text-gray-500">{appointment.duration} min</p>
                              </div>
                            </div>

                            {/* Status */}
                            <div className="text-center">
                              <Badge className={getStatusColor(appointment.status)} variant="secondary">
                                {appointment.status}
                              </Badge>
                              <p className="text-xs text-gray-500 mt-1">{appointment.appointmentType}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              {appointment.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleAcceptAppointment(appointment.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Accept
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeclineAppointment(appointment.id)}
                                    className="border-red-200 text-red-700 hover:bg-red-50"
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Decline
                                  </Button>
                                </>
                              )}

                              {appointment.status === "confirmed" && appointment.canStart && (
                                <Button
                                  size="sm"
                                  onClick={() => handleStartAppointment(appointment)}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <Play className="h-4 w-4 mr-1" />
                                  Start
                                </Button>
                              )}

                              {appointment.status === "in-progress" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleCompleteAppointment(appointment.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Complete
                                </Button>
                              )}

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedAppointment(appointment)
                                      setShowRescheduleDialog(true)
                                    }}
                                  >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Reschedule
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedAppointment(appointment)
                                      setAppointmentNotes(appointment.notes || "")
                                      setShowNotesDialog(true)
                                    }}
                                  >
                                    <FileText className="h-4 w-4 mr-2" />
                                    Notes
                                  </DropdownMenuItem>
                                  {appointment.sessionType === "video" && appointment.meetingLink && (
                                    <DropdownMenuItem onClick={() => window.open(appointment.meetingLink, "_blank")}>
                                      <Video className="h-4 w-4 mr-2" />
                                      Join Video
                                    </DropdownMenuItem>
                                  )}
                                  {appointment.sessionType === "phone" && (
                                    <DropdownMenuItem
                                      onClick={() => (window.location.href = `tel:${appointment.studentPhone}`)}
                                    >
                                      <Phone className="h-4 w-4 mr-2" />
                                      Call
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={() => (window.location.href = `mailto:${appointment.studentEmail}`)}
                                  >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Email
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>

                        {/* Additional Info */}
                        {(appointment.location || appointment.notes || appointment.isRecurring) && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              {appointment.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {appointment.location}
                                </div>
                              )}
                              {appointment.isRecurring && (
                                <div className="flex items-center gap-1">
                                  <RotateCcw className="h-4 w-4" />
                                  Recurring {appointment.recurringPattern}
                                </div>
                              )}
                              {appointment.notes && (
                                <div className="flex items-center gap-1">
                                  <FileText className="h-4 w-4" />
                                  {appointment.notes.substring(0, 50)}
                                  {appointment.notes.length > 50 && "..."}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Reschedule Dialog */}
        <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
          <DialogContent className="w-[95vw] max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>Reschedule Appointment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedAppointment && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">{selectedAppointment.studentName}</p>
                  <p className="text-sm text-gray-600">
                    Current: {formatDate(selectedAppointment.date)} at {selectedAppointment.time}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium">New Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      {rescheduleDate ? formatDate(rescheduleDate) : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={rescheduleDate} onSelect={setRescheduleDate} />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="text-sm font-medium">New Time</label>
                <Select value={rescheduleTime} onValueChange={setRescheduleTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                    <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                    <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                    <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                    <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                    <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                    <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                <Button variant="outline" onClick={() => setShowRescheduleDialog(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button onClick={handleReschedule} className="w-full sm:w-auto">
                  Reschedule
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Notes Dialog */}
        <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
          <DialogContent className="w-[95vw] max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>Appointment Notes</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedAppointment && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">{selectedAppointment.studentName}</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(selectedAppointment.date)} at {selectedAppointment.time}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={appointmentNotes}
                  onChange={(e) => setAppointmentNotes(e.target.value)}
                  placeholder="Add notes about this appointment..."
                  rows={4}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                <Button variant="outline" onClick={() => setShowNotesDialog(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button onClick={handleSaveNotes} className="w-full sm:w-auto">
                  Save Notes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
