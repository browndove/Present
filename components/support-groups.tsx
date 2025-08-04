"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Send,
  Paperclip,
  ImageIcon,
  FileText,
  Smile,
  Search,
  MoreVertical,
  Pin,
  Reply,
  Star,
  Clock,
  Check,
  CheckCheck,
  Settings,
  BellOff,
  Download,
  Bookmark,
  Flag,
  Filter,
  X,
  Users,
  Shield,
  AlertTriangle,
  Info,
  Heart,
  Brain,
  BookOpen,
  Coffee,
  Zap,
  Target,
  UserPlus,
  Crown,
  Gavel,
  Megaphone,
  ChevronRight,
  Loader2,
  CheckCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface GroupMessage {
  id: string
  senderId: string
  senderName: string
  senderRole: "student" | "moderator" | "admin" | "counselor"
  content: string
  timestamp: Date
  type: "text" | "image" | "file" | "system" | "announcement" | "poll"
  status: "sending" | "sent" | "delivered" | "read"
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
  isPinned?: boolean
  pinnedBy?: string
  pinnedAt?: Date
  isAnnouncement?: boolean
  priority?: "low" | "normal" | "high" | "urgent"
  isStarred?: boolean
  isBookmarked?: boolean
  isFlagged?: boolean
  flagReason?: string
  reportedBy?: string[]
  moderatedBy?: string
  moderationAction?: "approved" | "warning" | "removed"
  mentions?: string[]
  readBy?: { userId: string; readAt: Date }[]
}

interface SupportGroup {
  id: string
  name: string
  description: string
  category: "anxiety" | "depression" | "academic" | "social" | "wellness" | "crisis" | "general" | "grief"
  type: "open" | "closed" | "private" | "moderated"
  memberCount: number
  maxMembers: number
  isActive: boolean
  createdAt: Date
  lastActivity: Date
  avatar?: string
  coverImage?: string
  tags: string[]
  rules: string[]
  guidelines: string[]
  moderators: {
    id: string
    name: string
    role: "admin" | "moderator" | "counselor"
    avatar?: string
    title?: string
  }[]
  members: {
    id: string
    name: string
    avatar?: string
    joinedAt: Date
    role: "member" | "moderator" | "admin"
    status: "online" | "away" | "busy" | "offline"
    lastSeen?: Date
    isVerified?: boolean
    warningCount?: number
    isMuted?: boolean
    mutedUntil?: Date
  }[]
  settings: {
    allowInvites: boolean
    requireApproval: boolean
    allowFileSharing: boolean
    allowImageSharing: boolean
    moderationLevel: "low" | "medium" | "high" | "strict"
    autoModeration: boolean
    profanityFilter: boolean
    linkSharing: boolean
    anonymousPosting: boolean
    readReceipts: boolean
    typingIndicators: boolean
  }
  stats: {
    totalMessages: number
    activeMembers: number
    weeklyActivity: number
    averageResponseTime: number
    satisfactionRating: number
  }
  joinRequests?: {
    id: string
    userId: string
    userName: string
    requestedAt: Date
    message?: string
    status: "pending" | "approved" | "rejected"
  }[]
  announcements?: {
    id: string
    title: string
    content: string
    author: string
    createdAt: Date
    isPinned: boolean
  }[]
}

interface GroupCategory {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  groups: number
  isPopular?: boolean
}

const groupCategories: GroupCategory[] = [
  {
    id: "anxiety",
    name: "Anxiety Support",
    description: "Support for anxiety, panic attacks, and stress management",
    icon: Brain,
    color: "bg-blue-500",
    groups: 12,
    isPopular: true,
  },
  {
    id: "depression",
    name: "Depression Support",
    description: "Support for depression, mood disorders, and emotional wellness",
    icon: Heart,
    color: "bg-purple-500",
    groups: 8,
    isPopular: true,
  },
  {
    id: "academic",
    name: "Academic Stress",
    description: "Study stress, exam anxiety, and academic pressure support",
    icon: BookOpen,
    color: "bg-green-500",
    groups: 15,
    isPopular: true,
  },
  {
    id: "social",
    name: "Social Connection",
    description: "Building friendships, social anxiety, and relationship support",
    icon: Users,
    color: "bg-orange-500",
    groups: 10,
  },
  {
    id: "wellness",
    name: "General Wellness",
    description: "Overall mental health, self-care, and wellness practices",
    icon: Zap,
    color: "bg-teal-500",
    groups: 6,
  },
  {
    id: "grief",
    name: "Grief & Loss",
    description: "Support for loss, bereavement, and major life changes",
    icon: Coffee,
    color: "bg-gray-500",
    groups: 3,
  },
  {
    id: "crisis",
    name: "Crisis Support",
    description: "Immediate support for mental health crises (Moderated 24/7)",
    icon: AlertTriangle,
    color: "bg-red-500",
    groups: 2,
  },
]

