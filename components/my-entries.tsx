"use client"

import React from "react"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Grid,
  List,
  MoreHorizontal,
  Heart,
  Archive,
  Trash2,
  Filter,
  SortAsc,
  SortDesc,
  CalendarIcon,
  Eye,
  Edit,
  Share2,
  Download,
  Printer,
  Copy,
  Pin,
  PinOff,
  Settings,
  BarChart3,
  BookOpen,
  ImageIcon,
  Mic,
  Star,
  Sun,
  CloudRain,
  Snowflake,
  Wind,
  X,
  RotateCcw,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Home,
  ArrowUp,
  Users,
  Lock,
  Globe,
  FileText,
  CalendarIcon as CalendarView,
  TimerIcon as Timeline,
  Columns,
  Type,
  Coffee,
  Music,
  Gamepad2,
  Car,
  ShoppingBag,
  Utensils,
  Dumbbell,
  Shield,
  Brush,
  Flame,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  format,
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns"

// Enhanced mock data with more comprehensive information
const generateEnhancedEntries = () => {
  const entries = []
  const moods = [
    "Happy",
    "Sad",
    "Excited",
    "Anxious",
    "Peaceful",
    "Frustrated",
    "Grateful",
    "Tired",
    "Energetic",
    "Reflective",
  ]
  const activities = ["Work", "Exercise", "Reading", "Music", "Gaming", "Social", "Home", "Travel", "Shopping", "Food"]
  const weatherTypes = ["sunny", "cloudy", "rainy", "snowy", "windy"]
  const timeOfDay = ["morning", "afternoon", "evening", "night"]
  const privacyLevels = ["public", "private", "encrypted"]

  for (let i = 0; i < 150; i++) {
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 365))

    const wordCount = Math.floor(Math.random() * 800) + 50
    const readingTime = Math.ceil(wordCount / 200)
    const selectedMoods = moods.filter(() => Math.random() > 0.7).slice(0, 3)
    const selectedActivities = activities.filter(() => Math.random() > 0.8).slice(0, 2)

    entries.push({
      id: i + 1,
      title: Math.random() > 0.3 ? `Entry ${i + 1} - ${selectedMoods[0] || "Reflective"} Day` : "",
      content: `This is the content of entry ${i + 1}. It contains thoughts and reflections about the day. The weather was ${weatherTypes[Math.floor(Math.random() * weatherTypes.length)]} and I was feeling ${selectedMoods.join(", ")}. I spent time ${selectedActivities.join(" and ")}.`,
      date: date.toISOString().split("T")[0],
      createdAt: date.toISOString(),
      lastModified: new Date(date.getTime() + Math.random() * 86400000).toISOString(),
      moods: selectedMoods,
      activities: selectedActivities,
      wordCount,
      readingTime,
      charCount: wordCount * 5.5,
      isFavorite: Math.random() > 0.8,
      isPinned: Math.random() > 0.95,
      isPrivate: Math.random() > 0.7,
      privacyLevel: privacyLevels[Math.floor(Math.random() * privacyLevels.length)],
      hasImages: Math.random() > 0.7,
      hasVoiceNote: Math.random() > 0.8,
      hasDrawing: Math.random() > 0.9,
      imageCount: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0,
      weather: weatherTypes[Math.floor(Math.random() * weatherTypes.length)],
      timeOfDay: timeOfDay[Math.floor(Math.random() * timeOfDay.length)],
      location: Math.random() > 0.6 ? `Location ${Math.floor(Math.random() * 10) + 1}` : "",
      energyLevel: Math.floor(Math.random() * 10) + 1,
      stressLevel: Math.floor(Math.random() * 10) + 1,
      sleepQuality: Math.floor(Math.random() * 5) + 1,
      category: ["Personal", "Work", "Health", "Relationships", "Goals", "Creative"][Math.floor(Math.random() * 6)],
      tags: ["reflection", "gratitude", "goals", "challenges", "growth", "memories"].filter(() => Math.random() > 0.6),
      streak: Math.floor(Math.random() * 30),
      qualityScore: Math.floor(Math.random() * 100) + 1,
      sentiment: Math.random() > 0.5 ? "positive" : Math.random() > 0.5 ? "negative" : "neutral",
    })
  }

  return entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

const weatherIcons = {
  sunny: Sun,
  cloudy: CloudRain,
  rainy: CloudRain,
  snowy: Snowflake,
  windy: Wind,
}

const activityIcons = {
  Work: Coffee,
  Exercise: Dumbbell,
  Reading: BookOpen,
  Music: Music,
  Gaming: Gamepad2,
  Social: Users,
  Home: Home,
  Travel: Car,
  Shopping: ShoppingBag,
  Food: Utensils,
}

