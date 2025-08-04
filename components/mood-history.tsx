"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Calendar,
  TrendingUp,
  Download,
  Share2,
  Target,
  Trophy,
  Sun,
  Cloud,
  CloudRain,
  Star,
  Camera,
  Settings,
  Users,
  ArrowUpDown,
  MapPin,
  Heart,
  Brain,
  Flame,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data with enhanced features
const generateEnhancedMoodData = () => {
  const data = []
  const today = new Date()
  const weatherTypes = ["sunny", "cloudy", "rainy", "snowy"]
  const sleepQualities = [1, 2, 3, 4, 5]

  for (let i = 0; i < 365; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toISOString().split("T")[0],
      mood: Math.floor(Math.random() * 5) + 1,
      hasEntry: Math.random() > 0.3,
      weather: weatherTypes[Math.floor(Math.random() * weatherTypes.length)],
      sleepQuality: sleepQualities[Math.floor(Math.random() * sleepQualities.length)],
      energy: Math.floor(Math.random() * 10) + 1,
      stress: Math.floor(Math.random() * 10) + 1,
      anxiety: Math.floor(Math.random() * 10) + 1,
      photo: Math.random() > 0.7 ? `/placeholder.svg?height=100&width=100&text=Memory` : null,
      tags: ["happy", "grateful", "anxious", "peaceful"].filter(() => Math.random() > 0.6),
    })
  }
  return data.reverse()
}

const lifeEventsData = [
  { date: "2024-01-15", title: "Started New Job", type: "career", impact: "positive" },
  { date: "2024-02-14", title: "Valentine's Day", type: "relationship", impact: "positive" },
  { date: "2024-03-01", title: "Moved to New City", type: "life", impact: "mixed" },
  { date: "2024-03-20", title: "Health Checkup", type: "health", impact: "neutral" },
]

const achievementsData = [
  {
    id: 1,
    title: "30-Day Streak",
    description: "Completed 30 consecutive check-ins",
    icon: Flame,
    earned: true,
    date: "2024-01-30",
  },
  {
    id: 2,
    title: "Mood Improver",
    description: "Improved average mood by 1 point",
    icon: TrendingUp,
    earned: true,
    date: "2024-02-15",
  },
  {
    id: 3,
    title: "Gratitude Master",
    description: "Wrote 100 gratitude entries",
    icon: Heart,
    earned: false,
    progress: 67,
  },
  {
    id: 4,
    title: "Wellness Warrior",
    description: "Maintained healthy habits for 60 days",
    icon: Trophy,
    earned: false,
    progress: 45,
  },
  {
    id: 5,
    title: "Mindful Moments",
    description: "Completed 50 meditation sessions",
    icon: Brain,
    earned: true,
    date: "2024-03-01",
  },
]

const moodColors = {
  1: { bg: "bg-red-500", text: "text-red-500", light: "bg-red-100" },
  2: { bg: "bg-orange-500", text: "text-orange-500", light: "bg-orange-100" },
  3: { bg: "bg-yellow-500", text: "text-yellow-500", light: "bg-yellow-100" },
  4: { bg: "bg-green-500", text: "text-green-500", light: "bg-green-100" },
  5: { bg: "bg-blue-500", text: "text-blue-500", light: "bg-blue-100" },
}

const moodLabels = {
  1: "Very Sad",
  2: "Sad",
  3: "Neutral",
  4: "Happy",
  5: "Very Happy",
}

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: Star,
}

