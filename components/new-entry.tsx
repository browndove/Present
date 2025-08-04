"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Mic,
  Save,
  Lock,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Quote,
  Code,
  Minus,
  Type,
  Eye,
  Maximize,
  Minimize,
  Clock,
  Heart,
  Sun,
  Shield,
  Share2,
  FileText,
  Download,
  Printer,
  X,
  Plus,
  Trash2,
  CheckSquare,
  Square,
  Brush,
  Eraser,
  RotateCcw,
  Upload,
  Play,
  Pause,
  StopCircle,
  TrendingUp,
  Coffee,
  Book,
  Music,
  Gamepad2,
  Users,
  Home,
  Car,
  ShoppingBag,
  Utensils,
  Dumbbell,
  CloudRain,
  Snowflake,
  Wind,
  Flame,
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Enhanced mood system with intensity
const advancedMoods = [
  { emoji: "😢", label: "Sad", value: "sad", color: "#ef4444" },
  { emoji: "😔", label: "Down", value: "down", color: "#f97316" },
  { emoji: "😐", label: "Neutral", value: "neutral", color: "#eab308" },
  { emoji: "😊", label: "Happy", value: "happy", color: "#22c55e" },
  { emoji: "😄", label: "Joyful", value: "joyful", color: "#3b82f6" },
  { emoji: "😍", label: "Excited", value: "excited", color: "#8b5cf6" },
  { emoji: "😌", label: "Peaceful", value: "peaceful", color: "#06b6d4" },
  { emoji: "😤", label: "Frustrated", value: "frustrated", color: "#dc2626" },
  { emoji: "😰", label: "Anxious", value: "anxious", color: "#f59e0b" },
  { emoji: "🥰", label: "Grateful", value: "grateful", color: "#ec4899" },
]

const templates = [
  {
    id: "daily",
    name: "Daily Reflection",
    category: "daily",
    preview: "What went well today? What could have been better?",
    content: `## Today's Reflection

**What went well:**
- 

**What could have been better:**
- 

**Tomorrow I will:**
- `,
    tags: ["reflection", "daily"],
    isFavorite: false,
  },
  {
    id: "gratitude",
    name: "Gratitude Journal",
    category: "gratitude",
    preview: "Three things I'm grateful for today...",
    content: `## Gratitude Practice

**Three things I'm grateful for:**
1. 
2. 
3. 

**Why I'm grateful:**


**How this makes me feel:**
`,
    tags: ["gratitude", "positive"],
    isFavorite: true,
  },
  {
    id: "goals",
    name: "Goal Progress",
    category: "goals",
    preview: "Track progress toward your goals...",
    content: `## Goal Progress Check

**Goals I'm working on:**
- [ ] 
- [ ] 
- [ ] 

**Progress made today:**


**Next steps:**
`,
    tags: ["goals", "progress"],
    isFavorite: false,
  },
  {
    id: "mood",
    name: "Mood Check",
    category: "daily",
    preview: "How am I feeling and why?",
    content: `## Mood Check-In

**Current mood:** 

**What's influencing my mood:**
- 
- 

**What would help me feel better:**
- 
`,
    tags: ["mood", "feelings"],
    isFavorite: false,
  },
]

const activityTags = [
  { name: "Work", icon: Coffee, color: "#8b5cf6" },
  { name: "Exercise", icon: Dumbbell, color: "#ef4444" },
  { name: "Reading", icon: Book, color: "#3b82f6" },
  { name: "Music", icon: Music, color: "#ec4899" },
  { name: "Gaming", icon: Gamepad2, color: "#22c55e" },
  { name: "Social", icon: Users, color: "#f59e0b" },
  { name: "Home", icon: Home, color: "#06b6d4" },
  { name: "Travel", icon: Car, color: "#8b5cf6" },
  { name: "Shopping", icon: ShoppingBag, color: "#ec4899" },
  { name: "Food", icon: Utensils, color: "#f97316" },
]

const weatherOptions = [
  { value: "sunny", label: "Sunny", icon: Sun, color: "#f59e0b" },
  { value: "cloudy", label: "Cloudy", icon: CloudRain, color: "#6b7280" },
  { value: "rainy", label: "Rainy", icon: CloudRain, color: "#3b82f6" },
  { value: "snowy", label: "Snowy", icon: Snowflake, color: "#06b6d4" },
  { value: "windy", label: "Windy", icon: Wind, color: "#22c55e" },
]

