"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  TrendingUp,
  Target,
  Clock,
  PenTool,
  Heart,
  Brain,
  Activity,
  Settings,
  Download,
  Share2,
  Sun,
  CloudRain,
  Users,
  AlertTriangle,
  TrendingDown,
  Maximize2,
  RefreshCw,
  Lightbulb,
  Sparkles,
  Flame,
  Shield,
  BookOpen,
  Mail,
  FileText,
} from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  Area,
  AreaChart,
  ScatterChart,
  Scatter,
  ComposedChart,
  CartesianGrid,
  Legend,
} from "recharts"
import { cn } from "@/lib/utils"
import { format, subWeeks, subMonths, isWeekend } from "date-fns"

// Enhanced mock data generation
const generateAdvancedAnalyticsData = () => {
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
  const locations = ["Home", "Office", "Cafe", "Park", "Gym", "Library", "Beach", "Mountains"]
  const topics = [
    "Goals",
    "Relationships",
    "Career",
    "Health",
    "Family",
    "Dreams",
    "Challenges",
    "Growth",
    "Memories",
    "Future",
  ]

  const data = []
  const today = new Date()

  for (let i = 0; i < 365; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    const selectedMoods = moods.filter(() => Math.random() > 0.7).slice(0, 3)
    const selectedActivities = activities.filter(() => Math.random() > 0.8).slice(0, 2)
    const selectedTopics = topics.filter(() => Math.random() > 0.6).slice(0, 2)

    const wordCount = Math.floor(Math.random() * 800) + 50
    const sentences = Math.floor(wordCount / 15) + Math.floor(Math.random() * 10)
    const uniqueWords = Math.floor(wordCount * (0.6 + Math.random() * 0.3))

    data.push({
      date: date.toISOString().split("T")[0],
      mood: Math.floor(Math.random() * 5) + 1,
      moods: selectedMoods,
      activities: selectedActivities,
      topics: selectedTopics,
      wordCount,
      sentences,
      uniqueWords,
      readingTime: Math.ceil(wordCount / 200),
      writingTime: Math.floor(Math.random() * 45) + 5,
      energy: Math.floor(Math.random() * 10) + 1,
      stress: Math.floor(Math.random() * 10) + 1,
      anxiety: Math.floor(Math.random() * 10) + 1,
      sleep: Math.floor(Math.random() * 10) + 1,
      weather: weatherTypes[Math.floor(Math.random() * weatherTypes.length)],
      temperature: Math.floor(Math.random() * 40) + 10,
      location: locations[Math.floor(Math.random() * locations.length)],
      timeOfDay: Math.floor(Math.random() * 24),
      dayOfWeek: date.getDay(),
      isWeekend: isWeekend(date),
      sentiment: Math.random() > 0.5 ? "positive" : Math.random() > 0.5 ? "negative" : "neutral",
      complexity: Math.floor(Math.random() * 100) + 1,
      coherence: Math.floor(Math.random() * 100) + 1,
      emotionalRange: selectedMoods.length,
      socialMentions: Math.floor(Math.random() * 10),
      futureTense: Math.floor(Math.random() * 20),
      pastTense: Math.floor(Math.random() * 30),
      presentTense: Math.floor(Math.random() * 50),
      questions: Math.floor(Math.random() * 5),
      exclamations: Math.floor(Math.random() * 3),
      gratitudeMentions: Math.floor(Math.random() * 5),
      challengeMentions: Math.floor(Math.random() * 3),
      goalMentions: Math.floor(Math.random() * 2),
      relationshipMentions: Math.floor(Math.random() * 4),
      workMentions: Math.floor(Math.random() * 6),
      healthMentions: Math.floor(Math.random() * 3),
    })
  }

  return data.reverse()
}

// Color schemes for different chart types
const colorSchemes = {
  mood: {
    1: "#ef4444", // red
    2: "#f97316", // orange
    3: "#eab308", // yellow
    4: "#22c55e", // green
    5: "#3b82f6", // blue
  },
  sentiment: {
    positive: "#22c55e",
    negative: "#ef4444",
    neutral: "#6b7280",
  },
  weather: {
    sunny: "#f59e0b",
    cloudy: "#6b7280",
    rainy: "#3b82f6",
    snowy: "#e5e7eb",
    windy: "#8b5cf6",
  },
  activity: [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#6366f1",
  ],
}

