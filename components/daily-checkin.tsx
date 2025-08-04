"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Star,
  Flame,
  Camera,
  Mic,
  MapPin,
  Cloud,
  Sun,
  CloudRain,
  Snowflake,
  Target,
  Users,
  Sparkles,
  Heart,
  Brain,
  Activity,
  Book,
  Dumbbell,
  Droplets,
  Zap,
  CheckCircle2,
  Square,
  TrendingUp,
  Pill,
  Utensils,
  Smartphone,
  GraduationCap,
  DollarSign,
  Phone,
  Thermometer,
  StickerIcon as Stomach,
  Bone,
  TreesIcon as Lungs,
  HeartHandshake,
  Shield,
  AlertTriangle,
  BarChart3,
  Download,
  Moon,
  Lightbulb,
  BookOpen,
  Trophy,
  TreePine,
  Music,
  Palette,
  RotateCcw,
  Battery,
  PenTool,
  CloudLightning,
  CloudDrizzle,
  Stethoscope,
} from "lucide-react"
import { cn } from "@/lib/utils"

const moodEmojis = [
  { emoji: "😢", label: "Very Sad", value: 1, color: "bg-red-100 border-red-300" },
  { emoji: "😔", label: "Sad", value: 2, color: "bg-orange-100 border-orange-300" },
  { emoji: "😐", label: "Neutral", value: 3, color: "bg-yellow-100 border-yellow-300" },
  { emoji: "😊", label: "Happy", value: 4, color: "bg-green-100 border-green-300" },
  { emoji: "😄", label: "Very Happy", value: 5, color: "bg-blue-100 border-blue-300" },
]

const secondaryMoodTags = [
  "Excited",
  "Grateful",
  "Anxious",
  "Peaceful",
  "Frustrated",
  "Confident",
  "Lonely",
  "Energetic",
  "Tired",
  "Hopeful",
  "Overwhelmed",
  "Content",
  "Motivated",
  "Discouraged",
  "Proud",
  "Ashamed",
  "Curious",
  "Bored",
  "Inspired",
  "Jealous",
  "Compassionate",
  "Angry",
  "Serene",
  "Restless",
]

const physicalSymptoms = [
  { key: "headache", label: "Headache", icon: Brain, severity: [0] },
  { key: "stomachache", label: "Stomach Issues", icon: Stomach, severity: [0] },
  { key: "fatigue", label: "Fatigue", icon: Battery, severity: [0] },
  { key: "muscle_tension", label: "Muscle Tension", icon: Bone, severity: [0] },
  { key: "breathing", label: "Breathing Issues", icon: Lungs, severity: [0] },
  { key: "heart_rate", label: "Heart Racing", icon: Heart, severity: [0] },
  { key: "dizziness", label: "Dizziness", icon: RotateCcw, severity: [0] },
  { key: "nausea", label: "Nausea", icon: Stomach, severity: [0] },
]

const weatherOptions = [
  { value: "sunny", label: "Sunny", icon: Sun },
  { value: "cloudy", label: "Cloudy", icon: Cloud },
  { value: "rainy", label: "Rainy", icon: CloudRain },
  { value: "snowy", label: "Snowy", icon: Snowflake },
  { value: "stormy", label: "Stormy", icon: CloudLightning },
  { value: "foggy", label: "Foggy", icon: CloudDrizzle },
]

const quickTemplates = [
  {
    name: "Great Day",
    mood: 5,
    energy: [8],
    sleep: 5,
    anxiety: [2],
    stress: [2],
    habits: { exercise: true, meditation: true, readBook: true, drankWater: true, socializedFriends: true },
    gratitude: ["Beautiful weather", "Good health", "Supportive friends"],
    goals: ["Complete assignments", "Go for a walk", "Call family"],
  },
  {
    name: "Tough Day",
    mood: 2,
    energy: [3],
    sleep: 2,
    anxiety: [7],
    stress: [8],
    habits: { exercise: false, meditation: false, readBook: false, drankWater: true, socializedFriends: false },
    gratitude: ["Having a roof over my head", "Access to help", "Tomorrow is a new day"],
    goals: ["Take it easy", "Practice self-care", "Reach out for support"],
  },
  {
    name: "Productive Day",
    mood: 4,
    energy: [7],
    sleep: 4,
    anxiety: [3],
    stress: [4],
    habits: { exercise: true, meditation: true, readBook: true, drankWater: true, socializedFriends: false },
    gratitude: ["Clear focus", "Good progress", "Sense of accomplishment"],
    goals: ["Finish project", "Organize workspace", "Plan tomorrow"],
  },
  {
    name: "Recovery Day",
    mood: 3,
    energy: [4],
    sleep: 3,
    anxiety: [5],
    stress: [5],
    habits: { exercise: false, meditation: true, readBook: false, drankWater: true, socializedFriends: true },
    gratitude: ["Time to rest", "Understanding friends", "Small improvements"],
    goals: ["Rest and recharge", "Gentle activities", "Be kind to myself"],
  },
]

