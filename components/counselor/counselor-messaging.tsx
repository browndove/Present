"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Send,
  Paperclip,
  ImageIcon,
  FileText,
  Smile,
  Search,
  MoreVertical,
  Pin,
  Trash2,
  Edit,
  Reply,
  Star,
  Clock,
  Check,
  CheckCheck,
  Settings,
  BellOff,
  Download,
  Calendar,
  Phone,
  MessageSquare,
  Bookmark,
  Flag,
  Lock,
  Filter,
  SortAsc,
  X,
  Plus,
  Maximize2,
  Minimize2,
  Loader2,
  AlertTriangle,
  Users,
  FileCheck,
  Activity,
  Shield,
  Copy,
  Forward,
  Mic,
  Video,
  MapPin,
  Info,
  TrendingUp,
  BarChart3,
  Mail,
  User,
  ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Keep all the existing interfaces and mock data exactly the same
interface Student {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  studentId: string
  year: string
  major: string
  status: "active" | "at-risk" | "improving" | "stable" | "crisis"
  riskLevel: "low" | "medium" | "high" | "critical"
  lastSession: Date
  nextSession?: Date
  totalSessions: number
  currentMoodAverage: number
  moodTrend: "up" | "down" | "stable"
  lastActive: Date
  onlineStatus: "online" | "away" | "busy" | "offline"
  lastSeen?: Date
  tags: string[]
  notes: string
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  preferences: {
    preferredContactMethod: "message" | "email" | "phone"
    availableHours: string
    timezone: string
  }
  caseHistory: {
    openDate: Date
    lastUpdate: Date
    priority: "low" | "medium" | "high" | "urgent"
    assignedCounselor: string
  }
}

interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole: "student" | "counselor" | "admin" | "system"
  recipientId?: string
  content: string
  timestamp: Date
  type: "text" | "image" | "file" | "system" | "appointment" | "emergency" | "template" | "reminder" | "assessment"
  status: "sending" | "sent" | "delivered" | "read"
  priority: "low" | "normal" | "high" | "urgent" | "crisis"
  replyTo?: string
  reactions?: { emoji: string; users: string[]; count: number }[]
  attachments?: {
    id: string
    name: string
    size: number
    type: string
    url: string
    thumbnail?: string
  }[]
  isEdited?: boolean
  editedAt?: Date
  isDeleted?: boolean
  deletedAt?: Date
  isStarred?: boolean
  isBookmarked?: boolean
  isFlagged?: boolean
  flagReason?: string
  scheduledFor?: Date
  location?: {
    name: string
    address: string
    coordinates?: { lat: number; lng: number }
  }
  metadata?: {
    readBy?: { userId: string; readAt: Date }[]
    forwardedFrom?: string
    originalSender?: string
    templateId?: string
    assessmentId?: string
    sessionId?: string
    reminderType?: "appointment" | "medication" | "assignment" | "check-in"
  }
  counselorNotes?: string
  followUpRequired?: boolean
  followUpDate?: Date
  isConfidential?: boolean
  supervisorNotified?: boolean
}

interface Conversation {
  id: string
  studentId: string
  student: Student
  lastMessage?: Message
  unreadCount: number
  isArchived: boolean
  isPinned: boolean
  isMuted: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
  type: "individual" | "group" | "crisis" | "support"
  title?: string
  description?: string
  settings: {
    notifications: boolean
    readReceipts: boolean
    typing: boolean
    encryption: boolean
    autoArchive: boolean
    crisisAlerts: boolean
  }
  caseInfo: {
    status: "open" | "closed" | "on-hold" | "transferred"
    priority: "low" | "medium" | "high" | "urgent"
    lastSessionDate?: Date
    nextSessionDate?: Date
    totalSessions: number
    assignedSupervisor?: string
    specialNotes?: string
  }
}

interface MessageTemplate {
  id: string
  name: string
  category: "greeting" | "appointment" | "crisis" | "follow-up" | "resources" | "assessment" | "general"
  content: string
  variables: string[]
  isActive: boolean
  createdAt: Date
  usageCount: number
}

// Keep all the existing mock data
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
    status: "improving",
    riskLevel: "low",
    lastSession: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    nextSession: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    totalSessions: 8,
    currentMoodAverage: 3.8,
    moodTrend: "up",
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    onlineStatus: "online",
    tags: ["academic", "anxiety", "progress"],
    notes: "Student showing significant improvement in anxiety management.",
    emergencyContact: {
      name: "Mary Johnson",
      relationship: "Mother",
      phone: "(555) 987-6543",
    },
    preferences: {
      preferredContactMethod: "message",
      availableHours: "9 AM - 6 PM",
      timezone: "EST",
    },
    caseHistory: {
      openDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      lastUpdate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      priority: "medium",
      assignedCounselor: "counselor1",
    },
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
    status: "at-risk",
    riskLevel: "high",
    lastSession: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    nextSession: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    totalSessions: 12,
    currentMoodAverage: 2.3,
    moodTrend: "down",
    lastActive: new Date(Date.now() - 6 * 60 * 60 * 1000),
    onlineStatus: "away",
    lastSeen: new Date(Date.now() - 6 * 60 * 60 * 1000),
    tags: ["crisis", "academic", "career", "urgent"],
    notes: "Student expressing increased stress about graduation and job search.",
    emergencyContact: {
      name: "David Chen",
      relationship: "Father",
      phone: "(555) 876-5432",
    },
    preferences: {
      preferredContactMethod: "phone",
      availableHours: "2 PM - 8 PM",
      timezone: "PST",
    },
    caseHistory: {
      openDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      lastUpdate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      priority: "urgent",
      assignedCounselor: "counselor1",
    },
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
    status: "stable",
    riskLevel: "low",
    lastSession: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    totalSessions: 5,
    currentMoodAverage: 4.1,
    moodTrend: "stable",
    lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
    onlineStatus: "online",
    tags: ["social", "academic", "stable"],
    notes: "Student maintaining good progress with social anxiety.",
    emergencyContact: {
      name: "Carlos Rodriguez",
      relationship: "Father",
      phone: "(555) 765-4321",
    },
    preferences: {
      preferredContactMethod: "message",
      availableHours: "10 AM - 4 PM",
      timezone: "EST",
    },
    caseHistory: {
      openDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      lastUpdate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      priority: "low",
      assignedCounselor: "counselor1",
    },
  },
]