const mockGroups: SupportGroup[] = [
  {
    id: "1",
    name: "Anxiety Warriors",
    description:
      "A supportive community for students dealing with anxiety. Share coping strategies, celebrate victories, and find understanding peers.",
    category: "anxiety",
    type: "open",
    memberCount: 127,
    maxMembers: 200,
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 90),
    lastActivity: new Date(Date.now() - 300000),
    avatar: "/placeholder.svg?height=60&width=60&text=AW",
    tags: ["anxiety", "coping", "peer-support", "mindfulness"],
    rules: [
      "Be respectful and kind to all members",
      "No medical advice - share experiences only",
      "Respect privacy - what's shared here stays here",
      "Use trigger warnings when discussing difficult topics",
      "No spam or promotional content",
    ],
    guidelines: [
      "Share your experiences, not medical advice",
      "Use 'I' statements when sharing",
      "Be supportive and non-judgmental",
      "Take breaks if discussions become overwhelming",
      "Report concerning messages to moderators",
    ],
    moderators: [
      {
        id: "mod1",
        name: "Dr. Sarah Chen",
        role: "counselor",
        avatar: "/placeholder.svg?height=40&width=40&text=SC",
        title: "Licensed Therapist",
      },
      {
        id: "mod2",
        name: "Alex Rivera",
        role: "moderator",
        avatar: "/placeholder.svg?height=40&width=40&text=AR",
        title: "Peer Moderator",
      },
    ],
    members: [
      {
        id: "user1",
        name: "You",
        joinedAt: new Date(Date.now() - 86400000 * 30),
        role: "member",
        status: "online",
      },
      {
        id: "user2",
        name: "Emma Thompson",
        avatar: "/placeholder.svg?height=32&width=32&text=ET",
        joinedAt: new Date(Date.now() - 86400000 * 45),
        role: "member",
        status: "online",
        isVerified: true,
      },
      {
        id: "user3",
        name: "Michael Johnson",
        avatar: "/placeholder.svg?height=32&width=32&text=MJ",
        joinedAt: new Date(Date.now() - 86400000 * 60),
        role: "member",
        status: "away",
      },
    ],
    settings: {
      allowInvites: true,
      requireApproval: false,
      allowFileSharing: true,
      allowImageSharing: true,
      moderationLevel: "medium",
      autoModeration: true,
      profanityFilter: true,
      linkSharing: true,
      anonymousPosting: false,
      readReceipts: true,
      typingIndicators: true,
    },
    stats: {
      totalMessages: 2847,
      activeMembers: 89,
      weeklyActivity: 156,
      averageResponseTime: 12,
      satisfactionRating: 4.7,
    },
  },
  {
    id: "2",
    name: "Study Stress Solutions",
    description:
      "Connect with fellow students facing academic pressure. Share study tips, time management strategies, and emotional support during exam periods.",
    category: "academic",
    type: "open",
    memberCount: 203,
    maxMembers: 300,
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 120),
    lastActivity: new Date(Date.now() - 600000),
    avatar: "/placeholder.svg?height=60&width=60&text=SSS",
    tags: ["academic", "study-tips", "exam-stress", "time-management"],
    rules: [
      "Focus on emotional support, not academic cheating",
      "Share study strategies and coping methods",
      "Be encouraging and supportive",
      "No sharing of assignment answers or solutions",
      "Respect different learning styles and approaches",
    ],
    guidelines: [
      "Share what works for you, not universal advice",
      "Be understanding of different academic pressures",
      "Celebrate small victories and progress",
      "Offer encouragement during difficult periods",
      "Maintain academic integrity in all discussions",
    ],
    moderators: [
      {
        id: "mod3",
        name: "Dr. James Wilson",
        role: "counselor",
        avatar: "/placeholder.svg?height=40&width=40&text=JW",
        title: "Academic Counselor",
      },
    ],
    members: [
      {
        id: "user1",
        name: "You",
        joinedAt: new Date(Date.now() - 86400000 * 20),
        role: "member",
        status: "online",
      },
    ],
    settings: {
      allowInvites: true,
      requireApproval: false,
      allowFileSharing: true,
      allowImageSharing: true,
      moderationLevel: "medium",
      autoModeration: true,
      profanityFilter: true,
      linkSharing: true,
      anonymousPosting: false,
      readReceipts: true,
      typingIndicators: true,
    },
    stats: {
      totalMessages: 4521,
      activeMembers: 145,
      weeklyActivity: 287,
      averageResponseTime: 8,
      satisfactionRating: 4.5,
    },
  },
  {
    id: "3",
    name: "Crisis Support Network",
    description:
      "24/7 moderated support for students in mental health crisis. Professional counselors available. Immediate help and resources.",
    category: "crisis",
    type: "moderated",
    memberCount: 45,
    maxMembers: 100,
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 180),
    lastActivity: new Date(Date.now() - 120000),
    avatar: "/placeholder.svg?height=60&width=60&text=CSN",
    tags: ["crisis", "emergency", "professional", "24-7"],
    rules: [
      "This is for crisis situations only",
      "Professional counselors monitor 24/7",
      "Call emergency services for immediate danger",
      "All messages are confidential but monitored",
      "Be respectful of others in crisis",
    ],
    guidelines: [
      "Share your immediate concerns honestly",
      "Follow professional guidance provided",
      "Use crisis hotlines for immediate danger",
      "Support others with empathy and care",
      "Report any concerning behavior immediately",
    ],
    moderators: [
      {
        id: "mod4",
        name: "Dr. Maria Rodriguez",
        role: "counselor",
        avatar: "/placeholder.svg?height=40&width=40&text=MR",
        title: "Crisis Counselor",
      },
      {
        id: "mod5",
        name: "Dr. David Kim",
        role: "counselor",
        avatar: "/placeholder.svg?height=40&width=40&text=DK",
        title: "Emergency Therapist",
      },
    ],
    members: [
      {
        id: "user1",
        name: "You",
        joinedAt: new Date(Date.now() - 86400000 * 10),
        role: "member",
        status: "online",
      },
    ],
    settings: {
      allowInvites: false,
      requireApproval: true,
      allowFileSharing: false,
      allowImageSharing: false,
      moderationLevel: "strict",
      autoModeration: true,
      profanityFilter: true,
      linkSharing: false,
      anonymousPosting: true,
      readReceipts: false,
      typingIndicators: true,
    },
    stats: {
      totalMessages: 892,
      activeMembers: 23,
      weeklyActivity: 67,
      averageResponseTime: 3,
      satisfactionRating: 4.9,
    },
  },
]