export function NewEntry() {
  // Content state
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")

  // Mood state
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])
  const [moodIntensities, setMoodIntensities] = useState<Record<string, number>>({})

  // UI state
  const [editorMode, setEditorMode] = useState<"normal" | "focus" | "fullscreen" | "zen">("normal")
  const [showPreview, setShowPreview] = useState(false)
  const [isPrivate, setIsPrivate] = useState(false)
  const [privacyLevel, setPrivacyLevel] = useState("private")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Rich text formatting
  const [selectedText, setSelectedText] = useState("")
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false)
  const [textSize, setTextSize] = useState([16])
  const [fontFamily, setFontFamily] = useState("inter")
  const [textColor, setTextColor] = useState("#000000")
  const [highlightColor, setHighlightColor] = useState("#ffff00")

  // Media state
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [voiceNotes, setVoiceNotes] = useState<Blob[]>([])
  const [drawings, setDrawings] = useState<string[]>([])

  // Context state
  const [weather, setWeather] = useState("")
  const [location, setLocation] = useState("")
  const [energyLevel, setEnergyLevel] = useState([5])
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])

  // Tags and organization
  const [customTags, setCustomTags] = useState<Array<{ name: string; color: string }>>([])
  const [newTag, setNewTag] = useState("")
  const [tagColor, setTagColor] = useState("#3b82f6")

  // Goals and tasks
  const [goals, setGoals] = useState<Array<{ text: string; completed: boolean }>>([])
  const [newGoal, setNewGoal] = useState("")

  // Writing assistance
  const [writingGoal, setWritingGoal] = useState(500)
  const [sessionTime, setSessionTime] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [writingStreak, setWritingStreak] = useState(7)

  // Template state
  const [templateCategory, setTemplateCategory] = useState("all")
  const [favoriteTemplates, setFavoriteTemplates] = useState<string[]>(["gratitude"])

  // Canvas drawing
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawingTool, setDrawingTool] = useState<"pen" | "eraser">("pen")
  const [drawingColor, setDrawingColor] = useState("#000000")
  const [brushSize, setBrushSize] = useState(3)

  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Calculated values
  const wordCount = content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
  const charCount = content.length
  const readingTime = Math.ceil(wordCount / 200) // Average reading speed
  const completionPercentage = Math.min((wordCount / writingGoal) * 100, 100)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  // Recording timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      setRecordingTime(0)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const handleMoodToggle = (moodValue: string) => {
    setSelectedMoods((prev) => {
      if (prev.includes(moodValue)) {
        const newMoods = prev.filter((m) => m !== moodValue)
        const newIntensities = { ...moodIntensities }
        delete newIntensities[moodValue]
        setMoodIntensities(newIntensities)
        return newMoods
      } else {
        setMoodIntensities((prev) => ({ ...prev, [moodValue]: 5 }))
        return [...prev, moodValue]
      }
    })
  }

  const handleMoodIntensity = (moodValue: string, intensity: number) => {
    setMoodIntensities((prev) => ({ ...prev, [moodValue]: intensity }))
  }

  const applyTemplate = (template: (typeof templates)[0]) => {
    setSelectedTemplate(template.id)
    setContent(template.content)
    setCustomTags(template.tags.map((tag) => ({ name: tag, color: "#3b82f6" })))
    if (!isTimerRunning) {
      setIsTimerRunning(true)
    }
  }

  const toggleTemplateFavorite = (templateId: string) => {
    setFavoriteTemplates((prev) =>
      prev.includes(templateId) ? prev.filter((id) => id !== templateId) : [...prev, templateId],
    )
  }

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files).filter((file) => file.type.startsWith("image/"))
      setUploadedImages((prev) => [...prev, ...newImages])
    }
  }

  const addCustomTag = () => {
    if (newTag.trim()) {
      setCustomTags((prev) => [...prev, { name: newTag.trim(), color: tagColor }])
      setNewTag("")
    }
  }

  const removeTag = (tagName: string) => {
    setCustomTags((prev) => prev.filter((tag) => tag.name !== tagName))
  }

  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals((prev) => [...prev, { text: newGoal.trim(), completed: false }])
      setNewGoal("")
    }
  }

  const toggleGoal = (index: number) => {
    setGoals((prev) => prev.map((goal, i) => (i === index ? { ...goal, completed: !goal.completed } : goal)))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const insertFormatting = (format: string) => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    let replacement = ""
    switch (format) {
      case "bold":
        replacement = `**${selectedText}**`
        break
      case "italic":
        replacement = `*${selectedText}*`
        break
      case "underline":
        replacement = `<u>${selectedText}</u>`
        break
      case "strikethrough":
        replacement = `~~${selectedText}~~`
        break
      case "quote":
        replacement = `> ${selectedText}`
        break
      case "code":
        replacement = `\`${selectedText}\``
        break
      case "divider":
        replacement = "\n---\n"
        break
    }

    const newContent = content.substring(0, start) + replacement + content.substring(end)
    setContent(newContent)

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + replacement.length, start + replacement.length)
    }, 0)
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.lineWidth = brushSize
      ctx.lineCap = "round"

      if (drawingTool === "eraser") {
        ctx.globalCompositeOperation = "destination-out"
      } else {
        ctx.globalCompositeOperation = "source-over"
        ctx.strokeStyle = drawingColor
      }

      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const filteredTemplates = templates.filter(
    (template) => templateCategory === "all" || template.category === templateCategory,
  )

  // Sidebar content component for reuse
  const SidebarContent = () => (
    <div className="space-y-4">
      {/* Advanced Mood Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Mood & Emotions</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Select multiple emotions with intensity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {advancedMoods.map((mood) => (
              <Button
                key={mood.value}
                variant={selectedMoods.includes(mood.value) ? "default" : "outline"}
                className={cn(
                  "h-auto p-2 sm:p-3 flex flex-col items-center gap-1 transition-all hover:scale-105 text-xs sm:text-sm",
                  selectedMoods.includes(mood.value) && "ring-2 ring-offset-2",
                )}
                style={{
                  ringColor: selectedMoods.includes(mood.value) ? mood.color : undefined,
                }}
                onClick={() => handleMoodToggle(mood.value)}
              >
                <span className="text-sm sm:text-lg">{mood.emoji}</span>
                <span className="text-xs leading-tight text-center">{mood.label}</span>
              </Button>
            ))}
          </div>

          {selectedMoods.length > 0 && (
            <div className="space-y-3 pt-3 border-t">
              <Label className="text-xs sm:text-sm font-medium">Mood Intensities</Label>
              {selectedMoods.map((moodValue) => {
                const mood = advancedMoods.find((m) => m.value === moodValue)
                if (!mood) return null

                return (
                  <div key={moodValue} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{mood.emoji}</span>
                        <span className="text-xs sm:text-sm">{mood.label}</span>
                      </div>
                      <span className="text-xs sm:text-sm font-medium">{moodIntensities[moodValue] || 5}/10</span>
                    </div>
                    <Slider
                      value={[moodIntensities[moodValue] || 5]}
                      onValueChange={(value) => handleMoodIntensity(moodValue, value[0])}
                      min={1}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Context Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Context</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Environmental and situational context</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs sm:text-sm">Weather</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {weatherOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={weather === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setWeather(option.value)}
                  className="justify-start gap-2 text-xs sm:text-sm h-8 sm:h-9"
                >
                  <option.icon className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: option.color }} />
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs sm:text-sm">Location</Label>
            <Input
              placeholder="Where are you?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="text-xs sm:text-sm h-8 sm:h-9"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs sm:text-sm">Energy Level</Label>
            <Slider value={energyLevel} onValueChange={setEnergyLevel} min={1} max={10} step={1} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Drained</span>
              <span className="font-medium">{energyLevel[0]}/10</span>
              <span>Energized</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Tags */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Activities</CardTitle>
          <CardDescription className="text-xs sm:text-sm">What were you doing?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activityTags.map((activity) => (
              <Button
                key={activity.name}
                variant={selectedActivities.includes(activity.name) ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setSelectedActivities((prev) =>
                    prev.includes(activity.name) ? prev.filter((a) => a !== activity.name) : [...prev, activity.name],
                  )
                }
                className="justify-start gap-2 text-xs sm:text-sm h-8 sm:h-9"
              >
                <activity.icon className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: activity.color }} />
                {activity.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Tags */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Custom Tags</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Add your own tags</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Add tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addCustomTag()}
              className="text-xs sm:text-sm h-8 sm:h-9"
            />
            <input
              type="color"
              value={tagColor}
              onChange={(e) => setTagColor(e.target.value)}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded border"
            />
            <Button onClick={addCustomTag} size="sm" className="h-8 sm:h-9 px-2 sm:px-3">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>

          {customTags.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {customTags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="gap-1 text-xs"
                  style={{ backgroundColor: `${tag.color}20`, borderColor: tag.color }}
                >
                  {tag.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => removeTag(tag.name)}
                  >
                    <X className="h-2 w-2 sm:h-3 sm:w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Goals & Tasks */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Goals & Tasks</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Track your daily objectives</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Add goal or task..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addGoal()}
              className="text-xs sm:text-sm h-8 sm:h-9"
            />
            <Button onClick={addGoal} size="sm" className="h-8 sm:h-9 px-2 sm:px-3">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>

          {goals.length > 0 && (
            <div className="space-y-2">
              {goals.map((goal, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => toggleGoal(index)} className="p-0 h-auto">
                    {goal.completed ? (
                      <CheckSquare className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                    ) : (
                      <Square className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                  </Button>
                  <span
                    className={cn("text-xs sm:text-sm flex-1", goal.completed && "line-through text-muted-foreground")}
                  >
                    {goal.text}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setGoals((prev) => prev.filter((_, i) => i !== index))}
                    className="p-0 h-auto"
                  >
                    <Trash2 className="h-2 w-2 sm:h-3 sm:w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Privacy & Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs sm:text-sm">Privacy Level</Label>
            <Select value={privacyLevel} onValueChange={setPrivacyLevel}>
              <SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                    Public
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
                    Private
                  </div>
                </SelectItem>
                <SelectItem value="encrypted">
                  <div className="flex items-center gap-2">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                    Encrypted
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-xs sm:text-sm">Require Authentication</Label>
              <p className="text-xs text-muted-foreground">Require PIN or biometric to view this entry</p>
            </div>
            <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
          </div>

          {isPrivate && (
            <div className="flex items-center gap-2 p-2 sm:p-3 bg-muted rounded-lg">
              <Lock className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse" />
              <span className="text-xs sm:text-sm">This entry will be secured</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div
      className={cn(
        "space-y-3 sm:space-y-4 md:space-y-6 transition-all duration-300 px-2 sm:px-4 md:px-6",
        editorMode === "fullscreen" && "fixed inset-0 z-50 bg-background p-2 sm:p-4 overflow-auto",
        editorMode === "zen" && "max-w-2xl mx-auto",
        editorMode === "focus" && "relative",
      )}
    >
      {/* Header */}
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Create New Entry</h1>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
            Express your thoughts and capture your journey
          </p>
        </div>

        {/* Editor Mode Controls */}
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <Button
            variant={editorMode === "focus" ? "default" : "outline"}
            size="sm"
            onClick={() => setEditorMode(editorMode === "focus" ? "normal" : "focus")}
            className="h-8 sm:h-9 text-xs sm:text-sm"
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden sm:inline">Focus</span>
          </Button>
          <Button
            variant={editorMode === "fullscreen" ? "default" : "outline"}
            size="sm"
            onClick={() => setEditorMode(editorMode === "fullscreen" ? "normal" : "fullscreen")}
            className="h-8 sm:h-9 text-xs sm:text-sm"
          >
            {editorMode === "fullscreen" ? (
              <Minimize className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <Maximize className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </Button>
          <Button
            variant={showPreview ? "default" : "outline"}
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="h-8 sm:h-9 text-xs sm:text-sm"
          >
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden sm:inline">Preview</span>
          </Button>

          {/* Mobile Sidebar Toggle */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden h-8 sm:h-9 text-xs sm:text-sm bg-transparent">
                <Menu className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">Options</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Entry Options</SheetTitle>
                <SheetDescription>Customize your journal entry</SheetDescription>
              </SheetHeader>
              <div className="mt-4">
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Writing Progress */}
      <Card>
        <CardContent className="pt-3 sm:pt-4 md:pt-6">
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs sm:text-sm">Writing Progress</Label>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {wordCount}/{writingGoal}
                </span>
              </div>
              <Progress value={completionPercentage} className="h-1.5 sm:h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1 sm:gap-2">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <Label className="text-xs sm:text-sm">Session</Label>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-sm sm:text-lg font-mono">{formatTime(sessionTime)}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                >
                  {isTimerRunning ? (
                    <Pause className="h-2 w-2 sm:h-3 sm:w-3" />
                  ) : (
                    <Play className="h-2 w-2 sm:h-3 sm:w-3" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1 sm:gap-2">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                <Label className="text-xs sm:text-sm">Streak</Label>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Flame className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                <span className="text-sm sm:text-lg font-semibold">{writingStreak}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Reading Time</Label>
              <div className="flex items-center gap-1 sm:gap-2">
                <Book className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-sm sm:text-lg">{readingTime} min</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template Selection */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg md:text-xl">Quick Start Templates</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Choose a template to get started faster</CardDescription>
            </div>
            <Select value={templateCategory} onValueChange={setTemplateCategory}>
              <SelectTrigger className="w-full sm:w-[120px] h-8 sm:h-9 text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="gratitude">Gratitude</SelectItem>
                <SelectItem value="goals">Goals</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md border-2",
                  selectedTemplate === template.id && "border-primary bg-primary/5",
                )}
                onClick={() => applyTemplate(template)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs sm:text-sm">{template.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleTemplateFavorite(template.id)
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <Heart
                        className={cn(
                          "h-2 w-2 sm:h-3 sm:w-3",
                          favoriteTemplates.includes(template.id) && "fill-current text-red-500",
                        )}
                      />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{template.preview}</p>
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:gap-4 md:gap-6 lg:grid-cols-3">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
          {/* Entry Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg md:text-xl">Entry Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs sm:text-sm">
                  Title (Optional)
                </Label>
                <Input
                  id="title"
                  placeholder="Give your entry a meaningful title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-sm sm:text-base h-8 sm:h-9 md:h-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Rich Text Editor */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center justify-between">
                <CardTitle className="text-base sm:text-lg md:text-xl">Write Your Entry</CardTitle>
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                  {/* Formatting Toolbar */}
                  <div className="flex items-center gap-0.5 sm:gap-1 border rounded-lg p-1">
                    <Button variant="ghost" size="sm" onClick={() => insertFormatting("bold")} className="h-6 w-6 p-0">
                      <Bold className="h-2 w-2 sm:h-3 sm:w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting("italic")}
                      className="h-6 w-6 p-0"
                    >
                      <Italic className="h-2 w-2 sm:h-3 sm:w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting("underline")}
                      className="h-6 w-6 p-0"
                    >
                      <Underline className="h-2 w-2 sm:h-3 sm:w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting("strikethrough")}
                      className="h-6 w-6 p-0"
                    >
                      <Strikethrough className="h-2 w-2 sm:h-3 sm:w-3" />
                    </Button>
                    <Separator orientation="vertical" className="h-3 sm:h-4" />
                    <Button variant="ghost" size="sm" onClick={() => insertFormatting("quote")} className="h-6 w-6 p-0">
                      <Quote className="h-2 w-2 sm:h-3 sm:w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => insertFormatting("code")} className="h-6 w-6 p-0">
                      <Code className="h-2 w-2 sm:h-3 sm:w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting("divider")}
                      className="h-6 w-6 p-0"
                    >
                      <Minus className="h-2 w-2 sm:h-3 sm:w-3" />
                    </Button>
                  </div>

                  {/* Text Formatting Options */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm bg-transparent"
                      >
                        <Type className="h-2 w-2 sm:h-4 sm:w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60 sm:w-80">
                      <div className="space-y-3 sm:space-y-4">
                        <div className="space-y-2">
                          <Label className="text-xs sm:text-sm">Font Size</Label>
                          <Slider value={textSize} onValueChange={setTextSize} min={12} max={24} step={1} />
                          <div className="text-center text-xs sm:text-sm text-muted-foreground">{textSize[0]}px</div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs sm:text-sm">Font Family</Label>
                          <Select value={fontFamily} onValueChange={setFontFamily}>
                            <SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="inter">Inter</SelectItem>
                              <SelectItem value="serif">Serif</SelectItem>
                              <SelectItem value="mono">Monospace</SelectItem>
                              <SelectItem value="cursive">Cursive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs sm:text-sm">Text Color</Label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={textColor}
                                onChange={(e) => setTextColor(e.target.value)}
                                className="w-6 h-6 sm:w-8 sm:h-8 rounded border"
                              />
                              <span className="text-xs sm:text-sm">{textColor}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs sm:text-sm">Highlight</Label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={highlightColor}
                                onChange={(e) => setHighlightColor(e.target.value)}
                                className="w-6 h-6 sm:w-8 sm:h-8 rounded border"
                              />
                              <span className="text-xs sm:text-sm">{highlightColor}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="write" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-8 sm:h-9">
                  <TabsTrigger value="write" className="text-xs sm:text-sm">
                    Write
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="text-xs sm:text-sm">
                    Preview
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="write" className="space-y-3 sm:space-y-4">
                  <Textarea
                    ref={textareaRef}
                    placeholder="Start writing your thoughts..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={cn(
                      "min-h-[200px] sm:min-h-[250px] md:min-h-[300px] resize-none leading-relaxed transition-all text-sm sm:text-base",
                      editorMode === "focus" && "min-h-[300px] sm:min-h-[400px]",
                      editorMode === "zen" && "border-none shadow-none focus:ring-0",
                    )}
                    style={{
                      fontSize: `${textSize[0]}px`,
                      fontFamily:
                        fontFamily === "serif"
                          ? "serif"
                          : fontFamily === "mono"
                            ? "monospace"
                            : fontFamily === "cursive"
                              ? "cursive"
                              : "inherit",
                      color: textColor,
                    }}
                  />

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                      <span>{charCount} characters</span>
                      <span>{wordCount} words</span>
                      <span>{readingTime} min read</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" />
                        <span>Auto-saved</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="space-y-3 sm:space-y-4">
                  <div className="min-h-[200px] sm:min-h-[250px] md:min-h-[300px] p-3 sm:p-4 border rounded-lg bg-muted/20">
                    <div className="prose prose-sm max-w-none">
                      {title && <h1 className="text-base sm:text-lg md:text-xl">{title}</h1>}
                      <div className="whitespace-pre-wrap text-xs sm:text-sm md:text-base">
                        {content || "Nothing to preview yet..."}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Media Attachments */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg md:text-xl">Media & Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="images" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-8 sm:h-9">
                  <TabsTrigger value="images" className="text-xs sm:text-sm">
                    Images
                  </TabsTrigger>
                  <TabsTrigger value="voice" className="text-xs sm:text-sm">
                    Voice
                  </TabsTrigger>
                  <TabsTrigger value="drawing" className="text-xs sm:text-sm">
                    Drawing
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="images" className="space-y-3 sm:space-y-4">
                  <div
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 sm:p-6 md:p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={(e) => {
                      e.preventDefault()
                      handleImageUpload(e.dataTransfer.files)
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <Upload className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Drag & drop images here, or click to select
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="hidden"
                    />
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(image) || "/placeholder.svg"}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-16 sm:h-20 md:h-24 object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 sm:h-6 sm:w-6 p-0"
                            onClick={() => setUploadedImages((prev) => prev.filter((_, i) => i !== index))}
                          >
                            <X className="h-2 w-2 sm:h-3 sm:w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="voice" className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-center p-4 sm:p-6 md:p-8 border rounded-lg">
                    <div className="text-center space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-center">
                        {isRecording ? (
                          <div className="relative">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                              <Mic className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                            </div>
                            <div className="absolute inset-0 border-4 border-red-500 rounded-full animate-ping" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center">
                            <Mic className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        {isRecording && (
                          <div className="text-lg sm:text-2xl font-mono text-red-500">{formatTime(recordingTime)}</div>
                        )}

                        <div className="flex items-center gap-2 justify-center">
                          <Button
                            variant={isRecording ? "destructive" : "default"}
                            onClick={() => setIsRecording(!isRecording)}
                            className="h-8 sm:h-9 text-xs sm:text-sm"
                          >
                            {isRecording ? (
                              <>
                                <StopCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                Stop
                              </>
                            ) : (
                              <>
                                <Mic className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                Record
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      {isRecording && (
                        <div className="flex justify-center">
                          <div className="flex items-center gap-0.5 sm:gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className="w-0.5 sm:w-1 bg-red-500 rounded-full animate-pulse"
                                style={{
                                  height: `${Math.random() * 15 + 8}px`,
                                  animationDelay: `${i * 0.1}s`,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="drawing" className="space-y-3 sm:space-y-4">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                      <Button
                        variant={drawingTool === "pen" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDrawingTool("pen")}
                        className="h-7 sm:h-8 text-xs sm:text-sm"
                      >
                        <Brush className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Pen
                      </Button>
                      <Button
                        variant={drawingTool === "eraser" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDrawingTool("eraser")}
                        className="h-7 sm:h-8 text-xs sm:text-sm"
                      >
                        <Eraser className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Eraser
                      </Button>

                      <div className="flex items-center gap-1 sm:gap-2">
                        <Label className="text-xs sm:text-sm">Size:</Label>
                        <Slider
                          value={[brushSize]}
                          onValueChange={(value) => setBrushSize(value[0])}
                          min={1}
                          max={20}
                          step={1}
                          className="w-12 sm:w-16 md:w-20"
                        />
                        <span className="text-xs sm:text-sm w-4 sm:w-6">{brushSize}</span>
                      </div>

                      <input
                        type="color"
                        value={drawingColor}
                        onChange={(e) => setDrawingColor(e.target.value)}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded border"
                      />

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearCanvas}
                        className="h-7 sm:h-8 text-xs sm:text-sm bg-transparent"
                      >
                        <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Clear
                      </Button>
                    </div>

                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={200}
                      className="border rounded-lg cursor-crosshair w-full max-w-full h-32 sm:h-40 md:h-48"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block space-y-4 md:space-y-6">
          <SidebarContent />
        </div>
      </div>

      {/* Sticky Save Button */}
      <div className="sticky bottom-2 sm:bottom-4 z-10">
        <Card className="shadow-lg">
          <CardContent className="pt-3 sm:pt-4 md:pt-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button className="flex-1 h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg gap-1 sm:gap-2">
                <Save className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                Save Entry
              </Button>

              <div className="flex gap-1 sm:gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 sm:gap-2 bg-transparent h-8 sm:h-10 text-xs sm:text-sm"
                    >
                      <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Preview</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xs sm:max-w-2xl md:max-w-4xl max-h-[80vh] overflow-auto">
                    <DialogHeader>
                      <DialogTitle className="text-base sm:text-lg">Entry Preview</DialogTitle>
                      <DialogDescription className="text-xs sm:text-sm">How your entry will look</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="prose prose-sm max-w-none">
                        {title && <h1 className="text-base sm:text-lg md:text-xl">{title}</h1>}
                        <div className="whitespace-pre-wrap text-xs sm:text-sm md:text-base">{content}</div>
                      </div>

                      {selectedMoods.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="font-medium text-sm sm:text-base">Moods</h3>
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {selectedMoods.map((moodValue) => {
                              const mood = advancedMoods.find((m) => m.value === moodValue)
                              return mood ? (
                                <Badge key={moodValue} variant="secondary" className="text-xs">
                                  {mood.emoji} {mood.label} ({moodIntensities[moodValue] || 5}/10)
                                </Badge>
                              ) : null
                            })}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-1 sm:gap-2 pt-3 sm:pt-4 flex-wrap">
                        <Button className="gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9">
                          <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                          Export PDF
                        </Button>
                        <Button
                          variant="outline"
                          className="gap-1 sm:gap-2 bg-transparent text-xs sm:text-sm h-8 sm:h-9"
                        >
                          <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          Share
                        </Button>
                        <Button
                          variant="outline"
                          className="gap-1 sm:gap-2 bg-transparent text-xs sm:text-sm h-8 sm:h-9"
                        >
                          <Printer className="h-3 w-3 sm:h-4 sm:w-4" />
                          Print
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 sm:gap-2 bg-transparent h-8 sm:h-10 text-xs sm:text-sm"
                >
                  <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