const mockConversations: Conversation[] = mockStudents.map((student, index) => ({
  id: `conv${index + 1}`,
  studentId: student.id,
  student,
  lastMessage: {
    id: `msg${index + 1}`,
    senderId: index % 2 === 0 ? student.id : "counselor1",
    senderName: index % 2 === 0 ? student.name : "Dr. Jennifer Martinez",
    senderRole: index % 2 === 0 ? "student" : "counselor",
    content:
      index === 0
        ? "Thank you for the resources. I've been practicing the techniques we discussed."
        : index === 1
          ? "I'm feeling overwhelmed with my thesis and job applications. Can we schedule an emergency session?"
          : "I wanted to update you on my progress with the social anxiety exercises.",
    timestamp: new Date(Date.now() - (index + 1) * 60 * 60 * 1000),
    type: "text",
    status: "read",
    priority: index === 1 ? "urgent" : "normal",
  },
  unreadCount: index === 1 ? 2 : 0,
  isArchived: false,
  isPinned: index === 0,
  isMuted: false,
  tags: student.tags,
  createdAt: student.caseHistory.openDate,
  updatedAt: new Date(Date.now() - (index + 1) * 60 * 60 * 1000),
  type: "individual",
  settings: {
    notifications: true,
    readReceipts: true,
    typing: true,
    encryption: true,
    autoArchive: false,
    crisisAlerts: true,
  },
  caseInfo: {
    status: "open",
    priority: student.caseHistory.priority,
    lastSessionDate: student.lastSession,
    nextSessionDate: student.nextSession,
    totalSessions: student.totalSessions,
    assignedSupervisor: "supervisor1",
    specialNotes: student.notes,
  },
}))

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "student1",
    senderName: "Sarah Johnson",
    senderRole: "student",
    content: "Hi Dr. Martinez, I wanted to follow up on our last session about my study schedule.",
    timestamp: new Date(Date.now() - 86400000),
    type: "text",
    status: "read",
    priority: "normal",
  },
  {
    id: "2",
    senderId: "counselor1",
    senderName: "Dr. Jennifer Martinez",
    senderRole: "counselor",
    content: "Hello Sarah! I'm glad you're following up. How has the new schedule been working for you?",
    timestamp: new Date(Date.now() - 86400000 + 300000),
    type: "text",
    status: "read",
    priority: "normal",
    counselorNotes: "Student initiated follow-up - good sign of engagement",
  },
  {
    id: "3",
    senderId: "student1",
    senderName: "Sarah Johnson",
    senderRole: "student",
    content:
      "It's been helpful, but I'm still struggling with time management during exam periods. Do you have any additional strategies?",
    timestamp: new Date(Date.now() - 86400000 + 600000),
    type: "text",
    status: "read",
    priority: "normal",
    reactions: [
      { emoji: "👍", users: ["counselor1"], count: 1 },
      { emoji: "💡", users: ["counselor1"], count: 1 },
    ],
  },
  {
    id: "4",
    senderId: "counselor1",
    senderName: "Dr. Jennifer Martinez",
    senderRole: "counselor",
    content:
      "I have some resources that might help. Let me share a few techniques that other students have found effective.",
    timestamp: new Date(Date.now() - 86400000 + 900000),
    type: "text",
    status: "read",
    priority: "normal",
    followUpRequired: true,
    followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "5",
    senderId: "counselor1",
    senderName: "Dr. Jennifer Martinez",
    senderRole: "counselor",
    content: "Here's a comprehensive guide on exam preparation and stress management techniques.",
    timestamp: new Date(Date.now() - 86400000 + 1200000),
    type: "file",
    status: "read",
    priority: "normal",
    attachments: [
      {
        id: "att1",
        name: "Exam_Preparation_Guide.pdf",
        size: 1024576,
        type: "application/pdf",
        url: "/placeholder-file.pdf",
      },
    ],
    metadata: {
      templateId: "resource-sharing",
    },
  },
]