const mockMessages: GroupMessage[] = [
  {
    id: "1",
    senderId: "mod1",
    senderName: "Dr. Sarah Chen",
    senderRole: "counselor",
    content:
      "Welcome everyone! Remember that this is a safe space for sharing and supporting each other. Please review our group guidelines pinned above.",
    timestamp: new Date(Date.now() - 86400000 * 2),
    type: "announcement",
    status: "read",
    isPinned: true,
    pinnedBy: "mod1",
    pinnedAt: new Date(Date.now() - 86400000 * 2),
    isAnnouncement: true,
  },
  {
    id: "2",
    senderId: "user2",
    senderName: "Emma Thompson",
    senderRole: "student",
    content:
      "Hi everyone! I've been dealing with some intense anxiety about my upcoming presentations. Does anyone have tips for managing presentation anxiety?",
    timestamp: new Date(Date.now() - 86400000),
    type: "text",
    status: "read",
    reactions: [
      { emoji: "❤️", users: ["user3", "mod1"], count: 2 },
      { emoji: "🤗", users: ["user1"], count: 1 },
    ],
  },
  {
    id: "3",
    senderId: "user3",
    senderName: "Michael Johnson",
    senderRole: "student",
    content:
      "I totally understand that feeling! What's helped me is practicing in front of a mirror first, then with close friends. Also, deep breathing exercises right before presenting.",
    timestamp: new Date(Date.now() - 86400000 + 1800000),
    type: "text",
    status: "read",
    replyTo: "2",
    reactions: [{ emoji: "👍", users: ["user2", "mod1"], count: 2 }],
  },
  {
    id: "4",
    senderId: "user1",
    senderName: "You",
    senderRole: "student",
    content:
      "I've found that preparing really well helps reduce my anxiety. Also, reminding myself that everyone wants me to succeed, not fail.",
    timestamp: new Date(Date.now() - 86400000 + 3600000),
    type: "text",
    status: "read",
    replyTo: "2",
    isStarred: true,
  },
  {
    id: "5",
    senderId: "mod1",
    senderName: "Dr. Sarah Chen",
    senderRole: "counselor",
    content:
      "These are all excellent suggestions! I'd also recommend the 4-7-8 breathing technique and progressive muscle relaxation. Here's a helpful resource on presentation anxiety management.",
    timestamp: new Date(Date.now() - 86400000 + 5400000),
    type: "file",
    status: "read",
    replyTo: "2",
    attachments: [
      {
        id: "att1",
        name: "Presentation_Anxiety_Guide.pdf",
        size: 1024576,
        type: "application/pdf",
        url: "/placeholder-file.pdf",
      },
    ],
  },
  {
    id: "6",
    senderId: "user2",
    senderName: "Emma Thompson",
    senderRole: "student",
    content: "Thank you all so much! This community is amazing. I feel so much more confident now. 💙",
    timestamp: new Date(Date.now() - 86400000 + 7200000),
    type: "text",
    status: "read",
    reactions: [
      { emoji: "❤️", users: ["user1", "user3", "mod1"], count: 3 },
      { emoji: "🎉", users: ["mod1"], count: 1 },
    ],
  },
  {
    id: "7",
    senderId: "user1",
    senderName: "You",
    senderRole: "student",
    content: "Has anyone tried the mindfulness app that was mentioned last week? I'm curious about your experiences.",
    timestamp: new Date(Date.now() - 300000),
    type: "text",
    status: "delivered",
  },
]

