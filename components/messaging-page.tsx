"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole: "student" | "counselor" | "admin"
  content: string
  timestamp: Date
  type: "text" | "image" | "file" | "system" | "appointment" | "emergency"
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
  priority?: "low" | "normal" | "high" | "urgent"
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
  }
}

interface Conversation {
  id: string
  participants: {
    id: string
    name: string
    role: "student" | "counselor" | "admin"
    avatar?: string
    status: "online" | "away" | "busy" | "offline"
    lastSeen?: Date
    title?: string
    department?: string
  }[]
  lastMessage?: Message
  unreadCount: number
  isArchived: boolean
  isPinned: boolean
  isMuted: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
  type: "direct" | "group" | "support"
  title?: string
  description?: string
  settings: {
    notifications: boolean
    readReceipts: boolean
    typing: boolean
    encryption: boolean
  }
}

interface Draft {
  conversationId: string
  content: string
  attachments: File[]
  replyTo?: string
  scheduledFor?: Date
  lastSaved: Date
}

interface UserPreferences {
  theme: "light" | "dark" | "auto"
  fontSize: "small" | "medium" | "large"
  soundEnabled: boolean
  notificationsEnabled: boolean
  readReceipts: boolean
  typingIndicators: boolean
  messagePreview: boolean
  compactMode: boolean
  autoSave: boolean
  encryption: boolean
  language: string
  timezone: string
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    participants: [
      {
        id: "student1",
        name: "You",
        role: "student",
        status: "online",
      },
      {
        id: "counselor1",
        name: "Dr. Sarah Johnson",
        role: "counselor",
        avatar: "/placeholder.svg?height=40&width=40&text=SJ",
        status: "online",
        title: "Senior Academic Counselor",
        department: "Student Services",
        lastSeen: new Date(),
      },
    ],
    lastMessage: {
      id: "msg1",
      senderId: "counselor1",
      senderName: "Dr. Sarah Johnson",
      senderRole: "counselor",
      content: "I've reviewed your academic plan. Let's schedule a follow-up meeting to discuss your progress.",
      timestamp: new Date(Date.now() - 300000),
      type: "text",
      status: "read",
    },
    unreadCount: 0,
    isArchived: false,
    isPinned: true,
    isMuted: false,
    tags: ["academic", "important"],
    createdAt: new Date(Date.now() - 86400000 * 7),
    updatedAt: new Date(Date.now() - 300000),
    type: "direct",
    settings: {
      notifications: true,
      readReceipts: true,
      typing: true,
      encryption: true,
    },
  },
  {
    id: "2",
    participants: [
      {
        id: "student1",
        name: "You",
        role: "student",
        status: "online",
      },
      {
        id: "counselor2",
        name: "Dr. Michael Chen",
        role: "counselor",
        avatar: "/placeholder.svg?height=40&width=40&text=MC",
        status: "away",
        title: "Licensed Clinical Psychologist",
        department: "Wellness Center",
        lastSeen: new Date(Date.now() - 1800000),
      },
    ],
    lastMessage: {
      id: "msg2",
      senderId: "student1",
      senderName: "You",
      senderRole: "student",
      content: "Thank you for the coping strategies. They've been really helpful.",
      timestamp: new Date(Date.now() - 3600000),
      type: "text",
      status: "read",
    },
    unreadCount: 2,
    isArchived: false,
    isPinned: false,
    isMuted: false,
    tags: ["mental-health", "personal"],
    createdAt: new Date(Date.now() - 86400000 * 14),
    updatedAt: new Date(Date.now() - 3600000),
    type: "direct",
    settings: {
      notifications: true,
      readReceipts: true,
      typing: true,
      encryption: true,
    },
  },
  {
    id: "3",
    participants: [
      {
        id: "student1",
        name: "You",
        role: "student",
        status: "online",
      },
      {
        id: "counselor3",
        name: "Dr. Emily Rodriguez",
        role: "counselor",
        avatar: "/placeholder.svg?height=40&width=40&text=ER",
        status: "busy",
        title: "Career Development Specialist",
        department: "Career Center",
        lastSeen: new Date(Date.now() - 900000),
      },
    ],
    lastMessage: {
      id: "msg3",
      senderId: "counselor3",
      senderName: "Dr. Emily Rodriguez",
      senderRole: "counselor",
      content:
        "I've attached some internship opportunities that match your interests. Take a look and let me know which ones appeal to you.",
      timestamp: new Date(Date.now() - 7200000),
      type: "text",
      status: "delivered",
      attachments: [
        {
          id: "att1",
          name: "Internship_Opportunities_2024.pdf",
          size: 2048576,
          type: "application/pdf",
          url: "/placeholder-file.pdf",
        },
      ],
    },
    unreadCount: 1,
    isArchived: false,
    isPinned: false,
    isMuted: false,
    tags: ["career", "internships"],
    createdAt: new Date(Date.now() - 86400000 * 21),
    updatedAt: new Date(Date.now() - 7200000),
    type: "direct",
    settings: {
      notifications: true,
      readReceipts: true,
      typing: true,
      encryption: true,
    },
  },
]

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "student1",
    senderName: "You",
    senderRole: "student",
    content: "Hi Dr. Johnson, I wanted to follow up on our last meeting about my study schedule.",
    timestamp: new Date(Date.now() - 86400000),
    type: "text",
    status: "read",
  },
  {
    id: "2",
    senderId: "counselor1",
    senderName: "Dr. Sarah Johnson",
    senderRole: "counselor",
    content: "Hello! I'm glad you're following up. How has the new schedule been working for you?",
    timestamp: new Date(Date.now() - 86400000 + 300000),
    type: "text",
    status: "read",
  },
  {
    id: "3",
    senderId: "student1",
    senderName: "You",
    senderRole: "student",
    content:
      "It's been helpful, but I'm still struggling with time management during exam periods. Do you have any additional strategies?",
    timestamp: new Date(Date.now() - 86400000 + 600000),
    type: "text",
    status: "read",
    reactions: [
      { emoji: "👍", users: ["counselor1"], count: 1 },
      { emoji: "💡", users: ["counselor1"], count: 1 },
    ],
  },
  {
    id: "4",
    senderId: "counselor1",
    senderName: "Dr. Sarah Johnson",
    senderRole: "counselor",
    content:
      "I have some resources that might help. Let me share a few techniques that other students have found effective.",
    timestamp: new Date(Date.now() - 86400000 + 900000),
    type: "text",
    status: "read",
  },
  {
    id: "5",
    senderId: "counselor1",
    senderName: "Dr. Sarah Johnson",
    senderRole: "counselor",
    content: "Here's a comprehensive guide on exam preparation and stress management techniques.",
    timestamp: new Date(Date.now() - 86400000 + 1200000),
    type: "file",
    status: "read",
    attachments: [
      {
        id: "att1",
        name: "Exam_Preparation_Guide.pdf",
        size: 1024576,
        type: "application/pdf",
        url: "/placeholder-file.pdf",
      },
    ],
  },
  {
    id: "6",
    senderId: "student1",
    senderName: "You",
    senderRole: "student",
    content: "Thank you so much! This is exactly what I needed. I'll review this and implement the strategies.",
    timestamp: new Date(Date.now() - 86400000 + 1500000),
    type: "text",
    status: "read",
    isStarred: true,
  },
  {
    id: "7",
    senderId: "counselor1",
    senderName: "Dr. Sarah Johnson",
    senderRole: "counselor",
    content: "I've reviewed your academic plan. Let's schedule a follow-up meeting to discuss your progress.",
    timestamp: new Date(Date.now() - 300000),
    type: "text",
    status: "read",
    priority: "high",
  },
]