const habitsList = [
  { key: "exercise", label: "Exercise", icon: Dumbbell, color: "text-red-500" },
  { key: "meditation", label: "Meditation", icon: Brain, color: "text-purple-500" },
  { key: "readBook", label: "Read Book", icon: Book, color: "text-blue-500" },
  { key: "drankWater", label: "Drink Water", icon: Droplets, color: "text-cyan-500" },
  { key: "socializedFriends", label: "Socialize", icon: Users, color: "text-green-500" },
  { key: "outdoorTime", label: "Outdoor Time", icon: TreePine, color: "text-emerald-500" },
  { key: "healthyMeals", label: "Healthy Meals", icon: Utensils, color: "text-orange-500" },
  { key: "limitedScreenTime", label: "Limited Screen Time", icon: Smartphone, color: "text-gray-500" },
  { key: "journaling", label: "Journaling", icon: PenTool, color: "text-indigo-500" },
  { key: "earlyBedtime", label: "Early Bedtime", icon: Moon, color: "text-slate-500" },
]

const medicationList = [
  { key: "antidepressant", label: "Antidepressant", dosage: "", time: "morning", taken: false },
  { key: "anxiety_med", label: "Anxiety Medication", dosage: "", time: "as_needed", taken: false },
  { key: "sleep_aid", label: "Sleep Aid", dosage: "", time: "evening", taken: false },
  { key: "vitamin_d", label: "Vitamin D", dosage: "", time: "morning", taken: false },
  { key: "multivitamin", label: "Multivitamin", dosage: "", time: "morning", taken: false },
  { key: "other", label: "Other", dosage: "", time: "custom", taken: false },
]

const socialInteractions = [
  { key: "family", label: "Family", quality: [3], duration: 0 },
  { key: "friends", label: "Friends", quality: [3], duration: 0 },
  { key: "romantic_partner", label: "Romantic Partner", quality: [3], duration: 0 },
  { key: "colleagues", label: "Colleagues/Classmates", quality: [3], duration: 0 },
  { key: "strangers", label: "Strangers/Public", quality: [3], duration: 0 },
  { key: "online", label: "Online Communities", quality: [3], duration: 0 },
]

const copingStrategies = [
  { key: "deep_breathing", label: "Deep Breathing", icon: Lungs, used: false, effectiveness: [0] },
  {
    key: "progressive_relaxation",
    label: "Progressive Muscle Relaxation",
    icon: Bone,
    used: false,
    effectiveness: [0],
  },
  { key: "mindfulness", label: "Mindfulness", icon: Brain, used: false, effectiveness: [0] },
  { key: "physical_exercise", label: "Physical Exercise", icon: Dumbbell, used: false, effectiveness: [0] },
  { key: "creative_expression", label: "Creative Expression", icon: Palette, used: false, effectiveness: [0] },
  { key: "social_support", label: "Talking to Someone", icon: Users, used: false, effectiveness: [0] },
  { key: "nature", label: "Time in Nature", icon: TreePine, used: false, effectiveness: [0] },
  { key: "music", label: "Listening to Music", icon: Music, used: false, effectiveness: [0] },
]

const triggers = [
  { key: "academic_pressure", label: "Academic Pressure", severity: [0] },
  { key: "social_situations", label: "Social Situations", severity: [0] },
  { key: "financial_stress", label: "Financial Stress", severity: [0] },
  { key: "family_issues", label: "Family Issues", severity: [0] },
  { key: "relationship_problems", label: "Relationship Problems", severity: [0] },
  { key: "health_concerns", label: "Health Concerns", severity: [0] },
  { key: "work_stress", label: "Work Stress", severity: [0] },
  { key: "news_media", label: "News/Media", severity: [0] },
  { key: "weather_changes", label: "Weather Changes", severity: [0] },
  { key: "sleep_disruption", label: "Sleep Disruption", severity: [0] },
]