const emojis = ["😊", "👍", "❤️", "😂", "😢", "😮", "😡", "🎉", "💡", "🔥", "✨", "💯", "🤗", "💙", "🌟", "👏"]

export function SupportGroups() {
  const [currentView, setCurrentView] = useState<"browse" | "group">("browse")
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [messages, setMessages] = useState<GroupMessage[]>(mockMessages)
  const [messageInput, setMessageInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [editingMessage, setEditingMessage] = useState<string | null>(null)
  const [showGroupInfo, setShowGroupInfo] = useState(false)
  const [showMembers, setShowMembers] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [joinMessage, setJoinMessage] = useState("")
  const [showRulesModal, setShowRulesModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [reportedMessageId, setReportedMessageId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileGroupList, setShowMobileGroupList] = useState(true)
  const [hasAcceptedRules, setHasAcceptedRules] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageInputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Typing indicator simulation
  useEffect(() => {
    if (isTyping) {
      const timeout = setTimeout(() => {
        setTypingUsers(["Emma Thompson", "Michael Johnson"])
        setTimeout(() => setTypingUsers([]), 3000)
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [isTyping])

  const handleJoinGroup = async (groupId: string) => {
    const group = mockGroups.find((g) => g.id === groupId)
    if (!group) return

    if (group.settings.requireApproval) {
      setShowJoinModal(true)
      return
    }

    setIsLoading(true)
    // Simulate joining
    setTimeout(() => {
      setSelectedGroup(groupId)
      setCurrentView("group")
      setShowMobileGroupList(false)
      setIsLoading(false)
    }, 1000)
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return

    setIsLoading(true)
    const newMessage: GroupMessage = {
      id: Date.now().toString(),
      senderId: "user1",
      senderName: "You",
      senderRole: "student",
      content: messageInput.trim(),
      timestamp: new Date(),
      type: "text",
      status: "sending",
      replyTo: replyingTo || undefined,
    }

    setMessages((prev) => [...prev, newMessage])
    setMessageInput("")
    setReplyingTo(null)
    setIsTyping(true)

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
    }
  }

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || []
          const existingReaction = reactions.find((r) => r.emoji === emoji)

          if (existingReaction) {
            if (existingReaction.users.includes("user1")) {
              existingReaction.users = existingReaction.users.filter((u) => u !== "user1")
              existingReaction.count--
              if (existingReaction.count === 0) {
                return { ...msg, reactions: reactions.filter((r) => r.emoji !== emoji) }
              }
            } else {
              existingReaction.users.push("user1")
              existingReaction.count++
            }
          } else {
            reactions.push({ emoji, users: ["user1"], count: 1 })
          }

          return { ...msg, reactions }
        }
        return msg
      }),
    )
  }

  const handleReportMessage = (messageId: string) => {
    setReportedMessageId(messageId)
    setShowReportModal(true)
  }

  const submitReport = () => {
    // Handle report submission
    setShowReportModal(false)
    setReportedMessageId(null)
    setReportReason("")
  }

  const filteredGroups = mockGroups.filter((group) => {
    if (selectedCategory !== "all" && group.category !== selectedCategory) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        group.name.toLowerCase().includes(query) ||
        group.description.toLowerCase().includes(query) ||
        group.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }
    return true
  })

  const currentGroup = selectedGroup ? mockGroups.find((g) => g.id === selectedGroup) : null

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

  const getStatusIcon = (status: GroupMessage["status"]) => {
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

  if (currentView === "browse") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Student Support Groups</h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Connect with fellow students in safe, moderated support groups. Share experiences, find understanding,
                and build meaningful connections.
              </p>
            </div>

            {/* Community Guidelines Alert */}
            <Alert className="mb-8 border-blue-200 bg-blue-50">
              <Shield className="h-5 w-5 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <div className="space-y-2">
                  <div className="font-semibold">Community Guidelines & Safety</div>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Treat all members with respect, kindness, and empathy</li>
                    <li>• Share experiences, not medical advice - consult professionals for treatment</li>
                    <li>• Maintain confidentiality - what's shared here stays here</li>
                    <li>• Use trigger warnings when discussing sensitive topics</li>
                    <li>• Report concerning behavior to moderators immediately</li>
                    <li>• Follow group-specific rules and moderator guidance</li>
                  </ul>
                  <div className="text-sm font-medium mt-3">
                    🚨 Crisis Support: If you're in immediate danger, call 911 or your local emergency services. For
                    mental health crisis support, call 988 (Suicide & Crisis Lifeline).
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search support groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {groupCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {groupCategories.map((category) => {
              const CategoryIcon = category.icon
              return (
                <Card
                  key={category.id}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-lg border-2",
                    selectedCategory === category.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn("p-2 rounded-lg text-white", category.color)}>
                        <CategoryIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{category.name}</h3>
                        {category.isPopular && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            Popular
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{category.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{category.groups} groups</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Groups List */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                {selectedCategory === "all"
                  ? "All Support Groups"
                  : `${groupCategories.find((c) => c.id === selectedCategory)?.name} Groups`}
              </h2>
              <div className="text-sm text-gray-500">{filteredGroups.length} groups found</div>
            </div>

            <div className="grid gap-4 sm:gap-6">
              {filteredGroups.map((group) => {
                const categoryInfo = groupCategories.find((c) => c.id === group.category)
                const CategoryIcon = categoryInfo?.icon || Users

                return (
                  <Card key={group.id} className="hover:shadow-lg transition-shadow border border-gray-200">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Group Avatar */}
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                              <AvatarImage src={group.avatar || "/placeholder.svg"} />
                              <AvatarFallback className={cn("text-white text-lg", categoryInfo?.color)}>
                                <CategoryIcon className="h-8 w-8" />
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={cn(
                                "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
                                group.isActive ? "bg-green-500" : "bg-gray-400",
                              )}
                            />
                          </div>
                        </div>

                        {/* Group Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{group.name}</h3>
                                <Badge variant={group.type === "open" ? "secondary" : "outline"} className="text-xs">
                                  {group.type}
                                </Badge>
                                {group.category === "crisis" && (
                                  <Badge variant="destructive" className="text-xs">
                                    24/7 Moderated
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{group.description}</p>
                            </div>
                          </div>

                          {/* Group Stats */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                            <div className="text-center sm:text-left">
                              <div className="text-lg sm:text-xl font-semibold text-gray-900">{group.memberCount}</div>
                              <div className="text-xs text-gray-500">Members</div>
                            </div>
                            <div className="text-center sm:text-left">
                              <div className="text-lg sm:text-xl font-semibold text-green-600">
                                {group.stats.activeMembers}
                              </div>
                              <div className="text-xs text-gray-500">Active</div>
                            </div>
                            <div className="text-center sm:text-left">
                              <div className="text-lg sm:text-xl font-semibold text-blue-600">
                                {group.stats.weeklyActivity}
                              </div>
                              <div className="text-xs text-gray-500">Weekly Posts</div>
                            </div>
                            <div className="text-center sm:text-left">
                              <div className="text-lg sm:text-xl font-semibold text-purple-600">
                                {group.stats.satisfactionRating}★
                              </div>
                              <div className="text-xs text-gray-500">Rating</div>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {group.tags.slice(0, 4).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {group.tags.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{group.tags.length - 4} more
                              </Badge>
                            )}
                          </div>

                          {/* Moderators */}
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm text-gray-600">Moderated by:</span>
                            <div className="flex -space-x-2">
                              {group.moderators.slice(0, 3).map((mod) => (
                                <Avatar key={mod.id} className="h-6 w-6 border-2 border-white">
                                  <AvatarImage src={mod.avatar || "/placeholder.svg"} />
                                  <AvatarFallback className="text-xs">
                                    {mod.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                            <div className="flex items-center gap-1">
                              {group.moderators.some((m) => m.role === "counselor") && (
                                <Shield className="h-4 w-4 text-green-500" />
                              )}
                              <span className="text-xs text-gray-500">
                                {group.moderators.length} moderator{group.moderators.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <Button
                              onClick={() => handleJoinGroup(group.id)}
                              disabled={isLoading}
                              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700"
                            >
                              {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <UserPlus className="h-4 w-4 mr-2" />
                              )}
                              {group.settings.requireApproval ? "Request to Join" : "Join Group"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedGroup(group.id)
                                setShowRulesModal(true)
                              }}
                              className="flex-1 sm:flex-none"
                            >
                              <Info className="h-4 w-4 mr-2" />
                              View Rules
                            </Button>
                            <Button variant="ghost" size="sm" className="sm:px-3">
                              <Bookmark className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredGroups.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No groups found</h3>
                <p className="text-gray-500">Try adjusting your search or category filter</p>
              </div>
            )}
          </div>
        </div>

        {/* Join Group Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Request to Join Group</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  This group requires approval to join. Please tell the moderators why you'd like to join.
                </p>
                <Textarea
                  placeholder="Why would you like to join this support group?"
                  value={joinMessage}
                  onChange={(e) => setJoinMessage(e.target.value)}
                  rows={4}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setShowJoinModal(false)
                      setJoinMessage("")
                    }}
                    className="flex-1"
                    disabled={!joinMessage.trim()}
                  >
                    Send Request
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowJoinModal(false)
                      setJoinMessage("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Rules Modal */}
        {showRulesModal && selectedGroup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Group Rules & Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {(() => {
                  const group = mockGroups.find((g) => g.id === selectedGroup)
                  if (!group) return null

                  return (
                    <>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Community Rules</h3>
                        <ul className="space-y-2">
                          {group.rules.map((rule, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{rule}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Guidelines for Participation</h3>
                        <ul className="space-y-2">
                          {group.guidelines.map((guideline, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>{guideline}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          <strong>Important:</strong> Violation of these rules may result in warnings, temporary
                          suspension, or permanent removal from the group. All conversations are monitored by trained
                          moderators for safety.
                        </AlertDescription>
                      </Alert>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setHasAcceptedRules(true)
                            setShowRulesModal(false)
                            handleJoinGroup(selectedGroup)
                          }}
                          className="flex-1"
                        >
                          I Understand & Accept
                        </Button>
                        <Button variant="outline" onClick={() => setShowRulesModal(false)}>
                          Close
                        </Button>
                      </div>
                    </>
                  )
                })()}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    )
  }

  // Group Chat View
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Group Sidebar */}
      <div
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col w-80",
          isMobile && !showMobileGroupList && "hidden",
          isMobile && "w-full",
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCurrentView("browse")
                setSelectedGroup(null)
              }}
              className="text-blue-600 hover:text-blue-700"
            >
              ← Back to Groups
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {currentGroup && (
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={currentGroup.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-blue-500 text-white">
                  {currentGroup.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-900 truncate">{currentGroup.name}</h2>
                <p className="text-sm text-gray-500">{currentGroup.memberCount} members</p>
              </div>
            </div>
          )}
        </div>

        {/* Group Info */}
        {currentGroup && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Group Description */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2">About</h3>
              <p className="text-sm text-gray-600">{currentGroup.description}</p>
            </div>

            {/* Group Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-900">{currentGroup.stats.activeMembers}</div>
                <div className="text-xs text-gray-500">Active Members</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-blue-600">{currentGroup.stats.weeklyActivity}</div>
                <div className="text-xs text-gray-500">Weekly Messages</div>
              </div>
            </div>

            {/* Moderators */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Moderators</h3>
              <div className="space-y-2">
                {currentGroup.moderators.map((mod) => (
                  <div key={mod.id} className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={mod.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">
                        {mod.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">{mod.name}</div>
                      <div className="text-xs text-gray-500">{mod.title}</div>
                    </div>
                    {mod.role === "counselor" && <Shield className="h-4 w-4 text-green-500" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-transparent"
                onClick={() => setShowMembers(true)}
              >
                <Users className="h-4 w-4 mr-2" />
                View Members ({currentGroup.memberCount})
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-transparent"
                onClick={() => setShowRulesModal(true)}
              >
                <Shield className="h-4 w-4 mr-2" />
                Group Rules
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <BellOff className="h-4 w-4 mr-2" />
                Mute Notifications
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className={cn("flex-1 flex flex-col", isMobile && showMobileGroupList && "hidden")}>
        {currentGroup ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isMobile && (
                    <Button variant="ghost" size="sm" onClick={() => setShowMobileGroupList(true)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentGroup.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {currentGroup.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold text-gray-900">{currentGroup.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{currentGroup.stats.activeMembers} active</span>
                      <span>•</span>
                      <span>{currentGroup.memberCount} members</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {typingUsers.length > 0 && (
                <div className="mt-2 text-sm text-gray-500 italic">
                  {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
                </div>
              )}
            </div>

            {/* Safety Notice */}
            <Alert className="m-4 border-blue-200 bg-blue-50">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-sm">
                This is a safe, moderated space. All messages are monitored by trained professionals. Remember to be
                respectful and follow group guidelines.
              </AlertDescription>
            </Alert>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isOwn = message.senderId === "user1"
                const replyToMessage = message.replyTo ? messages.find((m) => m.id === message.replyTo) : null

                return (
                  <div key={message.id} className="space-y-2">
                    {/* Pinned/Announcement Messages */}
                    {(message.isPinned || message.isAnnouncement) && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          {message.isPinned && <Pin className="h-4 w-4 text-yellow-600" />}
                          {message.isAnnouncement && <Megaphone className="h-4 w-4 text-blue-600" />}
                          <span className="text-sm font-medium text-gray-900">
                            {message.isAnnouncement ? "Announcement" : "Pinned Message"}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className={cn("flex gap-3 group", isOwn && "justify-end")}>
                      {!isOwn && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="text-xs">
                            {message.senderName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className={cn("max-w-[70%] space-y-1", isOwn && "items-end")}>
                        {/* Sender Name & Role */}
                        {!isOwn && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">{message.senderName}</span>
                            {message.senderRole === "counselor" && (
                              <Badge variant="secondary" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Counselor
                              </Badge>
                            )}
                            {message.senderRole === "moderator" && (
                              <Badge variant="outline" className="text-xs">
                                <Gavel className="h-3 w-3 mr-1" />
                                Moderator
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Reply Context */}
                        {replyToMessage && (
                          <div className="bg-gray-100 border-l-4 border-blue-500 p-2 rounded text-sm">
                            <div className="font-medium text-gray-600">{replyToMessage.senderName}</div>
                            <div className="text-gray-500 truncate">{replyToMessage.content}</div>
                          </div>
                        )}

                        {/* Message Content */}
                        <div
                          className={cn(
                            "rounded-lg px-4 py-2 relative group",
                            isOwn ? "bg-blue-500 text-white" : "bg-white border border-gray-200 text-gray-900",
                            message.isAnnouncement && "bg-blue-50 border-blue-200",
                            message.isPinned && "bg-yellow-50 border-yellow-200",
                          )}
                        >
                          {/* Message Actions */}
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
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => setShowEmojiPicker(true)}
                              >
                                <Smile className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleReportMessage(message.id)}
                              >
                                <Flag className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <p className="whitespace-pre-wrap break-words">{message.content}</p>

                          {/* Attachments */}
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
                                  <FileText className="h-4 w-4" />
                                  <div>
                                    <div className="text-sm font-medium">{attachment.name}</div>
                                    <div className="text-xs opacity-70">
                                      {(attachment.size / 1024 / 1024).toFixed(1)} MB
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <Download className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Message Footer */}
                        <div className={cn("flex items-center gap-2 text-xs", isOwn ? "justify-end" : "justify-start")}>
                          <span className="text-gray-500">{formatTime(message.timestamp)}</span>
                          {isOwn && getStatusIcon(message.status)}
                          {message.isStarred && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                        </div>

                        {/* Reactions */}
                        {message.reactions && message.reactions.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {message.reactions.map((reaction) => (
                              <button
                                key={reaction.emoji}
                                className={cn(
                                  "flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-colors",
                                  reaction.users.includes("user1")
                                    ? "bg-blue-100 border-blue-300 text-blue-700"
                                    : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200",
                                )}
                                onClick={() => handleReaction(message.id, reaction.emoji)}
                              >
                                <span>{reaction.emoji}</span>
                                <span>{reaction.count}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {isOwn && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback className="bg-blue-500 text-white text-xs">You</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
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

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-end gap-3">
                {/* Attachment Button */}
                <div className="relative">
                  <Button variant="ghost" size="sm" onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}>
                    <Paperclip className="h-4 w-4" />
                  </Button>

                  {showAttachmentMenu && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 space-y-1">
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
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="flex-1 relative">
                  <Textarea
                    ref={messageInputRef}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Share your thoughts with the group..."
                    className="min-h-[40px] max-h-32 resize-none pr-20"
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

                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                      <div className="grid grid-cols-6 gap-2">
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

                {/* Send Button */}
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || isLoading}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>

              {/* Community Guidelines Reminder */}
              <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                <Shield className="h-3 w-3" />
                <span>
                  Remember to be respectful and follow community guidelines. Messages are monitored for safety.
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a support group</h3>
              <p className="text-gray-500">Choose a group to start connecting with peers</p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input ref={fileInputRef} type="file" multiple className="hidden" />

      {/* Members Modal */}
      {showMembers && currentGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Group Members ({currentGroup.memberCount})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentGroup.members.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-sm">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
                        getStatusColor(member.status),
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{member.name}</span>
                      {member.role === "admin" && <Crown className="h-4 w-4 text-yellow-500" />}
                      {member.role === "moderator" && <Gavel className="h-4 w-4 text-blue-500" />}
                      {member.isVerified && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                    <div className="text-sm text-gray-500">
                      Joined {formatTime(member.joinedAt)} • {member.status}
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-end pt-4">
                <Button onClick={() => setShowMembers(false)}>Close</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Flag className="h-5 w-5" />
                Report Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Help us keep this community safe. Why are you reporting this message?
              </p>
              <Select value={reportReason} onValueChange={setReportReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inappropriate">Inappropriate content</SelectItem>
                  <SelectItem value="harassment">Harassment or bullying</SelectItem>
                  <SelectItem value="spam">Spam or promotional content</SelectItem>
                  <SelectItem value="medical">Inappropriate medical advice</SelectItem>
                  <SelectItem value="crisis">Mental health crisis concern</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Textarea placeholder="Additional details (optional)" rows={3} />
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 text-sm">
                  Reports are reviewed by moderators within 24 hours. For immediate safety concerns, contact campus
                  security or emergency services.
                </AlertDescription>
              </Alert>
              <div className="flex gap-2">
                <Button onClick={submitReport} disabled={!reportReason} className="flex-1 bg-red-600 hover:bg-red-700">
                  Submit Report
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReportModal(false)
                    setReportedMessageId(null)
                    setReportReason("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
