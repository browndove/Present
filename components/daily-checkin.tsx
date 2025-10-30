"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
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
  Bone,
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
  Loader2,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react"
import { cn } from "@/lib/utils"

// API Service Layer
class CheckinAPI {
  private baseURL: string
  private token: string | null

  constructor(baseURL = '/api', token: string | null = null) {
    this.baseURL = baseURL
    this.token = token || localStorage.getItem('authToken')
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  async getUserProfile() {
    return this.request('/user/profile')
  }

  async getCheckinHistory(limit = 30) {
    return this.request(`/checkins?limit=${limit}`)
  }

  async getTodaysCheckin() {
    const today = new Date().toISOString().split('T')[0]
    return this.request(`/checkins/today?date=${today}`)
  }

  async getAnalytics(days = 30) {
    return this.request(`/analytics/summary?days=${days}`)
  }

  async getUserSettings() {
    return this.request('/user/settings')
  }

  async saveCheckin(checkinData: any) {
    return this.request('/checkins', {
      method: 'POST',
      body: JSON.stringify(checkinData),
    })
  }

  async updateCheckin(checkinId: string, checkinData: any) {
    return this.request(`/checkins/${checkinId}`, {
      method: 'PUT',
      body: JSON.stringify(checkinData),
    })
  }

  async uploadMedia(file: File, type: 'photo' | 'voice') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    return this.request('/media/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set boundary
    })
  }

  async exportData(format = 'json', dateRange = 30) {
    return this.request(`/export?format=${format}&days=${dateRange}`)
  }
}

// Custom Hooks
function useAPI() {
  const [user, setUser] = useState(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const api = new CheckinAPI()

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const fetchWithErrorHandling = useCallback(async (apiCall: () => Promise<any>) => {
    try {
      return await apiCall()
    } catch (error) {
      console.error('API Error:', error)
      if (!isOnline) {
        throw new Error('You are offline. Please check your internet connection.')
      }
      throw error
    }
  }, [isOnline])

  return { api, user, setUser, isOnline, fetchWithErrorHandling }
}

function useLocalStorage(key: string, initialValue: any) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value: any) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  return [storedValue, setValue]
}