export function Analytics() {
  // State management
  const [data] = useState(generateAdvancedAnalyticsData())
  const [selectedTimeRange, setSelectedTimeRange] = useState("3months")
  const [selectedMetrics, setSelectedMetrics] = useState(["mood", "energy", "wordCount"])
  const [chartType, setChartType] = useState("line")
  const [viewMode, setViewMode] = useState("overview")
  const [expandedSections, setExpandedSections] = useState<string[]>(["overview"])
  const [customDateRange, setCustomDateRange] = useState({ start: "", end: "" })
  const [comparisonMode, setComparisonMode] = useState(false)
  const [comparisonPeriod, setComparisonPeriod] = useState("previous")
  const [showPredictions, setShowPredictions] = useState(false)
  const [dashboardLayout, setDashboardLayout] = useState("default")
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [drillDownData, setDrillDownData] = useState<any>(null)
  const [personalizedInsights, setPersonalizedInsights] = useState(true)
  const [anonymousBenchmarking, setAnonymousBenchmarking] = useState(false)

  // Responsive detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Filter data based on time range
  const filteredData = useMemo(() => {
    const now = new Date()
    let startDate = new Date()

    switch (selectedTimeRange) {
      case "1week":
        startDate = subWeeks(now, 1)
        break
      case "1month":
        startDate = subMonths(now, 1)
        break
      case "3months":
        startDate = subMonths(now, 3)
        break
      case "6months":
        startDate = subMonths(now, 6)
        break
      case "1year":
        startDate = subMonths(now, 12)
        break
      case "custom":
        if (customDateRange.start && customDateRange.end) {
          startDate = new Date(customDateRange.start)
        }
        break
      default:
        startDate = subMonths(now, 3)
    }

    return data.filter((entry) => new Date(entry.date) >= startDate)
  }, [data, selectedTimeRange, customDateRange])

  // Advanced analytics calculations
  const analytics = useMemo(() => {
    if (filteredData.length === 0) return null

    // Basic metrics
    const totalEntries = filteredData.length
    const averageMood = filteredData.reduce((sum, entry) => sum + entry.mood, 0) / totalEntries
    const totalWords = filteredData.reduce((sum, entry) => sum + entry.wordCount, 0)
    const averageWordsPerEntry = Math.round(totalWords / totalEntries)

    // Mood analytics
    const moodDistribution = filteredData.reduce(
      (acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1
        return acc
      },
      {} as Record<number, number>,
    )

    const moodVolatility =
      filteredData.reduce((sum, entry, index) => {
        if (index === 0) return 0
        return sum + Math.abs(entry.mood - filteredData[index - 1].mood)
      }, 0) /
      (totalEntries - 1)

    // Emotional range and complexity
    const emotionalRange = filteredData.reduce((sum, entry) => sum + entry.emotionalRange, 0) / totalEntries
    const averageComplexity = filteredData.reduce((sum, entry) => sum + entry.complexity, 0) / totalEntries

    // Writing analytics
    const vocabularyRichness =
      filteredData.reduce((sum, entry) => sum + entry.uniqueWords / entry.wordCount, 0) / totalEntries
    const averageWritingTime = filteredData.reduce((sum, entry) => sum + entry.writingTime, 0) / totalEntries
    const writingVelocity = averageWordsPerEntry / averageWritingTime

    // Behavioral patterns
    const timePatterns = filteredData.reduce(
      (acc, entry) => {
        const hour = entry.timeOfDay
        acc[hour] = (acc[hour] || 0) + 1
        return acc
      },
      {} as Record<number, number>,
    )

    const peakWritingHour = Object.entries(timePatterns).sort(([, a], [, b]) => b - a)[0]?.[0] || "0"

    const weekdayPatterns = filteredData.reduce(
      (acc, entry) => {
        const day = entry.dayOfWeek
        acc[day] = (acc[day] || 0) + 1
        return acc
      },
      {} as Record<number, number>,
    )

    // Weather correlations
    const weatherMoodCorrelation = filteredData.reduce(
      (acc, entry) => {
        if (!acc[entry.weather]) acc[entry.weather] = []
        acc[entry.weather].push(entry.mood)
        return acc
      },
      {} as Record<string, number[]>,
    )

    Object.keys(weatherMoodCorrelation).forEach((weather) => {
      const moods = weatherMoodCorrelation[weather]
      weatherMoodCorrelation[weather] = moods.reduce((sum, mood) => sum + mood, 0) / moods.length
    })

    // Streak calculations
    const streakData = filteredData.reduce(
      (acc, entry, index) => {
        if (index === 0) {
          acc.current = 1
          acc.longest = 1
          return acc
        }

        const prevDate = new Date(filteredData[index - 1].date)
        const currentDate = new Date(entry.date)
        const dayDiff = Math.abs((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))

        if (dayDiff === 1) {
          acc.current++
          acc.longest = Math.max(acc.longest, acc.current)
        } else {
          acc.current = 1
        }

        return acc
      },
      { current: 0, longest: 0 },
    )

    // Sentiment analysis
    const sentimentDistribution = filteredData.reduce(
      (acc, entry) => {
        acc[entry.sentiment] = (acc[entry.sentiment] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Topic analysis
    const topicFrequency = filteredData.reduce(
      (acc, entry) => {
        entry.topics.forEach((topic) => {
          acc[topic] = (acc[topic] || 0) + 1
        })
        return acc
      },
      {} as Record<string, number>,
    )

    // Correlation matrices
    const moodEnergyCorrelation =
      filteredData.reduce((sum, entry) => {
        return sum + entry.mood * entry.energy
      }, 0) / totalEntries

    const stressMoodCorrelation =
      filteredData.reduce((sum, entry) => {
        return sum + entry.stress * (6 - entry.mood) // Inverse correlation
      }, 0) / totalEntries

    // Predictive insights
    const moodTrend =
      filteredData.slice(-7).reduce((sum, entry) => sum + entry.mood, 0) / 7 -
      filteredData.slice(-14, -7).reduce((sum, entry) => sum + entry.mood, 0) / 7

    const writingTrend =
      filteredData.slice(-7).reduce((sum, entry) => sum + entry.wordCount, 0) / 7 -
      filteredData.slice(-14, -7).reduce((sum, entry) => sum + entry.wordCount, 0) / 7

    // Recovery time analysis
    const recoveryTimes = []
    let lowMoodStart = null

    filteredData.forEach((entry, index) => {
      if (entry.mood <= 2 && !lowMoodStart) {
        lowMoodStart = index
      } else if (entry.mood >= 4 && lowMoodStart !== null) {
        recoveryTimes.push(index - lowMoodStart)
        lowMoodStart = null
      }
    })

    const averageRecoveryTime =
      recoveryTimes.length > 0 ? recoveryTimes.reduce((sum, time) => sum + time, 0) / recoveryTimes.length : 0

    return {
      totalEntries,
      averageMood,
      totalWords,
      averageWordsPerEntry,
      moodDistribution,
      moodVolatility,
      emotionalRange,
      averageComplexity,
      vocabularyRichness,
      averageWritingTime,
      writingVelocity,
      peakWritingHour,
      weekdayPatterns,
      weatherMoodCorrelation,
      streakData,
      sentimentDistribution,
      topicFrequency,
      moodEnergyCorrelation,
      stressMoodCorrelation,
      moodTrend,
      writingTrend,
      averageRecoveryTime,
    }
  }, [filteredData])

  // Generate insights based on data
  const generateInsights = useMemo(() => {
    if (!analytics) return []

    const insights = []

    // Mood insights
    if (analytics.moodTrend > 0.5) {
      insights.push({
        type: "positive",
        category: "mood",
        title: "Mood Improving",
        description: `Your mood has improved by ${analytics.moodTrend.toFixed(1)} points over the last week.`,
        icon: TrendingUp,
        priority: "high",
      })
    } else if (analytics.moodTrend < -0.5) {
      insights.push({
        type: "warning",
        category: "mood",
        title: "Mood Declining",
        description: `Your mood has declined by ${Math.abs(analytics.moodTrend).toFixed(1)} points. Consider self-care activities.`,
        icon: TrendingDown,
        priority: "high",
      })
    }

    // Writing insights
    if (analytics.writingTrend > 50) {
      insights.push({
        type: "positive",
        category: "writing",
        title: "Writing More",
        description: `You're writing ${Math.round(analytics.writingTrend)} more words per entry recently.`,
        icon: PenTool,
        priority: "medium",
      })
    }

    // Peak performance insights
    const peakHour = Number.parseInt(analytics.peakWritingHour)
    const timeOfDay = peakHour < 12 ? "morning" : peakHour < 17 ? "afternoon" : "evening"
    insights.push({
      type: "info",
      category: "productivity",
      title: `Peak Writing Time: ${timeOfDay}`,
      description: `You write most often at ${peakHour}:00. Consider scheduling important reflections then.`,
      icon: Clock,
      priority: "low",
    })

    // Weather correlation insights
    const bestWeatherMood = Object.entries(analytics.weatherMoodCorrelation).sort(
      ([, a], [, b]) => (b as number) - (a as number),
    )[0]

    if (bestWeatherMood) {
      insights.push({
        type: "info",
        category: "environment",
        title: `Best Mood Weather: ${bestWeatherMood[0]}`,
        description: `Your mood averages ${(bestWeatherMood[1] as number).toFixed(1)}/5 on ${bestWeatherMood[0]} days.`,
        icon: Sun,
        priority: "low",
      })
    }

    // Recovery insights
    if (analytics.averageRecoveryTime > 0) {
      insights.push({
        type: "info",
        category: "resilience",
        title: "Recovery Pattern",
        description: `You typically recover from low moods in ${Math.round(analytics.averageRecoveryTime)} days.`,
        icon: Heart,
        priority: "medium",
      })
    }

    return insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return (
        priorityOrder[b.priority as keyof typeof priorityOrder] -
        priorityOrder[a.priority as keyof typeof priorityOrder]
      )
    })
  }, [analytics])

  // Chart data preparation
  const chartData = useMemo(() => {
    if (!filteredData.length) return {}

    // Mood trend data
    const moodTrendData = filteredData.map((entry) => ({
      date: format(new Date(entry.date), "MMM d"),
      mood: entry.mood,
      energy: entry.energy,
      stress: entry.stress,
      wordCount: entry.wordCount,
    }))

    // Mood distribution pie chart
    const moodDistributionData = Object.entries(analytics?.moodDistribution || {}).map(([mood, count]) => ({
      name: `Mood ${mood}`,
      value: count,
      fill: colorSchemes.mood[Number.parseInt(mood) as keyof typeof colorSchemes.mood],
    }))

    // Weekly patterns
    const weeklyData = Array.from({ length: 7 }, (_, i) => ({
      day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i],
      entries: analytics?.weekdayPatterns[i] || 0,
      avgMood:
        filteredData.filter((entry) => entry.dayOfWeek === i).reduce((sum, entry) => sum + entry.mood, 0) /
        (filteredData.filter((entry) => entry.dayOfWeek === i).length || 1),
    }))

    // Hourly patterns
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      entries: filteredData.filter((entry) => entry.timeOfDay === i).length,
      avgMood:
        filteredData.filter((entry) => entry.timeOfDay === i).reduce((sum, entry) => sum + entry.mood, 0) /
          (filteredData.filter((entry) => entry.timeOfDay === i).length || 1) || 0,
    }))

    // Weather correlation
    const weatherData = Object.entries(analytics?.weatherMoodCorrelation || {}).map(([weather, avgMood]) => ({
      weather,
      avgMood: avgMood as number,
      fill: colorSchemes.weather[weather as keyof typeof colorSchemes.weather],
    }))

    // Topic frequency
    const topicData = Object.entries(analytics?.topicFrequency || {})
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([topic, count]) => ({
        topic,
        count: count as number,
      }))

    // Sentiment over time
    const sentimentData = filteredData.reduce(
      (acc, entry) => {
        const week = format(new Date(entry.date), "MMM d")
        if (!acc[week]) {
          acc[week] = { positive: 0, negative: 0, neutral: 0, total: 0 }
        }
        acc[week][entry.sentiment as keyof (typeof acc)[typeof week]]++
        acc[week].total++
        return acc
      },
      {} as Record<string, any>,
    )

    const sentimentTrendData = Object.entries(sentimentData).map(([week, data]) => ({
      week,
      positive: (data.positive / data.total) * 100,
      negative: (data.negative / data.total) * 100,
      neutral: (data.neutral / data.total) * 100,
    }))

    // Correlation scatter plot
    const correlationData = filteredData.map((entry) => ({
      mood: entry.mood,
      energy: entry.energy,
      stress: entry.stress,
      wordCount: entry.wordCount,
      sleep: entry.sleep,
    }))

    return {
      moodTrendData,
      moodDistributionData,
      weeklyData,
      hourlyData,
      weatherData,
      topicData,
      sentimentTrendData,
      correlationData,
    }
  }, [filteredData, analytics])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const handleDrillDown = (data: any, chartType: string) => {
    setDrillDownData({ data, chartType })
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6 mx-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Advanced Analytics</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Deep insights into your emotional journey and writing patterns
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1week">Last Week</SelectItem>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              {isMobile ? "" : "Export"}
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Settings className="h-4 w-4" />
                  {isMobile ? "" : "Settings"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Analytics Settings</DialogTitle>
                  <DialogDescription>Customize your analytics dashboard</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Show Predictions</Label>
                      <Switch checked={showPredictions} onCheckedChange={setShowPredictions} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Personalized Insights</Label>
                      <Switch checked={personalizedInsights} onCheckedChange={setPersonalizedInsights} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Anonymous Benchmarking</Label>
                      <Switch checked={anonymousBenchmarking} onCheckedChange={setAnonymousBenchmarking} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Comparison Mode</Label>
                      <Switch checked={comparisonMode} onCheckedChange={setComparisonMode} />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label>Dashboard Layout</Label>
                    <Select value={dashboardLayout} onValueChange={setDashboardLayout}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label>Selected Metrics</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["mood", "energy", "stress", "wordCount", "sleep", "complexity"].map((metric) => (
                        <div key={metric} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={metric}
                            checked={selectedMetrics.includes(metric)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedMetrics((prev) => [...prev, metric])
                              } else {
                                setSelectedMetrics((prev) => prev.filter((m) => m !== metric))
                              }
                            }}
                            className="rounded"
                          />
                          <Label htmlFor={metric} className="capitalize">
                            {metric}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Custom Date Range */}
        {selectedTimeRange === "custom" && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="space-y-2 flex-1">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={customDateRange.start}
                    onChange={(e) => setCustomDateRange((prev) => ({ ...prev, start: e.target.value }))}
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={customDateRange.end}
                    onChange={(e) => setCustomDateRange((prev) => ({ ...prev, end: e.target.value }))}
                  />
                </div>
                <Button>Apply Range</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Key Insights */}
      {personalizedInsights && generateInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Personalized Insights
            </CardTitle>
            <CardDescription>AI-powered insights based on your patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {generateInsights.slice(0, isMobile ? 3 : 6).map((insight, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-lg border",
                    insight.type === "positive" &&
                      "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
                    insight.type === "warning" &&
                      "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800",
                    insight.type === "info" && "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-full",
                        insight.type === "positive" &&
                          "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400",
                        insight.type === "warning" &&
                          "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400",
                        insight.type === "info" && "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
                      )}
                    >
                      <insight.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="overview" className="text-xs md:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="mood" className="text-xs md:text-sm">
              Mood
            </TabsTrigger>
            <TabsTrigger value="writing" className="text-xs md:text-sm">
              Writing
            </TabsTrigger>
            <TabsTrigger value="patterns" className="text-xs md:text-sm">
              Patterns
            </TabsTrigger>
            <TabsTrigger value="correlations" className="text-xs md:text-sm">
              Correlations
            </TabsTrigger>
            <TabsTrigger value="predictions" className="text-xs md:text-sm">
              Predictions
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 md:space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Mood</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{analytics.averageMood.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={cn(analytics.moodTrend >= 0 ? "text-green-600" : "text-red-600")}>
                    {analytics.moodTrend >= 0 ? "+" : ""}
                    {analytics.moodTrend.toFixed(1)}
                  </span>{" "}
                  this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Entries</CardTitle>
                <PenTool className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{analytics.totalEntries}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round(analytics.totalEntries / (filteredData.length / 30))} per month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Words</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{analytics.totalWords.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Avg: {analytics.averageWordsPerEntry} per entry</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Streak</CardTitle>
                <Flame className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{analytics.streakData.current}</div>
                <p className="text-xs text-muted-foreground">Best: {analytics.streakData.longest} days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Volatility</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{analytics.moodVolatility.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.moodVolatility < 1 ? "Stable" : analytics.moodVolatility < 2 ? "Moderate" : "Variable"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recovery</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{Math.round(analytics.averageRecoveryTime)}</div>
                <p className="text-xs text-muted-foreground">days average</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Trend Chart */}
          
          {/* Quick Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Mood Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: { label: "Count" },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={chartData.moodDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.moodDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-background border rounded-lg p-2 shadow-md">
                                <p className="font-medium">{data.name}</p>
                                <p className="text-sm text-muted-foreground">{data.value} entries</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Weekly Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    entries: { label: "Entries", color: "hsl(var(--chart-2))" },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={chartData.weeklyData}>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="entries" fill="var(--color-entries)" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Writing Velocity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Words per minute</span>
                    <span className="font-medium">{analytics.writingVelocity.toFixed(1)}</span>
                  </div>
                  <Progress value={Math.min(analytics.writingVelocity * 10, 100)} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Vocabulary richness</span>
                    <span className="font-medium">{(analytics.vocabularyRichness * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={analytics.vocabularyRichness * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Emotional range</span>
                    <span className="font-medium">{analytics.emotionalRange.toFixed(1)}</span>
                  </div>
                  <Progress value={(analytics.emotionalRange / 5) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Mood Analysis Tab */}
        <TabsContent value="mood" className="space-y-4 md:space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Mood Volatility Analysis</CardTitle>
                <CardDescription>How stable are your emotions over time?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Volatility Index</span>
                    <Badge
                      variant={
                        analytics.moodVolatility < 1
                          ? "default"
                          : analytics.moodVolatility < 2
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {analytics.moodVolatility.toFixed(2)}
                    </Badge>
                  </div>
                  <Progress value={Math.min(analytics.moodVolatility * 25, 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {analytics.moodVolatility < 1
                      ? "Your mood is very stable with minimal fluctuations."
                      : analytics.moodVolatility < 2
                        ? "Your mood shows moderate variability."
                        : "Your mood shows high variability. Consider tracking triggers."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emotional Recovery</CardTitle>
                <CardDescription>How quickly do you bounce back?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{Math.round(analytics.averageRecoveryTime)}</div>
                    <p className="text-sm text-muted-foreground">days average recovery</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Resilience Score</span>
                      <span className="font-medium">
                        {analytics.averageRecoveryTime < 2
                          ? "Excellent"
                          : analytics.averageRecoveryTime < 4
                            ? "Good"
                            : "Needs Attention"}
                      </span>
                    </div>
                    <Progress value={Math.max(0, 100 - analytics.averageRecoveryTime * 20)} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mood Correlation Matrix</CardTitle>
              <CardDescription>Which emotions appear together?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Mood ↔ Energy</span>
                    <Badge variant="outline">{(analytics.moodEnergyCorrelation / 50).toFixed(2)}</Badge>
                  </div>
                  <Progress value={(analytics.moodEnergyCorrelation / 50) * 100} className="h-2" />
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Stress ↔ Mood</span>
                    <Badge variant="outline">{(analytics.stressMoodCorrelation / 50).toFixed(2)}</Badge>
                  </div>
                  <Progress value={(analytics.stressMoodCorrelation / 50) * 100} className="h-2" />
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Emotional Range</span>
                    <Badge variant="outline">{analytics.emotionalRange.toFixed(1)}</Badge>
                  </div>
                  <Progress value={(analytics.emotionalRange / 5) * 100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weather Impact on Mood</CardTitle>
              <CardDescription>How different weather conditions affect your emotional state</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  avgMood: { label: "Average Mood", color: "hsl(var(--chart-1))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={chartData.weatherData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="weather" />
                    <YAxis domain={[0, 5]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="avgMood" radius={[4, 4, 0, 0]}>
                      {chartData.weatherData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Writing Analytics Tab */}
        <TabsContent value="writing" className="space-y-4 md:space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Writing Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Avg words per entry</span>
                    <span className="font-medium">{analytics.averageWordsPerEntry}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Writing velocity</span>
                    <span className="font-medium">{analytics.writingVelocity.toFixed(1)} wpm</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Vocabulary richness</span>
                    <span className="font-medium">{(analytics.vocabularyRichness * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Avg complexity</span>
                    <span className="font-medium">{analytics.averageComplexity.toFixed(0)}/100</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Topic Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {chartData.topicData.slice(0, 5).map((topic, index) => (
                    <div key={topic.topic} className="flex items-center justify-between">
                      <span className="text-sm">{topic.topic}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(topic.count / chartData.topicData[0].count) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-6">{topic.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Writing Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      {analytics.writingTrend > 0 ? "Increasing" : "Decreasing"} word count
                    </span>
                  </div>
                  <div className="text-2xl font-bold">
                    {analytics.writingTrend > 0 ? "+" : ""}
                    {Math.round(analytics.writingTrend)}
                  </div>
                  <p className="text-xs text-muted-foreground">words per entry change this week</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sentiment Analysis Over Time</CardTitle>
              <CardDescription>Track the emotional tone of your writing</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  positive: { label: "Positive", color: "#22c55e" },
                  negative: { label: "Negative", color: "#ef4444" },
                  neutral: { label: "Neutral", color: "#6b7280" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData.sentimentTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="positive"
                      stackId="1"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="neutral"
                      stackId="1"
                      stroke="#6b7280"
                      fill="#6b7280"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="negative"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Behavioral Patterns Tab */}
        <TabsContent value="patterns" className="space-y-4 md:space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Daily Writing Patterns</CardTitle>
                <CardDescription>When do you write most often?</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    entries: { label: "Entries", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={chartData.hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="entries" fill="var(--color-entries)" radius={[2, 2, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm">
                    <strong>Peak writing time:</strong> {analytics.peakWritingHour}:00
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Consider scheduling important reflections during this time for optimal results.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Consistency</CardTitle>
                <CardDescription>Your writing habits by day of week</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    entries: { label: "Entries", color: "hsl(var(--chart-2))" },
                    avgMood: { label: "Avg Mood", color: "hsl(var(--chart-3))" },
                  }}
                  className="h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData.weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="entries" fill="var(--color-entries)" />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="avgMood"
                        stroke="var(--color-avgMood)"
                        strokeWidth={2}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Most active day:</span>
                    <p className="font-medium">{chartData.weeklyData.sort((a, b) => b.entries - a.entries)[0]?.day}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Best mood day:</span>
                    <p className="font-medium">{chartData.weeklyData.sort((a, b) => b.avgMood - a.avgMood)[0]?.day}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Habit Formation Analysis</CardTitle>
              <CardDescription>Understanding your journaling consistency patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Streak Probability</Label>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round((analytics.streakData.current / analytics.streakData.longest) * 100)}%
                  </div>
                  <Progress
                    value={(analytics.streakData.current / analytics.streakData.longest) * 100}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">Likelihood of continuing current streak</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Habit Strength</Label>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round((analytics.totalEntries / filteredData.length) * 100)}%
                  </div>
                  <Progress value={(analytics.totalEntries / filteredData.length) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground">Consistency over selected period</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Momentum Score</Label>
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(Math.min(analytics.streakData.current * 10, 100))}
                  </div>
                  <Progress value={Math.min(analytics.streakData.current * 10, 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground">Current writing momentum</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seasonal Patterns</CardTitle>
              <CardDescription>How your mood and writing change throughout the year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Monthly Averages</h4>
                  {Array.from({ length: 12 }, (_, i) => {
                    const monthData = filteredData.filter((entry) => new Date(entry.date).getMonth() === i)
                    const avgMood =
                      monthData.length > 0
                        ? monthData.reduce((sum, entry) => sum + entry.mood, 0) / monthData.length
                        : 0
                    const monthName = format(new Date(2024, i, 1), "MMM")

                    return (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm w-8">{monthName}</span>
                        <div className="flex-1 mx-3">
                          <Progress value={(avgMood / 5) * 100} className="h-2" />
                        </div>
                        <span className="text-sm w-8 text-right">{avgMood.toFixed(1)}</span>
                      </div>
                    )
                  })}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Seasonal Insights</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Sun className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Spring/Summer</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Higher energy levels and more positive entries during warmer months
                      </p>
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <CloudRain className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Fall/Winter</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        More reflective writing and deeper emotional processing
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Correlations Tab */}
        <TabsContent value="correlations" className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Variable Correlation Analysis</CardTitle>
              <CardDescription>Explore relationships between different aspects of your wellbeing</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  mood: { label: "Mood", color: "hsl(var(--chart-1))" },
                  energy: { label: "Energy", color: "hsl(var(--chart-2))" },
                  stress: { label: "Stress", color: "hsl(var(--chart-3))" },
                  sleep: { label: "Sleep", color: "hsl(var(--chart-4))" },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={chartData.correlationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mood" name="Mood" />
                    <YAxis dataKey="energy" name="Energy" />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-md">
                              <p className="font-medium mb-2">Correlation Point</p>
                              <div className="space-y-1 text-sm">
                                <p>Mood: {data.mood}/5</p>
                                <p>Energy: {data.energy}/10</p>
                                <p>Stress: {data.stress}/10</p>
                                <p>Sleep: {data.sleep}/10</p>
                                <p>Words: {data.wordCount}</p>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Scatter dataKey="energy" fill="var(--color-mood)" />
                  </ScatterChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Correlation Strength Matrix</CardTitle>
                <CardDescription>Statistical relationships between variables</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { vars: "Mood ↔ Energy", strength: 0.73, color: "text-green-600" },
                    { vars: "Sleep ↔ Mood", strength: 0.68, color: "text-green-600" },
                    { vars: "Stress ↔ Mood", strength: -0.61, color: "text-red-600" },
                    { vars: "Words ↔ Mood", strength: 0.45, color: "text-blue-600" },
                    { vars: "Energy ↔ Words", strength: 0.52, color: "text-blue-600" },
                  ].map((correlation, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">{correlation.vars}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div
                            className={cn("h-2 rounded-full", correlation.strength > 0 ? "bg-green-500" : "bg-red-500")}
                            style={{ width: `${Math.abs(correlation.strength) * 100}%` }}
                          />
                        </div>
                        <span className={cn("text-sm font-medium", correlation.color)}>
                          {correlation.strength > 0 ? "+" : ""}
                          {correlation.strength.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Environmental Factors</CardTitle>
                <CardDescription>How external conditions affect your wellbeing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Weather Impact</Label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(analytics.weatherMoodCorrelation).map(([weather, mood]) => (
                        <div key={weather} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                          <span className="capitalize">{weather}</span>
                          <span className="font-medium">{(mood as number).toFixed(1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Time-Based Patterns</Label>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Weekend vs Weekday</span>
                        <Badge variant="outline">
                          {filteredData.filter((e) => e.isWeekend).length > 0
                            ? (
                                filteredData.filter((e) => e.isWeekend).reduce((sum, e) => sum + e.mood, 0) /
                                filteredData.filter((e) => e.isWeekend).length
                              ).toFixed(1)
                            : "0"}{" "}
                          vs{" "}
                          {filteredData.filter((e) => !e.isWeekend).length > 0
                            ? (
                                filteredData.filter((e) => !e.isWeekend).reduce((sum, e) => sum + e.mood, 0) /
                                filteredData.filter((e) => !e.isWeekend).length
                              ).toFixed(1)
                            : "0"}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Morning vs Evening</span>
                        <Badge variant="outline">
                          {filteredData.filter((e) => e.timeOfDay < 12).length > 0
                            ? (
                                filteredData.filter((e) => e.timeOfDay < 12).reduce((sum, e) => sum + e.mood, 0) /
                                filteredData.filter((e) => e.timeOfDay < 12).length
                              ).toFixed(1)
                            : "0"}{" "}
                          vs{" "}
                          {filteredData.filter((e) => e.timeOfDay >= 18).length > 0
                            ? (
                                filteredData.filter((e) => e.timeOfDay >= 18).reduce((sum, e) => sum + e.mood, 0) /
                                filteredData.filter((e) => e.timeOfDay >= 18).length
                              ).toFixed(1)
                            : "0"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-4 md:space-y-6">
          {showPredictions && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    AI-Powered Predictions
                  </CardTitle>
                  <CardDescription>
                    Based on your historical patterns, here are some predictions and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-sm">Mood Forecast</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {(analytics.averageMood + analytics.moodTrend).toFixed(1)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Predicted mood for next week based on current trends
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Flame className="h-4 w-4 text-orange-600" />
                        <span className="font-medium text-sm">Streak Probability</span>
                      </div>
                      <div className="text-2xl font-bold text-orange-600 mb-1">
                        {Math.round((analytics.streakData.current / (analytics.streakData.current + 1)) * 100)}%
                      </div>
                      <p className="text-xs text-muted-foreground">Likelihood of maintaining current streak</p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium text-sm">Risk Assessment</span>
                      </div>
                      <div className="text-2xl font-bold text-yellow-600 mb-1">
                        {analytics.moodVolatility > 2 ? "High" : analytics.moodVolatility > 1 ? "Medium" : "Low"}
                      </div>
                      <p className="text-xs text-muted-foreground">Risk of mood dips based on volatility patterns</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Personalized Recommendations</CardTitle>
                  <CardDescription>AI-generated suggestions based on your patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        icon: Clock,
                        title: "Optimal Writing Time",
                        description: `Your peak writing time is ${analytics.peakWritingHour}:00. Consider scheduling important reflections during this window.`,
                        action: "Set Reminder",
                        priority: "high",
                      },
                      {
                        icon: Sun,
                        title: "Weather-Based Planning",
                        description: `You tend to feel best on ${Object.entries(analytics.weatherMoodCorrelation).sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0]} days. Plan important activities accordingly.`,
                        action: "View Calendar",
                        priority: "medium",
                      },
                      {
                        icon: Heart,
                        title: "Recovery Strategy",
                        description: `Your average recovery time is ${Math.round(analytics.averageRecoveryTime)} days. Consider implementing coping strategies during low periods.`,
                        action: "Learn More",
                        priority: "medium",
                      },
                      {
                        icon: Target,
                        title: "Writing Goal Adjustment",
                        description: `Based on your current pace of ${analytics.averageWordsPerEntry} words per entry, consider adjusting your monthly goal.`,
                        action: "Update Goal",
                        priority: "low",
                      },
                    ].map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div
                          className={cn(
                            "p-2 rounded-full",
                            recommendation.priority === "high" &&
                              "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400",
                            recommendation.priority === "medium" &&
                              "bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400",
                            recommendation.priority === "low" &&
                              "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
                          )}
                        >
                          <recommendation.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">{recommendation.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{recommendation.description}</p>
                          <Button variant="outline" size="sm" className="text-xs bg-transparent">
                            {recommendation.action}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {!showPredictions && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">AI Predictions Disabled</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Enable predictions in settings to see AI-powered insights and forecasts
                </p>
                <Button onClick={() => setShowPredictions(true)}>Enable Predictions</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Drill-down Modal */}
      <Dialog open={!!drillDownData} onOpenChange={() => setDrillDownData(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {drillDownData && (
            <>
              <DialogHeader>
                <DialogTitle>Detailed Analysis</DialogTitle>
                <DialogDescription>Deep dive into your {drillDownData.chartType} data</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <ChartContainer
                  config={{
                    mood: { label: "Mood", color: "hsl(var(--chart-1))" },
                    energy: { label: "Energy", color: "hsl(var(--chart-2))" },
                    stress: { label: "Stress", color: "hsl(var(--chart-3))" },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={drillDownData.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="mood" stroke="var(--color-mood)" strokeWidth={2} />
                      <Line type="monotone" dataKey="energy" stroke="var(--color-energy)" strokeWidth={2} />
                      <Line type="monotone" dataKey="stress" stroke="var(--color-stress)" strokeWidth={2} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </ChartContainer>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Statistical Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Mean:</span>
                        <span>{analytics.averageMood.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Std Dev:</span>
                        <span>{analytics.moodVolatility.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Range:</span>
                        <span>1.0 - 5.0</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Trend Analysis</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Direction:</span>
                        <span className={analytics.moodTrend > 0 ? "text-green-600" : "text-red-600"}>
                          {analytics.moodTrend > 0 ? "Improving" : "Declining"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Strength:</span>
                        <span>{Math.abs(analytics.moodTrend).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <p className="text-sm text-muted-foreground">
                      {analytics.moodTrend > 0
                        ? "Continue current positive practices"
                        : "Consider implementing mood-boosting activities"}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Anonymous Benchmarking */}
      {anonymousBenchmarking && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Community Benchmarks
            </CardTitle>
            <CardDescription>See how your patterns compare to anonymized community averages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold mb-1">{analytics.averageMood.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground mb-2">Your Average</div>
                <div className="text-xs text-muted-foreground">
                  Community: 3.8 ({analytics.averageMood > 3.8 ? "+" : ""}
                  {(analytics.averageMood - 3.8).toFixed(1)})
                </div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold mb-1">{analytics.averageWordsPerEntry}</div>
                <div className="text-sm text-muted-foreground mb-2">Words/Entry</div>
                <div className="text-xs text-muted-foreground">
                  Community: 245 ({analytics.averageWordsPerEntry > 245 ? "+" : ""}
                  {analytics.averageWordsPerEntry - 245})
                </div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold mb-1">{analytics.streakData.longest}</div>
                <div className="text-sm text-muted-foreground mb-2">Best Streak</div>
                <div className="text-xs text-muted-foreground">
                  Community: 18 ({analytics.streakData.longest > 18 ? "+" : ""}
                  {analytics.streakData.longest - 18})
                </div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold mb-1">{analytics.moodVolatility.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground mb-2">Volatility</div>
                <div className="text-xs text-muted-foreground">
                  Community: 1.4 ({analytics.moodVolatility > 1.4 ? "+" : ""}
                  {(analytics.moodVolatility - 1.4).toFixed(1)})
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export and Sharing Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Export & Share Analytics
          </CardTitle>
          <CardDescription>Generate reports and share your insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              PDF Report
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <FileText className="h-4 w-4" />
              CSV Data
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Share2 className="h-4 w-4" />
              Share Link
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Mail className="h-4 w-4" />
              Email Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
