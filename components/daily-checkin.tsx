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
]

const weatherOptions = [
  { value: "sunny", label: "Sunny", icon: Sun },
  { value: "cloudy", label: "Cloudy", icon: Cloud },
  { value: "rainy", label: "Rainy", icon: CloudRain },
  { value: "snowy", label: "Snowy", icon: Snowflake },
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
  },
  {
    name: "Tough Day",
    mood: 2,
    energy: [3],
    sleep: 2,
    anxiety: [7],
    stress: [8],
    habits: { exercise: false, meditation: false, readBook: false, drankWater: true, socializedFriends: false },
  },
  {
    name: "Productive Day",
    mood: 4,
    energy: [7],
    sleep: 4,
    anxiety: [3],
    stress: [4],
    habits: { exercise: true, meditation: true, readBook: true, drankWater: true, socializedFriends: false },
  },
]

const habitsList = [
  { key: "exercise", label: "Exercise", icon: Dumbbell, color: "text-red-500" },
  { key: "meditation", label: "Meditation", icon: Brain, color: "text-purple-500" },
  { key: "readBook", label: "Read Book", icon: Book, color: "text-blue-500" },
  { key: "drankWater", label: "Drink Water", icon: Droplets, color: "text-cyan-500" },
  { key: "socializedFriends", label: "Socialize", icon: Users, color: "text-green-500" },
]

export function DailyCheckin() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [moodIntensity, setMoodIntensity] = useState([3])
  const [secondaryMoods, setSecondaryMoods] = useState<string[]>([])
  const [energyLevel, setEnergyLevel] = useState([5])
  const [anxietyLevel, setAnxietyLevel] = useState([3])
  const [stressLevel, setStressLevel] = useState([3])
  const [sleepQuality, setSleepQuality] = useState(0)
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
  })
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
    const total = 10 // Total trackable items

    if (selectedMood !== null) completed++
    if (energyLevel[0] !== 5) completed++ // Changed from default
    if (sleepQuality > 0) completed++
    if (notes.trim()) completed++
    if (gratitudeItems.some((item) => item.trim())) completed++
    if (dailyGoals.some((goal) => goal.trim())) completed++
    if (Object.values(habits).some(Boolean)) completed++
    if (weather) completed++
    if (anxietyLevel[0] !== 3) completed++
    if (stressLevel[0] !== 3) completed++

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
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSubmitted(true)
    setIsSubmitting(false)

    setTimeout(() => {
      setSubmitted(false)
      // Reset form
      setSelectedMood(null)
      setMoodIntensity([3])
      setSecondaryMoods([])
      setEnergyLevel([5])
      setAnxietyLevel([3])
      setStressLevel([3])
      setSleepQuality(0)
      setNotes("")
      setGratitudeItems(["", "", ""])
      setDailyGoals(["", "", ""])
      setGoalCompletion([false, false, false])
      setHabits({
        exercise: false,
        meditation: false,
        readBook: false,
        drankWater: false,
        socializedFriends: false,
      })
      setWeather("")
      setDailyPhoto(null)
      setVoiceNote(null)
    }, 2000)
  }

  const completionPercentage = getCompletionPercentage()

  return (
    <div className="space-y-4 md:space-y-6 mx-10 md:mx-16 lg:mx-20 xl:mx-32 2xl:mx-30 mt-1 ">
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

      {/* Main Content Grid */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Primary Mood Selection */}
        <Card className="lg:col-span-2 xl:col-span-1">
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
        <Card className="xl:col-span-2">
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
              <Slider value={energyLevel} onValueChange={setEnergyLevel} max={10} min={1} step={1} className="w-full" />
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
              <Slider value={stressLevel} onValueChange={setStressLevel} max={10} min={1} step={1} className="w-full" />
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
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Habit Tracker */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Daily Habits</CardTitle>
            <CardDescription className="text-sm">Track your healthy habits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
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
                <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
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
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">{notes.length}/500 characters</span>
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
          </CardContent>
        </Card>
      </div>

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
                Saving Check-in...
              </>
            ) : submitted ? (
              <>
                <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 mr-2" />✓ Check-in Saved Successfully!
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                Complete Daily Check-in
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
