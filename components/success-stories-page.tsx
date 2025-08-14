"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Search,
  Send,
  CheckCircle,
  Star,
  EyeOff,
  Globe,
  School,
  ThumbsUp,
  Loader2,
  Phone,
  MapPin,
  BookOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Types remain the same...
interface Story {
  id: string
  author: {
    id: string
    name: string
    username: string
    avatar: string
    verified: boolean
    year: string
    major: string
    university: string
  }
  content: string
  images?: string[]
  tags: string[]
  category: string
  timestamp: Date
  likes: number
  comments: number
  shares: number
  bookmarks: number
  likedBy: string[]
  bookmarkedBy: string[]
  sharedBy: string[]
  visibility: "public" | "university" | "anonymous"
  featured: boolean
  verified: boolean
  helpfulCount: number
  inspiringCount: number
  relatableCount: number
  reactions: {
    helpful: string[]
    inspiring: string[]
    relatable: string[]
  }
}

interface Comment {
  id: string
  storyId: string
  author: {
    id: string
    name: string
    username: string
    avatar: string
    verified: boolean
  }
  content: string
  timestamp: Date
  likes: number
  likedBy: string[]
  replies: Comment[]
  parentId?: string
}

// Clean, professional mock data
const mockStories: Story[] = [
  {
    id: "1",
    author: {
      id: "user1",
      name: "Sarah Chen",
      username: "sarahc_psych",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
      year: "Senior",
      major: "Psychology",
      university: "Stanford University",
    },
    content:
      "6 months ago, I was struggling with severe anxiety and panic attacks. I couldn't even attend classes without feeling overwhelmed. Today, I presented my thesis to a panel of professors and felt confident throughout!\n\nWhat helped me:\n• Regular therapy sessions\n• Mindfulness meditation (10 min daily)\n• Building a support network\n• Gradual exposure therapy\n• Self-compassion practices\n\nTo anyone struggling: You're not alone, and recovery is possible. Take it one day at a time.",
    images: ["/placeholder.svg?height=300&width=500"],
    tags: ["anxiety", "therapy", "mindfulness", "recovery", "student-success"],
    category: "Anxiety & Panic",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 247,
    comments: 18,
    shares: 12,
    bookmarks: 34,
    likedBy: ["user2", "user3"],
    bookmarkedBy: ["user2"],
    sharedBy: [],
    visibility: "public",
    featured: true,
    verified: true,
    helpfulCount: 89,
    inspiringCount: 156,
    relatableCount: 73,
    reactions: {
      helpful: ["user2", "user3"],
      inspiring: ["user2", "user4"],
      relatable: ["user3"],
    },
  },
  {
    id: "2",
    author: {
      id: "user2",
      name: "Marcus Johnson",
      username: "marcus_eng",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: false,
      year: "Junior",
      major: "Computer Engineering",
      university: "MIT",
    },
    content:
      "Depression made me feel like I was drowning in my coursework. I went from a 3.8 GPA to barely passing. But I learned that asking for help isn't weakness—it's strength.\n\nMy turning point:\n• Reached out to campus counseling\n• Started antidepressants (with doctor's guidance)\n• Joined a study group (social connection!)\n• Established a sleep routine\n• Started exercising 3x/week\n\nNow I'm back to a 3.6 GPA and actually enjoying my studies again. If you're struggling academically due to mental health, please reach out. Resources are available!",
    tags: ["depression", "academic-struggles", "counseling", "medication", "exercise"],
    category: "Depression",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likes: 189,
    comments: 23,
    shares: 8,
    bookmarks: 45,
    likedBy: ["user1", "user3"],
    bookmarkedBy: ["user1", "user3"],
    sharedBy: [],
    visibility: "public",
    featured: false,
    verified: true,
    helpfulCount: 67,
    inspiringCount: 98,
    relatableCount: 112,
    reactions: {
      helpful: ["user1", "user3"],
      inspiring: ["user1"],
      relatable: ["user1", "user3", "user4"],
    },
  },
  {
    id: "3",
    author: {
      id: "user3",
      name: "Anonymous Student",
      username: "anon_warrior",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: false,
      year: "Sophomore",
      major: "Pre-Med",
      university: "Anonymous",
    },
    content:
      "Content Warning: Eating Disorder\n\nSharing anonymously because I'm still on my journey, but I wanted to give hope to others struggling with eating disorders in college.\n\nI developed an eating disorder during my freshman year due to stress and perfectionism. It got so bad I had to take a medical leave.\n\nWhat's helping me recover:\n• Working with a specialized therapist\n• Nutritional counseling\n• Body-positive affirmations\n• Removing triggering social media\n• Finding joy in movement (not punishment)\n\nI'm not fully recovered yet, but I'm eating regularly again and my relationship with food is improving. Recovery isn't linear, but it's possible.",
    tags: ["eating-disorder", "recovery", "therapy", "body-positivity", "anonymous"],
    category: "Eating Disorders",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    likes: 156,
    comments: 31,
    shares: 15,
    bookmarks: 67,
    likedBy: ["user1", "user2"],
    bookmarkedBy: ["user1", "user2"],
    sharedBy: [],
    visibility: "anonymous",
    featured: false,
    verified: true,
    helpfulCount: 78,
    inspiringCount: 89,
    relatableCount: 45,
    reactions: {
      helpful: ["user1", "user2"],
      inspiring: ["user1", "user2"],
      relatable: ["user2"],
    },
  },
]