export function MyEntries() {
  // Basic state
  const [entries, setEntries] = useState(generateEnhancedEntries())
  const [selectedEntries, setSelectedEntries] = useState<number[]>([])
  const [expandedEntry, setExpandedEntry] = useState<number | null>(null)

  // View and layout state
  const [viewMode, setViewMode] = useState<
    "grid" | "list" | "timeline" | "calendar" | "compact" | "magazine" | "kanban"
  >("grid")
  const [layoutDensity, setLayoutDensity] = useState<"comfortable" | "compact" | "spacious">("comfortable")
  const [cardSize, setCardSize] = useState<"small" | "medium" | "large">("medium")

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])

  // Advanced search criteria
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [wordCountRange, setWordCountRange] = useState([0, 1000])
  const [privacyFilter, setPrivacyFilter] = useState<string[]>([])
  const [moodFilter, setMoodFilter] = useState<string[]>([])
  const [activityFilter, setActivityFilter] = useState<string[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const [attachmentFilter, setAttachmentFilter] = useState<string[]>([])
  const [timeOfDayFilter, setTimeOfDayFilter] = useState<string[]>([])
  const [weatherFilter, setWeatherFilter] = useState<string[]>([])
  const [sentimentFilter, setSentimentFilter] = useState<string[]>([])

  // Sorting state
  const [sortBy, setSortBy] = useState("recent")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [secondarySortBy, setSecondarySortBy] = useState("")

  // UI state
  const [showFilters, setShowFilters] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewEntry, setPreviewEntry] = useState<any>(null)
  const [bulkMode, setBulkMode] = useState(false)
  const [customization, setCustomization] = useState({
    theme: "default",
    fontSize: "medium",
    previewLength: 150,
    showMoodColors: true,
    showReadingTime: true,
    showWordCount: true,
    animationsEnabled: true,
    highContrast: false,
  })

  // Pagination and loading
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // Analytics state
  const [analyticsData, setAnalyticsData] = useState({
    totalEntries: 0,
    totalWords: 0,
    averageWordsPerEntry: 0,
    writingStreak: 0,
    mostCommonMood: "",
    peakWritingHour: "",
    monthlyGoalProgress: 0,
  })

  // Calculate analytics
  useEffect(() => {
    const totalEntries = entries.length
    const totalWords = entries.reduce((sum, entry) => sum + entry.wordCount, 0)
    const averageWordsPerEntry = Math.round(totalWords / totalEntries) || 0

    const moodCounts = entries.reduce(
      (acc, entry) => {
        entry.moods.forEach((mood) => {
          acc[mood] = (acc[mood] || 0) + 1
        })
        return acc
      },
      {} as Record<string, number>,
    )

    const mostCommonMood = Object.entries(moodCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || ""

    const hourCounts = entries.reduce(
      (acc, entry) => {
        const hour = new Date(entry.createdAt).getHours()
        acc[hour] = (acc[hour] || 0) + 1
        return acc
      },
      {} as Record<number, number>,
    )

    const peakWritingHour = Object.entries(hourCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "0"

    setAnalyticsData({
      totalEntries,
      totalWords,
      averageWordsPerEntry,
      writingStreak: 7, // Mock streak
      mostCommonMood,
      peakWritingHour: `${peakWritingHour}:00`,
      monthlyGoalProgress: 75, // Mock progress
    })
  }, [entries])

  // Generate search suggestions
  useEffect(() => {
    if (searchQuery.length > 1) {
      const suggestions = entries
        .flatMap((entry) => [...entry.moods, ...entry.activities, ...entry.tags, entry.category, entry.title])
        .filter((item) => item && item.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter((item, index, arr) => arr.indexOf(item) === index)
        .slice(0, 5)

      setSearchSuggestions(suggestions)
    } else {
      setSearchSuggestions([])
    }
  }, [searchQuery, entries])

  // Advanced filtering logic
  const filteredEntries = useMemo(() => {
    let filtered = entries

    // Text search
    if (searchQuery) {
      filtered = filtered.filter(
        (entry) =>
          entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.moods.some((mood) => mood.toLowerCase().includes(searchQuery.toLowerCase())) ||
          entry.activities.some((activity) => activity.toLowerCase().includes(searchQuery.toLowerCase())) ||
          entry.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Date range filter
    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter((entry) => {
        const entryDate = new Date(entry.date)
        if (dateRange.from && entryDate < dateRange.from) return false
        if (dateRange.to && entryDate > dateRange.to) return false
        return true
      })
    }

    // Word count range filter
    filtered = filtered.filter((entry) => entry.wordCount >= wordCountRange[0] && entry.wordCount <= wordCountRange[1])

    // Privacy filter
    if (privacyFilter.length > 0) {
      filtered = filtered.filter((entry) => privacyFilter.includes(entry.privacyLevel))
    }

    // Mood filter
    if (moodFilter.length > 0) {
      filtered = filtered.filter((entry) => entry.moods.some((mood) => moodFilter.includes(mood)))
    }

    // Activity filter
    if (activityFilter.length > 0) {
      filtered = filtered.filter((entry) => entry.activities.some((activity) => activityFilter.includes(activity)))
    }

    // Category filter
    if (categoryFilter.length > 0) {
      filtered = filtered.filter((entry) => categoryFilter.includes(entry.category))
    }

    // Attachment filter
    if (attachmentFilter.length > 0) {
      filtered = filtered.filter((entry) => {
        if (attachmentFilter.includes("images") && !entry.hasImages) return false
        if (attachmentFilter.includes("voice") && !entry.hasVoiceNote) return false
        if (attachmentFilter.includes("drawings") && !entry.hasDrawing) return false
        return true
      })
    }

    // Time of day filter
    if (timeOfDayFilter.length > 0) {
      filtered = filtered.filter((entry) => timeOfDayFilter.includes(entry.timeOfDay))
    }

    // Weather filter
    if (weatherFilter.length > 0) {
      filtered = filtered.filter((entry) => weatherFilter.includes(entry.weather))
    }

    // Sentiment filter
    if (sentimentFilter.length > 0) {
      filtered = filtered.filter((entry) => sentimentFilter.includes(entry.sentiment))
    }

    return filtered
  }, [
    entries,
    searchQuery,
    dateRange,
    wordCountRange,
    privacyFilter,
    moodFilter,
    activityFilter,
    categoryFilter,
    attachmentFilter,
    timeOfDayFilter,
    weatherFilter,
    sentimentFilter,
  ])

  // Sorting logic
  const sortedEntries = useMemo(() => {
    const sorted = [...filteredEntries].sort((a, b) => {
      let primaryComparison = 0

      switch (sortBy) {
        case "recent":
          primaryComparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          break
        case "oldest":
          primaryComparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case "modified":
          primaryComparison = new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
          break
        case "title":
          primaryComparison = a.title.localeCompare(b.title)
          break
        case "wordCount":
          primaryComparison = b.wordCount - a.wordCount
          break
        case "readingTime":
          primaryComparison = b.readingTime - a.readingTime
          break
        case "mood":
          primaryComparison = (b.moods[0] || "").localeCompare(a.moods[0] || "")
          break
        case "category":
          primaryComparison = a.category.localeCompare(b.category)
          break
        case "quality":
          primaryComparison = b.qualityScore - a.qualityScore
          break
        case "favorites":
          primaryComparison = (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0)
          break
        default:
          primaryComparison = 0
      }

      if (sortOrder === "asc") {
        primaryComparison = -primaryComparison
      }

      // Secondary sorting
      if (primaryComparison === 0 && secondarySortBy) {
        switch (secondarySortBy) {
          case "wordCount":
            return sortOrder === "desc" ? b.wordCount - a.wordCount : a.wordCount - b.wordCount
          case "date":
            return sortOrder === "desc"
              ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          default:
            return 0
        }
      }

      return primaryComparison
    })

    // Move pinned entries to top
    const pinned = sorted.filter((entry) => entry.isPinned)
    const unpinned = sorted.filter((entry) => !entry.isPinned)

    return [...pinned, ...unpinned]
  }, [filteredEntries, sortBy, sortOrder, secondarySortBy])

  // Pagination
  const paginatedEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedEntries.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedEntries, currentPage, itemsPerPage])

  // Entry actions
  const toggleFavorite = (id: number) => {
    setEntries((prev) => prev.map((entry) => (entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry)))
  }

  const togglePin = (id: number) => {
    setEntries((prev) => prev.map((entry) => (entry.id === id ? { ...entry, isPinned: !entry.isPinned } : entry)))
  }

  const deleteEntry = (id: number) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
  }

  const archiveEntry = (id: number) => {
    // Implementation for archiving
    console.log("Archive entry:", id)
  }

  const duplicateEntry = (id: number) => {
    const entry = entries.find((e) => e.id === id)
    if (entry) {
      const newEntry = {
        ...entry,
        id: Math.max(...entries.map((e) => e.id)) + 1,
        title: `${entry.title} (Copy)`,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      }
      setEntries((prev) => [newEntry, ...prev])
    }
  }

  const bulkDelete = () => {
    setEntries((prev) => prev.filter((entry) => !selectedEntries.includes(entry.id)))
    setSelectedEntries([])
    setBulkMode(false)
  }

  const bulkArchive = () => {
    // Implementation for bulk archive
    setSelectedEntries([])
    setBulkMode(false)
  }

  const bulkExport = () => {
    const selectedData = entries.filter((entry) => selectedEntries.includes(entry.id))
    const csvContent = selectedData
      .map((entry) => `"${entry.title}","${entry.date}","${entry.wordCount}","${entry.moods.join(";")}"`)
      .join("\n")

    const blob = new Blob([`Title,Date,Word Count,Moods\n${csvContent}`], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "selected-entries.csv"
    a.click()

    setSelectedEntries([])
    setBulkMode(false)
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setDateRange({})
    setWordCountRange([0, 1000])
    setPrivacyFilter([])
    setMoodFilter([])
    setActivityFilter([])
    setCategoryFilter([])
    setAttachmentFilter([])
    setTimeOfDayFilter([])
    setWeatherFilter([])
    setSentimentFilter([])
  }

  const saveSearch = () => {
    if (searchQuery && !searchHistory.includes(searchQuery)) {
      setSearchHistory((prev) => [searchQuery, ...prev.slice(0, 9)])
    }
  }

  const getMoodColor = (mood: string) => {
    const colors = {
      Happy: "#22c55e",
      Sad: "#ef4444",
      Excited: "#f59e0b",
      Anxious: "#f97316",
      Peaceful: "#06b6d4",
      Frustrated: "#dc2626",
      Grateful: "#ec4899",
      Tired: "#6b7280",
      Energetic: "#84cc16",
      Reflective: "#8b5cf6",
    }
    return colors[mood as keyof typeof colors] || "#6b7280"
  }

  const getEntryLength = (wordCount: number) => {
    if (wordCount < 100) return "short"
    if (wordCount < 300) return "medium"
    return "long"
  }

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isToday(date)) return "Today"
    if (isYesterday(date)) return "Yesterday"
    if (isThisWeek(date)) return format(date, "EEEE")
    if (isThisMonth(date)) return format(date, "MMM d")
    if (isThisYear(date)) return format(date, "MMM d")
    return format(date, "MMM d, yyyy")
  }

  const allMoods = Array.from(new Set(entries.flatMap((entry) => entry.moods)))
  const allActivities = Array.from(new Set(entries.flatMap((entry) => entry.activities)))
  const allCategories = Array.from(new Set(entries.map((entry) => entry.category)))

  return (
    <div className="space-y-4 md:space-y-6 my-2 mx-4 md:mx-8 lg:mx-12 xl:mx-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Entries</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {sortedEntries.length} entries • {entries.filter((e) => e.isFavorite).length} favorites •{" "}
            {entries.filter((e) => e.isPinned).length} pinned
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Selector */}
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "timeline" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("timeline")}
              className="h-8 w-8 p-0"
            >
              <Timeline className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("calendar")}
              className="h-8 w-8 p-0"
            >
              <CalendarView className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "kanban" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className="h-8 w-8 p-0"
            >
              <Columns className="h-4 w-4" />
            </Button>
          </div>

          {/* Bulk Mode Toggle */}
          <Button
            variant={bulkMode ? "default" : "outline"}
            size="sm"
            onClick={() => setBulkMode(!bulkMode)}
            className="gap-2 bg-transparent"
          >
            <CheckSquare className="h-4 w-4" />
            Bulk
          </Button>

          {/* Settings */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Display Settings</DialogTitle>
                <DialogDescription>Customize how your entries are displayed</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="display" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="display">Display</TabsTrigger>
                  <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
                  <TabsTrigger value="export">Export</TabsTrigger>
                </TabsList>

                <TabsContent value="display" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <Select
                        value={customization.theme}
                        onValueChange={(value) => setCustomization((prev) => ({ ...prev, theme: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="colorful">Colorful</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Layout Density</Label>
                      <Select value={layoutDensity} onValueChange={setLayoutDensity}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="compact">Compact</SelectItem>
                          <SelectItem value="comfortable">Comfortable</SelectItem>
                          <SelectItem value="spacious">Spacious</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Preview Length</Label>
                      <Slider
                        value={[customization.previewLength]}
                        onValueChange={([value]) => setCustomization((prev) => ({ ...prev, previewLength: value }))}
                        min={50}
                        max={300}
                        step={25}
                      />
                      <div className="text-sm text-muted-foreground">{customization.previewLength} characters</div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Show Mood Colors</Label>
                        <Switch
                          checked={customization.showMoodColors}
                          onCheckedChange={(checked) =>
                            setCustomization((prev) => ({ ...prev, showMoodColors: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Show Reading Time</Label>
                        <Switch
                          checked={customization.showReadingTime}
                          onCheckedChange={(checked) =>
                            setCustomization((prev) => ({ ...prev, showReadingTime: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Show Word Count</Label>
                        <Switch
                          checked={customization.showWordCount}
                          onCheckedChange={(checked) =>
                            setCustomization((prev) => ({ ...prev, showWordCount: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Enable Animations</Label>
                        <Switch
                          checked={customization.animationsEnabled}
                          onCheckedChange={(checked) =>
                            setCustomization((prev) => ({ ...prev, animationsEnabled: checked }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="accessibility" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Font Size</Label>
                      <Select
                        value={customization.fontSize}
                        onValueChange={(value) => setCustomization((prev) => ({ ...prev, fontSize: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                          <SelectItem value="extra-large">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>High Contrast Mode</Label>
                      <Switch
                        checked={customization.highContrast}
                        onCheckedChange={(checked) => setCustomization((prev) => ({ ...prev, highContrast: checked }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Keyboard Shortcuts</Label>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>
                          • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl + F</kbd> - Search
                        </div>
                        <div>
                          • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl + N</kbd> - New Entry
                        </div>
                        <div>
                          • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl + B</kbd> - Bulk Mode
                        </div>
                        <div>
                          • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Esc</kbd> - Clear Filters
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="export" className="space-y-4">
                  <div className="space-y-4">
                    <Button className="w-full gap-2">
                      <Download className="h-4 w-4" />
                      Export All Entries (CSV)
                    </Button>
                    <Button variant="outline" className="w-full gap-2 bg-transparent">
                      <FileText className="h-4 w-4" />
                      Generate PDF Report
                    </Button>
                    <Button variant="outline" className="w-full gap-2 bg-transparent">
                      <Share2 className="h-4 w-4" />
                      Create Shareable Collection
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Main Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search entries, moods, activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveSearch()}
                  className="pl-10"
                />

                {/* Search Suggestions */}
                {searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-background border rounded-md shadow-lg">
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="w-full px-3 py-2 text-left hover:bg-muted text-sm"
                        onClick={() => {
                          setSearchQuery(suggestion)
                          setSearchSuggestions([])
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button variant="outline" onClick={() => setAdvancedSearchOpen(true)} className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Advanced
              </Button>

              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2 bg-transparent"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDateRange({ from: new Date(), to: new Date() })}
                className="gap-1 bg-transparent"
              >
                <CalendarIcon className="h-3 w-3" />
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const weekStart = startOfWeek(new Date())
                  const weekEnd = endOfWeek(new Date())
                  setDateRange({ from: weekStart, to: weekEnd })
                }}
                className="gap-1 bg-transparent"
              >
                <CalendarIcon className="h-3 w-3" />
                This Week
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const monthStart = startOfMonth(new Date())
                  const monthEnd = endOfMonth(new Date())
                  setDateRange({ from: monthStart, to: monthEnd })
                }}
                className="gap-1 bg-transparent"
              >
                <CalendarIcon className="h-3 w-3" />
                This Month
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMoodFilter(["Happy", "Excited", "Grateful"])}
                className="gap-1 bg-transparent"
              >
                <Heart className="h-3 w-3" />
                Positive
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAttachmentFilter(["images"])}
                className="gap-1 bg-transparent"
              >
                <ImageIcon className="h-3 w-3" />
                With Photos
              </Button>
            </div>

            {/* Active Filters Display */}
            {(searchQuery || dateRange.from || moodFilter.length > 0 || activityFilter.length > 0) && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-muted-foreground">Active filters:</span>

                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchQuery}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                  </Badge>
                )}

                {dateRange.from && (
                  <Badge variant="secondary" className="gap-1">
                    Date: {format(dateRange.from, "MMM d")} - {dateRange.to ? format(dateRange.to, "MMM d") : "now"}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setDateRange({})} />
                  </Badge>
                )}

                {moodFilter.map((mood) => (
                  <Badge key={mood} variant="secondary" className="gap-1">
                    {mood}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setMoodFilter((prev) => prev.filter((m) => m !== mood))}
                    />
                  </Badge>
                ))}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="gap-1 text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3 w-3" />
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Search Modal */}
      <Dialog open={advancedSearchOpen} onOpenChange={setAdvancedSearchOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Advanced Search</DialogTitle>
            <DialogDescription>Use multiple criteria to find exactly what you're looking for</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Date Range */}
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Word Count Range */}
            <div className="space-y-2">
              <Label>Word Count Range</Label>
              <div className="space-y-2">
                <Slider
                  value={wordCountRange}
                  onValueChange={setWordCountRange}
                  max={1000}
                  min={0}
                  step={25}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{wordCountRange[0]} words</span>
                  <span>{wordCountRange[1]} words</span>
                </div>
              </div>
            </div>

            {/* Mood Filter */}
            <div className="space-y-2">
              <Label>Moods</Label>
              <div className="flex flex-wrap gap-2">
                {allMoods.map((mood) => (
                  <Button
                    key={mood}
                    variant={moodFilter.includes(mood) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setMoodFilter((prev) => (prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]))
                    }}
                    className="text-xs"
                  >
                    {mood}
                  </Button>
                ))}
              </div>
            </div>

            {/* Activity Filter */}
            <div className="space-y-2">
              <Label>Activities</Label>
              <div className="flex flex-wrap gap-2">
                {allActivities.map((activity) => (
                  <Button
                    key={activity}
                    variant={activityFilter.includes(activity) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setActivityFilter((prev) =>
                        prev.includes(activity) ? prev.filter((a) => a !== activity) : [...prev, activity],
                      )
                    }}
                    className="text-xs gap-1"
                  >
                    {activityIcons[activity as keyof typeof activityIcons] &&
                      React.createElement(activityIcons[activity as keyof typeof activityIcons], {
                        className: "h-3 w-3",
                      })}
                    {activity}
                  </Button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="flex flex-wrap gap-2">
                {allCategories.map((category) => (
                  <Button
                    key={category}
                    variant={categoryFilter.includes(category) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setCategoryFilter((prev) =>
                        prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
                      )
                    }}
                    className="text-xs"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Privacy Filter */}
            <div className="space-y-2">
              <Label>Privacy Level</Label>
              <div className="flex gap-2">
                {["public", "private", "encrypted"].map((level) => (
                  <Button
                    key={level}
                    variant={privacyFilter.includes(level) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setPrivacyFilter((prev) =>
                        prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
                      )
                    }}
                    className="text-xs gap-1 capitalize"
                  >
                    {level === "public" && <Globe className="h-3 w-3" />}
                    {level === "private" && <Lock className="h-3 w-3" />}
                    {level === "encrypted" && <Shield className="h-3 w-3" />}
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            {/* Attachment Filter */}
            <div className="space-y-2">
              <Label>Attachments</Label>
              <div className="flex gap-2">
                {[
                  { key: "images", label: "Images", icon: ImageIcon },
                  { key: "voice", label: "Voice", icon: Mic },
                  { key: "drawings", label: "Drawings", icon: Brush },
                ].map(({ key, label, icon: Icon }) => (
                  <Button
                    key={key}
                    variant={attachmentFilter.includes(key) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setAttachmentFilter((prev) =>
                        prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key],
                      )
                    }}
                    className="text-xs gap-1"
                  >
                    <Icon className="h-3 w-3" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Time of Day Filter */}
            <div className="space-y-2">
              <Label>Time of Day</Label>
              <div className="flex gap-2">
                {["morning", "afternoon", "evening", "night"].map((time) => (
                  <Button
                    key={time}
                    variant={timeOfDayFilter.includes(time) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setTimeOfDayFilter((prev) =>
                        prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time],
                      )
                    }}
                    className="text-xs capitalize"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={clearAllFilters} className="gap-2 bg-transparent">
              <RotateCcw className="h-4 w-4" />
              Clear All
            </Button>
            <Button onClick={() => setAdvancedSearchOpen(false)}>Apply Filters</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sorting and View Options */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="modified">Last Modified</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
              <SelectItem value="wordCount">Word Count</SelectItem>
              <SelectItem value="readingTime">Reading Time</SelectItem>
              <SelectItem value="mood">Mood</SelectItem>
              <SelectItem value="category">Category</SelectItem>
              <SelectItem value="quality">Quality Score</SelectItem>
              <SelectItem value="favorites">Favorites First</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="gap-2 bg-transparent"
          >
            {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            {sortOrder === "asc" ? "Ascending" : "Descending"}
          </Button>

          {secondarySortBy && (
            <Badge variant="outline" className="gap-1">
              Then by: {secondarySortBy}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSecondarySortBy("")} />
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6 per page</SelectItem>
              <SelectItem value="12">12 per page</SelectItem>
              <SelectItem value="24">24 per page</SelectItem>
              <SelectItem value="48">48 per page</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={() => setShowStats(!showStats)} className="gap-2 bg-transparent">
            <BarChart3 className="h-4 w-4" />
            Stats
          </Button>
        </div>
      </div>

      {/* Analytics Panel */}
      {showStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Entry Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <Label className="text-sm">Total Entries</Label>
                </div>
                <div className="text-2xl font-bold">{analyticsData.totalEntries}</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4 text-green-500" />
                  <Label className="text-sm">Total Words</Label>
                </div>
                <div className="text-2xl font-bold">{analyticsData.totalWords.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Avg: {analyticsData.averageWordsPerEntry} per entry</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <Label className="text-sm">Writing Streak</Label>
                </div>
                <div className="text-2xl font-bold">{analyticsData.writingStreak} days</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-500" />
                  <Label className="text-sm">Most Common Mood</Label>
                </div>
                <div className="text-lg font-semibold">{analyticsData.mostCommonMood}</div>
                <div className="text-sm text-muted-foreground">Peak time: {analyticsData.peakWritingHour}</div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm">Monthly Writing Goal</Label>
                  <span className="text-sm text-muted-foreground">{analyticsData.monthlyGoalProgress}%</span>
                </div>
                <Progress value={analyticsData.monthlyGoalProgress} className="h-2" />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-semibold text-green-600">
                    {entries.filter((e) => e.sentiment === "positive").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Positive Entries</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-semibold text-blue-600">{entries.filter((e) => e.hasImages).length}</div>
                  <div className="text-sm text-muted-foreground">With Photos</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-semibold text-purple-600">
                    {Math.round(entries.reduce((sum, e) => sum + e.qualityScore, 0) / entries.length)}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Quality Score</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Actions Bar */}
      {bulkMode && selectedEntries.length > 0 && (
        <Card className="border-primary">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{selectedEntries.length} entries selected</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={bulkExport} className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={bulkArchive} className="gap-2 bg-transparent">
                  <Archive className="h-4 w-4" />
                  Archive
                </Button>
                <Button variant="destructive" size="sm" onClick={bulkDelete} className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedEntries([])
                    setBulkMode(false)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Entries Display */}
      {sortedEntries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-semibold mb-2">No entries found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery ||
              Object.values({ dateRange, moodFilter, activityFilter }).some(
                (f) => f && (Array.isArray(f) ? f.length > 0 : Object.keys(f).length > 0),
              )
                ? "Try adjusting your search or filters"
                : "Start your journaling journey by creating your first entry"}
            </p>
            <div className="flex gap-2">
              <Button>Create New Entry</Button>
              {(searchQuery ||
                Object.values({ dateRange, moodFilter, activityFilter }).some(
                  (f) => f && (Array.isArray(f) ? f.length > 0 : Object.keys(f).length > 0),
                )) && (
                <Button variant="outline" onClick={clearAllFilters} className="bg-transparent">
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === "grid" && (
            <div
              className={cn(
                "grid gap-4",
                layoutDensity === "compact" && "gap-3",
                layoutDensity === "spacious" && "gap-6",
                "md:grid-cols-2 lg:grid-cols-3",
                cardSize === "small" && "xl:grid-cols-4",
                cardSize === "large" && "lg:grid-cols-2",
              )}
            >
              {paginatedEntries.map((entry) => (
                <Card
                  key={entry.id}
                  className={cn(
                    "group hover:shadow-md transition-all cursor-pointer relative",
                    customization.animationsEnabled && "hover:scale-[1.02]",
                    customization.showMoodColors && entry.moods.length > 0 && "border-l-4",
                    entry.isPinned && "ring-2 ring-yellow-200 bg-yellow-50/50",
                    selectedEntries.includes(entry.id) && "ring-2 ring-primary bg-primary/5",
                    customization.highContrast && "border-2 border-foreground",
                  )}
                  style={{
                    borderLeftColor:
                      customization.showMoodColors && entry.moods.length > 0 ? getMoodColor(entry.moods[0]) : undefined,
                  }}
                  onClick={() => !bulkMode && setPreviewEntry(entry)}
                >
                  {bulkMode && (
                    <div className="absolute top-2 left-2 z-10">
                      <Checkbox
                        checked={selectedEntries.includes(entry.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedEntries((prev) => [...prev, entry.id])
                          } else {
                            setSelectedEntries((prev) => prev.filter((id) => id !== entry.id))
                          }
                        }}
                      />
                    </div>
                  )}

                  {entry.isPinned && (
                    <div className="absolute top-2 right-2">
                      <Pin className="h-4 w-4 text-yellow-600" />
                    </div>
                  )}

                  <CardHeader
                    className={cn(
                      "pb-3",
                      layoutDensity === "compact" && "pb-2 pt-3",
                      layoutDensity === "spacious" && "pb-4 pt-6",
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle
                          className={cn(
                            "line-clamp-2",
                            !entry.title && "text-muted-foreground italic",
                            customization.fontSize === "small" && "text-sm",
                            customization.fontSize === "large" && "text-lg",
                            customization.fontSize === "extra-large" && "text-xl",
                          )}
                        >
                          {entry.title || "Untitled Entry"}
                        </CardTitle>
                        <CardDescription
                          className={cn(
                            "flex items-center gap-2 mt-1",
                            customization.fontSize === "small" && "text-xs",
                            customization.fontSize === "large" && "text-sm",
                          )}
                        >
                          <span>{formatRelativeDate(entry.date)}</span>
                          {entry.lastModified !== entry.createdAt && <span className="text-xs">• edited</span>}
                          {customization.showReadingTime && (
                            <span className="text-xs">• {entry.readingTime} min read</span>
                          )}
                        </CardDescription>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              setPreviewEntry(entry)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Quick Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              togglePin(entry.id)
                            }}
                          >
                            {entry.isPinned ? (
                              <>
                                <PinOff className="h-4 w-4 mr-2" />
                                Unpin
                              </>
                            ) : (
                              <>
                                <Pin className="h-4 w-4 mr-2" />
                                Pin to Top
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(entry.id)
                            }}
                          >
                            <Heart className={cn("h-4 w-4 mr-2", entry.isFavorite && "fill-current text-red-500")} />
                            {entry.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              duplicateEntry(entry.id)
                            }}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              archiveEntry(entry.id)
                            }}
                          >
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteEntry(entry.id)
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent
                    className={cn(
                      layoutDensity === "compact" && "pt-0 pb-3",
                      layoutDensity === "spacious" && "pt-0 pb-6",
                    )}
                  >
                    <p
                      className={cn(
                        "text-muted-foreground line-clamp-3 mb-4",
                        customization.fontSize === "small" && "text-xs",
                        customization.fontSize === "large" && "text-sm",
                      )}
                    >
                      {entry.content.slice(0, customization.previewLength)}
                      {entry.content.length > customization.previewLength && "..."}
                    </p>

                    {/* Mood Tags */}
                    {entry.moods.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {entry.moods.slice(0, 3).map((mood) => (
                          <Badge
                            key={mood}
                            variant="secondary"
                            className="text-xs"
                            style={{
                              backgroundColor: customization.showMoodColors ? `${getMoodColor(mood)}20` : undefined,
                              borderColor: customization.showMoodColors ? getMoodColor(mood) : undefined,
                            }}
                          >
                            {mood}
                          </Badge>
                        ))}
                        {entry.moods.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{entry.moods.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Activity Tags */}
                    {entry.activities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {entry.activities.map((activity) => {
                          const ActivityIcon = activityIcons[activity as keyof typeof activityIcons]
                          return (
                            <Badge key={activity} variant="outline" className="text-xs gap-1">
                              {ActivityIcon && <ActivityIcon className="h-3 w-3" />}
                              {activity}
                            </Badge>
                          )
                        })}
                      </div>
                    )}

                    {/* Entry Stats */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        {customization.showWordCount && <span>{entry.wordCount} words</span>}
                        <span>{entry.charCount} chars</span>
                        {entry.qualityScore > 80 && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <Star className="h-2 w-2 fill-current text-yellow-500" />
                            High Quality
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {entry.hasImages && (
                          <div className="flex items-center gap-1">
                            <ImageIcon className="h-3 w-3" />
                            <span>{entry.imageCount}</span>
                          </div>
                        )}
                        {entry.hasVoiceNote && <Mic className="h-3 w-3" />}
                        {entry.hasDrawing && <Brush className="h-3 w-3" />}
                        {entry.isFavorite && <Heart className="h-3 w-3 fill-current text-red-500" />}
                        {entry.isPrivate && (
                          <div className="flex items-center gap-1">
                            {entry.privacyLevel === "encrypted" ? (
                              <Shield className="h-3 w-3" />
                            ) : (
                              <Lock className="h-3 w-3" />
                            )}
                          </div>
                        )}
                        {entry.weather &&
                          React.createElement(weatherIcons[entry.weather as keyof typeof weatherIcons], {
                            className: "h-3 w-3",
                          })}
                      </div>
                    </div>

                    {/* Progress Bar for Word Count */}
                    {customization.showWordCount && (
                      <div className="mt-2">
                        <Progress
                          value={(entry.wordCount / analyticsData.averageWordsPerEntry) * 100}
                          className="h-1"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="space-y-2">
              {paginatedEntries.map((entry) => (
                <Card
                  key={entry.id}
                  className={cn(
                    "hover:shadow-sm transition-all cursor-pointer",
                    entry.isPinned && "ring-1 ring-yellow-200 bg-yellow-50/30",
                    selectedEntries.includes(entry.id) && "ring-1 ring-primary bg-primary/5",
                  )}
                  onClick={() => !bulkMode && setPreviewEntry(entry)}
                >
                  <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                      {bulkMode && (
                        <Checkbox
                          checked={selectedEntries.includes(entry.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedEntries((prev) => [...prev, entry.id])
                            } else {
                              setSelectedEntries((prev) => prev.filter((id) => id !== entry.id))
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {entry.isPinned && <Pin className="h-3 w-3 text-yellow-600" />}
                          <h3 className={cn("font-medium truncate", !entry.title && "text-muted-foreground italic")}>
                            {entry.title || "Untitled Entry"}
                          </h3>
                          <span className="text-xs text-muted-foreground">{formatRelativeDate(entry.date)}</span>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                          {entry.content.slice(0, 120)}...
                        </p>

                        <div className="flex items-center gap-2 flex-wrap">
                          {entry.moods.slice(0, 2).map((mood) => (
                            <Badge key={mood} variant="secondary" className="text-xs">
                              {mood}
                            </Badge>
                          ))}
                          {entry.moods.length > 2 && (
                            <span className="text-xs text-muted-foreground">+{entry.moods.length - 2} more</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{entry.wordCount} words</span>
                        <span>{entry.readingTime} min</span>

                        <div className="flex items-center gap-1">
                          {entry.hasImages && <ImageIcon className="h-3 w-3" />}
                          {entry.hasVoiceNote && <Mic className="h-3 w-3" />}
                          {entry.isFavorite && <Heart className="h-3 w-3 fill-current text-red-500" />}
                          {entry.isPrivate && <Lock className="h-3 w-3" />}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                setPreviewEntry(entry)
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleFavorite(entry.id)
                              }}
                            >
                              <Heart className="h-4 w-4 mr-2" />
                              {entry.isFavorite ? "Unfavorite" : "Favorite"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteEntry(entry.id)
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Timeline View */}
          {viewMode === "timeline" && (
            <div className="space-y-6">
              {Object.entries(
                paginatedEntries.reduce(
                  (groups, entry) => {
                    const date = format(new Date(entry.date), "yyyy-MM-dd")
                    if (!groups[date]) {
                      groups[date] = []
                    }
                    groups[date].push(entry)
                    return groups
                  },
                  {} as Record<string, typeof paginatedEntries>,
                ),
              ).map(([date, dayEntries]) => (
                <div key={date} className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 w-24 text-right">
                      <div className="text-sm font-medium">{format(new Date(date), "MMM d")}</div>
                      <div className="text-xs text-muted-foreground">{format(new Date(date), "yyyy")}</div>
                    </div>
                    <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                    <div className="flex-1 h-px bg-border"></div>
                  </div>

                  <div className="ml-28 space-y-3">
                    {dayEntries.map((entry) => (
                      <Card
                        key={entry.id}
                        className="hover:shadow-sm transition-all cursor-pointer"
                        onClick={() => setPreviewEntry(entry)}
                      >
                        <CardContent className="py-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className={cn("font-medium mb-1", !entry.title && "text-muted-foreground italic")}>
                                {entry.title || "Untitled Entry"}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                {entry.content.slice(0, 150)}...
                              </p>
                              <div className="flex items-center gap-2">
                                {entry.moods.slice(0, 3).map((mood) => (
                                  <Badge key={mood} variant="secondary" className="text-xs">
                                    {mood}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(entry.createdAt), "HH:mm")}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, sortedEntries.length)} of {sortedEntries.length} entries
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="bg-transparent"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, Math.ceil(sortedEntries.length / itemsPerPage)) }, (_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(Math.ceil(sortedEntries.length / itemsPerPage), prev + 1))
                }
                disabled={currentPage >= Math.ceil(sortedEntries.length / itemsPerPage)}
                className="bg-transparent"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Entry Preview Modal */}
      <Dialog open={!!previewEntry} onOpenChange={() => setPreviewEntry(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {previewEntry && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <DialogTitle className={cn(!previewEntry.title && "text-muted-foreground italic")}>
                      {previewEntry.title || "Untitled Entry"}
                    </DialogTitle>
                    <DialogDescription>
                      {formatRelativeDate(previewEntry.date)} • {previewEntry.wordCount} words •{" "}
                      {previewEntry.readingTime} min read
                    </DialogDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => toggleFavorite(previewEntry.id)}>
                      <Heart className={cn("h-4 w-4", previewEntry.isFavorite && "fill-current text-red-500")} />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Entry
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => duplicateEntry(previewEntry.id)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Printer className="h-4 w-4 mr-2" />
                          Print
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Entry Content */}
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{previewEntry.content}</div>
                </div>

                {/* Entry Metadata */}
                <div className="grid gap-4 md:grid-cols-2">
                  {previewEntry.moods.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Moods</Label>
                      <div className="flex flex-wrap gap-2">
                        {previewEntry.moods.map((mood) => (
                          <Badge
                            key={mood}
                            variant="secondary"
                            style={{
                              backgroundColor: `${getMoodColor(mood)}20`,
                              borderColor: getMoodColor(mood),
                            }}
                          >
                            {mood}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {previewEntry.activities.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Activities</Label>
                      <div className="flex flex-wrap gap-2">
                        {previewEntry.activities.map((activity) => {
                          const ActivityIcon = activityIcons[activity as keyof typeof activityIcons]
                          return (
                            <Badge key={activity} variant="outline" className="gap-1">
                              {ActivityIcon && <ActivityIcon className="h-3 w-3" />}
                              {activity}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Details</Label>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Category: {previewEntry.category}</div>
                      <div>Energy Level: {previewEntry.energyLevel}/10</div>
                      <div>Sleep Quality: {previewEntry.sleepQuality}/5 stars</div>
                      {previewEntry.location && <div>Location: {previewEntry.location}</div>}
                      {previewEntry.weather && (
                        <div className="flex items-center gap-1">
                          Weather:
                          {React.createElement(weatherIcons[previewEntry.weather as keyof typeof weatherIcons], {
                            className: "h-3 w-3 ml-1",
                          })}
                          <span className="capitalize">{previewEntry.weather}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Statistics</Label>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Quality Score: {previewEntry.qualityScore}/100</div>
                      <div>
                        Sentiment: <span className="capitalize">{previewEntry.sentiment}</span>
                      </div>
                      <div>
                        Time of Day: <span className="capitalize">{previewEntry.timeOfDay}</span>
                      </div>
                      <div>
                        Privacy: <span className="capitalize">{previewEntry.privacyLevel}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attachments */}
                {(previewEntry.hasImages || previewEntry.hasVoiceNote || previewEntry.hasDrawing) && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Attachments</Label>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {previewEntry.hasImages && (
                        <div className="flex items-center gap-1">
                          <ImageIcon className="h-4 w-4" />
                          {previewEntry.imageCount} image{previewEntry.imageCount !== 1 ? "s" : ""}
                        </div>
                      )}
                      {previewEntry.hasVoiceNote && (
                        <div className="flex items-center gap-1">
                          <Mic className="h-4 w-4" />
                          Voice note
                        </div>
                      )}
                      {previewEntry.hasDrawing && (
                        <div className="flex items-center gap-1">
                          <Brush className="h-4 w-4" />
                          Drawing
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Back to Top Button */}
      <Button
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 shadow-lg"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </div>
  )
}