export function EnhancedDailyCheckin() {
  const [currentTab, setCurrentTab] = useState("mood")
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [moodIntensity, setMoodIntensity] = useState([3])
  const [secondaryMoods, setSecondaryMoods] = useState<string[]>([])
  const [energyLevel, setEnergyLevel] = useState([5])
  const [anxietyLevel, setAnxietyLevel] = useState([3])
  const [stressLevel, setStressLevel] = useState([3])
  const [sleepQuality, setSleepQuality] = useState(0)
  const [sleepHours, setSleepHours] = useState(8)
  const [notes, setNotes] = useState("")
  const [gratitudeItems, setGratitudeItems] = useState(["", "", ""])
  const [dailyGoals, setDailyGoals] = useState(["", "", ""])
  const [goalCompletion, setGoalCompletion] = useState([false, false, false])
  const [habits, setHabits] = useState({
    exercise: false,
    meditation: false,
    readBook: false,
    drankWater: false,
    socializedFriends: false,
    outdoorTime: false,
    healthyMeals: false,
    limitedScreenTime: false,
    journaling: false,
    earlyBedtime: false,
  })
  const [symptoms, setSymptoms] = useState(
    physicalSymptoms.reduce(
      (acc, symptom) => ({
        ...acc,
        [symptom.key]: { severity: [0], notes: "" },
      }),
      {},
    ),
  )
  const [medications, setMedications] = useState(medicationList)
  const [socialData, setSocialData] = useState(socialInteractions)
  const [copingData, setCopingData] = useState(copingStrategies)
  const [triggerData, setTriggerData] = useState(triggers)
  const [weather, setWeather] = useState("")
  const [currentLocation, setCurrentLocation] = useState("")
  const [dailyPhoto, setDailyPhoto] = useState<File | null>(null)
  const [voiceNote, setVoiceNote] = useState<Blob | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [sharePublic, setSharePublic] = useState(false)
  const [notifyPartner, setNotifyPartner] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showInsights, setShowInsights] = useState(false)
  const [therapySession, setTherapySession] = useState({
    had_session: false,
    session_type: "",
    effectiveness: [0],
    notes: "",
  })
  const [academicStress, setAcademicStress] = useState({
    workload: [3],
    upcoming_deadlines: 0,
    exam_anxiety: [3],
    performance_pressure: [3],
  })
  const [financialStress, setFinancialStress] = useState({
    money_worries: [3],
    budgeting_concerns: false,
    employment_stress: [3],
  })
  const [relationshipQuality, setRelationshipQuality] = useState({
    family_satisfaction: [3],
    friend_satisfaction: [3],
    romantic_satisfaction: [3],
    social_isolation: [3],
  })

  useEffect(() => {
    setCurrentTime(new Date())
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation(`${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`)
      })
    }
  }, [])

  const isEvening = currentTime.getHours() >= 18
  const isMorning = currentTime.getHours() < 12
  const currentStreak = 7

  const getCompletionPercentage = () => {
    let completed = 0
    const total = 15 // Increased total trackable items

    if (selectedMood !== null) completed++
    if (energyLevel[0] !== 5) completed++
    if (sleepQuality > 0) completed++
    if (notes.trim()) completed++
    if (gratitudeItems.some((item) => item.trim())) completed++
    if (dailyGoals.some((goal) => goal.trim())) completed++
    if (Object.values(habits).some(Boolean)) completed++
    if (weather) completed++
    if (anxietyLevel[0] !== 3) completed++
    if (stressLevel[0] !== 3) completed++
    if (Object.values(symptoms).some((s: any) => s.severity[0] > 0)) completed++
    if (medications.some((med) => med.taken)) completed++
    if (socialData.some((social) => social.duration > 0)) completed++
    if (copingData.some((coping) => coping.used)) completed++
    if (triggerData.some((trigger) => trigger.severity[0] > 0)) completed++

    return Math.round((completed / total) * 100)
  }

  const handleSecondaryMoodToggle = (mood: string) => {
    setSecondaryMoods((prev) => (prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]))
  }

  const handleHabitToggle = (habitKey: string) => {
    setHabits((prev) => ({
      ...prev,
      [habitKey]: !prev[habitKey as keyof typeof prev],
    }))
  }

  const handleGratitudeChange = (index: number, value: string) => {
    setGratitudeItems((prev) => {
      const newItems = [...prev]
      newItems[index] = value
      return newItems
    })
  }

  const handleGoalChange = (index: number, value: string) => {
    setDailyGoals((prev) => {
      const newItems = [...prev]
      newItems[index] = value
      return newItems
    })
  }

  const handleGoalCompletion = (index: number) => {
    setGoalCompletion((prev) => {
      const newCompletion = [...prev]
      newCompletion[index] = !newCompletion[index]
      return newCompletion
    })
  }

  const applyTemplate = (template: (typeof quickTemplates)[0]) => {
    setSelectedMood(template.mood)
    setEnergyLevel(template.energy)
    setSleepQuality(template.sleep)
    setAnxietyLevel(template.anxiety)
    setStressLevel(template.stress)
    setHabits(template.habits)
    setMoodIntensity([template.mood])
    setGratitudeItems(template.gratitude)
    setDailyGoals(template.goals)
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setDailyPhoto(file)
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Voice recording logic would go here
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setSubmitted(true)
    setIsSubmitting(false)
    setTimeout(() => {
      setSubmitted(false)
    }, 3000)
  }

  const completionPercentage = getCompletionPercentage()

  const generateInsights = () => {
    const insights = []

    if (selectedMood && selectedMood <= 2 && stressLevel[0] >= 7) {
      insights.push({
        type: "warning",
        title: "High Stress & Low Mood Detected",
        message: "Consider using coping strategies or reaching out for support.",
        icon: AlertTriangle,
      })
    }

    if (sleepQuality <= 2 && energyLevel[0] <= 3) {
      insights.push({
        type: "info",
        title: "Sleep & Energy Connection",
        message: "Poor sleep quality may be affecting your energy levels.",
        icon: Moon,
      })
    }

    if (Object.values(habits).filter(Boolean).length >= 7) {
      insights.push({
        type: "success",
        title: "Great Habit Consistency!",
        message: "You're maintaining excellent daily habits.",
        icon: Trophy,
      })
    }

    return insights
  }

  return (
    <div className="space-y-4 md:space-y-6 mx-4 md:mx-6 lg:mx-14 xl:mx-22 2xl:mx-24 mt-1">
      {/* Header with Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {isMorning ? "Good Morning!" : isEvening ? "Evening Reflection" : "Daily Check-in"}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {isMorning
              ? "How do you feel starting today?"
              : isEvening
                ? "How was your day?"
                : "How are you feeling right now?"}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
            <Badge variant="secondary" className="text-sm md:text-lg px-2 md:px-3 py-1">
              {currentStreak} day streak
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInsights(!showInsights)}
            className="text-xs md:text-sm"
          >
            <Lightbulb className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            Insights
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completion Progress</span>
              <span>{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      {showInsights && (
        <div className="space-y-3">
          {generateInsights().map((insight, index) => (
            <Alert
              key={index}
              className={cn(
                "border-l-4",
                insight.type === "warning" && "border-l-red-500 bg-red-50",
                insight.type === "info" && "border-l-blue-500 bg-blue-50",
                insight.type === "success" && "border-l-green-500 bg-green-50",
              )}
            >
              <insight.icon className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium">{insight.title}</div>
                <div className="text-sm text-muted-foreground">{insight.message}</div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Quick Templates */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg md:text-xl">Quick Templates</CardTitle>
          <CardDescription className="text-sm">Start with a pre-filled template</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {quickTemplates.map((template) => (
              <Button
                key={template.name}
                variant="outline"
                size="sm"
                onClick={() => applyTemplate(template)}
                className="text-xs md:text-sm"
              >
                <Sparkles className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                {template.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="mood" className="text-xs md:text-sm">
            <Heart className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            Mood
          </TabsTrigger>
          <TabsTrigger value="physical" className="text-xs md:text-sm">
            <Activity className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            Physical
          </TabsTrigger>
          <TabsTrigger value="habits" className="text-xs md:text-sm">
            <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            Habits
          </TabsTrigger>
          <TabsTrigger value="social" className="text-xs md:text-sm">
            <Users className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            Social
          </TabsTrigger>
          <TabsTrigger value="academic" className="text-xs md:text-sm">
            <GraduationCap className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            Academic
          </TabsTrigger>
          <TabsTrigger value="reflection" className="text-xs md:text-sm">
            <BookOpen className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            Reflection
          </TabsTrigger>
        </TabsList>

        {/* Mood Tab */}
        <TabsContent value="mood" className="space-y-4 md:space-y-6">
          <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
            {/* Primary Mood Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Primary Mood</CardTitle>
                <CardDescription className="text-sm">How are you feeling overall?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-5 gap-1 md:gap-2">
                  {moodEmojis.map((mood) => (
                    <Button
                      key={mood.value}
                      variant={selectedMood === mood.value ? "default" : "outline"}
                      size="lg"
                      className={cn(
                        "h-12 md:h-16 text-lg md:text-2xl transition-all hover:scale-110",
                        selectedMood === mood.value && `ring-2 ring-primary ${mood.color}`,
                      )}
                      onClick={() => setSelectedMood(mood.value)}
                    >
                      {mood.emoji}
                    </Button>
                  ))}
                </div>
                {selectedMood && (
                  <div className="space-y-3">
                    <p className="text-center text-sm text-muted-foreground">
                      {moodEmojis.find((m) => m.value === selectedMood)?.label}
                    </p>
                    <div className="space-y-2">
                      <Label className="text-sm">Mood Intensity</Label>
                      <Slider
                        value={moodIntensity}
                        onValueChange={setMoodIntensity}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Mild</span>
                        <span className="font-medium">{moodIntensity[0]}/10</span>
                        <span>Intense</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Secondary Moods */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Secondary Emotions</CardTitle>
                <CardDescription className="text-sm">Select all that apply</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 md:gap-2">
                  {secondaryMoodTags.map((mood) => (
                    <Badge
                      key={mood}
                      variant={secondaryMoods.includes(mood) ? "default" : "outline"}
                      className="cursor-pointer transition-all hover:scale-105 text-xs md:text-sm"
                      onClick={() => handleSecondaryMoodToggle(mood)}
                    >
                      {mood}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Energy, Anxiety, Stress Levels */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                  <Activity className="h-4 w-4 md:h-5 md:w-5" />
                  Energy Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Slider
                    value={energyLevel}
                    onValueChange={setEnergyLevel}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs md:text-sm text-muted-foreground">
                    <span>Drained</span>
                    <span className="font-medium text-base md:text-lg">{energyLevel[0]}/10</span>
                    <span>Energized</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                  <Zap className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
                  Anxiety Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Slider
                    value={anxietyLevel}
                    onValueChange={setAnxietyLevel}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs md:text-sm text-muted-foreground">
                    <span>Calm</span>
                    <span className="font-medium text-base md:text-lg">{anxietyLevel[0]}/10</span>
                    <span>Anxious</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                  <Brain className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
                  Stress Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Slider
                    value={stressLevel}
                    onValueChange={setStressLevel}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs md:text-sm text-muted-foreground">
                    <span>Relaxed</span>
                    <span className="font-medium text-base md:text-lg">{stressLevel[0]}/10</span>
                    <span>Stressed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sleep Quality */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Sleep Quality</CardTitle>
                <CardDescription className="text-sm">How well did you sleep last night?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-1 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto"
                      onClick={() => setSleepQuality(star)}
                    >
                      <Star
                        className={cn(
                          "h-6 w-6 md:h-8 md:w-8 transition-all hover:scale-110",
                          star <= sleepQuality ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
                        )}
                      />
                    </Button>
                  ))}
                </div>
                {sleepQuality > 0 && (
                  <p className="text-center text-sm text-muted-foreground mt-2">{sleepQuality} out of 5 stars</p>
                )}
                <div className="space-y-2">
                  <Label className="text-sm">Hours of Sleep</Label>
                  <Slider
                    value={[sleepHours]}
                    onValueChange={(value) => setSleepHours(value[0])}
                    max={12}
                    min={3}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>3h</span>
                    <span className="font-medium">{sleepHours}h</span>
                    <span>12h</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Physical Tab */}
        <TabsContent value="physical" className="space-y-4 md:space-y-6">
          <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
            {/* Physical Symptoms */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                  <Thermometer className="h-4 w-4 md:h-5 md:w-5" />
                  Physical Symptoms
                </CardTitle>
                <CardDescription className="text-sm">Rate any physical symptoms you're experiencing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {physicalSymptoms.map((symptom) => (
                    <div key={symptom.key} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <symptom.icon className="h-4 w-4 text-muted-foreground" />
                        <Label className="text-sm">{symptom.label}</Label>
                      </div>
                      <Slider
                        value={symptoms[symptom.key]?.severity || [0]}
                        onValueChange={(value) =>
                          setSymptoms((prev) => ({
                            ...prev,
                            [symptom.key]: { ...prev[symptom.key], severity: value },
                          }))
                        }
                        max={10}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>None</span>
                        <span>{symptoms[symptom.key]?.severity?.[0] || 0}/10</span>
                        <span>Severe</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Medication Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                  <Pill className="h-4 w-4 md:h-5 md:w-5" />
                  Medication Tracking
                </CardTitle>
                <CardDescription className="text-sm">Track your daily medications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {medications.map((med, index) => (
                    <div key={med.key} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={med.key}
                          checked={med.taken}
                          onCheckedChange={(checked) => {
                            const newMeds = [...medications]
                            newMeds[index].taken = checked as boolean
                            setMedications(newMeds)
                          }}
                        />
                        <Label htmlFor={med.key} className="text-sm">
                          {med.label}
                        </Label>
                      </div>
                      <Badge variant={med.taken ? "default" : "outline"} className="text-xs">
                        {med.time}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Coping Strategies */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                  <Shield className="h-4 w-4 md:h-5 md:w-5" />
                  Coping Strategies Used
                </CardTitle>
                <CardDescription className="text-sm">What strategies did you use today?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {copingData.map((strategy, index) => (
                    <div key={strategy.key} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={strategy.key}
                          checked={strategy.used}
                          onCheckedChange={(checked) => {
                            const newStrategies = [...copingData]
                            newStrategies[index].used = checked as boolean
                            setCopingData(newStrategies)
                          }}
                        />
                        <Label htmlFor={strategy.key} className="text-sm flex items-center gap-1">
                          <strategy.icon className="h-3 w-3" />
                          {strategy.label}
                        </Label>
                      </div>
                      {strategy.used && (
                        <div className="ml-6 space-y-1">
                          <Label className="text-xs text-muted-foreground">Effectiveness</Label>
                          <Slider
                            value={strategy.effectiveness}
                            onValueChange={(value) => {
                              const newStrategies = [...copingData]
                              newStrategies[index].effectiveness = value
                              setCopingData(newStrategies)
                            }}
                            max={10}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Not helpful</span>
                            <span>{strategy.effectiveness[0]}/10</span>
                            <span>Very helpful</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Habits Tab */}
        <TabsContent value="habits" className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Daily Habits</CardTitle>
              <CardDescription className="text-sm">Track your healthy habits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                {habitsList.map((habit) => (
                  <div key={habit.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={habit.key}
                      checked={habits[habit.key as keyof typeof habits]}
                      onCheckedChange={() => handleHabitToggle(habit.key)}
                    />
                    <Label htmlFor={habit.key} className="text-xs md:text-sm flex items-center gap-1 cursor-pointer">
                      <habit.icon className={cn("h-3 w-3 md:h-4 md:w-4", habit.color)} />
                      {habit.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Triggers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
                Stress Triggers
              </CardTitle>
              <CardDescription className="text-sm">Rate any triggers you encountered today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {triggerData.map((trigger, index) => (
                  <div key={trigger.key} className="space-y-2">
                    <Label className="text-sm">{trigger.label}</Label>
                    <Slider
                      value={trigger.severity}
                      onValueChange={(value) => {
                        const newTriggers = [...triggerData]
                        newTriggers[index].severity = value
                        setTriggerData(newTriggers)
                      }}
                      max={10}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Not present</span>
                      <span>{trigger.severity[0]}/10</span>
                      <span>Very intense</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Tab */}
        <TabsContent value="social" className="space-y-4 md:space-y-6">
          <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
            {/* Social Interactions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                  <Users className="h-4 w-4 md:h-5 md:w-5" />
                  Social Interactions
                </CardTitle>
                <CardDescription className="text-sm">
                  Rate the quality and duration of your social interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {socialData.map((social, index) => (
                    <div key={social.key} className="space-y-3 p-3 border rounded">
                      <Label className="text-sm font-medium">{social.label}</Label>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Quality (1-5)</Label>
                        <Slider
                          value={social.quality}
                          onValueChange={(value) => {
                            const newSocial = [...socialData]
                            newSocial[index].quality = value
                            setSocialData(newSocial)
                          }}
                          max={5}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Poor</span>
                          <span>{social.quality[0]}/5</span>
                          <span>Excellent</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Duration (hours)</Label>
                        <Slider
                          value={[social.duration]}
                          onValueChange={(value) => {
                            const newSocial = [...socialData]
                            newSocial[index].duration = value[0]
                            setSocialData(newSocial)
                          }}
                          max={8}
                          min={0}
                          step={0.5}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0h</span>
                          <span>{social.duration}h</span>
                          <span>8h+</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Relationship Quality */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                  <HeartHandshake className="h-4 w-4 md:h-5 md:w-5" />
                  Relationship Satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Family Relationships</Label>
                    <Slider
                      value={relationshipQuality.family_satisfaction}
                      onValueChange={(value) =>
                        setRelationshipQuality((prev) => ({
                          ...prev,
                          family_satisfaction: value,
                        }))
                      }
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Strained</span>
                      <span>{relationshipQuality.family_satisfaction[0]}/10</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Friendships</Label>
                    <Slider
                      value={relationshipQuality.friend_satisfaction}
                      onValueChange={(value) =>
                        setRelationshipQuality((prev) => ({
                          ...prev,
                          friend_satisfaction: value,
                        }))
                      }
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Strained</span>
                      <span>{relationshipQuality.friend_satisfaction[0]}/10</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Social Isolation Level</Label>
                    <Slider
                      value={relationshipQuality.social_isolation}
                      onValueChange={(value) =>
                        setRelationshipQuality((prev) => ({
                          ...prev,
                          social_isolation: value,
                        }))
                      }
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Very connected</span>
                      <span>{relationshipQuality.social_isolation[0]}/10</span>
                      <span>Very isolated</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Therapy Session */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 md:h-5 md:w-5" />
                  Therapy/Counseling
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="therapy_session"
                    checked={therapySession.had_session}
                    onCheckedChange={(checked) =>
                      setTherapySession((prev) => ({
                        ...prev,
                        had_session: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="therapy_session" className="text-sm">
                    Had a therapy/counseling session today
                  </Label>
                </div>
                {therapySession.had_session && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-sm">Session Type</Label>
                      <Select
                        value={therapySession.session_type}
                        onValueChange={(value) =>
                          setTherapySession((prev) => ({
                            ...prev,
                            session_type: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select session type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual Therapy</SelectItem>
                          <SelectItem value="group">Group Therapy</SelectItem>
                          <SelectItem value="counseling">Academic Counseling</SelectItem>
                          <SelectItem value="peer_support">Peer Support</SelectItem>
                          <SelectItem value="crisis">Crisis Counseling</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Session Effectiveness</Label>
                      <Slider
                        value={therapySession.effectiveness}
                        onValueChange={(value) =>
                          setTherapySession((prev) => ({
                            ...prev,
                            effectiveness: value,
                          }))
                        }
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Not helpful</span>
                        <span>{therapySession.effectiveness[0]}/10</span>
                        <span>Very helpful</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Session Notes</Label>
                      <Textarea
                        placeholder="Key insights or takeaways from your session..."
                        value={therapySession.notes}
                        onChange={(e) =>
                          setTherapySession((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        className="min-h-[60px] text-sm"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Academic Tab */}
        <TabsContent value="academic" className="space-y-4 md:space-y-6">
          <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
            {/* Academic Stress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 md:h-5 md:w-5" />
                  Academic Stress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Current Workload Stress</Label>
                  <Slider
                    value={academicStress.workload}
                    onValueChange={(value) =>
                      setAcademicStress((prev) => ({
                        ...prev,
                        workload: value,
                      }))
                    }
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Manageable</span>
                    <span>{academicStress.workload[0]}/10</span>
                    <span>Overwhelming</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Exam/Test Anxiety</Label>
                  <Slider
                    value={academicStress.exam_anxiety}
                    onValueChange={(value) =>
                      setAcademicStress((prev) => ({
                        ...prev,
                        exam_anxiety: value,
                      }))
                    }
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Calm</span>
                    <span>{academicStress.exam_anxiety[0]}/10</span>
                    <span>Very anxious</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Performance Pressure</Label>
                  <Slider
                    value={academicStress.performance_pressure}
                    onValueChange={(value) =>
                      setAcademicStress((prev) => ({
                        ...prev,
                        performance_pressure: value,
                      }))
                    }
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low pressure</span>
                    <span>{academicStress.performance_pressure[0]}/10</span>
                    <span>High pressure</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Upcoming Deadlines</Label>
                  <Slider
                    value={[academicStress.upcoming_deadlines]}
                    onValueChange={(value) =>
                      setAcademicStress((prev) => ({
                        ...prev,
                        upcoming_deadlines: value[0],
                      }))
                    }
                    max={10}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>None</span>
                    <span>{academicStress.upcoming_deadlines}</span>
                    <span>10+ deadlines</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Stress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                  <DollarSign className="h-4 w-4 md:h-5 md:w-5" />
                  Financial Stress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Money Worries</Label>
                  <Slider
                    value={financialStress.money_worries}
                    onValueChange={(value) =>
                      setFinancialStress((prev) => ({
                        ...prev,
                        money_worries: value,
                      }))
                    }
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>No worries</span>
                    <span>{financialStress.money_worries[0]}/10</span>
                    <span>Very worried</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Employment Stress</Label>
                  <Slider
                    value={financialStress.employment_stress}
                    onValueChange={(value) =>
                      setFinancialStress((prev) => ({
                        ...prev,
                        employment_stress: value,
                      }))
                    }
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Secure</span>
                    <span>{financialStress.employment_stress[0]}/10</span>
                    <span>Very stressed</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="budgeting_concerns"
                    checked={financialStress.budgeting_concerns}
                    onCheckedChange={(checked) =>
                      setFinancialStress((prev) => ({
                        ...prev,
                        budgeting_concerns: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="budgeting_concerns" className="text-sm">
                    Struggling with budgeting
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reflection Tab */}
        <TabsContent value="reflection" className="space-y-4 md:space-y-6">
          <div className="grid gap-4 md:gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {/* Gratitude Section */}
            <Card className="lg:col-span-2 xl:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                  <Heart className="h-4 w-4 md:h-5 md:w-5 text-pink-500" />
                  Gratitude
                </CardTitle>
                <CardDescription className="text-sm">What are three things you're grateful for today?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-3">
                  {gratitudeItems.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <Label className="text-xs md:text-sm">Grateful for #{index + 1}</Label>
                      <Input
                        placeholder={`Something you're grateful for...`}
                        value={item}
                        onChange={(e) => handleGratitudeChange(index, e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Daily Goals */}
            <Card className="lg:col-span-2 xl:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                  <Target className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                  Daily Goals
                </CardTitle>
                <CardDescription className="text-sm">Set up to 3 goals for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-3">
                  {dailyGoals.map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-xs md:text-sm">Goal #{index + 1}</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder={`Goal ${index + 1}...`}
                          value={goal}
                          onChange={(e) => handleGoalChange(index, e.target.value)}
                          className="text-sm"
                        />
                        <Button
                          variant={goalCompletion[index] ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleGoalCompletion(index)}
                          disabled={!goal.trim()}
                          className="shrink-0"
                        >
                          <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weather & Location */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                  <Cloud className="h-4 w-4 md:h-5 md:w-5" />
                  Context
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Weather</Label>
                  <Select value={weather} onValueChange={setWeather}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select weather" />
                    </SelectTrigger>
                    <SelectContent>
                      {weatherOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <option.icon className="h-4 w-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {currentLocation && (
                  <div className="space-y-1">
                    <Label className="text-sm flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Location
                    </Label>
                    <p className="text-xs text-muted-foreground">{currentLocation}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Media Attachments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Media</CardTitle>
                <CardDescription className="text-sm">Add photo or voice note</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="photo-upload" className="text-sm">
                    Daily Photo
                  </Label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <Camera className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                        {dailyPhoto ? "Change Photo" : "Add Photo"}
                      </label>
                    </Button>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                  {dailyPhoto && <p className="text-xs text-muted-foreground">Photo: {dailyPhoto.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Voice Note</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleRecording}
                    className={cn("w-full", isRecording && "bg-red-50 text-red-600 border-red-200")}
                  >
                    {isRecording ? (
                      <>
                        <Square className="h-3 w-3 md:h-4 md:w-4 mr-1 animate-pulse" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                        Record Voice Note
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="lg:col-span-2 xl:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Additional Notes</CardTitle>
                <CardDescription className="text-sm">
                  {isMorning
                    ? "Any thoughts or intentions for today?"
                    : isEvening
                      ? "Reflect on your day..."
                      : "Anything else you'd like to record?"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={
                    isMorning
                      ? "What are you looking forward to today?"
                      : isEvening
                        ? "How was your day? Any highlights or challenges?"
                        : "Any thoughts or reflections..."
                  }
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[80px] md:min-h-[100px] resize-none text-sm"
                  maxLength={1000}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">{notes.length}/1000 characters</span>
                </div>
              </CardContent>
            </Card>

            {/* Social Features */}
            <Card className="lg:col-span-2 xl:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Sharing Options</CardTitle>
                <CardDescription className="text-sm">Choose how to share your check-in</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Share anonymously with community</Label>
                    <p className="text-xs text-muted-foreground">Help others by sharing your mood data anonymously</p>
                  </div>
                  <Switch checked={sharePublic} onCheckedChange={setSharePublic} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Notify accountability partner</Label>
                    <p className="text-xs text-muted-foreground">Send check-in summary to your support person</p>
                  </div>
                  <Switch checked={notifyPartner} onCheckedChange={setNotifyPartner} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Export data for healthcare provider</Label>
                    <p className="text-xs text-muted-foreground">Generate a report for your therapist or doctor</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Advanced Analytics Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl flex items-center gap-2">
            <BarChart3 className="h-4 w-4 md:h-5 md:w-5" />
            Quick Analytics
          </CardTitle>
          <CardDescription className="text-sm">Your mental health trends at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">7</div>
              <div className="text-xs text-blue-600">Day Streak</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">4.2</div>
              <div className="text-xs text-green-600">Avg Mood</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">85%</div>
              <div className="text-xs text-purple-600">Habit Success</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">6.8h</div>
              <div className="text-xs text-orange-600">Avg Sleep</div>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" size="sm">
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              View Detailed Analytics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Resources */}
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <div className="space-y-2">
            <div className="font-semibold">Need immediate help?</div>
            <div className="text-sm space-y-1">
              <div>🚨 Emergency: Call 911</div>
              <div>💬 Crisis Text Line: Text HOME to 741741</div>
              <div>📞 Suicide & Crisis Lifeline: 988</div>
              <div>🏥 Campus Counseling: (555) 123-4567</div>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Submit Button */}
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <Button
            onClick={handleSubmit}
            disabled={!selectedMood || isSubmitting || submitted}
            className={cn(
              "w-full h-12 md:h-14 text-base md:text-lg transition-all",
              submitted && "bg-green-500 hover:bg-green-500",
            )}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white mr-2" />
                Saving Enhanced Check-in...
              </>
            ) : submitted ? (
              <>
                <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 mr-2" />✓ Enhanced Check-in Saved Successfully!
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                Complete Enhanced Daily Check-in
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Breathing Exercise Quick Access */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl flex items-center gap-2">
            <Lungs className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
            Quick Wellness Tools
          </CardTitle>
          <CardDescription className="text-sm">Immediate support tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button variant="outline" size="sm" className="h-auto p-3 flex-col gap-1 bg-transparent">
              <Lungs className="h-4 w-4" />
              <span className="text-xs">Breathing</span>
            </Button>
            <Button variant="outline" size="sm" className="h-auto p-3 flex-col gap-1 bg-transparent">
              <Brain className="h-4 w-4" />
              <span className="text-xs">Meditation</span>
            </Button>
            <Button variant="outline" size="sm" className="h-auto p-3 flex-col gap-1 bg-transparent">
              <Music className="h-4 w-4" />
              <span className="text-xs">Calm Music</span>
            </Button>
            <Button variant="outline" size="sm" className="h-auto p-3 flex-col gap-1 bg-transparent">
              <Phone className="h-4 w-4" />
              <span className="text-xs">Crisis Line</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
