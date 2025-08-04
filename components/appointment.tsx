"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  X,
  Search,
  Video,
  Edit,
  Trash2,
  AlertCircle,
  Clock,
  Calendar,
  Mail,
  Award,
  TrendingUp,
  User,
  CalendarDays,
  MessageSquare,
  Target,
  Users,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CounselorSession {
  id: string
  date: string
  time: string
  counselor: string
  counselorEmail: string
  type: "Academic Support" | "Personal Counseling" | "Career Guidance" | "Crisis Intervention"
  duration: number
  status: "Pending" | "Approved" | "Completed" | "Cancelled" | "Rescheduled"
  reason: string
  priority: "Low" | "Medium" | "High" | "Urgent"
  meetingLink?: string
  notes?: string
  createdAt: string
  // Enhanced details
  specificConcerns: string
  previousAttempts: string
  expectedOutcome: string
  urgencyReason?: string
  supportSystem: string
  academicImpact?: string
}

interface BookingFormData {
  counselor: string
  date: string
  time: string
  type: string
  reason: string
  priority: string
  // Enhanced fields
  specificConcerns: string
  previousAttempts: string
  expectedOutcome: string
  urgencyReason: string
  supportSystem: string
  academicImpact: string
  communicationMethod?: string
  sessionFormat?: string
  symptomDuration?: string
  severityLevel?: string
  triggersPatterns?: string
  impactAreas?: string[]
  takingMedications?: string
  medicationDetails?: string
  previousTherapy?: string
  therapyDetails?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  emergencyContactRelation?: string
  counselingGoals?: string[]
  additionalInfo?: string
}

interface FormErrors {
  counselor?: string
  date?: string
  time?: string
  type?: string
  reason?: string
  priority?: string
  specificConcerns?: string
  expectedOutcome?: string
  supportSystem?: string
}

interface Counselor {
  id: string
  name: string
  title: string
  specialty: string
  email: string
  phone: string
  office: string
  availability: "Available" | "Limited" | "Unavailable"
}

interface UserProgress {
  level: number
  xp: number
  xpToNext: number
  totalSessions: number
  streak: number
  completedSessions: number
}

const mockSessions: CounselorSession[] = [
  {
    id: "1",
    date: "2024-02-15",
    time: "10:00 AM",
    counselor: "Dr. Sarah Johnson",
    counselorEmail: "s.johnson@university.edu",
    type: "Academic Support",
    duration: 45,
    status: "Approved",
    reason: "Need help with time management and study strategies for upcoming exams",
    priority: "High",
    meetingLink: "https://meet.university.edu/session-1",
    createdAt: "2024-02-10T09:00:00Z",
    specificConcerns:
      "Struggling to balance multiple courses and feeling overwhelmed with workload. Having difficulty prioritizing tasks and managing deadlines effectively.",
    previousAttempts:
      "Tried using various apps and planners but couldn't stick to them consistently. Attempted study groups but found them distracting.",
    expectedOutcome:
      "Learn effective time management techniques and develop a sustainable study schedule that works with my learning style.",
    supportSystem:
      "Family is supportive but lives far away. Have a few close friends in similar programs who understand the pressure.",
    academicImpact:
      "GPA has dropped from 3.8 to 3.2 this semester. Missing assignment deadlines and feeling unprepared for exams.",
  },
  {
    id: "2",
    date: "2024-02-20",
    time: "2:30 PM",
    counselor: "Dr. Michael Chen",
    counselorEmail: "m.chen@university.edu",
    type: "Personal Counseling",
    duration: 60,
    status: "Pending",
    reason: "Experiencing anxiety and stress related to academic performance",
    priority: "Medium",
    createdAt: "2024-02-12T14:30:00Z",
    specificConcerns:
      "Constant worry about grades and future career prospects. Physical symptoms include difficulty sleeping, loss of appetite, and frequent headaches.",
    previousAttempts:
      "Tried meditation apps and breathing exercises with limited success. Spoke with friends but don't want to burden them.",
    expectedOutcome:
      "Develop coping strategies for anxiety and learn to manage stress in a healthier way. Want to regain confidence in my abilities.",
    supportSystem:
      "Close relationship with roommate who is understanding. Parents are supportive but tend to add pressure about grades.",
    academicImpact:
      "Anxiety is affecting concentration during lectures and exams. Avoiding participation in class discussions due to fear of being wrong.",
  },
  {
    id: "3",
    date: "2024-01-25",
    time: "11:00 AM",
    counselor: "Dr. Emily Rodriguez",
    counselorEmail: "e.rodriguez@university.edu",
    type: "Career Guidance",
    duration: 50,
    status: "Completed",
    reason: "Career planning and internship opportunities discussion",
    priority: "Medium",
    notes: "Discussed career paths in technology sector. Follow-up scheduled.",
    createdAt: "2024-01-20T10:00:00Z",
    specificConcerns:
      "Uncertain about which career path to pursue within my major. Confused about internship requirements and how to make myself competitive.",
    previousAttempts:
      "Attended career fairs but felt overwhelmed by options. Researched online but information seems contradictory.",
    expectedOutcome:
      "Clear understanding of career options and actionable steps to secure relevant internships. Want to create a focused career plan.",
    supportSystem:
      "Career-oriented family members provide advice but in different fields. University career center resources available.",
    academicImpact:
      "Lack of direction affecting motivation in courses. Unsure which electives to choose to support career goals.",
  },
]

