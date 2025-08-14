"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  MessageCircle,
  Send,
  Phone,
  Video,
  UserPlus,
  Settings,
  Plus,
  Search,
  CheckCircle,
  Clock,
  PhoneOff,
  VideoOff,
  Mic,
  MicOff,
  Upload,
  FileText,
  ImageIcon,
  Download,
  Bell,
  Edit,
  Save,
  Shield,
  UserX,
  AlertTriangle,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Types
interface User {
  id: string
  name: string
  username: string
  avatar: string
  bio: string
  university: string
  major: string
  isOnline: boolean
  lastActive: Date
  isFriend: boolean
  studyStatus: "studying" | "available" | "busy" | "offline"
  email?: string
  phone?: string
  interests: string[]
  privacySettings: PrivacySettings
}

interface PrivacySettings {
  profileVisibility: "public" | "friends" | "private"
  showOnlineStatus: boolean
  showStudyStatus: boolean
  allowFriendRequests: boolean
  allowMessages: boolean
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  read: boolean
  type: "text" | "file" | "image" | "voice"
  fileUrl?: string
  fileName?: string
  fileSize?: number
}

interface Conversation {
  id: string
  participants: string[]
  lastMessage: Message
  unreadCount: number
}

interface Task {
  id: string
  title: string
  completed: boolean
  dueDate?: Date
  priority: "low" | "medium" | "high"
}

interface StudyGroup {
  id: string
  name: string
  subject: string
  description: string
  members: string[]
  creator: string
  nextSession?: Date
  isPrivate: boolean
}