export function MoodHistory() {
  const [viewMode, setViewMode] = useState<"year" | "month" | "week">("month")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [comparisonMode, setComparisonMode] = useState(false)
  const [comparisonPeriod, setComparisonPeriod] = useState("month")
  const [exportFormat, setExportFormat] = useState("pdf")
  const [showWeatherOverlay, setShowWeatherOverlay] = useState(false)
  const [showSleepOverlay, setShowSleepOverlay] = useState(false)
  const [showLifeEvents, setShowLifeEvents] = useState(true)
  const [lifeEvents, setLifeEvents] = useState(lifeEventsData)
  const [newEventDialog, setNewEventDialog] = useState(false)
  const [moodGoals, setMoodGoals] = useState({ target: 4, timeframe: "month" })
  const [achievements] = useState(achievementsData)
  const [calendarTheme, setCalendarTheme] = useState("colorful")
  const [highContrast, setHighContrast] = useState(false)
  const [largerText, setLargerText] = useState(false)
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const moodData = useMemo(() => generateEnhancedMoodData(), [])

  const currentDate = new Date()
  const currentMonthNum = currentMonth.getMonth()
  const currentYear = currentMonth.getFullYear()

  // Filter data based on view mode and current month
  const filteredData = useMemo(() => {
    return moodData.filter((entry) => {
      const entryDate = new Date(entry.date)
      if (viewMode === "month") {
        return entryDate.getMonth() === currentMonthNum && entryDate.getFullYear() === currentYear
      }
      if (viewMode === "week") {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return entryDate >= weekAgo
      }
      return true // year view shows all data
    })
  }, [moodData, viewMode, currentMonthNum, currentYear])

  // Calculate statistics
  const stats = useMemo(() => {
    const validEntries = filteredData.filter((d) => d.hasEntry)
    const averageMood = validEntries.reduce((sum, entry) => sum + entry.mood, 0) / validEntries.length || 0
    const moodTrend = validEntries.length > 1 ? validEntries[validEntries.length - 1].mood - validEntries[0].mood : 0

    const weatherCorrelation = Object.entries(
      validEntries.reduce(
        (acc, entry) => {
          if (!acc[entry.weather]) acc[entry.weather] = []
          acc[entry.weather].push(entry.mood)
          return acc
        },
        {} as Record<string, number[]>,
      ),
    ).map(([weather, moods]) => ({
      weather,
      avgMood: moods.reduce((a, b) => a + b, 0) / moods.length,
    }))

    const bestDay = validEntries.reduce((best, entry) => (entry.mood > (best?.mood || 0) ? entry : best), null)

    const streakDays = calculateStreak(validEntries)

    return {
      averageMood,
      moodTrend,
      weatherCorrelation,
      bestDay,
      streakDays,
      totalEntries: validEntries.length,
      photosCount: validEntries.filter((e) => e.photo).length,
    }
  }, [filteredData])

  function calculateStreak(entries: typeof filteredData) {
    let streak = 0
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date)
      const expectedDate = new Date()
      expectedDate.setDate(expectedDate.getDate() - i)

      if (entryDate.toDateString() === expectedDate.toDateString()) {
        streak++
      } else {
        break
      }
    }
    return streak
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const getIntensity = (mood: number) => mood / 5

  const exportData = () => {
    const dataToExport = {
      period: viewMode,
      data: filteredData,
      stats,
      achievements: achievements.filter((a) => a.earned),
      lifeEvents,
    }

    if (exportFormat === "json") {
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `mood-data-${viewMode}.json`
      a.click()
    } else if (exportFormat === "csv") {
      const csvContent = filteredData
        .map(
          (entry) =>
            `${entry.date},${entry.mood},${entry.weather},${entry.sleepQuality},${entry.energy},${entry.stress}`,
        )
        .join("\n")
      const blob = new Blob([`Date,Mood,Weather,Sleep,Energy,Stress\n${csvContent}`], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `mood-data-${viewMode}.csv`
      a.click()
    }
    // PDF export would require a library like jsPDF
  }

  const earnedAchievements = achievements.filter((a) => a.earned)
  const goalProgress = Math.min((stats.averageMood / moodGoals.target) * 100, 100)

  return (
    <div className="space-y-4 md:space-y-6 mx-4 md:mx-8 lg:mx-12 xl:mx-16">
      {/* Header with Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Mood Journey</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Track your emotional patterns and celebrate progress
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="gap-1">
            <Flame className="h-3 w-3" />
            {stats.streakDays} day streak
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Trophy className="h-3 w-3" />
            {earnedAchievements.length} achievements
          </Badge>
        </div>
      </div>

      {/* View Controls */}
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {(["week", "month", "year"] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={viewMode === mode ? "default" : "outline"}
                  onClick={() => setViewMode(mode)}
                  className="capitalize text-sm"
                  size="sm"
                >
                  {mode}
                </Button>
              ))}
            </div>

            {viewMode === "month" && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium min-w-[120px] text-center">
                  {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
                <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Settings</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Display Settings</DialogTitle>
                    <DialogDescription>Customize your mood history view</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Calendar Theme</Label>
                      <Select value={calendarTheme} onValueChange={setCalendarTheme}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="colorful">Colorful</SelectItem>
                          <SelectItem value="gradient">Gradient</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>High Contrast</Label>
                        <Switch checked={highContrast} onCheckedChange={setHighContrast} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Larger Text</Label>
                        <Switch checked={largerText} onCheckedChange={setLargerText} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Animations</Label>
                        <Switch checked={animationsEnabled} onCheckedChange={setAnimationsEnabled} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Weather Overlay</Label>
                        <Switch checked={showWeatherOverlay} onCheckedChange={setShowWeatherOverlay} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Sleep Quality</Label>
                        <Switch checked={showSleepOverlay} onCheckedChange={setShowSleepOverlay} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Life Events</Label>
                        <Switch checked={showLifeEvents} onCheckedChange={setShowLifeEvents} />
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={exportData}>
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageMood.toFixed(1)}/5</div>
            <p className="text-xs text-muted-foreground">
              <span className={cn(stats.moodTrend >= 0 ? "text-green-600" : "text-red-600")}>
                {stats.moodTrend >= 0 ? "+" : ""}
                {stats.moodTrend.toFixed(1)}
              </span>{" "}
              from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Day</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {stats.bestDay
                ? new Date(stats.bestDay.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.bestDay ? `Mood: ${stats.bestDay.mood}/5` : "No entries yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entries</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEntries}</div>
            <p className="text-xs text-muted-foreground">{stats.photosCount} with photos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goalProgress.toFixed(0)}%</div>
            <Progress value={goalProgress} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Target: {moodGoals.target}/5 average</p>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievements
          </CardTitle>
          <CardDescription>Celebrate your wellness milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all",
                  achievement.earned
                    ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                    : "bg-muted/50",
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-full",
                    achievement.earned ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground",
                  )}
                >
                  <achievement.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  {!achievement.earned && achievement.progress && (
                    <div className="mt-1">
                      <Progress value={achievement.progress} className="h-1" />
                      <p className="text-xs text-muted-foreground mt-1">{achievement.progress}% complete</p>
                    </div>
                  )}
                  {achievement.earned && achievement.date && (
                    <p className="text-xs text-green-600 mt-1">
                      Earned {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Tools */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5" />
                Comparison Analysis
              </CardTitle>
              <CardDescription>Compare different time periods</CardDescription>
            </div>
            <Switch checked={comparisonMode} onCheckedChange={setComparisonMode} />
          </div>
        </CardHeader>
        {comparisonMode && (
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={comparisonPeriod === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setComparisonPeriod("month")}
                >
                  This vs Last Month
                </Button>
                <Button
                  variant={comparisonPeriod === "weekday" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setComparisonPeriod("weekday")}
                >
                  Weekdays vs Weekends
                </Button>
                <Button
                  variant={comparisonPeriod === "season" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setComparisonPeriod("season")}
                >
                  Seasonal Comparison
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">Current Period</h4>
                  <p className="text-2xl font-bold text-blue-600">{stats.averageMood.toFixed(1)}/5</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">{stats.totalEntries} entries</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <h4 className="font-medium text-purple-900 dark:text-purple-100">Previous Period</h4>
                  <p className="text-2xl font-bold text-purple-600">{(stats.averageMood - 0.3).toFixed(1)}/5</p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    {Math.max(stats.totalEntries - 5, 0)} entries
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Weather Correlation */}
      {stats.weatherCorrelation.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Weather & Mood Correlation
            </CardTitle>
            <CardDescription>How weather affects your mood</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {stats.weatherCorrelation.map((item) => {
                const WeatherIcon = weatherIcons[item.weather as keyof typeof weatherIcons]
                return (
                  <div key={item.weather} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <WeatherIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium capitalize">{item.weather}</p>
                      <p className="text-sm text-muted-foreground">Avg: {item.avgMood.toFixed(1)}/5</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Life Events Timeline */}
      {showLifeEvents && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Life Events Timeline
                </CardTitle>
                <CardDescription>Major events and their impact on your mood</CardDescription>
              </div>
              <Dialog open={newEventDialog} onOpenChange={setNewEventDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Life Event</DialogTitle>
                    <DialogDescription>Record a significant moment in your journey</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Event Title</Label>
                      <Input placeholder="What happened?" />
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="career">Career</SelectItem>
                          <SelectItem value="relationship">Relationship</SelectItem>
                          <SelectItem value="health">Health</SelectItem>
                          <SelectItem value="life">Life Change</SelectItem>
                          <SelectItem value="achievement">Achievement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Impact</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="How did this affect you?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="positive">Positive</SelectItem>
                          <SelectItem value="negative">Negative</SelectItem>
                          <SelectItem value="mixed">Mixed</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button className="flex-1">Add Event</Button>
                      <Button variant="outline" onClick={() => setNewEventDialog(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lifeEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full",
                      event.impact === "positive" && "bg-green-500",
                      event.impact === "negative" && "bg-red-500",
                      event.impact === "mixed" && "bg-yellow-500",
                      event.impact === "neutral" && "bg-gray-500",
                    )}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString()} • {event.type}
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {event.impact}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mood Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Mood Calendar
          </CardTitle>
          <CardDescription>
            Click on any day to see details.
            {showWeatherOverlay && " Weather icons show conditions."}
            {showSleepOverlay && " Border thickness indicates sleep quality."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-1 text-xs">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className={cn("p-2 text-center font-medium text-muted-foreground", largerText && "text-sm")}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {filteredData.slice(-35).map((entry, index) => {
                const date = new Date(entry.date)
                const isToday = date.toDateString() === new Date().toDateString()
                const isSelected = selectedDate === entry.date
                const WeatherIcon = weatherIcons[entry.weather as keyof typeof weatherIcons]

                return (
                  <Button
                    key={entry.date}
                    variant="ghost"
                    className={cn(
                      "h-8 w-8 p-0 rounded-sm relative transition-all",
                      animationsEnabled && "hover:scale-110",
                      entry.hasEntry ? moodColors[entry.mood as keyof typeof moodColors].bg : "bg-muted",
                      isToday && "ring-2 ring-primary",
                      isSelected && "ring-2 ring-blue-500",
                      calendarTheme === "minimal" && "rounded-none",
                      calendarTheme === "gradient" && "bg-gradient-to-br",
                      highContrast && "border-2 border-foreground",
                      showSleepOverlay && `border-${entry.sleepQuality}`,
                    )}
                    style={{
                      opacity: entry.hasEntry ? 0.3 + getIntensity(entry.mood) * 0.7 : 0.3,
                      borderWidth: showSleepOverlay ? `${entry.sleepQuality}px` : undefined,
                    }}
                    onClick={() => setSelectedDate(entry.date)}
                  >
                    <span
                      className={cn("text-xs font-medium text-white mix-blend-difference", largerText && "text-sm")}
                    >
                      {date.getDate()}
                    </span>

                    {/* Entry indicator */}
                    {entry.hasEntry && <div className="absolute -top-1 -right-1 h-2 w-2 bg-white rounded-full" />}

                    {/* Photo indicator */}
                    {entry.photo && <Camera className="absolute -bottom-1 -right-1 h-2 w-2 text-white" />}

                    {/* Weather overlay */}
                    {showWeatherOverlay && <WeatherIcon className="absolute -top-1 -left-1 h-2 w-2 text-white" />}
                  </Button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-xs flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 bg-red-500 rounded-sm opacity-50" />
                  <span>Sad</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 bg-yellow-500 rounded-sm opacity-50" />
                  <span>Neutral</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 bg-blue-500 rounded-sm opacity-50" />
                  <span>Happy</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span>Entry</span>
                </div>
                <div className="flex items-center gap-1">
                  <Camera className="h-3 w-3" />
                  <span>Photo</span>
                </div>
                {showWeatherOverlay && (
                  <div className="flex items-center gap-1">
                    <Sun className="h-3 w-3" />
                    <span>Weather</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const dayData = filteredData.find((d) => d.date === selectedDate)
              if (!dayData?.hasEntry) {
                return <p className="text-sm text-muted-foreground">No journal entry for this day.</p>
              }

              return (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-1">
                      <Label className="text-sm">Mood</Label>
                      <Badge variant="secondary">{moodLabels[dayData.mood as keyof typeof moodLabels]}</Badge>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">Energy</Label>
                      <p className="text-sm">{dayData.energy}/10</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">Sleep</Label>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "h-3 w-3",
                              star <= dayData.sleepQuality
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground",
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">Weather</Label>
                      <div className="flex items-center gap-1">
                        {(() => {
                          const WeatherIcon = weatherIcons[dayData.weather as keyof typeof weatherIcons]
                          return <WeatherIcon className="h-4 w-4" />
                        })()}
                        <span className="text-sm capitalize">{dayData.weather}</span>
                      </div>
                    </div>
                  </div>

                  {dayData.tags.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm">Tags</Label>
                      <div className="flex flex-wrap gap-1">
                        {dayData.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {dayData.photo && (
                    <div className="space-y-2">
                      <Label className="text-sm">Photo Memory</Label>
                      <img
                        src={dayData.photo || "/placeholder.svg"}
                        alt="Daily memory"
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Edit className="h-4 w-4" />
                    View Full Entry
                  </Button>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Export & Share
          </CardTitle>
          <CardDescription>Generate reports and share your progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="space-y-2">
              <Label className="text-sm">Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="csv">CSV Data</SelectItem>
                  <SelectItem value="json">JSON Export</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button onClick={exportData} className="gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Share2 className="h-4 w-4" />
                Share Progress
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Users className="h-4 w-4" />
                Community Compare
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