const userProgress: UserProgress = {
  level: 3,
  xp: 230,
  xpToNext: 270,
  totalSessions: 3,
  streak: 2,
  completedSessions: 1,
}

const counselors: Counselor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    title: "Senior Academic Counselor",
    specialty: "Academic Support & Study Strategies",
    email: "s.johnson@university.edu",
    phone: "(555) 123-4567",
    office: "Student Services Building, Room 201",
    availability: "Available",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    title: "Licensed Clinical Psychologist",
    specialty: "Personal Counseling & Mental Health",
    email: "m.chen@university.edu",
    phone: "(555) 234-5678",
    office: "Wellness Center, Room 105",
    availability: "Limited",
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    title: "Career Development Specialist",
    specialty: "Career Guidance & Professional Development",
    email: "e.rodriguez@university.edu",
    phone: "(555) 345-6789",
    office: "Career Center, Room 301",
    availability: "Available",
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    title: "Crisis Intervention Specialist",
    specialty: "Crisis Support & Emergency Counseling",
    email: "j.wilson@university.edu",
    phone: "(555) 456-7890",
    office: "Emergency Services, 24/7 Hotline",
    availability: "Available",
  },
]

const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
]

const sessionTypes = [
  {
    value: "Academic Support",
    label: "Academic Support",
    description: "Study strategies, time management, academic planning",
    icon: BookOpen,
  },
  {
    value: "Personal Counseling",
    label: "Personal Counseling",
    description: "Mental health support, stress management, personal issues",
    icon: MessageSquare,
  },
  {
    value: "Career Guidance",
    label: "Career Guidance",
    description: "Career planning, internships, professional development",
    icon: Target,
  },
  {
    value: "Crisis Intervention",
    label: "Crisis Intervention",
    description: "Immediate support for urgent mental health concerns",
    icon: AlertTriangle,
  },
]

const priorityLevels = [
  {
    value: "Low",
    label: "Low Priority",
    description: "General guidance or routine check-in",
    color: "text-green-600 bg-green-50 border-green-200",
  },
  {
    value: "Medium",
    label: "Medium Priority",
    description: "Ongoing concerns affecting daily life",
    color: "text-yellow-600 bg-yellow-50 border-yellow-200",
  },
  {
    value: "High",
    label: "High Priority",
    description: "Significant impact on academics or wellbeing",
    color: "text-orange-600 bg-orange-50 border-orange-200",
  },
  {
    value: "Urgent",
    label: "Urgent Priority",
    description: "Immediate support needed",
    color: "text-red-600 bg-red-50 border-red-200",
  },
]