const categories = [
  "All Stories",
  "Anxiety & Panic",
  "Depression",
  "Eating Disorders",
  "ADHD",
  "Bipolar Disorder",
  "PTSD & Trauma",
  "Substance Recovery",
  "Self-Harm Recovery",
  "Crisis Recovery",
  "Academic Stress",
  "Social Anxiety",
  "Body Image",
  "Relationships",
  "Family Dynamics",
  "Financial Stress",
  "Identity & Sexuality",
  "Grief & Loss",
  "Sleep Disorders",
  "General Wellness",
]

const storyTags = [
  "therapy",
  "counseling",
  "medication",
  "support-group",
  "mindfulness",
  "meditation",
  "exercise",
  "nutrition",
  "sleep-hygiene",
  "self-care",
  "boundaries",
  "coping-strategies",
  "recovery",
  "relapse-prevention",
  "progress",
  "setback",
  "breakthrough",
  "healing",
  "anxiety",
  "depression",
  "bipolar",
  "adhd",
  "ptsd",
  "ocd",
  "eating-disorder",
  "academic-stress",
  "social-anxiety",
  "perfectionism",
  "imposter-syndrome",
]

export function SuccessStoriesPage() {
  const [stories, setStories] = useState<Story[]>(mockStories)
  const [filteredStories, setFilteredStories] = useState<Story[]>(mockStories)
  const [selectedCategory, setSelectedCategory] = useState("All Stories")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newStory, setNewStory] = useState({
    content: "",
    category: "",
    tags: [] as string[],
    visibility: "public" as "public" | "university" | "anonymous",
    images: [] as string[],
  })
  const [currentUser] = useState({
    id: "current-user",
    name: "Alex Rivera",
    username: "alex_rivera",
    avatar: "/placeholder.svg?height=40&width=40",
    verified: false,
    year: "Junior",
    major: "Computer Science",
    university: "Your University",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comments, setComments] = useState<{ [storyId: string]: Comment[] }>({})
  const [showComments, setShowComments] = useState<{ [storyId: string]: boolean }>({})
  const [newComment, setNewComment] = useState<{ [storyId: string]: string }>({})

  // Filter and search functionality
  useEffect(() => {
    let filtered = stories

    if (selectedCategory !== "All Stories") {
      filtered = filtered.filter((story) => story.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (story) =>
          story.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
          story.author.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    switch (sortBy) {
      case "recent":
        filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        break
      case "popular":
        filtered.sort((a, b) => b.likes + b.comments + b.shares - (a.likes + a.comments + a.shares))
        break
      case "helpful":
        filtered.sort((a, b) => b.helpfulCount - a.helpfulCount)
        break
      case "inspiring":
        filtered.sort((a, b) => b.inspiringCount - a.inspiringCount)
        break
    }

    setFilteredStories(filtered)
  }, [stories, selectedCategory, searchQuery, sortBy])

  const handleCreateStory = async () => {
    if (!newStory.content.trim()) return

    setIsSubmitting(true)
    try {
      const storyData = {
        author: currentUser,
        content: newStory.content,
        images: newStory.images,
        tags: newStory.tags,
        category: newStory.category,
        timestamp: new Date(),
        likes: 0,
        comments: 0,
        shares: 0,
        bookmarks: 0,
        likedBy: [],
        bookmarkedBy: [],
        sharedBy: [],
        visibility: newStory.visibility,
        featured: false,
        verified: false,
        helpfulCount: 0,
        inspiringCount: 0,
        relatableCount: 0,
        reactions: {
          helpful: [],
          inspiring: [],
          relatable: [],
        },
      }

      const newStoryWithId = { ...storyData, id: Date.now().toString() }
      setStories((prev) => [newStoryWithId, ...prev])

      setNewStory({
        content: "",
        category: "",
        tags: [],
        visibility: "public",
        images: [],
      })
      setShowCreateDialog(false)
    } catch (error) {
      console.error("Error creating story:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLike = (storyId: string) => {
    setStories((prev) =>
      prev.map((story) => {
        if (story.id === storyId) {
          const isLiked = story.likedBy.includes(currentUser.id)
          return {
            ...story,
            likes: isLiked ? story.likes - 1 : story.likes + 1,
            likedBy: isLiked ? story.likedBy.filter((id) => id !== currentUser.id) : [...story.likedBy, currentUser.id],
          }
        }
        return story
      }),
    )
  }

  const handleBookmark = (storyId: string) => {
    setStories((prev) =>
      prev.map((story) => {
        if (story.id === storyId) {
          const isBookmarked = story.bookmarkedBy.includes(currentUser.id)
          return {
            ...story,
            bookmarks: isBookmarked ? story.bookmarks - 1 : story.bookmarks + 1,
            bookmarkedBy: isBookmarked
              ? story.bookmarkedBy.filter((id) => id !== currentUser.id)
              : [...story.bookmarkedBy, currentUser.id],
          }
        }
        return story
      }),
    )
  }

  const handleReaction = (storyId: string, reactionType: "helpful" | "inspiring" | "relatable") => {
    setStories((prev) =>
      prev.map((story) => {
        if (story.id === storyId) {
          const hasReacted = story.reactions[reactionType].includes(currentUser.id)
          const newReactions = { ...story.reactions }

          if (hasReacted) {
            newReactions[reactionType] = newReactions[reactionType].filter((id) => id !== currentUser.id)
          } else {
            newReactions[reactionType] = [...newReactions[reactionType], currentUser.id]
          }

          return {
            ...story,
            reactions: newReactions,
            [`${reactionType}Count`]: hasReacted
              ? (story[`${reactionType}Count` as keyof Story] as number) - 1
              : (story[`${reactionType}Count` as keyof Story] as number) + 1,
          }
        }
        return story
      }),
    )
  }

  const handleComment = (storyId: string) => {
    const commentText = newComment[storyId]?.trim()
    if (!commentText) return

    const comment: Comment = {
      id: Date.now().toString(),
      storyId,
      author: currentUser,
      content: commentText,
      timestamp: new Date(),
      likes: 0,
      likedBy: [],
      replies: [],
    }

    setComments((prev) => ({
      ...prev,
      [storyId]: [comment, ...(prev[storyId] || [])],
    }))

    setNewComment((prev) => ({
      ...prev,
      [storyId]: "",
    }))

    setStories((prev) =>
      prev.map((story) => (story.id === storyId ? { ...story, comments: story.comments + 1 } : story)),
    )
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`
    return date.toLocaleDateString()
  }

  const addTag = (tag: string) => {
    if (tag && !newStory.tags.includes(tag)) {
      setNewStory((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setNewStory((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Twitter-like Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gray-900">Mental Health Stories</h1>
              <nav className="hidden md:flex space-x-8">
                <button className="text-gray-700 hover:text-gray-900 font-medium">For You</button>
                <button className="text-gray-500 hover:text-gray-700">Following</button>
                <button className="text-gray-500 hover:text-gray-700">Categories</button>
              </nav>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium">
                  Share Story
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Share your story</DialogTitle>
                  <DialogDescription>
                    Help others by sharing your mental health journey and what worked for you.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="What's your story?"
                    value={newStory.content}
                    onChange={(e) => setNewStory((prev) => ({ ...prev, content: e.target.value }))}
                    className="min-h-[150px] text-lg border-gray-200 focus:border-blue-500 resize-none"
                    maxLength={2000}
                  />
                  <div className="text-sm text-gray-500">{newStory.content.length}/2000</div>

                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      value={newStory.category}
                      onValueChange={(value) => setNewStory((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={newStory.visibility}
                      onValueChange={(value: "public" | "university" | "anonymous") =>
                        setNewStory((prev) => ({ ...prev, visibility: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Public
                          </div>
                        </SelectItem>
                        <SelectItem value="university">
                          <div className="flex items-center gap-2">
                            <School className="h-4 w-4" />
                            University Only
                          </div>
                        </SelectItem>
                        <SelectItem value="anonymous">
                          <div className="flex items-center gap-2">
                            <EyeOff className="h-4 w-4" />
                            Anonymous
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {newStory.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                          #{tag} ×
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {storyTags
                        .filter((tag) => !newStory.tags.includes(tag))
                        .slice(0, 10)
                        .map((tag) => (
                          <Button
                            key={tag}
                            variant="outline"
                            size="sm"
                            className="text-xs h-7 bg-transparent"
                            onClick={() => addTag(tag)}
                          >
                            + {tag}
                          </Button>
                        ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateStory}
                      disabled={!newStory.content.trim() || !newStory.category || isSubmitting}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sharing...
                        </>
                      ) : (
                        "Share Story"
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
            {/* Twitter-like Sidebar */}
            <div className="lg:col-span-1 border-r border-gray-200 min-h-screen">
              <div className="sticky top-20 p-4 space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search stories"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                  />
                </div>

                {/* Trending */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">What's happening</h3>
                  <div className="space-y-3">
                    <div className="cursor-pointer hover:bg-gray-100 p-2 rounded">
                      <p className="text-sm text-gray-500">Trending in Mental Health</p>
                      <p className="font-bold text-gray-900">#MentalHealthAwareness</p>
                      <p className="text-sm text-gray-500">1,247 stories</p>
                    </div>
                    <div className="cursor-pointer hover:bg-gray-100 p-2 rounded">
                      <p className="text-sm text-gray-500">Trending</p>
                      <p className="font-bold text-gray-900">#TherapyWorks</p>
                      <p className="text-sm text-gray-500">892 stories</p>
                    </div>
                    <div className="cursor-pointer hover:bg-gray-100 p-2 rounded">
                      <p className="text-sm text-gray-500">Trending in Students</p>
                      <p className="font-bold text-gray-900">#StudentSupport</p>
                      <p className="text-sm text-gray-500">456 stories</p>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Categories</h3>
                  <div className="space-y-1">
                    {categories.slice(0, 8).map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={cn(
                          "w-full text-left p-2 rounded hover:bg-gray-100 text-sm",
                          selectedCategory === category ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700",
                        )}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resources */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Resources</h3>
                  <div className="space-y-2">
                    <button className="w-full text-left p-2 rounded hover:bg-gray-100 text-sm text-gray-700 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Crisis Hotline
                    </button>
                    <button className="w-full text-left p-2 rounded hover:bg-gray-100 text-sm text-gray-700 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Find Counseling
                    </button>
                    <button className="w-full text-left p-2 rounded hover:bg-gray-100 text-sm text-gray-700 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Self-Help Guides
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Feed */}
            <div className="lg:col-span-3">
              {/* Feed Header */}
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Stories</h2>
                    <p className="text-sm text-gray-500">Real experiences from students like you</p>
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Latest</SelectItem>
                      <SelectItem value="popular">Popular</SelectItem>
                      <SelectItem value="helpful">Most Helpful</SelectItem>
                      <SelectItem value="inspiring">Most Inspiring</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Stories Feed */}
              <div>
                {filteredStories.map((story) => (
                  <div key={story.id} className="border-b border-gray-200 p-4 hover:bg-gray-50/50 transition-colors">
                    {/* Story Header */}
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={story.author.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {story.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-900">
                            {story.visibility === "anonymous" ? "Anonymous Student" : story.author.name}
                          </span>
                          {story.author.verified && <CheckCircle className="h-4 w-4 text-blue-500" />}
                          {story.visibility !== "anonymous" && (
                            <span className="text-gray-500">@{story.author.username}</span>
                          )}
                          <span className="text-gray-500">·</span>
                          <span className="text-gray-500">{formatTimeAgo(story.timestamp)}</span>
                          {story.visibility === "anonymous" && (
                            <Badge variant="outline" className="text-xs">
                              <EyeOff className="h-3 w-3 mr-1" />
                              Anonymous
                            </Badge>
                          )}
                        </div>
                        {story.visibility !== "anonymous" && (
                          <div className="text-sm text-gray-500">
                            {story.author.year} • {story.author.major} • {story.author.university}
                          </div>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Story Content */}
                    <div className="mt-3 ml-15">
                      <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{story.content}</p>

                      {/* Images */}
                      {story.images && story.images.length > 0 && (
                        <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200">
                          {story.images.map((image, index) => (
                            <img
                              key={index}
                              src={image || "/placeholder.svg"}
                              alt={`Story image ${index + 1}`}
                              className="w-full h-64 object-cover"
                            />
                          ))}
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        <Badge variant="secondary" className="text-xs">
                          {story.category}
                        </Badge>
                        {story.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Reactions */}
                      <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500">
                        <button className="flex items-center space-x-1 hover:text-blue-600">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{story.helpfulCount} Helpful</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-yellow-600">
                          <Star className="h-4 w-4" />
                          <span>{story.inspiringCount} Inspiring</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-red-600">
                          <Heart className="h-4 w-4" />
                          <span>{story.relatableCount} Relatable</span>
                        </button>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between mt-4 max-w-md">
                        <button
                          onClick={() => setShowComments((prev) => ({ ...prev, [story.id]: !prev[story.id] }))}
                          className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-full transition-colors"
                        >
                          <MessageCircle className="h-5 w-5" />
                          <span>{story.comments}</span>
                        </button>

                        <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600 hover:bg-green-50 px-3 py-2 rounded-full transition-colors">
                          <Share2 className="h-5 w-5" />
                          <span>{story.shares}</span>
                        </button>

                        <button
                          onClick={() => handleLike(story.id)}
                          className={cn(
                            "flex items-center space-x-2 px-3 py-2 rounded-full transition-colors",
                            story.likedBy.includes(currentUser.id)
                              ? "text-red-600 bg-red-50"
                              : "text-gray-500 hover:text-red-600 hover:bg-red-50",
                          )}
                        >
                          <Heart className={cn("h-5 w-5", story.likedBy.includes(currentUser.id) && "fill-current")} />
                          <span>{story.likes}</span>
                        </button>

                        <button
                          onClick={() => handleBookmark(story.id)}
                          className={cn(
                            "flex items-center space-x-2 px-3 py-2 rounded-full transition-colors",
                            story.bookmarkedBy.includes(currentUser.id)
                              ? "text-blue-600 bg-blue-50"
                              : "text-gray-500 hover:text-blue-600 hover:bg-blue-50",
                          )}
                        >
                          <Bookmark
                            className={cn("h-5 w-5", story.bookmarkedBy.includes(currentUser.id) && "fill-current")}
                          />
                        </button>
                      </div>

                      {/* Comments Section */}
                      {showComments[story.id] && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          {/* Add Comment */}
                          <div className="flex space-x-3 mb-4">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {currentUser.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex space-x-2">
                              <Input
                                placeholder="Write a supportive comment..."
                                value={newComment[story.id] || ""}
                                onChange={(e) => setNewComment((prev) => ({ ...prev, [story.id]: e.target.value }))}
                                onKeyPress={(e) => e.key === "Enter" && handleComment(story.id)}
                                className="bg-gray-50 border-gray-200"
                              />
                              <Button size="sm" onClick={() => handleComment(story.id)}>
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Comments List */}
                          <div className="space-y-3">
                            {comments[story.id]?.map((comment) => (
                              <div key={comment.id} className="flex space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>
                                    {comment.author.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="bg-gray-50 rounded-2xl px-4 py-2">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <span className="font-medium text-sm">{comment.author.name}</span>
                                      <span className="text-xs text-gray-500">{formatTimeAgo(comment.timestamp)}</span>
                                    </div>
                                    <p className="text-sm text-gray-900">{comment.content}</p>
                                  </div>
                                  <div className="flex items-center space-x-4 mt-1 ml-4">
                                    <button className="text-xs text-gray-500 hover:text-red-600 flex items-center space-x-1">
                                      <Heart className="h-3 w-3" />
                                      <span>{comment.likes}</span>
                                    </button>
                                    <button className="text-xs text-gray-500 hover:text-blue-600">Reply</button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredStories.length === 0 && (
                <div className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No stories found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search or filters.</p>
                  <Button onClick={() => setShowCreateDialog(true)} className="bg-blue-500 hover:bg-blue-600">
                    Share Your Story
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