const mockTemplates: MessageTemplate[] = [
  {
    id: "1",
    name: "Appointment Reminder",
    category: "appointment",
    content:
      "Hi {studentName}, this is a reminder about your counseling session scheduled for {date} at {time}. Please confirm your attendance or let me know if you need to reschedule.",
    variables: ["studentName", "date", "time"],
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    usageCount: 45,
  },
  {
    id: "2",
    name: "Crisis Check-in",
    category: "crisis",
    content:
      "Hi {studentName}, I wanted to check in with you after our last conversation. How are you feeling today? Remember that I'm here to support you, and if you need immediate assistance, please don't hesitate to reach out.",
    variables: ["studentName"],
    isActive: true,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    usageCount: 23,
  },
  {
    id: "3",
    name: "Resource Sharing",
    category: "resources",
    content:
      "Hi {studentName}, I've found some resources that might be helpful for {topic}. I'll attach them to this message. Please review them when you have time and let me know if you have any questions.",
    variables: ["studentName", "topic"],
    isActive: true,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    usageCount: 67,
  },
  {
    id: "4",
    name: "Follow-up After Session",
    category: "follow-up",
    content:
      "Hi {studentName}, thank you for our session today. I wanted to follow up on the strategies we discussed. How are you feeling about implementing them? Remember to practice the techniques we covered.",
    variables: ["studentName"],
    isActive: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    usageCount: 89,
  },
]

const emojis = ["😊", "👍", "❤️", "😂", "😢", "😮", "😡", "🎉", "💡", "🔥", "✨", "💯", "🤗", "💪", "🙏", "⭐"]