const emojis = ["😊", "👍", "❤️", "😂", "😢", "😮", "😡", "🎉", "💡", "🔥", "✨", "💯"]

export function MessagingPage() {
  const [selectedConversation, setSelectedConversation] = useState<string>("1")
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
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "starred" | "archived">("all")
  const [sortBy, setSortBy] = useState<"recent" | "name" | "unread">("recent")
  const [showSettings, setShowSettings] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileConversations, setShowMobileConversations] = useState(true)

  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    theme: "light",
    fontSize: "medium",
    soundEnabled: true,
    notificationsEnabled: true,
    readReceipts: true,
    typingIndicators: true,
    messagePreview: true,
    compactMode: false,
    autoSave: true,
    encryption: true,
    language: "en",
    timezone: "UTC",
  })

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

  // Auto-save drafts
  useEffect(() => {
    if (messageInput.trim() && userPreferences.autoSave) {
      const draft: Draft = {
        conversationId: selectedConversation,
        content: messageInput,
        attachments: [],
        lastSaved: new Date(),
      }
      setDrafts((prev) => {
        const existing = prev.findIndex((d) => d.conversationId === selectedConversation)
        if (existing >= 0) {
          const updated = [...prev]
          updated[existing] = draft
          return updated
        }
        return [...prev, draft]
      })
    }
  }, [messageInput, selectedConversation, userPreferences.autoSave])

  // Load draft when switching conversations
  useEffect(() => {
    const draft = drafts.find((d) => d.conversationId === selectedConversation)
    if (draft) {
      setMessageInput(draft.content)
    } else {
      setMessageInput("")
    }
  }, [selectedConversation, drafts])

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
      senderId: "student1",
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

    // Clear draft
    setDrafts((prev) => prev.filter((d) => d.conversationId !== selectedConversation))

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

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || []
          const existingReaction = reactions.find((r) => r.emoji === emoji)

          if (existingReaction) {
            if (existingReaction.users.includes("student1")) {
              // Remove reaction
              existingReaction.users = existingReaction.users.filter((u) => u !== "student1")
              existingReaction.count--
              if (existingReaction.count === 0) {
                return { ...msg, reactions: reactions.filter((r) => r.emoji !== emoji) }
              }
            } else {
              // Add reaction
              existingReaction.users.push("student1")
              existingReaction.count++
            }
          } else {
            // New reaction
            reactions.push({ emoji, users: ["student1"], count: 1 })
          }

          return { ...msg, reactions }
        }
        return msg
      }),
    )
  }

  const handleStarMessage = (messageId: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg)))
  }

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, isDeleted: true, deletedAt: new Date(), content: "This message was deleted" }
          : msg,
      ),
    )
  }

  const handleEditMessage = (messageId: string, newContent: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, content: newContent, isEdited: true, editedAt: new Date() } : msg,
      ),
    )
    setEditingMessage(null)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const attachment = {
          id: Date.now().toString(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
        }

        const newMessage: Message = {
          id: Date.now().toString(),
          senderId: "student1",
          senderName: "You",
          senderRole: "student",
          content: `Shared ${file.type.startsWith("image/") ? "an image" : "a file"}: ${file.name}`,
          timestamp: new Date(),
          type: file.type.startsWith("image/") ? "image" : "file",
          status: "sending",
          attachments: [attachment],
        }

        setMessages((prev) => [...prev, newMessage])
      })
    }
  }

  const filteredConversations = conversations.filter((conv) => {
    if (activeFilter === "unread" && conv.unreadCount === 0) return false
    if (activeFilter === "starred" && !conv.isPinned) return false
    if (activeFilter === "archived" && !conv.isArchived) return false

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        conv.participants.some((p) => p.name.toLowerCase().includes(query)) ||
        conv.lastMessage?.content.toLowerCase().includes(query) ||
        conv.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    return true
  })

  const sortedConversations = [...filteredConversations].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.participants[1]?.name.localeCompare(b.participants[1]?.name || "") || 0
      case "unread":
        return b.unreadCount - a.unreadCount
      default:
        return b.updatedAt.getTime() - a.updatedAt.getTime()
    }
  })

  const currentConversation = conversations.find((c) => c.id === selectedConversation)
  const currentCounselor = currentConversation?.participants.find((p) => p.role === "counselor")

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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
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

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden mx-2">
      {/* Sidebar - Conversations List */}
      <div
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
          isSidebarCollapsed ? "w-16" : "w-80",
          isMobile && !showMobileConversations && "hidden",
          isMobile && "w-full",
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className={cn("text-xl font-semibold text-gray-900", isSidebarCollapsed && "hidden")}>Messages</h1>
            <div className="flex items-center gap-2">
              {!isSidebarCollapsed && (
                <>
                  <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
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
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 mb-4">
                <Select value={activeFilter} onValueChange={(value: any) => setActiveFilter(value)}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="starred">Starred</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-32">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recent</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {sortedConversations.map((conversation) => {
            const counselor = conversation.participants.find((p) => p.role === "counselor")
            const isSelected = conversation.id === selectedConversation

            return (
              <div
                key={conversation.id}
                className={cn(
                  "p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                  isSelected && "bg-blue-50 border-blue-200",
                  isSidebarCollapsed && "p-2",
                )}
                onClick={() => {
                  setSelectedConversation(conversation.id)
                  if (isMobile) {
                    setShowMobileConversations(false)
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={counselor?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {counselor?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
                        getStatusColor(counselor?.status || "offline"),
                      )}
                    />
                  </div>

                  {!isSidebarCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900 truncate">{counselor?.name}</h3>
                          {conversation.isPinned && <Pin className="h-3 w-3 text-blue-500" />}
                          {conversation.isMuted && <BellOff className="h-3 w-3 text-gray-400" />}
                          {conversation.settings.encryption && <Lock className="h-3 w-3 text-green-500" />}
                        </div>
                        <div className="flex items-center gap-1">
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

                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600 truncate flex-1">
                          {conversation.lastMessage?.content || "No messages yet"}
                        </p>
                        {conversation.lastMessage && getStatusIcon(conversation.lastMessage.status)}
                      </div>

                      {conversation.tags.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {conversation.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={cn("flex-1 flex flex-col", isMobile && showMobileConversations && "hidden")}>
        {currentConversation && currentCounselor ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isMobile && (
                    <Button variant="ghost" size="sm" onClick={() => setShowMobileConversations(true)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={currentCounselor.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {currentCounselor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
                        getStatusColor(currentCounselor.status),
                      )}
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{currentCounselor.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{currentCounselor.title}</span>
                      {currentCounselor.status === "online" ? (
                        <span className="text-green-600">Online</span>
                      ) : (
                        <span>Last seen {currentCounselor.lastSeen && formatTime(currentCounselor.lastSeen)}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {isTyping && (
                <div className="mt-2 text-sm text-gray-500 italic">{currentCounselor.name} is typing...</div>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isOwn = message.senderId === "student1"
                const replyToMessage = message.replyTo ? messages.find((m) => m.id === message.replyTo) : null

                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3 group",
                      isOwn ? "justify-end" : "justify-start",
                      selectedMessages.includes(message.id) && "bg-blue-50 -mx-4 px-4 py-2 rounded",
                    )}
                  >
                    {!isOwn && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={currentCounselor?.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {currentCounselor?.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className={cn("max-w-[70%] space-y-1", isOwn && "items-end")}>
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
                          message.priority === "urgent" && "ring-2 ring-red-500",
                          message.priority === "high" && "ring-2 ring-orange-500",
                        )}
                      >
                        {/* Priority Indicator */}
                        {message.priority && message.priority !== "normal" && (
                          <div className="absolute -top-1 -left-1">
                            <div
                              className={cn(
                                "w-3 h-3 rounded-full",
                                message.priority === "urgent" && "bg-red-500",
                                message.priority === "high" && "bg-orange-500",
                              )}
                            />
                          </div>
                        )}

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
                              onClick={() => handleStarMessage(message.id)}
                            >
                              <Star
                                className={cn("h-3 w-3", message.isStarred ? "fill-yellow-400 text-yellow-400" : "")}
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => setShowEmojiPicker(true)}
                            >
                              <Smile className="h-3 w-3" />
                            </Button>
                            {isOwn && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => setEditingMessage(message.id)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleDeleteMessage(message.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Message Text */}
                        {editingMessage === message.id ? (
                          <div className="space-y-2">
                            <Textarea
                              defaultValue={message.content}
                              className="min-h-[60px]"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault()
                                  handleEditMessage(message.id, e.currentTarget.value)
                                }
                                if (e.key === "Escape") {
                                  setEditingMessage(null)
                                }
                              }}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  const textarea = document.querySelector("textarea")
                                  if (textarea) {
                                    handleEditMessage(message.id, textarea.value)
                                  }
                                }}
                              >
                                Save
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => setEditingMessage(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="whitespace-pre-wrap break-words">{message.content}</p>
                            {message.isEdited && (
                              <span className={cn("text-xs opacity-70", isOwn ? "text-blue-100" : "text-gray-500")}>
                                (edited)
                              </span>
                            )}
                          </>
                        )}

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
                                {attachment.type.startsWith("image/") ? (
                                  <div className="flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4" />
                                    <img
                                      src={attachment.url || "/placeholder.svg"}
                                      alt={attachment.name}
                                      className="max-w-48 max-h-32 rounded object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    <div>
                                      <div className="text-sm font-medium">{attachment.name}</div>
                                      <div className="text-xs opacity-70">{formatFileSize(attachment.size)}</div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                      <Download className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
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
                        {message.isBookmarked && <Bookmark className="h-3 w-3 text-blue-500" />}
                        {message.isFlagged && <Flag className="h-3 w-3 text-red-500" />}
                      </div>

                      {/* Reactions */}
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {message.reactions.map((reaction) => (
                            <button
                              key={reaction.emoji}
                              className={cn(
                                "flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-colors",
                                reaction.users.includes("student1")
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
                          input.onchange = handleFileUpload
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
                        Schedule
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
                    placeholder="Type your message..."
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

              {/* Draft Indicator */}
              {drafts.find((d) => d.conversationId === selectedConversation) && (
                <div className="text-xs text-gray-500 mt-2">
                  Draft saved {formatTime(drafts.find((d) => d.conversationId === selectedConversation)!.lastSaved)}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a counselor to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileUpload} />

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Schedule Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
              <div className="flex gap-2">
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
                <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
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