// Main Component
export default function EnhancedDailyCheckin() {
  const { api, user, setUser, isOnline, fetchWithErrorHandling } = useAPI()
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)

  // Form state
  const [currentTab, setCurrentTab] = useState("mood")
  const [checkinId, setCheckinId] = useState<string | null>(null)
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

  // Analytics data
  const [analytics, setAnalytics] = useState({
    currentStreak: 0,
    avgMood: 0,
    habitSuccess: 0,
    avgSleep: 0,
  })

  // Local storage for offline support
  const [offlineData, setOfflineData] = useLocalStorage('checkin_offline_data', null)

  // Auto-save draft
  const [draftData, setDraftData] = useLocalStorage('checkin_draft', {})

  // Constants (keeping your existing ones)
  const moodEmojis = [
    { emoji: "😢", label: "Very Sad", value: 1, color: "bg-red-100 border-red-300" },
    { emoji: "😔", label: "Sad", value: 2, color: "bg-orange-100 border-orange-300" },
    { emoji: "😐", label: "Neutral", value: 3, color: "bg-yellow-100 border-yellow-300" },
    { emoji: "😊", label: "Happy", value: 4, color: "bg-green-100 border-green-300" },
    { emoji: "😄", label: "Very Happy", value: 5, color: "bg-blue-100 border-blue-300" },
  ]

  // Data Loading Functions
  const loadUserData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [userProfile, todaysCheckin, analyticsData] = await Promise.all([
        fetchWithErrorHandling(() => api.getUserProfile()),
        fetchWithErrorHandling(() => api.getTodaysCheckin()),
        fetchWithErrorHandling(() => api.getAnalytics())
      ])

      setUser(userProfile)
      setAnalytics({
        currentStreak: analyticsData.streak || 0,
        avgMood: analyticsData.avgMood || 0,
        habitSuccess: analyticsData.habitSuccess || 0,
        avgSleep: analyticsData.avgSleep || 0,
      })

      // Load existing checkin if exists
      if (todaysCheckin) {
        setCheckinId(todaysCheckin.id)
        populateFormWithData(todaysCheckin)
        setSubmitted(true)
      } else {
        // Load draft if no existing checkin
        if (draftData && Object.keys(draftData).length > 0) {
          populateFormWithData(draftData)
        }
      }

      setLastSyncTime(new Date())
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load data')
      // Load offline data if available
      if (offlineData) {
        populateFormWithData(offlineData)
      }
    } finally {
      setIsLoading(false)
    }
  }, [api, fetchWithErrorHandling, draftData, offlineData])

  const populateFormWithData = (data: any) => {
    if (data.selectedMood !== undefined) setSelectedMood(data.selectedMood)
    if (data.moodIntensity) setMoodIntensity(data.moodIntensity)
    if (data.secondaryMoods) setSecondaryMoods(data.secondaryMoods)
    if (data.energyLevel) setEnergyLevel(data.energyLevel)
    if (data.anxietyLevel) setAnxietyLevel(data.anxietyLevel)
    if (data.stressLevel) setStressLevel(data.stressLevel)
    if (data.sleepQuality !== undefined) setSleepQuality(data.sleepQuality)
    if (data.sleepHours !== undefined) setSleepHours(data.sleepHours)
    if (data.notes) setNotes(data.notes)
    if (data.gratitudeItems) setGratitudeItems(data.gratitudeItems)
    if (data.dailyGoals) setDailyGoals(data.dailyGoals)
    if (data.goalCompletion) setGoalCompletion(data.goalCompletion)
    if (data.habits) setHabits(data.habits)
  }

  // Auto-save draft
  useEffect(() => {
    const currentData = {
      selectedMood,
      moodIntensity,
      secondaryMoods,
      energyLevel,
      anxietyLevel,
      stressLevel,
      sleepQuality,
      sleepHours,
      notes,
      gratitudeItems,
      dailyGoals,
      goalCompletion,
      habits,
      timestamp: new Date(),
    }

    // Only save draft if form has meaningful data and not submitted
    if (!submitted && (selectedMood !== null || notes.trim() || gratitudeItems.some(item => item.trim()))) {
      setDraftData(currentData)
    }
  }, [selectedMood, moodIntensity, secondaryMoods, energyLevel, anxietyLevel, stressLevel, 
      sleepQuality, sleepHours, notes, gratitudeItems, dailyGoals, goalCompletion, habits, 
      submitted, setDraftData])

  // Submit handler
  const handleSubmit = async () => {
    if (!selectedMood) {
      setError('Please select your primary mood before submitting.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    const checkinData = {
      selectedMood,
      moodIntensity: moodIntensity[0],
      secondaryMoods,
      energyLevel: energyLevel[0],
      anxietyLevel: anxietyLevel[0],
      stressLevel: stressLevel[0],
      sleepQuality,
      sleepHours,
      notes,
      gratitudeItems,
      dailyGoals,
      goalCompletion,
      habits,
      timestamp: new Date(),
    }

    try {
      let response
      if (checkinId) {
        // Update existing checkin
        response = await fetchWithErrorHandling(() => api.updateCheckin(checkinId, checkinData))
      } else {
        // Create new checkin
        response = await fetchWithErrorHandling(() => api.saveCheckin(checkinData))
        setCheckinId(response.id)
      }

      setSubmitted(true)
      setLastSyncTime(new Date())
      // Clear draft after successful submission
      setDraftData({})
      
      setTimeout(() => {
        setSubmitted(false)
      }, 3000)

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save check-in')
      // Save offline for later sync
      if (!isOnline) {
        setOfflineData(checkinData)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Sync offline data when back online
  useEffect(() => {
    if (isOnline && offlineData) {
      const syncOfflineData = async () => {
        try {
          await fetchWithErrorHandling(() => api.saveCheckin(offlineData))
          setOfflineData(null)
          setLastSyncTime(new Date())
        } catch (error) {
          console.error('Failed to sync offline data:', error)
        }
      }
      syncOfflineData()
    }
  }, [isOnline, offlineData, api, fetchWithErrorHandling, setOfflineData])

  // Load data on component mount
  useEffect(() => {
    loadUserData()
  }, [loadUserData])

  // Utility functions
  const getCompletionPercentage = () => {
    let completed = 0
    const total = 10 // Simplified total for demo

    if (selectedMood !== null) completed++
    if (energyLevel[0] !== 5) completed++
    if (sleepQuality > 0) completed++
    if (notes.trim()) completed++
    if (gratitudeItems.some((item) => item.trim())) completed++
    if (dailyGoals.some((goal) => goal.trim())) completed++
    if (Object.values(habits).some(Boolean)) completed++
    if (anxietyLevel[0] !== 3) completed++
    if (stressLevel[0] !== 3) completed++
    completed++ // Always add 1 for participation

    return Math.round((completed / total) * 100)
  }

  const handleRefresh = () => {
    loadUserData()
  }

  const handleExportData = async () => {
    try {
      const exportData = await fetchWithErrorHandling(() => api.exportData('json', 30))
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `mental-health-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      setError('Failed to export data')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your mental health dashboard...</p>
        </div>
      </div>
    )
  }

  const currentTime = new Date()
  const isEvening = currentTime.getHours() >= 18
  const isMorning = currentTime.getHours() < 12
  const completionPercentage = getCompletionPercentage()

  return (
    <div className="space-y-4 md:space-y-6 mx-4 md:mx-6 lg:mx-14 xl:mx-22 2xl:mx-24 mt-1">
      {/* Connection Status */}
      {!isOnline && (
        <Alert className="border-orange-200 bg-orange-50">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            You're offline. Your data will be saved locally and synced when connection is restored.
          </AlertDescription>
        </Alert>
      )}

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={() => setError(null)}>
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Header with Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {user ? `Hello ${user.firstName || user.name}!` : 
             isMorning ? "Good Morning!" : isEvening ? "Evening Reflection" : "Daily Check-in"}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {isMorning
              ? "How do you feel starting today?"
              : isEvening
                ? "How was your day?"
                : "How are you feeling right now?"}
          </p>
          {lastSyncTime && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Wifi className="h-3 w-3" />
              Last synced: {lastSyncTime.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
            <Badge variant="secondary" className="text-sm md:text-lg px-2 md:px-3 py-1">
              {analytics.currentStreak} day streak
            </Badge>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={cn("h-3 w-3 md:h-4 md:w-4 mr-1", isLoading && "animate-spin")} />
            Refresh
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
            {submitted && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Today's check-in completed
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl flex items-center gap-2">
            <BarChart3 className="h-4 w-4 md:h-5 md:w-5" />
            Your Mental Health Analytics
          </CardTitle>
          <CardDescription className="text-sm">Your recent trends and progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{analytics.currentStreak}</div>
              <div className="text-xs text-blue-600">Day Streak</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{analytics.avgMood.toFixed(1)}</div>
              <div className="text-xs text-green-600">Avg Mood</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{analytics.habitSuccess}%</div>
              <div className="text-xs text-purple-600">Habit Success</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{analytics.avgSleep.toFixed(1)}h</div>
              <div className="text-xs text-orange-600">Avg Sleep</div>
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-2">
            <Button variant="outline" size="sm">
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              View Detailed Analytics
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportData}>
              <Download className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Form - Simplified for demo */}
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

      {/* Energy Level */}
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

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Additional Notes</CardTitle>
          <CardDescription className="text-sm">Any thoughts or reflections for today?</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="How are you feeling? Any thoughts to share..."
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

      {/* Submit Button */}
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <Button
            onClick={handleSubmit}
            disabled={!selectedMood || isSubmitting}
            className={cn(
              "w-full h-12 md:h-14 text-base md:text-lg transition-all",
              submitted && "bg-green-500 hover:bg-green-500",
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 md:h-5 md:w-5 mr-2" />
                {checkinId ? 'Updating Check-in...' : 'Saving Check-in...'}
              </>
            ) : submitted ? (
              <>
                <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                ✓ Check-in {checkinId ? 'Updated' : 'Saved'} Successfully!
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                {checkinId ? 'Update Today\'s Check-in' : 'Complete Daily Check-in'}
              </>
            )}
          </Button>
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
    </div>
  )
}