export default function CounselorMessagingPage() {
  const [selectedConversation, setSelectedConversation] = useState<string>("conv1")
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [messageInput, setMessageInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false)
  const [selectedMessages, setSelectedMessages] = useState<string[]>([])
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [editingMessage, setEditingMessage] = useState<string | null>(null)
  const [showMessageActions, setShowMessageActions] = useState<string | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "urgent" | "crisis" | "archived">("all")
  const [sortBy, setSortBy] = useState<"recent" | "name" | "priority" | "status">("recent")
  const [showSettings, setShowSettings] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [showMobileConversations, setShowMobileConversations] = useState(true)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null)
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({})
  const [showCrisisModal, setShowCrisisModal] = useState(false)
  const [showBulkMessageModal, setShowBulkMessageModal] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [bulkMessage, setBulkMessage] = useState("")
  const [showStudentInfoModal, setShowStudentInfoModal] = useState(false)
  const [selectedStudentInfo, setSelectedStudentInfo] = useState<Student | null>(null)
  const [messagePriority, setMessagePriority] = useState<Message["priority"]>("normal")
  const [isConfidential, setIsConfidential] = useState(false)
  const [followUpRequired, setFollowUpRequired] = useState(false)
  const [followUpDate, setFollowUpDate] = useState("")
  const [counselorNotes, setCounselorNotes] = useState("")
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [activeTab, setActiveTab] = useState("messages")

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageInputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Enhanced mobile detection
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)

      // Auto-collapse sidebar on mobile
      if (width < 768) {
        setIsSidebarCollapsed(false) // Keep expanded on mobile for overlay
        if (selectedConversation) {
          setShowMobileConversations(false) // Show chat when conversation selected
        }
      } else if (width < 1024) {
        setIsSidebarCollapsed(true) // Collapse on tablet
      } else {
        setIsSidebarCollapsed(false) // Expand on desktop
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [selectedConversation])

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Typing indicator
  const handleTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true)
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, 2000)
  }, [isTyping])

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return

    setIsLoading(true)
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "counselor1",
      senderName: "Dr. Jennifer Martinez",
      senderRole: "counselor",
      content: messageInput.trim(),
      timestamp: new Date(),
      type: "text",
      status: "sending",
      priority: messagePriority,
      replyTo: replyingTo || undefined,
      counselorNotes: counselorNotes || undefined,
      followUpRequired,
      followUpDate: followUpDate ? new Date(followUpDate) : undefined,
      isConfidential,
    }

    setMessages((prev) => [...prev, newMessage])
    setMessageInput("")
    setReplyingTo(null)
    setCounselorNotes("")
    setFollowUpRequired(false)
    setFollowUpDate("")
    setMessagePriority("normal")
    setIsConfidential(false)

    // Simulate sending
    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "sent" } : msg)))
      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg)))
      }, 1000)
    }, 500)

    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    } else {
      handleTyping()
    }
  }

  const handleTemplateUse = (template: MessageTemplate) => {
    let content = template.content
    Object.entries(templateVariables).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{${key}}`, "g"), value)
    })
    setMessageInput(content)
    setShowTemplateModal(false)
    setSelectedTemplate(null)
    setTemplateVariables({})
  }

  const handleBulkMessage = () => {
    if (!bulkMessage.trim() || selectedStudents.length === 0) return

    selectedStudents.forEach((studentId) => {
      const newMessage: Message = {
        id: `${Date.now()}-${studentId}`,
        senderId: "counselor1",
        senderName: "Dr. Jennifer Martinez",
        senderRole: "counselor",
        recipientId: studentId,
        content: bulkMessage.trim(),
        timestamp: new Date(),
        type: "text",
        status: "sending",
        priority: messagePriority,
      }
      setMessages((prev) => [...prev, newMessage])
    })

    setBulkMessage("")
    setSelectedStudents([])
    setShowBulkMessageModal(false)
  }

  const handleCrisisAlert = (studentId: string) => {
    const crisisMessage: Message = {
      id: Date.now().toString(),
      senderId: "counselor1",
      senderName: "Dr. Jennifer Martinez",
      senderRole: "counselor",
      recipientId: studentId,
      content:
        "I'm here to support you. If you're in immediate danger, please call 911 or go to your nearest emergency room. You can also reach the crisis hotline at 988. Let's schedule an emergency session as soon as possible.",
      timestamp: new Date(),
      type: "emergency",
      status: "sending",
      priority: "crisis",
      supervisorNotified: true,
    }
    setMessages((prev) => [...prev, crisisMessage])
    setShowCrisisModal(false)
  }

  const filteredConversations = conversations.filter((conv) => {
    if (activeFilter === "unread" && conv.unreadCount === 0) return false
    if (activeFilter === "urgent" && conv.caseInfo.priority !== "urgent") return false
    if (activeFilter === "crisis" && conv.student.status !== "crisis") return false
    if (activeFilter === "archived" && !conv.isArchived) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        conv.student.name.toLowerCase().includes(query) ||
        conv.student.email.toLowerCase().includes(query) ||
        conv.student.studentId.toLowerCase().includes(query) ||
        conv.lastMessage?.content.toLowerCase().includes(query) ||
        conv.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }
    return true
  })

  const sortedConversations = [...filteredConversations].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.student.name.localeCompare(b.student.name)
      case "priority":
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.caseInfo.priority] - priorityOrder[a.caseInfo.priority]
      case "status":
        return a.student.status.localeCompare(b.student.status)
      default:
        return b.updatedAt.getTime() - a.updatedAt.getTime()
    }
  })

  const currentConversation = conversations.find((c) => c.id === selectedConversation)
  const currentStudent = currentConversation?.student

  const getStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "sending":
        return <Clock className="h-3 w-3 text-gray-400" />
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-gray-400" />
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "busy":
        return "bg-red-500"
      default:
        return "bg-gray-400"
    }
  }

  const getRiskColor = (risk: string) => {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "crisis":
        return "bg-red-500 text-white"
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "normal":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile Overlay */}
      {isMobile && showMobileConversations && selectedConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowMobileConversations(false)} />
      )}

      {/* Enhanced Responsive Sidebar */}
      <div
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-50",
          // Desktop behavior
          !isMobile && !isTablet && (isSidebarCollapsed ? "w-16" : "w-96"),
          // Tablet behavior
          isTablet && (isSidebarCollapsed ? "w-16" : "w-80"),
          // Mobile behavior
          isMobile && "fixed inset-y-0 left-0 w-full max-w-sm",
          isMobile && !showMobileConversations && "-translate-x-full",
          isMobile && showMobileConversations && "translate-x-0",
        )}
      >
        {/* Enhanced Mobile-Friendly Header */}
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileConversations(false)}
                  className="md:hidden"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <h1
                className={cn(
                  "text-lg sm:text-xl font-semibold text-gray-900",
                  isSidebarCollapsed && !isMobile && "hidden",
                )}
              >
                {isMobile ? "Messages" : "Student Messages"}
              </h1>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              {!isSidebarCollapsed && (
                <>
                  <Button variant="ghost" size="sm" onClick={() => setShowBulkMessageModal(true)}>
                    <Users className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowTemplateModal(true)}>
                    <FileText className="h-4 w-4" />
                  </Button>
                  {!isMobile && (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => setShowAnalytics(true)}>
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)}>
                        <Settings className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </>
              )}
              {!isMobile && (
                <Button variant="ghost" size="sm" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
                  {isSidebarCollapsed ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>

          {!isSidebarCollapsed && (
            <>
              {/* Enhanced Mobile-Friendly Search */}
              <div className="relative mb-3 sm:mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 sm:h-10"
                />
              </div>

              {/* Enhanced Mobile-Friendly Filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3 sm:mb-4">
                <Select value={activeFilter} onValueChange={(value: any) => setActiveFilter(value)}>
                  <SelectTrigger className="w-full sm:w-32 h-9">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="crisis">Crisis</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-full sm:w-32 h-9">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recent</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Enhanced Mobile-Friendly Quick Stats */}
              <div className="grid grid-cols-3 gap-2 mb-3 sm:mb-4">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <div className="text-sm sm:text-lg font-bold text-blue-600">
                    {conversations.filter((c) => c.unreadCount > 0).length}
                  </div>
                  <div className="text-xs text-blue-600">Unread</div>
                </div>
                <div className="text-center p-2 bg-red-50 rounded-lg">
                  <div className="text-sm sm:text-lg font-bold text-red-600">
                    {conversations.filter((c) => c.caseInfo.priority === "urgent").length}
                  </div>
                  <div className="text-xs text-red-600">Urgent</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <div className="text-sm sm:text-lg font-bold text-green-600">
                    {conversations.filter((c) => c.student.onlineStatus === "online").length}
                  </div>
                  <div className="text-xs text-green-600">Online</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Enhanced Mobile-Friendly Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {sortedConversations.map((conversation) => {
            const student = conversation.student
            const isSelected = conversation.id === selectedConversation
            return (
              <div
                key={conversation.id}
                className={cn(
                  "p-3 sm:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                  isSelected && "bg-blue-50 border-blue-200",
                  isSidebarCollapsed && !isMobile && "p-2",
                  conversation.caseInfo.priority === "urgent" && "border-l-4 border-l-red-500",
                  conversation.student.status === "crisis" && "border-l-4 border-l-red-600",
                )}
                onClick={() => {
                  setSelectedConversation(conversation.id)
                  if (isMobile) {
                    setShowMobileConversations(false)
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                      <AvatarImage src={student.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
                        getStatusColor(student.onlineStatus),
                      )}
                    />
                    {student.status === "crisis" && (
                      <div className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-2 w-2 text-white" />
                      </div>
                    )}
                  </div>

                  {(!isSidebarCollapsed || isMobile) && (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <h3 className="font-medium text-gray-900 truncate text-sm sm:text-base">{student.name}</h3>
                          <Badge
                            className={cn(getRiskColor(student.riskLevel), "text-xs flex-shrink-0")}
                            variant="secondary"
                          >
                            {student.riskLevel}
                          </Badge>
                          {conversation.isPinned && <Pin className="h-3 w-3 text-blue-500 flex-shrink-0" />}
                          {conversation.isMuted && <BellOff className="h-3 w-3 text-gray-400 flex-shrink-0" />}
                          {conversation.settings.encryption && (
                            <Lock className="h-3 w-3 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {conversation.unreadCount > 0 && (
                            <Badge variant="default" className="bg-blue-500 text-white text-xs px-1.5 py-0.5">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500">
                            {conversation.lastMessage && formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          {student.year} • {student.major}
                        </p>
                        <Badge
                          className={cn(getPriorityColor(conversation.caseInfo.priority), "text-xs flex-shrink-0")}
                          variant="secondary"
                        >
                          {conversation.caseInfo.priority}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-xs sm:text-sm text-gray-600 truncate flex-1">
                          {conversation.lastMessage?.content || "No messages yet"}
                        </p>
                        {conversation.lastMessage && getStatusIcon(conversation.lastMessage.status)}
                      </div>

                      {conversation.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {conversation.tags.slice(0, isMobile ? 2 : 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {conversation.tags.length > (isMobile ? 2 : 3) && (
                            <Badge variant="secondary" className="text-xs">
                              +{conversation.tags.length - (isMobile ? 2 : 3)}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Mobile-Friendly Quick Actions */}
                      <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedStudentInfo(student)
                            setShowStudentInfoModal(true)
                          }}
                        >
                          <Info className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.location.href = `tel:${student.phone}`
                          }}
                        >
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.location.href = `mailto:${student.email}`
                          }}
                        >
                          <Mail className="h-3 w-3" />
                        </Button>
                        {student.status === "crisis" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-500"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCrisisAlert(student.id)
                            }}
                          >
                            <AlertTriangle className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Enhanced Responsive Main Chat Area */}
      <div className={cn("flex-1 flex flex-col min-w-0", isMobile && showMobileConversations && "hidden")}>
        {currentConversation && currentStudent ? (
          <>
            {/* Enhanced Mobile-Friendly Chat Header */}
            <div className="bg-white border-b border-gray-200 p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  {isMobile && (
                    <Button variant="ghost" size="sm" onClick={() => setShowMobileConversations(true)}>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  )}
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                      <AvatarImage src={currentStudent.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {currentStudent.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white",
                        getStatusColor(currentStudent.onlineStatus),
                      )}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                        {currentStudent.name}
                      </h2>
                      <Badge
                        className={cn(getRiskColor(currentStudent.riskLevel), "text-xs flex-shrink-0")}
                        variant="secondary"
                      >
                        {currentStudent.riskLevel}
                      </Badge>
                      {currentStudent.status === "crisis" && (
                        <Badge className="bg-red-500 text-white text-xs flex-shrink-0" variant="secondary">
                          CRISIS
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                      <span className="truncate">{currentStudent.studentId}</span>
                      <span>•</span>
                      <span className="truncate">{currentStudent.year}</span>
                      {!isMobile && (
                        <>
                          <span>•</span>
                          <span className="truncate">{currentStudent.major}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-500">
                      {currentStudent.onlineStatus === "online" ? (
                        <span className="text-green-600">Online now</span>
                      ) : (
                        <span>Last seen {currentStudent.lastSeen && formatTime(currentStudent.lastSeen)}</span>
                      )}
                      <span>•</span>
                      <span>{currentConversation.caseInfo.totalSessions} sessions</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Mobile-Friendly Header Actions */}
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedStudentInfo(currentStudent)
                      setShowStudentInfoModal(true)
                    }}
                  >
                    <User className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => (window.location.href = `tel:${currentStudent.phone}`)}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  {!isMobile && (
                    <>
                      <Button variant="ghost" size="sm">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {currentStudent.status === "crisis" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() => handleCrisisAlert(currentStudent.id)}
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Enhanced Mobile-Friendly Case Info Bar */}
              <div className="mt-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span>
                      <strong>Last Session:</strong> {formatTime(currentStudent.lastSession)}
                    </span>
                    {currentStudent.nextSession && (
                      <span>
                        <strong>Next Session:</strong> {formatTime(currentStudent.nextSession)}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <strong>Mood:</strong>
                      {currentStudent.moodTrend === "up" ? (
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                      ) : currentStudent.moodTrend === "down" ? (
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 rotate-180" />
                      ) : (
                        <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                      )}
                    </span>
                  </div>
                  <Badge
                    className={cn(getPriorityColor(currentConversation.caseInfo.priority), "text-xs flex-shrink-0")}
                    variant="secondary"
                  >
                    {currentConversation.caseInfo.priority} priority
                  </Badge>
                </div>
              </div>

              {isTyping && <div className="mt-2 text-sm text-gray-500 italic">{currentStudent.name} is typing...</div>}
            </div>

            {/* Enhanced Mobile-Friendly Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
              {messages.map((message) => {
                const isOwn = message.senderRole === "counselor"
                const replyToMessage = message.replyTo ? messages.find((m) => m.id === message.replyTo) : null
                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2 sm:gap-3 group",
                      isOwn ? "justify-end" : "justify-start",
                      selectedMessages.includes(message.id) && "bg-blue-50 -mx-3 sm:-mx-4 px-3 sm:px-4 py-2 rounded",
                    )}
                  >
                    {!isOwn && (
                      <Avatar className="h-6 w-6 sm:h-8 sm:w-8 mt-1 flex-shrink-0">
                        <AvatarImage src={currentStudent.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {currentStudent.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className={cn("max-w-[85%] sm:max-w-[70%] space-y-1", isOwn && "items-end")}>
                      {/* Reply Context */}
                      {replyToMessage && (
                        <div className="bg-gray-100 border-l-4 border-blue-500 p-2 rounded text-sm">
                          <div className="font-medium text-gray-600">{replyToMessage.senderName}</div>
                          <div className="text-gray-500 truncate">{replyToMessage.content}</div>
                        </div>
                      )}

                      {/* Enhanced Mobile-Friendly Message Content */}
                      <div
                        className={cn(
                          "rounded-lg px-3 sm:px-4 py-2 relative group",
                          isOwn ? "bg-blue-500 text-white" : "bg-white border border-gray-200 text-gray-900",
                          message.priority === "crisis" && "ring-2 ring-red-500",
                          message.priority === "urgent" && "ring-2 ring-orange-500",
                          message.priority === "high" && "ring-2 ring-yellow-500",
                          message.isConfidential && "border-2 border-purple-300",
                        )}
                      >
                        {/* Priority & Confidential Indicators */}
                        <div className="flex items-center gap-1 sm:gap-2 mb-1 flex-wrap">
                          {message.priority !== "normal" && (
                            <Badge className={cn(getPriorityColor(message.priority), "text-xs")} variant="secondary">
                              {message.priority}
                            </Badge>
                          )}
                          {message.isConfidential && (
                            <Badge className="bg-purple-100 text-purple-800 text-xs" variant="secondary">
                              <Lock className="h-3 w-3 mr-1" />
                              Confidential
                            </Badge>
                          )}
                          {message.followUpRequired && (
                            <Badge className="bg-orange-100 text-orange-800 text-xs" variant="secondary">
                              <Clock className="h-3 w-3 mr-1" />
                              Follow-up
                            </Badge>
                          )}
                        </div>

                        {/* Message Text */}
                        <p className="whitespace-pre-wrap break-words text-sm sm:text-base">{message.content}</p>

                        {/* Counselor Notes (only visible to counselor) */}
                        {message.counselorNotes && isOwn && (
                          <div className="mt-2 p-2 bg-blue-400 rounded text-sm">
                            <div className="font-medium text-blue-100">Private Note:</div>
                            <div className="text-blue-100">{message.counselorNotes}</div>
                          </div>
                        )}

                        {/* Enhanced Mobile-Friendly Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.attachments.map((attachment) => (
                              <div
                                key={attachment.id}
                                className={cn(
                                  "flex items-center gap-2 p-2 rounded border",
                                  isOwn ? "bg-blue-400 border-blue-300" : "bg-gray-50 border-gray-200",
                                )}
                              >
                                {attachment.type.startsWith("image/") ? (
                                  <div className="flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4 flex-shrink-0" />
                                    <img
                                      src={attachment.url || "/placeholder.svg"}
                                      alt={attachment.name}
                                      className="max-w-32 sm:max-w-48 max-h-24 sm:max-h-32 rounded object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <FileText className="h-4 w-4 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                      <div className="text-sm font-medium truncate">{attachment.name}</div>
                                      <div className="text-xs opacity-70">{formatFileSize(attachment.size)}</div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0">
                                      <Download className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Enhanced Mobile-Friendly Message Actions */}
                        <div className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-1 flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => setReplyingTo(message.id)}
                            >
                              <Reply className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Star className="h-3 w-3" />
                            </Button>
                            {!isMobile && (
                              <>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Forward className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                            {isOwn && (
                              <>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Message Footer */}
                      <div className={cn("flex items-center gap-2 text-xs", isOwn ? "justify-end" : "justify-start")}>
                        <span className="text-gray-500">{formatTime(message.timestamp)}</span>
                        {isOwn && getStatusIcon(message.status)}
                        {message.isStarred && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                        {message.isBookmarked && <Bookmark className="h-3 w-3 text-blue-500" />}
                        {message.isFlagged && <Flag className="h-3 w-3 text-red-500" />}
                        {message.supervisorNotified && <Shield className="h-3 w-3 text-purple-500" />}
                      </div>

                      {/* Follow-up Date */}
                      {message.followUpDate && (
                        <div className="text-xs text-gray-500">Follow-up: {formatTime(message.followUpDate)}</div>
                      )}

                      {/* Reactions */}
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {message.reactions.map((reaction) => (
                            <button
                              key={reaction.emoji}
                              className="flex items-center gap-1 px-2 py-1 rounded-full text-xs border bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                              <span>{reaction.emoji}</span>
                              <span>{reaction.count}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {isOwn && (
                      <Avatar className="h-6 w-6 sm:h-8 sm:w-8 mt-1 flex-shrink-0">
                        <AvatarFallback className="bg-blue-500 text-white text-xs">You</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Context */}
            {replyingTo && (
              <div className="bg-blue-50 border-t border-blue-200 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Reply className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-blue-700">
                      Replying to {messages.find((m) => m.id === replyingTo)?.senderName}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-blue-600 mt-1 truncate">
                  {messages.find((m) => m.id === replyingTo)?.content}
                </p>
              </div>
            )}

            {/* Enhanced Mobile-Friendly Message Input */}
            <div className="bg-white border-t border-gray-200 p-3 sm:p-4">
              {/* Message Options Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
                  <Select value={messagePriority} onValueChange={(value: any) => setMessagePriority(value)}>
                    <SelectTrigger className="w-full sm:w-32 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="crisis">Crisis</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox id="confidential" checked={isConfidential} onCheckedChange={setIsConfidential} />
                      <Label htmlFor="confidential" className="text-sm">
                        Confidential
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox id="followup" checked={followUpRequired} onCheckedChange={setFollowUpRequired} />
                      <Label htmlFor="followup" className="text-sm">
                        Follow-up
                      </Label>
                    </div>
                  </div>
                </div>

                {followUpRequired && (
                  <Input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full sm:w-40 h-9"
                    min={new Date().toISOString().split("T")[0]}
                  />
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTemplateModal(true)}
                  className="w-full sm:w-auto"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Templates
                </Button>
              </div>

              {/* Counselor Notes */}
              {counselorNotes && (
                <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Label className="text-sm font-medium text-yellow-800">Private Notes:</Label>
                  <p className="text-sm text-yellow-700">{counselorNotes}</p>
                </div>
              )}

              <div className="flex items-end gap-2 sm:gap-3">
                {/* Enhanced Mobile-Friendly Attachment Menu */}
                <div className="relative">
                  <Button variant="ghost" size="sm" onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}>
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  {showAttachmentMenu && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 space-y-1 w-48 z-10">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => {
                          fileInputRef.current?.click()
                          setShowAttachmentMenu(false)
                        }}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Document
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => {
                          const input = document.createElement("input")
                          input.type = "file"
                          input.accept = "image/*"
                          input.click()
                          setShowAttachmentMenu(false)
                        }}
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Image
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => {
                          setShowScheduleModal(true)
                          setShowAttachmentMenu(false)
                        }}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Message
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => {
                          setShowAttachmentMenu(false)
                        }}
                      >
                        <Mic className="h-4 w-4 mr-2" />
                        Voice Note
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => {
                          setShowAttachmentMenu(false)
                        }}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Location
                      </Button>
                    </div>
                  )}
                </div>

                {/* Enhanced Mobile-Friendly Message Input */}
                <div className="flex-1 relative">
                  <Textarea
                    ref={messageInputRef}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    className="min-h-[40px] max-h-32 resize-none pr-20 text-sm sm:text-base"
                    rows={1}
                  />

                  {/* Emoji Button */}
                  <div className="absolute right-2 bottom-2 flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Enhanced Mobile-Friendly Emoji Picker */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10">
                      <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                        {emojis.map((emoji) => (
                          <button
                            key={emoji}
                            className="p-2 hover:bg-gray-100 rounded text-lg"
                            onClick={() => {
                              setMessageInput((prev) => prev + emoji)
                              setShowEmojiPicker(false)
                            }}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Counselor Notes Input */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const notes = prompt("Add private counselor notes:")
                    if (notes) setCounselorNotes(notes)
                  }}
                  className="text-yellow-600"
                >
                  <FileCheck className="h-4 w-4" />
                </Button>

                {/* Send Button */}
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || isLoading}
                  className="bg-blue-500 hover:bg-blue-600 h-10 px-4"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a student</h3>
              <p className="text-gray-500">Choose a student to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input ref={fileInputRef} type="file" multiple className="hidden" />

      {/* Enhanced Mobile-Friendly Template Modal */}
      <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
        <DialogContent className="w-[95vw] max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Message Templates</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="use" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="use">Use Template</TabsTrigger>
              <TabsTrigger value="manage">Manage Templates</TabsTrigger>
            </TabsList>
            <TabsContent value="use" className="space-y-4">
              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {mockTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{template.name}</h4>
                        <Badge variant="secondary">{template.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{template.content}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Used {template.usageCount} times</span>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedTemplate(template)
                            if (template.variables.length > 0) {
                              const variables: Record<string, string> = {}
                              template.variables.forEach((variable) => {
                                const value = prompt(`Enter value for ${variable}:`)
                                if (value) variables[variable] = value
                              })
                              setTemplateVariables(variables)
                            }
                            handleTemplateUse(template)
                          }}
                        >
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="manage" className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Template Management</h4>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Template
                </Button>
              </div>
              <div className="space-y-2">
                {mockTemplates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h5 className="font-medium">{template.name}</h5>
                      <p className="text-sm text-gray-500">{template.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Enhanced Mobile-Friendly Bulk Message Modal */}
      <Dialog open={showBulkMessageModal} onOpenChange={setShowBulkMessageModal}>
        <DialogContent className="w-[95vw] max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Send Bulk Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Students</Label>
              <div className="max-h-48 overflow-y-auto border rounded-lg p-3 space-y-2">
                {mockStudents.map((student) => (
                  <div key={student.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={student.id}
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedStudents([...selectedStudents, student.id])
                        } else {
                          setSelectedStudents(selectedStudents.filter((id) => id !== student.id))
                        }
                      }}
                    />
                    <Label htmlFor={student.id} className="flex items-center gap-2 cursor-pointer flex-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={student.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="flex-1">{student.name}</span>
                      <Badge className={getRiskColor(student.riskLevel)} variant="secondary">
                        {student.riskLevel}
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                value={bulkMessage}
                onChange={(e) => setBulkMessage(e.target.value)}
                placeholder="Enter your message..."
                rows={4}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button variant="outline" onClick={() => setShowBulkMessageModal(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button
                onClick={handleBulkMessage}
                disabled={!bulkMessage.trim() || selectedStudents.length === 0}
                className="w-full sm:w-auto"
              >
                Send to {selectedStudents.length} students
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Mobile-Friendly Student Info Modal */}
      <Dialog open={showStudentInfoModal} onOpenChange={setShowStudentInfoModal}>
        <DialogContent className="w-[95vw] max-w-3xl mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Information</DialogTitle>
          </DialogHeader>
          {selectedStudentInfo && (
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="case">Case Info</TabsTrigger>
                <TabsTrigger value="sessions">Sessions</TabsTrigger>
                <TabsTrigger value="emergency">Emergency</TabsTrigger>
              </TabsList>
              <TabsContent value="profile" className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedStudentInfo.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {selectedStudentInfo.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-semibold">{selectedStudentInfo.name}</h3>
                    <p className="text-gray-600">{selectedStudentInfo.studentId}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                      <Badge className={getRiskColor(selectedStudentInfo.riskLevel)} variant="secondary">
                        {selectedStudentInfo.riskLevel} risk
                      </Badge>
                      <Badge variant="secondary">{selectedStudentInfo.status}</Badge>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-medium">Academic Info</Label>
                    <div className="space-y-1 text-sm">
                      <p>Year: {selectedStudentInfo.year}</p>
                      <p>Major: {selectedStudentInfo.major}</p>
                      <p>Email: {selectedStudentInfo.email}</p>
                      <p>Phone: {selectedStudentInfo.phone}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="font-medium">Preferences</Label>
                    <div className="space-y-1 text-sm">
                      <p>Contact Method: {selectedStudentInfo.preferences.preferredContactMethod}</p>
                      <p>Available Hours: {selectedStudentInfo.preferences.availableHours}</p>
                      <p>Timezone: {selectedStudentInfo.preferences.timezone}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="case" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-medium">Case Status</Label>
                    <div className="space-y-2 text-sm">
                      <p>Priority: {selectedStudentInfo.caseHistory.priority}</p>
                      <p>Opened: {selectedStudentInfo.caseHistory.openDate.toLocaleDateString()}</p>
                      <p>Last Update: {selectedStudentInfo.caseHistory.lastUpdate.toLocaleDateString()}</p>
                      <p>Total Sessions: {selectedStudentInfo.totalSessions}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="font-medium">Current Status</Label>
                    <div className="space-y-2 text-sm">
                      <p>Mood Average: {selectedStudentInfo.currentMoodAverage.toFixed(1)}/5</p>
                      <p>Trend: {selectedStudentInfo.moodTrend}</p>
                      <p>Last Active: {formatTime(selectedStudentInfo.lastActive)}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="font-medium">Notes</Label>
                  <p className="text-sm text-gray-600 mt-1">{selectedStudentInfo.notes}</p>
                </div>
                <div>
                  <Label className="font-medium">Tags</Label>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {selectedStudentInfo.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="sessions" className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">Session History</Label>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Session
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Last Session</span>
                        <span className="text-sm text-gray-500">{formatTime(selectedStudentInfo.lastSession)}</span>
                      </div>
                      <p className="text-sm text-gray-600">Individual counseling session - anxiety management</p>
                    </div>
                    {selectedStudentInfo.nextSession && (
                      <div className="p-3 border rounded-lg bg-blue-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Next Session</span>
                          <span className="text-sm text-blue-600">{formatTime(selectedStudentInfo.nextSession)}</span>
                        </div>
                        <p className="text-sm text-gray-600">Scheduled follow-up session</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="emergency" className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Emergency Contact</h4>
                  <div className="space-y-1 text-sm">
                    <p>Name: {selectedStudentInfo.emergencyContact.name}</p>
                    <p>Relationship: {selectedStudentInfo.emergencyContact.relationship}</p>
                    <p>Phone: {selectedStudentInfo.emergencyContact.phone}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    <Button
                      size="sm"
                      onClick={() => (window.location.href = `tel:${selectedStudentInfo.emergencyContact.phone}`)}
                      className="w-full sm:w-auto"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Emergency Contact
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCrisisAlert(selectedStudentInfo.id)}
                      className="w-full sm:w-auto"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Initiate Crisis Protocol
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Enhanced Mobile-Friendly Schedule Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Schedule Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea placeholder="Enter your scheduled message..." rows={3} />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => {
                  setShowScheduleModal(false)
                  setScheduledDate("")
                  setScheduledTime("")
                }}
                className="flex-1"
              >
                Schedule
              </Button>
              <Button variant="outline" onClick={() => setShowScheduleModal(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