interface Notification {
  id: string
  type: "message" | "friend_request" | "study_reminder" | "group_invite"
  title: string
  content: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

interface CallState {
  isActive: boolean
  type: "voice" | "video"
  participantId: string
  participantName: string
  isMuted: boolean
  isVideoOff: boolean
  duration: number
}

// Mock Data
const currentUser: User = {
  id: "current-user",
  name: "Alex Rivera",
  username: "alex_rivera",
  avatar: "/placeholder.svg?height=40&width=40",
  bio: "Psychology student passionate about cognitive science and peer learning",
  university: "Stanford University",
  major: "Psychology",
  email: "alex.rivera@stanford.edu",
  phone: "+1 (555) 123-4567",
  interests: ["Psychology", "Neuroscience", "Research", "Statistics"],
  isOnline: true,
  lastActive: new Date(),
  isFriend: false,
  studyStatus: "studying",
  privacySettings: {
    profileVisibility: "friends",
    showOnlineStatus: true,
    showStudyStatus: true,
    allowFriendRequests: true,
    allowMessages: true,
  },
}

const mockFriends: User[] = [
  {
    id: "friend1",
    name: "Sarah Chen",
    username: "sarah_mindful",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Neuroscience major with focus on mindfulness research",
    university: "UC Berkeley",
    major: "Neuroscience",
    email: "sarah.chen@berkeley.edu",
    interests: ["Neuroscience", "Mindfulness", "Research"],
    isOnline: true,
    lastActive: new Date(Date.now() - 5 * 60 * 1000),
    isFriend: true,
    studyStatus: "available",
    privacySettings: {
      profileVisibility: "friends",
      showOnlineStatus: true,
      showStudyStatus: true,
      allowFriendRequests: true,
      allowMessages: true,
    },
  },
  {
    id: "friend2",
    name: "Marcus Johnson",
    username: "marcus_code",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "CS grad student specializing in AI and machine learning",
    university: "MIT",
    major: "Computer Science",
    email: "marcus.j@mit.edu",
    interests: ["AI", "Machine Learning", "Programming"],
    isOnline: false,
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isFriend: true,
    studyStatus: "busy",
    privacySettings: {
      profileVisibility: "public",
      showOnlineStatus: true,
      showStudyStatus: false,
      allowFriendRequests: true,
      allowMessages: true,
    },
  },
]

export default function FullFunctionalPlatform() {
  // State
  const [friends, setFriends] = useState<User[]>(mockFriends)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])

  // UI State
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [newTask, setNewTask] = useState("")
  const [studyTimer, setStudyTimer] = useState(0)
  const [isStudying, setIsStudying] = useState(false)

  // Dialog States
  const [showAddFriends, setShowAddFriends] = useState(false)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)

  // Call State
  const [callState, setCallState] = useState<CallState | null>(null)

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editedProfile, setEditedProfile] = useState(currentUser)

  // File Upload
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Effects
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isStudying) {
      interval = setInterval(() => {
        setStudyTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isStudying])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (callState?.isActive) {
      interval = setInterval(() => {
        setCallState((prev) => (prev ? { ...prev, duration: prev.duration + 1 } : null))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [callState?.isActive])

  // Initialize mock data
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: "msg1",
        senderId: "friend1",
        receiverId: "current-user",
        content: "Hey! How's your psychology project going?",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false,
        type: "text",
      },
      {
        id: "msg2",
        senderId: "current-user",
        receiverId: "friend1",
        content: "It's going well! Thanks for asking. The research phase is almost done.",
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        read: true,
        type: "text",
      },
    ]

    const mockConversations: Conversation[] = [
      {
        id: "conv1",
        participants: ["current-user", "friend1"],
        lastMessage: mockMessages[1],
        unreadCount: 1,
      },
      {
        id: "conv2",
        participants: ["current-user", "friend2"],
        lastMessage: {
          id: "msg3",
          senderId: "friend2",
          receiverId: "current-user",
          content: "Want to study together tomorrow?",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: false,
          type: "text",
        },
        unreadCount: 1,
      },
    ]

    const mockTasks: Task[] = [
      {
        id: "task1",
        title: "Complete psychology assignment",
        completed: false,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        priority: "high",
      },
      {
        id: "task2",
        title: "Schedule study session with Marcus",
        completed: false,
        priority: "medium",
      },
      {
        id: "task3",
        title: "Read mindfulness article Sarah shared",
        completed: true,
        priority: "low",
      },
    ]

    const mockGroups: StudyGroup[] = [
      {
        id: "group1",
        name: "Cognitive Psychology Study Circle",
        subject: "Psychology",
        description: "Weekly study sessions for cognitive psychology concepts",
        members: ["current-user", "friend1"],
        creator: "current-user",
        nextSession: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        isPrivate: false,
      },
    ]

    const mockNotifications: Notification[] = [
      {
        id: "notif1",
        type: "message",
        title: "New message from Sarah",
        content: "Hey! How's your psychology project going?",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false,
      },
      {
        id: "notif2",
        type: "study_reminder",
        title: "Study session reminder",
        content: "Your study session starts in 30 minutes",
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        read: false,
      },
    ]

    setMessages(mockMessages)
    setConversations(mockConversations)
    setTasks(mockTasks)
    setStudyGroups(mockGroups)
    setNotifications(mockNotifications)
  }, [])

  // Helper Functions
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "studying":
        return "text-red-600"
      case "available":
        return "text-green-600"
      case "busy":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-green-500"
      default:
        return "border-l-gray-300"
    }
  }

  // Core Functions
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      receiverId: selectedConversation.participants.find((p) => p !== currentUser.id) || "",
      content: newMessage,
      timestamp: new Date(),
      read: false,
      type: "text",
    }

    setMessages((prev) => [...prev, message])

    // Update conversation
    setConversations((prev) =>
      prev.map((conv) => (conv.id === selectedConversation.id ? { ...conv, lastMessage: message } : conv)),
    )

    setNewMessage("")

    // Add notification for recipient
    const recipient = friends.find((f) => f.id === message.receiverId)
    if (recipient) {
      addNotification({
        type: "message",
        title: `New message from ${currentUser.name}`,
        content: message.content,
        timestamp: new Date(),
      })
    }
  }

  const startCall = (friendId: string, type: "voice" | "video") => {
    const friend = friends.find((f) => f.id === friendId)
    if (!friend) return

    setCallState({
      isActive: true,
      type,
      participantId: friendId,
      participantName: friend.name,
      isMuted: false,
      isVideoOff: type === "voice",
      duration: 0,
    })

    // Simulate call connection
    setTimeout(() => {
      addNotification({
        type: "message",
        title: `${type === "voice" ? "Voice" : "Video"} call started`,
        content: `Connected with ${friend.name}`,
        timestamp: new Date(),
      })
    }, 2000)
  }

  const endCall = () => {
    if (callState) {
      addNotification({
        type: "message",
        title: "Call ended",
        content: `Call duration: ${formatTime(callState.duration)}`,
        timestamp: new Date(),
      })
    }
    setCallState(null)
  }

  const toggleMute = () => {
    setCallState((prev) => (prev ? { ...prev, isMuted: !prev.isMuted } : null))
  }

  const toggleVideo = () => {
    setCallState((prev) => (prev ? { ...prev, isVideoOff: !prev.isVideoOff } : null))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !selectedConversation) return

    const message: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      receiverId: selectedConversation.participants.find((p) => p !== currentUser.id) || "",
      content: `Shared a file: ${file.name}`,
      timestamp: new Date(),
      read: false,
      type: file.type.startsWith("image/") ? "image" : "file",
      fileName: file.name,
      fileSize: file.size,
      fileUrl: URL.createObjectURL(file),
    }

    setMessages((prev) => [...prev, message])

    // Update conversation
    setConversations((prev) =>
      prev.map((conv) => (conv.id === selectedConversation.id ? { ...conv, lastMessage: message } : conv)),
    )

    addNotification({
      type: "message",
      title: "File shared",
      content: `Shared ${file.name} with ${getFriendFromConversation(selectedConversation)?.name}`,
      timestamp: new Date(),
    })

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const addFriend = (user: User) => {
    setFriends((prev) => [...prev, { ...user, isFriend: true }])

    addNotification({
      type: "friend_request",
      title: "Friend added",
      content: `${user.name} is now your friend`,
      timestamp: new Date(),
    })

    // Create conversation
    const newConversation: Conversation = {
      id: `conv_${Date.now()}`,
      participants: [currentUser.id, user.id],
      lastMessage: {
        id: `msg_${Date.now()}`,
        senderId: "system",
        receiverId: user.id,
        content: "You are now connected!",
        timestamp: new Date(),
        read: false,
        type: "text",
      },
      unreadCount: 0,
    }

    setConversations((prev) => [...prev, newConversation])
  }

  const removeFriend = (friendId: string) => {
    const friend = friends.find((f) => f.id === friendId)
    setFriends((prev) => prev.filter((f) => f.id !== friendId))
    setConversations((prev) => prev.filter((c) => !c.participants.includes(friendId)))

    if (friend) {
      addNotification({
        type: "friend_request",
        title: "Friend removed",
        content: `${friend.name} has been removed from your friends`,
        timestamp: new Date(),
      })
    }
  }

  const addTask = () => {
    if (!newTask.trim()) return

    const task: Task = {
      id: `task_${Date.now()}`,
      title: newTask,
      completed: false,
      priority: "medium",
    }

    setTasks((prev) => [...prev, task])
    setNewTask("")

    addNotification({
      type: "study_reminder",
      title: "Task added",
      content: `New task: ${task.title}`,
      timestamp: new Date(),
    })
  }

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updatedTask = { ...task, completed: !task.completed }

          if (updatedTask.completed) {
            addNotification({
              type: "study_reminder",
              title: "Task completed",
              content: `Completed: ${task.title}`,
              timestamp: new Date(),
            })
          }

          return updatedTask
        }
        return task
      }),
    )
  }

  const deleteTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    setTasks((prev) => prev.filter((t) => t.id !== taskId))

    if (task) {
      addNotification({
        type: "study_reminder",
        title: "Task deleted",
        content: `Deleted: ${task.title}`,
        timestamp: new Date(),
      })
    }
  }

  const createStudyGroup = (name: string, subject: string, description: string, isPrivate: boolean) => {
    const group: StudyGroup = {
      id: `group_${Date.now()}`,
      name,
      subject,
      description,
      members: [currentUser.id],
      creator: currentUser.id,
      isPrivate,
    }

    setStudyGroups((prev) => [...prev, group])

    addNotification({
      type: "group_invite",
      title: "Study group created",
      content: `Created "${name}" study group`,
      timestamp: new Date(),
    })
  }

  const joinStudyGroup = (groupId: string) => {
    setStudyGroups((prev) =>
      prev.map((group) => (group.id === groupId ? { ...group, members: [...group.members, currentUser.id] } : group)),
    )

    const group = studyGroups.find((g) => g.id === groupId)
    if (group) {
      addNotification({
        type: "group_invite",
        title: "Joined study group",
        content: `Joined "${group.name}" study group`,
        timestamp: new Date(),
      })
    }
  }

  const addNotification = (notification: Omit<Notification, "id" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev])
  }

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif)))
  }

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const saveProfile = () => {
    // In a real app, this would save to a backend
    setIsEditingProfile(false)

    addNotification({
      type: "message",
      title: "Profile updated",
      content: "Your profile has been successfully updated",
      timestamp: new Date(),
    })
  }

  const exportData = () => {
    const data = {
      profile: currentUser,
      friends: friends,
      messages: messages,
      tasks: tasks,
      studyGroups: studyGroups,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "studyconnect-data.json"
    a.click()
    URL.revokeObjectURL(url)

    addNotification({
      type: "message",
      title: "Data exported",
      content: "Your data has been exported successfully",
      timestamp: new Date(),
    })
  }

  // Helper functions for conversations
  const getConversationMessages = (conversationId: string) => {
    const conversation = conversations.find((c) => c.id === conversationId)
    if (!conversation) return []

    return messages
      .filter((m) => conversation.participants.includes(m.senderId) && conversation.participants.includes(m.receiverId))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  }

  const getFriendFromConversation = (conversation: Conversation) => {
    const friendId = conversation.participants.find((p) => p !== currentUser.id)
    return friends.find((f) => f.id === friendId)
  }

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">StudyConnect</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Study Timer */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="font-mono">{formatTime(studyTimer)}</span>
                <Button
                  size="sm"
                  variant={isStudying ? "default" : "outline"}
                  onClick={() => setIsStudying(!isStudying)}
                  className="text-xs"
                >
                  {isStudying ? "Stop" : "Start"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setStudyTimer(0)} className="text-xs">
                  Reset
                </Button>
              </div>

              {/* Notifications */}
              <Button variant="outline" size="sm" onClick={() => setShowNotifications(true)} className="relative">
                <Bell className="h-4 w-4" />
                {unreadNotificationsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                    {unreadNotificationsCount}
                  </Badge>
                )}
              </Button>

              <Button variant="outline" size="sm" onClick={() => setShowAddFriends(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Friends
              </Button>

              <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
                <Settings className="h-4 w-4" />
              </Button>

              <Avatar className="h-8 w-8 cursor-pointer" onClick={() => setShowProfile(true)}>
                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                <AvatarFallback>AR</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Friends List */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-gray-900">Friends ({friends.length})</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search friends..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {filteredFriends.map((friend) => (
                      <div
                        key={friend.id}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer group"
                        onClick={() => {
                          const conv = conversations.find((c) => c.participants.includes(friend.id))
                          if (conv) setSelectedConversation(conv)
                        }}
                      >
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {friend.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {friend.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{friend.name}</p>
                          <p className={cn("text-xs", getStatusColor(friend.studyStatus))}>
                            {friend.isOnline ? friend.studyStatus : formatTimeAgo(friend.lastActive)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              const conv = conversations.find((c) => c.participants.includes(friend.id))
                              if (conv) setSelectedConversation(conv)
                            }}
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeFriend(friend.id)
                            }}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Tasks */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-gray-900">My Tasks</CardTitle>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTask()}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={addTask}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        "flex items-center space-x-3 p-2 rounded-lg border-l-4 group",
                        getPriorityColor(task.priority),
                        task.completed && "opacity-60",
                      )}
                    >
                      <div
                        className={cn(
                          "w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer",
                          task.completed ? "bg-gray-800 border-gray-800" : "border-gray-300",
                        )}
                        onClick={() => toggleTask(task.id)}
                      >
                        {task.completed && <CheckCircle className="h-3 w-3 text-white" />}
                      </div>
                      <p className={cn("text-sm flex-1", task.completed && "line-through text-gray-500")}>
                        {task.title}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Study Groups */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-gray-900">Study Groups</CardTitle>
                  <Button size="sm" onClick={() => setShowCreateGroup(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {studyGroups.map((group) => (
                    <div key={group.id} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{group.name}</h4>
                        <Badge className="text-xs bg-gray-100 text-gray-700">{group.subject}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{group.members.length} members</span>
                        {group.nextSession && <span>Next: {group.nextSession.toLocaleDateString()}</span>}
                      </div>
                      {!group.members.includes(currentUser.id) && (
                        <Button size="sm" className="w-full mt-2" onClick={() => joinStudyGroup(group.id)}>
                          Join Group
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Messages */}
          <div className="lg:col-span-3">
            <Card className="h-[600px]">
              <div className="flex h-full">
                {/* Conversations List */}
                <div className="w-1/3 border-r border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-lg text-gray-900">Messages</h3>
                  </div>
                  <ScrollArea className="h-[500px]">
                    <div className="p-2">
                      {conversations.map((conversation) => {
                        const friend = getFriendFromConversation(conversation)
                        if (!friend) return null

                        return (
                          <div
                            key={conversation.id}
                            className={cn(
                              "flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50",
                              selectedConversation?.id === conversation.id && "bg-gray-100",
                            )}
                            onClick={() => setSelectedConversation(conversation)}
                          >
                            <div className="relative">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {friend.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              {friend.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-sm truncate">{friend.name}</p>
                                <span className="text-xs text-gray-500">
                                  {formatTimeAgo(conversation.lastMessage.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 truncate">{conversation.lastMessage.content}</p>
                            </div>
                            {conversation.unreadCount > 0 && (
                              <div className="w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white">{conversation.unreadCount}</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                  {selectedConversation ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {(() => {
                            const friend = getFriendFromConversation(selectedConversation)
                            return friend ? (
                              <>
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>
                                    {friend.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{friend.name}</p>
                                  <p className={cn("text-sm", getStatusColor(friend.studyStatus))}>
                                    {friend.isOnline
                                      ? friend.studyStatus
                                      : `Last seen ${formatTimeAgo(friend.lastActive)}`}
                                  </p>
                                </div>
                              </>
                            ) : null
                          })()}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const friend = getFriendFromConversation(selectedConversation)
                              if (friend) startCall(friend.id, "voice")
                            }}
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const friend = getFriendFromConversation(selectedConversation)
                              if (friend) startCall(friend.id, "video")
                            }}
                          >
                            <Video className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Messages */}
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                          {getConversationMessages(selectedConversation.id).map((message) => (
                            <div
                              key={message.id}
                              className={cn(
                                "flex",
                                message.senderId === currentUser.id ? "justify-end" : "justify-start",
                              )}
                            >
                              <div
                                className={cn(
                                  "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                                  message.senderId === currentUser.id
                                    ? "bg-gray-800 text-white"
                                    : "bg-gray-100 text-gray-900",
                                )}
                              >
                                {message.type === "file" || message.type === "image" ? (
                                  <div className="space-y-2">
                                    {message.type === "image" && message.fileUrl && (
                                      <img
                                        src={message.fileUrl || "/placeholder.svg"}
                                        alt={message.fileName}
                                        className="max-w-full h-auto rounded"
                                      />
                                    )}
                                    <div className="flex items-center space-x-2">
                                      {message.type === "file" ? (
                                        <FileText className="h-4 w-4" />
                                      ) : (
                                        <ImageIcon className="h-4 w-4" />
                                      )}
                                      <span className="text-sm">{message.fileName}</span>
                                      {message.fileUrl && (
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => {
                                            const a = document.createElement("a")
                                            a.href = message.fileUrl!
                                            a.download = message.fileName || "file"
                                            a.click()
                                          }}
                                        >
                                          <Download className="h-3 w-3" />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-sm">{message.content}</p>
                                )}
                                <p
                                  className={cn(
                                    "text-xs mt-1",
                                    message.senderId === currentUser.id ? "text-gray-300" : "text-gray-500",
                                  )}
                                >
                                  {formatTimeAgo(message.timestamp)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>

                      {/* Message Input */}
                      <div className="p-4 border-t border-gray-200">
                        <div className="flex space-x-2">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                            accept="image/*,.pdf,.doc,.docx,.txt"
                          />
                          <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                            <Upload className="h-4 w-4" />
                          </Button>
                          <Input
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                            className="flex-1"
                          />
                          <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Select a conversation to start messaging</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Call Interface */}
      {callState && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="text-center mb-6">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarImage src="/placeholder.svg?height=80&width=80" />
                <AvatarFallback className="text-2xl">
                  {callState.participantName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold">{callState.participantName}</h3>
              <p className="text-gray-600">
                {callState.type === "voice" ? "Voice Call" : "Video Call"} • {formatTime(callState.duration)}
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <Button variant={callState.isMuted ? "default" : "outline"} onClick={toggleMute}>
                {callState.isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>

              {callState.type === "video" && (
                <Button variant={callState.isVideoOff ? "default" : "outline"} onClick={toggleVideo}>
                  {callState.isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                </Button>
              )}

              <Button variant="destructive" onClick={endCall}>
                <PhoneOff className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Notifications</DialogTitle>
              <Button size="sm" variant="outline" onClick={markAllNotificationsAsRead}>
                Mark all as read
              </Button>
            </div>
          </DialogHeader>
          <ScrollArea className="max-h-96">
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 border rounded-lg cursor-pointer",
                    notification.read ? "bg-white" : "bg-blue-50 border-blue-200",
                  )}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
                      <p className="text-xs text-gray-500 mt-2">{formatTimeAgo(notification.timestamp)}</p>
                    </div>
                    {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Profile</DialogTitle>
              <Button size="sm" variant="outline" onClick={() => setIsEditingProfile(!isEditingProfile)}>
                {isEditingProfile ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              </Button>
            </div>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">AR</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                {isEditingProfile ? (
                  <div className="space-y-2">
                    <Input
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Name"
                    />
                    <Input
                      value={editedProfile.username}
                      onChange={(e) => setEditedProfile((prev) => ({ ...prev, username: e.target.value }))}
                      placeholder="Username"
                    />
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-semibold">{currentUser.name}</h3>
                    <p className="text-gray-600">@{currentUser.username}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                {isEditingProfile ? (
                  <Textarea
                    value={editedProfile.bio}
                    onChange={(e) => setEditedProfile((prev) => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-600">{currentUser.bio}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">University</label>
                  {isEditingProfile ? (
                    <Input
                      value={editedProfile.university}
                      onChange={(e) => setEditedProfile((prev) => ({ ...prev, university: e.target.value }))}
                    />
                  ) : (
                    <p className="text-gray-600">{currentUser.university}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Major</label>
                  {isEditingProfile ? (
                    <Input
                      value={editedProfile.major}
                      onChange={(e) => setEditedProfile((prev) => ({ ...prev, major: e.target.value }))}
                    />
                  ) : (
                    <p className="text-gray-600">{currentUser.major}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Interests</label>
                <div className="flex flex-wrap gap-2">
                  {currentUser.interests.map((interest, index) => (
                    <Badge key={index} className="bg-gray-100 text-gray-700">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              {isEditingProfile && (
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveProfile}>Save Changes</Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Settings & Privacy
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Privacy Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Online Status</p>
                    <p className="text-sm text-gray-500">Let friends see when you're online</p>
                  </div>
                  <Switch defaultChecked={currentUser.privacySettings.showOnlineStatus} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Study Status</p>
                    <p className="text-sm text-gray-500">Share your current study status</p>
                  </div>
                  <Switch defaultChecked={currentUser.privacySettings.showStudyStatus} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Allow Friend Requests</p>
                    <p className="text-sm text-gray-500">Receive friend requests from other users</p>
                  </div>
                  <Switch defaultChecked={currentUser.privacySettings.allowFriendRequests} />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Message Notifications</p>
                    <p className="text-sm text-gray-500">Get notified about new messages</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Study Reminders</p>
                    <p className="text-sm text-gray-500">Receive reminders about study sessions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Data & Privacy</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent" onClick={exportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export My Data
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <UserX className="h-4 w-4 mr-2" />
                  Blocked Users
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Report a Problem
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Friends Dialog */}
      <Dialog open={showAddFriends} onOpenChange={setShowAddFriends}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Friends</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input placeholder="Search by name or username..." className="flex-1" />
              <Button size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <h4 className="font-medium text-gray-700">Suggested Friends</h4>
              {[
                {
                  id: "suggested1",
                  name: "David Kim",
                  username: "david_study",
                  avatar: "/placeholder.svg?height=40&width=40",
                  bio: "Engineering student at Stanford",
                  university: "Stanford University",
                  major: "Engineering",
                  interests: ["Engineering", "Math", "Physics"],
                  isOnline: true,
                  lastActive: new Date(),
                  isFriend: false,
                  studyStatus: "available" as const,
                  privacySettings: {
                    profileVisibility: "public" as const,
                    showOnlineStatus: true,
                    showStudyStatus: true,
                    allowFriendRequests: true,
                    allowMessages: true,
                  },
                },
                {
                  id: "suggested2",
                  name: "Lisa Wang",
                  username: "lisa_wellness",
                  avatar: "/placeholder.svg?height=40&width=40",
                  bio: "Pre-med student focused on wellness",
                  university: "Stanford University",
                  major: "Biology",
                  interests: ["Biology", "Medicine", "Wellness"],
                  isOnline: false,
                  lastActive: new Date(Date.now() - 60 * 60 * 1000),
                  isFriend: false,
                  studyStatus: "offline" as const,
                  privacySettings: {
                    profileVisibility: "friends" as const,
                    showOnlineStatus: true,
                    showStudyStatus: true,
                    allowFriendRequests: true,
                    allowMessages: true,
                  },
                },
              ].map((user) => (
                <div key={user.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.bio}</p>
                    <p className="text-xs text-gray-500">
                      {user.university} • {user.major}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.interests.slice(0, 2).map((interest, index) => (
                        <Badge key={index} className="text-xs bg-gray-100 text-gray-600">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button size="sm" onClick={() => addFriend(user)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Friend
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Study Group Dialog */}
      <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Study Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Group name..." id="groupName" />
            <Input placeholder="Subject..." id="groupSubject" />
            <Textarea placeholder="Description..." id="groupDescription" />
            <div className="flex items-center space-x-2">
              <Switch id="isPrivate" />
              <label htmlFor="isPrivate" className="text-sm">
                Private group
              </label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateGroup(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const nameInput = document.getElementById("groupName") as HTMLInputElement
                  const subjectInput = document.getElementById("groupSubject") as HTMLInputElement
                  const descriptionInput = document.getElementById("groupDescription") as HTMLTextAreaElement
                  const privateSwitch = document.getElementById("isPrivate") as HTMLInputElement

                  if (nameInput.value && subjectInput.value) {
                    createStudyGroup(nameInput.value, subjectInput.value, descriptionInput.value, privateSwitch.checked)
                    setShowCreateGroup(false)

                    // Clear form
                    nameInput.value = ""
                    subjectInput.value = ""
                    descriptionInput.value = ""
                    privateSwitch.checked = false
                  }
                }}
              >
                Create Group
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