export function CounselorScheduling() {
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [editingSession, setEditingSession] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState<BookingFormData>({
    counselor: "",
    date: "",
    time: "",
    type: "",
    reason: "",
    priority: "",
    specificConcerns: "",
    previousAttempts: "",
    expectedOutcome: "",
    urgencyReason: "",
    supportSystem: "",
    academicImpact: "",
  })

  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const formRef = useRef<HTMLFormElement>(null)
  const errorSummaryRef = useRef<HTMLDivElement>(null)

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Calculate analytics
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const monthlyStats = {
    total: mockSessions.filter((session) => {
      const sessionDate = new Date(session.date)
      return sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear
    }).length,
    completed: mockSessions.filter((session) => {
      const sessionDate = new Date(session.date)
      return (
        sessionDate.getMonth() === currentMonth &&
        sessionDate.getFullYear() === currentYear &&
        session.status === "Completed"
      )
    }).length,
    pending: mockSessions.filter((session) => session.status === "Pending").length,
    approved: mockSessions.filter((session) => session.status === "Approved").length,
    cancelled: mockSessions.filter((session) => session.status === "Cancelled").length,
  }

  const validateStep = (step: number): boolean => {
    const errors: FormErrors = {}

    if (step === 1) {
      if (!formData.counselor) errors.counselor = "Please select a counselor"
      if (!formData.type) errors.type = "Please select a session type"
      if (!formData.date) errors.date = "Please select a date"
      if (!formData.time) errors.time = "Please select a time"
      if (!formData.priority) errors.priority = "Please select a priority level"

      if (formData.date) {
        const selectedDate = new Date(formData.date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (selectedDate < today) {
          errors.date = "Please select a future date"
        }
      }
    }

    if (step === 2) {
      if (!formData.reason.trim()) errors.reason = "Please provide a reason for the appointment"
      if (!formData.specificConcerns.trim()) errors.specificConcerns = "Please describe your specific concerns"
      if (!formData.expectedOutcome.trim()) errors.expectedOutcome = "Please describe what you hope to achieve"
    }

    if (step === 3) {
      if (!formData.supportSystem.trim()) errors.supportSystem = "Please describe your current support system"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
    setFormErrors({})
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(3)) {
      return
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setShowBookingForm(false)
      setCurrentStep(1)
      setFormData({
        counselor: "",
        date: "",
        time: "",
        type: "",
        reason: "",
        priority: "",
        specificConcerns: "",
        previousAttempts: "",
        expectedOutcome: "",
        urgencyReason: "",
        supportSystem: "",
        academicImpact: "",
      })
      setFormErrors({})
    } catch (error) {
      console.error("Booking failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReschedule = (sessionId: string) => {
    const session = mockSessions.find((s) => s.id === sessionId)
    if (session) {
      setFormData({
        counselor: session.counselor,
        date: session.date,
        time: session.time,
        type: session.type,
        reason: session.reason,
        priority: session.priority,
        specificConcerns: session.specificConcerns,
        previousAttempts: session.previousAttempts,
        expectedOutcome: session.expectedOutcome,
        urgencyReason: session.urgencyReason || "",
        supportSystem: session.supportSystem,
        academicImpact: session.academicImpact || "",
      })
      setEditingSession(sessionId)
      setShowBookingForm(true)
    }
  }

  const handleCancel = (sessionId: string) => {
    console.log("Cancelling session:", sessionId)
  }

  const filteredSessions = mockSessions.filter(
    (session) =>
      session.counselor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.status.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "Rescheduled":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const resetForm = () => {
    setShowBookingForm(false)
    setCurrentStep(1)
    setEditingSession(null)
    setFormData({
      counselor: "",
      date: "",
      time: "",
      type: "",
      reason: "",
      priority: "",
      specificConcerns: "",
      previousAttempts: "",
      expectedOutcome: "",
      urgencyReason: "",
      supportSystem: "",
      academicImpact: "",
    })
    setFormErrors({})
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8", showBookingForm && "blur-sm")}>
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">Counseling Appointments</h1>
              <p className="text-sm sm:text-base text-gray-600">
                Manage your counseling sessions and track your progress
              </p>
            </div>
            <Button
              onClick={() => setShowBookingForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 w-full sm:w-auto"
            >
              Schedule Appointment
            </Button>
          </div>

          {/* Minimal Progress Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-lg sm:text-xl font-semibold text-gray-900">Level {userProgress.level}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Progress</div>
                  </div>
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <Progress value={(userProgress.xp / userProgress.xpToNext) * 100} className="h-2" />
                <div className="text-xs text-gray-500 mt-1">
                  {userProgress.xp}/{userProgress.xpToNext} XP
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg sm:text-xl font-semibold text-gray-900">{userProgress.streak}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Day Streak</div>
                  </div>
                  <div className="h-5 w-5 bg-orange-500 rounded-full"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg sm:text-xl font-semibold text-gray-900">
                      {userProgress.completedSessions}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Completed</div>
                  </div>
                  <Award className="h-5 w-5 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Card className="border border-gray-200">
              <CardContent className="p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-semibold text-gray-900">{monthlyStats.total}</div>
                <div className="text-xs sm:text-sm text-gray-600">This Month</div>
              </CardContent>
            </Card>
            <Card className="border border-gray-200">
              <CardContent className="p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-semibold text-green-600">{monthlyStats.completed}</div>
                <div className="text-xs sm:text-sm text-gray-600">Completed</div>
              </CardContent>
            </Card>
            <Card className="border border-gray-200">
              <CardContent className="p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-semibold text-blue-600">{monthlyStats.approved}</div>
                <div className="text-xs sm:text-sm text-gray-600">Approved</div>
              </CardContent>
            </Card>
            <Card className="border border-gray-200">
              <CardContent className="p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-semibold text-yellow-600">{monthlyStats.pending}</div>
                <div className="text-xs sm:text-sm text-gray-600">Pending</div>
              </CardContent>
            </Card>
            <Card className="border border-gray-200">
              <CardContent className="p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-semibold text-red-600">{monthlyStats.cancelled}</div>
                <div className="text-xs sm:text-sm text-gray-600">Cancelled</div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search appointments by counselor, type, or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4 sm:space-y-6">
          {filteredSessions.map((session) => (
            <Card key={session.id} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">{session.counselor}</h3>
                      <Badge className={cn("text-xs font-medium border", getStatusColor(session.status))}>
                        {session.status}
                      </Badge>
                      <Badge className={cn("text-xs font-medium border", getPriorityColor(session.priority))}>
                        {session.priority}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{session.type}</div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(session.date).toLocaleDateString("en-US", {
                          weekday: isMobile ? "short" : "long",
                          month: isMobile ? "short" : "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {session.time} ({session.duration}min)
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    {session.status === "Approved" && session.meetingLink && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                        onClick={() => window.open(session.meetingLink, "_blank")}
                      >
                        <Video className="h-4 w-4 mr-1" />
                        Join Call
                      </Button>
                    )}
                    {(session.status === "Pending" || session.status === "Approved") && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReschedule(session.id)}
                          className="border-gray-300 w-full sm:w-auto"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Reschedule
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancel(session.id)}
                          className="border-red-300 text-red-600 hover:bg-red-50 w-full sm:w-auto"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Enhanced Details */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-900 mb-2">Reason for Appointment:</div>
                    <div className="text-sm text-gray-700 mb-3">{session.reason}</div>

                    <div className="text-sm font-medium text-gray-900 mb-2">Specific Concerns:</div>
                    <div className="text-sm text-gray-700 mb-3">{session.specificConcerns}</div>

                    <div className="text-sm font-medium text-gray-900 mb-2">Expected Outcome:</div>
                    <div className="text-sm text-gray-700">{session.expectedOutcome}</div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-blue-900 mb-2">Previous Attempts:</div>
                      <div className="text-sm text-blue-800">{session.previousAttempts}</div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-green-900 mb-2">Support System:</div>
                      <div className="text-sm text-green-800">{session.supportSystem}</div>
                    </div>
                  </div>

                  {session.academicImpact && (
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-orange-900 mb-2">Academic Impact:</div>
                      <div className="text-sm text-orange-800">{session.academicImpact}</div>
                    </div>
                  )}

                  {session.notes && (
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-purple-900 mb-2">Counselor Notes:</div>
                      <div className="text-sm text-purple-800">{session.notes}</div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 pt-4 border-t border-gray-200 mt-4 gap-2">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{session.counselorEmail}</span>
                  </div>
                  <div>Scheduled: {new Date(session.createdAt).toLocaleDateString()}</div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredSessions.length === 0 && (
            <Card className="border border-gray-200">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="text-gray-500 mb-2">No appointments found</div>
                <div className="text-sm text-gray-400">
                  {searchQuery
                    ? "Try adjusting your search criteria"
                    : "Schedule your first appointment to get started"}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Enhanced Multi-Step Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[95vh]">
            <Card className="bg-white shadow-2xl border-0 rounded-xl overflow-hidden">
              {/* Header */}
              <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <CalendarDays className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-900">
                        {editingSession ? "Reschedule Appointment" : "Schedule New Appointment"}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Step {currentStep} of 3 -{" "}
                        {currentStep === 1 ? "Basic Information" : currentStep === 2 ? "Details" : "Additional Context"}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={resetForm} className="rounded-full">
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mt-6 space-x-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                          step < currentStep
                            ? "bg-green-500 text-white"
                            : step === currentStep
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-600",
                        )}
                      >
                        {step < currentStep ? <CheckCircle2 className="h-4 w-4" /> : step}
                      </div>
                      {step < 3 && (
                        <div
                          className={cn(
                            "w-16 h-1 mx-2 transition-colors",
                            step < currentStep ? "bg-green-500" : "bg-gray-200",
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardHeader>

              {/* Form Content */}
              <div className="max-h-[60vh] overflow-y-auto">
                <CardContent className="p-6">
                  {Object.keys(formErrors).length > 0 && (
                    <Alert className="mb-6 border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div ref={errorSummaryRef} tabIndex={-1}>
                          <strong>Please correct the following errors:</strong>
                          <ul className="mt-2 list-disc list-inside space-y-1">
                            {Object.entries(formErrors).map(([field, error]) => (
                              <li key={field} className="text-sm">
                                {error}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-6">
                    {/* Step 1: Basic Information */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div className="text-center mb-6">
                          <User className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                          <h3 className="text-lg font-semibold text-gray-900">Let's start with the basics</h3>
                          <p className="text-sm text-gray-600">Choose your counselor and preferred time</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="counselor" className="text-sm font-medium">
                              Select Counselor *
                            </Label>
                            <Select
                              value={formData.counselor}
                              onValueChange={(value) => {
                                setFormData({ ...formData, counselor: value })
                                if (formErrors.counselor) {
                                  setFormErrors({ ...formErrors, counselor: undefined })
                                }
                              }}
                            >
                              <SelectTrigger
                                className={cn(
                                  "h-12 transition-all duration-200",
                                  formErrors.counselor
                                    ? "border-red-500 focus:border-red-500 ring-red-200"
                                    : "focus:ring-2 focus:ring-blue-200",
                                )}
                              >
                                <SelectValue placeholder="Choose your counselor" />
                              </SelectTrigger>
                              <SelectContent>
                                {counselors.map((counselor) => (
                                  <SelectItem key={counselor.id} value={counselor.name}>
                                    <div className="flex items-center space-x-3 py-2">
                                      <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                          <User className="h-4 w-4 text-blue-600" />
                                        </div>
                                      </div>
                                      <div>
                                        <div className="font-medium text-gray-900">{counselor.name}</div>
                                        <div className="text-sm text-gray-500">{counselor.specialty}</div>
                                        <div className="text-xs text-gray-400">{counselor.office}</div>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="type" className="text-sm font-medium">
                              Session Type *
                            </Label>
                            <Select
                              value={formData.type}
                              onValueChange={(value) => {
                                setFormData({ ...formData, type: value })
                                if (formErrors.type) {
                                  setFormErrors({ ...formErrors, type: undefined })
                                }
                              }}
                            >
                              <SelectTrigger
                                className={cn(
                                  "h-12 transition-all duration-200",
                                  formErrors.type
                                    ? "border-red-500 focus:border-red-500 ring-red-200"
                                    : "focus:ring-2 focus:ring-blue-200",
                                )}
                              >
                                <SelectValue placeholder="What type of support do you need?" />
                              </SelectTrigger>
                              <SelectContent>
                                {sessionTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    <div className="flex items-center space-x-3 py-2">
                                      <type.icon className="h-4 w-4 text-gray-600" />
                                      <div>
                                        <div className="font-medium text-gray-900">{type.label}</div>
                                        <div className="text-sm text-gray-500">{type.description}</div>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="date" className="text-sm font-medium">
                              Preferred Date *
                            </Label>
                            <Input
                              id="date"
                              type="date"
                              value={formData.date}
                              onChange={(e) => {
                                setFormData({ ...formData, date: e.target.value })
                                if (formErrors.date) {
                                  setFormErrors({ ...formErrors, date: undefined })
                                }
                              }}
                              min={new Date().toISOString().split("T")[0]}
                              className={cn(
                                "h-12 transition-all duration-200",
                                formErrors.date
                                  ? "border-red-500 focus:border-red-500 ring-red-200"
                                  : "focus:ring-2 focus:ring-blue-200",
                              )}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="time" className="text-sm font-medium">
                              Preferred Time *
                            </Label>
                            <Select
                              value={formData.time}
                              onValueChange={(value) => {
                                setFormData({ ...formData, time: value })
                                if (formErrors.time) {
                                  setFormErrors({ ...formErrors, time: undefined })
                                }
                              }}
                            >
                              <SelectTrigger
                                className={cn(
                                  "h-12 transition-all duration-200",
                                  formErrors.time
                                    ? "border-red-500 focus:border-red-500 ring-red-200"
                                    : "focus:ring-2 focus:ring-blue-200",
                                )}
                              >
                                <SelectValue placeholder="Select your preferred time" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeSlots.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    <div className="flex items-center space-x-2">
                                      <Clock className="h-4 w-4 text-gray-600" />
                                      <span>{time}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="priority" className="text-sm font-medium">
                            Priority Level *
                          </Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {priorityLevels.map((priority) => (
                              <div
                                key={priority.value}
                                className={cn(
                                  "relative cursor-pointer rounded-lg border p-4 transition-all duration-200 hover:shadow-md",
                                  formData.priority === priority.value
                                    ? `${priority.color} border-current shadow-md`
                                    : "border-gray-200 hover:border-gray-300",
                                )}
                                onClick={() => {
                                  setFormData({ ...formData, priority: priority.value })
                                  if (formErrors.priority) {
                                    setFormErrors({ ...formErrors, priority: undefined })
                                  }
                                }}
                              >
                                <div className="flex items-center space-x-3">
                                  <div
                                    className={cn(
                                      "w-4 h-4 rounded-full border-2 transition-colors",
                                      formData.priority === priority.value
                                        ? "border-current bg-current"
                                        : "border-gray-300",
                                    )}
                                  >
                                    {formData.priority === priority.value && (
                                      <div className="w-full h-full rounded-full bg-white scale-50" />
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm">{priority.label}</div>
                                    <div className="text-xs text-gray-600">{priority.description}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Preferred Communication */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Preferred Communication Method</Label>
                          <Select
                            value={formData.communicationMethod || ""}
                            onValueChange={(value) => setFormData({ ...formData, communicationMethod: value })}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="How would you like to be contacted?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="phone">Phone Call</SelectItem>
                              <SelectItem value="text">Text Message</SelectItem>
                              <SelectItem value="portal">Student Portal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Session Format */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Session Format Preference</Label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                              { value: "in-person", label: "In-Person", desc: "Face-to-face meeting" },
                              { value: "video", label: "Video Call", desc: "Online video session" },
                              { value: "phone", label: "Phone Call", desc: "Audio-only session" },
                            ].map((format) => (
                              <div
                                key={format.value}
                                className={cn(
                                  "cursor-pointer rounded-lg border p-3 transition-all duration-200",
                                  formData.sessionFormat === format.value
                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                    : "border-gray-200 hover:border-gray-300",
                                )}
                                onClick={() => setFormData({ ...formData, sessionFormat: format.value })}
                              >
                                <div className="text-sm font-medium">{format.label}</div>
                                <div className="text-xs text-gray-600">{format.desc}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Details */}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div className="text-center mb-6">
                          <MessageSquare className="h-12 w-12 text-green-500 mx-auto mb-3" />
                          <h3 className="text-lg font-semibold text-gray-900">Tell us more about your situation</h3>
                          <p className="text-sm text-gray-600">This helps your counselor prepare for the session</p>
                        </div>

                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="reason" className="text-sm font-medium">
                              Brief Reason for Appointment *
                            </Label>
                            <Textarea
                              id="reason"
                              placeholder="Provide a brief summary of why you're scheduling this appointment..."
                              value={formData.reason}
                              onChange={(e) => {
                                setFormData({ ...formData, reason: e.target.value })
                                if (formErrors.reason) {
                                  setFormErrors({ ...formErrors, reason: undefined })
                                }
                              }}
                              rows={3}
                              className={cn(
                                "transition-all duration-200 resize-none",
                                formErrors.reason
                                  ? "border-red-500 focus:border-red-500 ring-red-200"
                                  : "focus:ring-2 focus:ring-blue-200",
                              )}
                            />
                            <div className="text-xs text-gray-500">{formData.reason.length}/500 characters</div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="specificConcerns" className="text-sm font-medium">
                              Specific Concerns *
                            </Label>
                            <Textarea
                              id="specificConcerns"
                              placeholder="Describe your specific concerns, symptoms, or challenges in detail. This helps the counselor prepare for your session..."
                              value={formData.specificConcerns}
                              onChange={(e) => {
                                setFormData({ ...formData, specificConcerns: e.target.value })
                                if (formErrors.specificConcerns) {
                                  setFormErrors({ ...formErrors, specificConcerns: undefined })
                                }
                              }}
                              rows={4}
                              className={cn(
                                "transition-all duration-200 resize-none",
                                formErrors.specificConcerns
                                  ? "border-red-500 focus:border-red-500 ring-red-200"
                                  : "focus:ring-2 focus:ring-blue-200",
                              )}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="expectedOutcome" className="text-sm font-medium">
                              Expected Outcome *
                            </Label>
                            <Textarea
                              id="expectedOutcome"
                              placeholder="What do you hope to achieve from this session? What would success look like for you?"
                              value={formData.expectedOutcome}
                              onChange={(e) => {
                                setFormData({ ...formData, expectedOutcome: e.target.value })
                                if (formErrors.expectedOutcome) {
                                  setFormErrors({ ...formErrors, expectedOutcome: undefined })
                                }
                              }}
                              rows={3}
                              className={cn(
                                "transition-all duration-200 resize-none",
                                formErrors.expectedOutcome
                                  ? "border-red-500 focus:border-red-500 ring-red-200"
                                  : "focus:ring-2 focus:ring-blue-200",
                              )}
                            />
                          </div>
                        </div>

                        {/* Symptom Duration */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="symptomDuration" className="text-sm font-medium">
                              How long have you been experiencing these concerns?
                            </Label>
                            <Select
                              value={formData.symptomDuration || ""}
                              onValueChange={(value) => setFormData({ ...formData, symptomDuration: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="less-than-week">Less than a week</SelectItem>
                                <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                                <SelectItem value="1-month">About a month</SelectItem>
                                <SelectItem value="2-3-months">2-3 months</SelectItem>
                                <SelectItem value="6-months">6 months or more</SelectItem>
                                <SelectItem value="over-year">Over a year</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="severityLevel" className="text-sm font-medium">
                              How would you rate the severity? (1-10)
                            </Label>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">1</span>
                              <input
                                type="range"
                                min="1"
                                max="10"
                                value={formData.severityLevel || 5}
                                onChange={(e) => setFormData({ ...formData, severityLevel: e.target.value })}
                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              />
                              <span className="text-sm text-gray-500">10</span>
                              <div className="ml-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">{formData.severityLevel || 5}</span>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">
                              1 = Mild discomfort, 10 = Severe impact on daily life
                            </div>
                          </div>
                        </div>

                        {/* Triggers and Patterns */}
                        <div className="space-y-2">
                          <Label htmlFor="triggersPatterns" className="text-sm font-medium">
                            Triggers and Patterns
                          </Label>
                          <Textarea
                            id="triggersPatterns"
                            placeholder="Are there specific situations, times of day, or events that make your concerns worse or better? Any patterns you've noticed?"
                            value={formData.triggersPatterns || ""}
                            onChange={(e) => setFormData({ ...formData, triggersPatterns: e.target.value })}
                            rows={3}
                            className="transition-all duration-200 resize-none focus:ring-2 focus:ring-blue-200"
                          />
                        </div>

                        {/* Impact Areas */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Areas of Life Being Affected</Label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                              "Academic Performance",
                              "Sleep Patterns",
                              "Social Relationships",
                              "Physical Health",
                              "Work/Employment",
                              "Family Relationships",
                              "Self-Care",
                              "Hobbies/Interests",
                            ].map((area) => (
                              <label key={area} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.impactAreas?.includes(area) || false}
                                  onChange={(e) => {
                                    const areas = formData.impactAreas || []
                                    if (e.target.checked) {
                                      setFormData({ ...formData, impactAreas: [...areas, area] })
                                    } else {
                                      setFormData({ ...formData, impactAreas: areas.filter((a) => a !== area) })
                                    }
                                  }}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{area}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Additional Context */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div className="text-center mb-6">
                          <Users className="h-12 w-12 text-purple-500 mx-auto mb-3" />
                          <h3 className="text-lg font-semibold text-gray-900">Additional context</h3>
                          <p className="text-sm text-gray-600">Help us understand your broader situation</p>
                        </div>

                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="previousAttempts" className="text-sm font-medium">
                                Previous Attempts
                              </Label>
                              <Textarea
                                id="previousAttempts"
                                placeholder="Have you tried addressing this issue before? What worked or didn't work?"
                                value={formData.previousAttempts}
                                onChange={(e) => {
                                  setFormData({ ...formData, previousAttempts: e.target.value })
                                }}
                                rows={4}
                                className="transition-all duration-200 resize-none focus:ring-2 focus:ring-blue-200"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="supportSystem" className="text-sm font-medium">
                                Current Support System *
                              </Label>
                              <Textarea
                                id="supportSystem"
                                placeholder="Describe your current support network (family, friends, other resources)..."
                                value={formData.supportSystem}
                                onChange={(e) => {
                                  setFormData({ ...formData, supportSystem: e.target.value })
                                  if (formErrors.supportSystem) {
                                    setFormErrors({ ...formErrors, supportSystem: undefined })
                                  }
                                }}
                                rows={4}
                                className={cn(
                                  "transition-all duration-200 resize-none",
                                  formErrors.supportSystem
                                    ? "border-red-500 focus:border-red-500 ring-red-200"
                                    : "focus:ring-2 focus:ring-blue-200",
                                )}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="academicImpact" className="text-sm font-medium">
                              Academic Impact
                            </Label>
                            <Textarea
                              id="academicImpact"
                              placeholder="How is this issue affecting your academic performance, if at all?"
                              value={formData.academicImpact}
                              onChange={(e) => {
                                setFormData({ ...formData, academicImpact: e.target.value })
                              }}
                              rows={3}
                              className="transition-all duration-200 resize-none focus:ring-2 focus:ring-blue-200"
                            />
                          </div>

                          {/* Medication and Treatment History */}
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
                            <h4 className="font-medium text-blue-900 flex items-center gap-2">
                              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white">!</span>
                              </div>
                              Medical and Treatment Information
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-blue-800">
                                  Are you currently taking any medications?
                                </Label>
                                <div className="space-y-2">
                                  <label className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      name="medications"
                                      value="yes"
                                      checked={formData.takingMedications === "yes"}
                                      onChange={(e) => setFormData({ ...formData, takingMedications: e.target.value })}
                                      className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm">Yes</span>
                                  </label>
                                  <label className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      name="medications"
                                      value="no"
                                      checked={formData.takingMedications === "no"}
                                      onChange={(e) => setFormData({ ...formData, takingMedications: e.target.value })}
                                      className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm">No</span>
                                  </label>
                                </div>
                                {formData.takingMedications === "yes" && (
                                  <Textarea
                                    placeholder="Please list medications and dosages..."
                                    value={formData.medicationDetails || ""}
                                    onChange={(e) => setFormData({ ...formData, medicationDetails: e.target.value })}
                                    rows={2}
                                    className="mt-2 text-sm"
                                  />
                                )}
                              </div>

                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-blue-800">
                                  Previous counseling or therapy experience?
                                </Label>
                                <div className="space-y-2">
                                  <label className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      name="previousTherapy"
                                      value="yes"
                                      checked={formData.previousTherapy === "yes"}
                                      onChange={(e) => setFormData({ ...formData, previousTherapy: e.target.value })}
                                      className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm">Yes</span>
                                  </label>
                                  <label className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      name="previousTherapy"
                                      value="no"
                                      checked={formData.previousTherapy === "no"}
                                      onChange={(e) => setFormData({ ...formData, previousTherapy: e.target.value })}
                                      className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm">No</span>
                                  </label>
                                </div>
                                {formData.previousTherapy === "yes" && (
                                  <Textarea
                                    placeholder="Please describe your previous therapy experience..."
                                    value={formData.therapyDetails || ""}
                                    onChange={(e) => setFormData({ ...formData, therapyDetails: e.target.value })}
                                    rows={2}
                                    className="mt-2 text-sm"
                                  />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Emergency Contacts */}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-4">
                            <h4 className="font-medium text-green-900">Emergency Contact Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-green-800">Emergency Contact Name</Label>
                                <Input
                                  placeholder="Full name of emergency contact"
                                  value={formData.emergencyContactName || ""}
                                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                                  className="border-green-300 focus:border-green-500"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-green-800">Emergency Contact Phone</Label>
                                <Input
                                  placeholder="Phone number"
                                  value={formData.emergencyContactPhone || ""}
                                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                                  className="border-green-300 focus:border-green-500"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-green-800">Relationship</Label>
                                <Select
                                  value={formData.emergencyContactRelation || ""}
                                  onValueChange={(value) =>
                                    setFormData({ ...formData, emergencyContactRelation: value })
                                  }
                                >
                                  <SelectTrigger className="border-green-300 focus:border-green-500">
                                    <SelectValue placeholder="Select relationship" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="parent">Parent</SelectItem>
                                    <SelectItem value="guardian">Guardian</SelectItem>
                                    <SelectItem value="sibling">Sibling</SelectItem>
                                    <SelectItem value="spouse">Spouse/Partner</SelectItem>
                                    <SelectItem value="friend">Close Friend</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>

                          {/* Goals and Preferences */}
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Specific Goals for Counseling</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                  "Reduce anxiety/stress",
                                  "Improve mood",
                                  "Better sleep",
                                  "Academic success",
                                  "Social skills",
                                  "Relationship issues",
                                  "Self-confidence",
                                  "Coping strategies",
                                  "Time management",
                                  "Career planning",
                                  "Family issues",
                                  "Other",
                                ].map((goal) => (
                                  <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={formData.counselingGoals?.includes(goal) || false}
                                      onChange={(e) => {
                                        const goals = formData.counselingGoals || []
                                        if (e.target.checked) {
                                          setFormData({ ...formData, counselingGoals: [...goals, goal] })
                                        } else {
                                          setFormData({ ...formData, counselingGoals: goals.filter((g) => g !== goal) })
                                        }
                                      }}
                                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">{goal}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="additionalInfo" className="text-sm font-medium">
                                Additional Information
                              </Label>
                              <Textarea
                                id="additionalInfo"
                                placeholder="Is there anything else you'd like your counselor to know before your first session? Any specific concerns, preferences, or questions?"
                                value={formData.additionalInfo || ""}
                                onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                                rows={4}
                                className="transition-all duration-200 resize-none focus:ring-2 focus:ring-blue-200"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </form>
                </CardContent>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex flex-col sm:flex-row gap-3 justify-between">
                  <div className="flex gap-3">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevStep}
                        disabled={isLoading}
                        className="flex-1 sm:flex-none bg-transparent"
                      >
                        Previous
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      disabled={isLoading}
                      className="flex-1 sm:flex-none bg-transparent"
                    >
                      Cancel
                    </Button>
                    {currentStep < 3 ? (
                      <Button
                        type="button"
                        onClick={handleNextStep}
                        disabled={isLoading}
                        className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700"
                      >
                        Next Step
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        onClick={handleFormSubmit}
                        disabled={isLoading}
                        className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
                      >
                        {isLoading ? "Processing..." : editingSession ? "Update Appointment" : "Schedule Appointment"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
