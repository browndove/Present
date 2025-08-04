"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Send,
  Bot,
  User,
  Phone,
  AlertTriangle,
  BookOpen,
  Users,
  Clock,
  Shield,
  MessageSquare,
  Loader2,
  X,
  Brain,
  Stethoscope,
  FileText,
  BarChart3,
  TrendingUp,
  Heart,
  Target,
  CheckCircle,
  Activity,
  Bookmark,
  Search,
  Download,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ThumbsUp,
  ClockIcon,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  type?: "text" | "crisis" | "resource" | "assessment" | "summary"
  sentiment?: "positive" | "negative" | "neutral"
  riskLevel?: "low" | "moderate" | "high" | "crisis"
  bookmarked?: boolean
  reactions?: { type: string; count: number }[]
}

interface AssessmentQuestion {
  id: string
  question: string
  type: "scale" | "multiple" | "boolean"
  options?: string[]
  scale?: { min: number; max: number; labels: string[] }
}

interface AssessmentResult {
  type: "PHQ-9" | "GAD-7" | "Risk Assessment"
  score: number
  severity: "minimal" | "mild" | "moderate" | "severe"
  recommendations: string[]
  timestamp: Date
}

interface UserProgress {
  moodTrend: number[]
  assessmentHistory: AssessmentResult[]
  conversationInsights: {
    totalSessions: number
    averageSessionLength: number
    commonTopics: string[]
    improvementAreas: string[]
  }
  goals: {
    id: string
    title: string
    progress: number
    target: string
    completed: boolean
  }[]
}

// PHQ-9 Depression Assessment
const phq9Questions: AssessmentQuestion[] = [
  {
    id: "phq9_1",
    question: "Little interest or pleasure in doing things",
    type: "scale",
    scale: { min: 0, max: 3, labels: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  },
  {
    id: "phq9_2",
    question: "Feeling down, depressed, or hopeless",
    type: "scale",
    scale: { min: 0, max: 3, labels: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  },
  {
    id: "phq9_3",
    question: "Trouble falling or staying asleep, or sleeping too much",
    type: "scale",
    scale: { min: 0, max: 3, labels: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  },
  {
    id: "phq9_4",
    question: "Feeling tired or having little energy",
    type: "scale",
    scale: { min: 0, max: 3, labels: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  },
  {
    id: "phq9_5",
    question: "Poor appetite or overeating",
    type: "scale",
    scale: { min: 0, max: 3, labels: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  },
]

// GAD-7 Anxiety Assessment
const gad7Questions: AssessmentQuestion[] = [
  {
    id: "gad7_1",
    question: "Feeling nervous, anxious, or on edge",
    type: "scale",
    scale: { min: 0, max: 3, labels: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  },
  {
    id: "gad7_2",
    question: "Not being able to stop or control worrying",
    type: "scale",
    scale: { min: 0, max: 3, labels: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  },
  {
    id: "gad7_3",
    question: "Worrying too much about different things",
    type: "scale",
    scale: { min: 0, max: 3, labels: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  },
  {
    id: "gad7_4",
    question: "Trouble relaxing",
    type: "scale",
    scale: { min: 0, max: 3, labels: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  },
]

const quickActions = [
  {
    id: "academic-stress",
    label: "Academic Performance Anxiety",
    icon: BookOpen,
    prompt:
      "I'm experiencing significant stress related to academic performance and coursework demands. I would like guidance on managing these concerns.",
    category: "academic",
    description: "Coursework pressure and performance concerns",
  },
  {
    id: "generalized-anxiety",
    label: "Anxiety Management",
    icon: Brain,
    prompt:
      "I've been experiencing persistent anxiety that is affecting my daily functioning. I need strategies for managing these symptoms.",
    category: "mental-health",
    description: "General anxiety and stress management",
  },
  {
    id: "social-adjustment",
    label: "Social Integration Challenges",
    icon: Users,
    prompt:
      "I'm having difficulty with social integration and building meaningful connections in the university environment.",
    category: "social",
    description: "Social connections and peer relationships",
  },
  {
    id: "sleep-disorders",
    label: "Sleep Pattern Disruption",
    icon: Clock,
    prompt: "I'm experiencing sleep disturbances that are impacting my academic performance and overall well-being.",
    category: "wellness",
    description: "Sleep hygiene and rest patterns",
  },
]

const crisisResources = [
  {
    name: "National Suicide Prevention Lifeline",
    number: "988",
    description: "24/7 crisis intervention and suicide prevention",
    type: "Emergency",
    urgent: true,
  },
  {
    name: "Crisis Text Line",
    number: "Text HOME to 741741",
    description: "24/7 text-based crisis counseling services",
    type: "Emergency",
    urgent: true,
  },
  {
    name: "Campus Counseling and Psychological Services",
    number: "Contact Student Services",
    description: "Professional counseling services for enrolled students",
    type: "Campus Resource",
    urgent: false,
  },
]

export function MentalHealthChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Welcome to the Advanced Student Mental Health Support System. I'm equipped with evidence-based assessment tools and personalized intervention capabilities. I can help you with standardized screenings, track your progress, and provide tailored support. How would you like to begin today?",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
      sentiment: "neutral",
      riskLevel: "low",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showResources, setShowResources] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [currentAssessment, setCurrentAssessment] = useState<{
    type: "PHQ-9" | "GAD-7" | "Risk Assessment"
    questions: AssessmentQuestion[]
    currentQuestion: number
    responses: number[]
  } | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress>({
    moodTrend: [6, 5, 7, 6, 8, 7, 6, 8, 7, 9],
    assessmentHistory: [],
    conversationInsights: {
      totalSessions: 12,
      averageSessionLength: 15,
      commonTopics: ["Academic Stress", "Sleep Issues", "Social Anxiety"],
      improvementAreas: ["Coping Strategies", "Time Management"],
    },
    goals: [
      { id: "1", title: "Improve Sleep Schedule", progress: 75, target: "8 hours nightly", completed: false },
      { id: "2", title: "Practice Daily Mindfulness", progress: 60, target: "10 minutes daily", completed: false },
      { id: "3", title: "Reduce Academic Anxiety", progress: 40, target: "Weekly check-ins", completed: false },
    ],
  })
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [bookmarkedMessages, setBookmarkedMessages] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Responsive detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Advanced sentiment and risk analysis
  const analyzeSentimentAndRisk = (
    text: string,
  ): { sentiment: "positive" | "negative" | "neutral"; riskLevel: "low" | "moderate" | "high" | "crisis" } => {
    const crisisKeywords = ["suicide", "kill myself", "end it all", "not worth living", "hurt myself"]
    const highRiskKeywords = ["hopeless", "worthless", "can't go on", "overwhelming", "desperate"]
    const negativeKeywords = ["sad", "depressed", "anxious", "worried", "stressed", "tired", "lonely"]
    const positiveKeywords = ["better", "good", "happy", "hopeful", "improving", "grateful", "confident"]

    const lowerText = text.toLowerCase()

    if (crisisKeywords.some((keyword) => lowerText.includes(keyword))) {
      return { sentiment: "negative", riskLevel: "crisis" }
    }

    if (highRiskKeywords.some((keyword) => lowerText.includes(keyword))) {
      return { sentiment: "negative", riskLevel: "high" }
    }

    const negativeCount = negativeKeywords.filter((keyword) => lowerText.includes(keyword)).length
    const positiveCount = positiveKeywords.filter((keyword) => lowerText.includes(keyword)).length

    if (negativeCount > positiveCount + 1) {
      return { sentiment: "negative", riskLevel: negativeCount > 3 ? "moderate" : "low" }
    } else if (positiveCount > negativeCount) {
      return { sentiment: "positive", riskLevel: "low" }
    }

    return { sentiment: "neutral", riskLevel: "low" }
  }

  const generateAIResponse = async (userMessage: string, context?: any): Promise<string> => {
    try {
      const analysis = analyzeSentimentAndRisk(userMessage)
      const conversationHistory = messages
        .slice(-5)
        .map((m) => `${m.sender}: ${m.content}`)
        .join("\n")

      const contextPrompt = `You are an advanced mental health AI assistant with clinical assessment capabilities.

      User Analysis:
      - Sentiment: ${analysis.sentiment}
      - Risk Level: ${analysis.riskLevel}
      - Recent conversation context: ${conversationHistory}
      - User progress: ${userProgress.conversationInsights.commonTopics.join(", ")}

      Professional Guidelines:
      - Provide evidence-based, personalized responses
      - Reference user's progress and patterns when relevant
      - Suggest appropriate assessments (PHQ-9, GAD-7) when indicated
      - Use clinical terminology appropriately while remaining accessible
      - Offer specific, actionable interventions
      - Monitor for crisis indicators and respond appropriately
      - Maintain therapeutic boundaries and professional ethics

      ${analysis.riskLevel === "crisis" ? "CRISIS_DETECTED: Immediate intervention required." : ""}
      ${analysis.riskLevel === "high" ? "HIGH_RISK: Enhanced monitoring and resources needed." : ""}

      User message: "${userMessage}"`

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: contextPrompt,
        maxTokens: 400,
      })

      return text
    } catch (error) {
      console.error("Error generating AI response:", error)
      return "I apologize for the technical difficulty. Your mental health is important - please contact your campus counseling center or call 988 if you need immediate support."
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const analysis = analyzeSentimentAndRisk(content)
    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: "user",
      timestamp: new Date(),
      type: "text",
      sentiment: analysis.sentiment,
      riskLevel: analysis.riskLevel,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const aiResponse = await generateAIResponse(content)

      let messageType: "text" | "crisis" | "resource" | "assessment" = "text"
      let finalResponse = aiResponse

      if (aiResponse.startsWith("CRISIS_DETECTED:")) {
        messageType = "crisis"
        finalResponse = aiResponse.replace("CRISIS_DETECTED:", "").trim()
        setShowResources(true)
      } else if (aiResponse.includes("HIGH_RISK:")) {
        finalResponse = aiResponse.replace("HIGH_RISK:", "").trim()
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: finalResponse,
        sender: "ai",
        timestamp: new Date(),
        type: messageType,
        sentiment: "neutral",
        riskLevel: analysis.riskLevel === "crisis" ? "crisis" : "low",
      }

      setMessages((prev) => [...prev, aiMessage])

      // Update mood trend based on sentiment
      if (analysis.sentiment === "positive") {
        setUserProgress((prev) => ({
          ...prev,
          moodTrend: [...prev.moodTrend.slice(-9), Math.min(10, prev.moodTrend[prev.moodTrend.length - 1] + 1)],
        }))
      } else if (analysis.sentiment === "negative") {
        setUserProgress((prev) => ({
          ...prev,
          moodTrend: [...prev.moodTrend.slice(-9), Math.max(1, prev.moodTrend[prev.moodTrend.length - 1] - 1)],
        }))
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I apologize for the technical difficulty. Please contact your campus counseling services or call 988 if you need immediate support.",
        sender: "ai",
        timestamp: new Date(),
        type: "text",
        sentiment: "neutral",
        riskLevel: "low",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const startAssessment = (type: "PHQ-9" | "GAD-7") => {
    const questions = type === "PHQ-9" ? phq9Questions : gad7Questions
    setCurrentAssessment({
      type,
      questions,
      currentQuestion: 0,
      responses: [],
    })
    setActiveTab("assessment")
  }

  const handleAssessmentResponse = (response: number) => {
    if (!currentAssessment) return

    const newResponses = [...currentAssessment.responses, response]

    if (currentAssessment.currentQuestion < currentAssessment.questions.length - 1) {
      setCurrentAssessment({
        ...currentAssessment,
        currentQuestion: currentAssessment.currentQuestion + 1,
        responses: newResponses,
      })
    } else {
      // Complete assessment
      const totalScore = newResponses.reduce((sum, score) => sum + score, 0)
      let severity: "minimal" | "mild" | "moderate" | "severe"
      let recommendations: string[]

      if (currentAssessment.type === "PHQ-9") {
        if (totalScore <= 4) severity = "minimal"
        else if (totalScore <= 9) severity = "mild"
        else if (totalScore <= 14) severity = "moderate"
        else severity = "severe"

        recommendations = [
          severity === "minimal" ? "Continue current self-care practices" : "Consider professional counseling",
          "Maintain regular sleep schedule",
          "Engage in regular physical activity",
          severity === "severe" ? "Seek immediate professional help" : "Practice stress management techniques",
        ]
      } else {
        if (totalScore <= 4) severity = "minimal"
        else if (totalScore <= 9) severity = "mild"
        else if (totalScore <= 14) severity = "moderate"
        else severity = "severe"

        recommendations = [
          "Practice deep breathing exercises",
          "Consider mindfulness meditation",
          severity === "severe" ? "Consult with a mental health professional" : "Use progressive muscle relaxation",
          "Limit caffeine intake",
        ]
      }

      const result: AssessmentResult = {
        type: currentAssessment.type,
        score: totalScore,
        severity,
        recommendations,
        timestamp: new Date(),
      }

      setUserProgress((prev) => ({
        ...prev,
        assessmentHistory: [...prev.assessmentHistory, result],
      }))

      // Add assessment result message
      const assessmentMessage: Message = {
        id: Date.now().toString(),
        content: `Assessment Complete: ${currentAssessment.type}\n\nScore: ${totalScore}\nSeverity: ${severity.charAt(0).toUpperCase() + severity.slice(1)}\n\nRecommendations:\n${recommendations.map((r) => `• ${r}`).join("\n")}`,
        sender: "ai",
        timestamp: new Date(),
        type: "assessment",
        sentiment: "neutral",
        riskLevel: severity === "severe" ? "high" : "low",
      }

      setMessages((prev) => [...prev, assessmentMessage])
      setCurrentAssessment(null)
      setActiveTab("chat")
    }
  }

  const toggleBookmark = (messageId: string) => {
    setBookmarkedMessages((prev) =>
      prev.includes(messageId) ? prev.filter((id) => id !== messageId) : [...prev, messageId],
    )
  }

  const addReaction = (messageId: string, reactionType: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || []
          const existingReaction = reactions.find((r) => r.type === reactionType)
          if (existingReaction) {
            existingReaction.count++
          } else {
            reactions.push({ type: reactionType, count: 1 })
          }
          return { ...msg, reactions }
        }
        return msg
      }),
    )
  }

  const filteredMessages = searchQuery
    ? messages.filter((msg) => msg.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Professional Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white">
                  Advanced Mental Health Support
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  AI-powered assessments, progress tracking, and personalized interventions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                onClick={() => setShowResources(!showResources)}
                className="gap-2 bg-white dark:bg-gray-800"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">Crisis Resources</span>
              </Button>
              <Button variant="outline" size={isMobile ? "sm" : "default"} className="gap-2 bg-white dark:bg-gray-800">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>

          {/* Crisis Resources Panel */}
          {showResources && (
            <Card className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-red-800 dark:text-red-200 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Emergency Mental Health Resources
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowResources(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {crisisResources.map((resource, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-4 rounded-lg border bg-white dark:bg-gray-800",
                        resource.urgent ? "border-red-300 shadow-md" : "border-gray-300 dark:border-gray-600",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{resource.name}</h4>
                            <Badge variant={resource.urgent ? "destructive" : "secondary"} className="text-xs">
                              {resource.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                            {resource.description}
                          </p>
                          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded border">
                            <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                              {resource.number}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Interface with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <div className="overflow-x-auto">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5 bg-transparent h-auto p-0 space-x-0">
                <TabsTrigger
                  value="chat"
                  className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Chat</span>
                </TabsTrigger>
                <TabsTrigger
                  value="assessment"
                  className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent"
                >
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Assessment</span>
                </TabsTrigger>
                <TabsTrigger
                  value="progress"
                  className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Progress</span>
                </TabsTrigger>
                <TabsTrigger
                  value="resources"
                  className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent"
                >
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Resources</span>
                </TabsTrigger>
                <TabsTrigger
                  value="goals"
                  className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent"
                >
                  <Target className="h-4 w-4" />
                  <span className="hidden sm:inline">Goals</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-4">
              {/* Quick Actions Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <Button
                      onClick={() => startAssessment("PHQ-9")}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start gap-2 h-auto p-3"
                    >
                      <Stethoscope className="h-4 w-4 flex-shrink-0" />
                      <div className="text-left flex-1 min-w-0">
                        <div className="text-xs font-medium truncate">PHQ-9 Depression Screen</div>
                        <div className="text-xs text-gray-500 truncate">5-minute assessment</div>
                      </div>
                    </Button>
                    <Button
                      onClick={() => startAssessment("GAD-7")}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start gap-2 h-auto p-3"
                    >
                      <Brain className="h-4 w-4 flex-shrink-0" />
                      <div className="text-left flex-1 min-w-0">
                        <div className="text-xs font-medium truncate">GAD-7 Anxiety Screen</div>
                        <div className="text-xs text-gray-500 truncate">4-minute assessment</div>
                      </div>
                    </Button>

                    <Separator className="my-4" />

                    {quickActions.map((action) => (
                      <Button
                        key={action.id}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendMessage(action.prompt)}
                        className="w-full justify-start gap-2 h-auto p-3 text-left"
                        disabled={isLoading}
                      >
                        <action.icon className="h-4 w-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate">{action.label}</div>
                          <div className="text-xs text-gray-500 truncate">{action.description}</div>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Chat Interface */}
              <div className="lg:col-span-3">
                <Card className="h-[500px] sm:h-[600px] lg:h-[700px] flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
                          <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-base sm:text-lg">Advanced AI Support</CardTitle>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            Clinical assessments • Progress tracking • Crisis detection
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                          className={cn(isVoiceEnabled && "bg-blue-100 dark:bg-blue-900")}
                        >
                          {isVoiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                        </Button>
                        <div className="relative">
                          <Search className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input
                            placeholder="Search messages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8 w-32 sm:w-40 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Enhanced Messages */}
                  <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-3 sm:gap-4",
                          message.sender === "user" ? "justify-end" : "justify-start",
                        )}
                      >
                        {message.sender === "ai" && (
                          <div className="flex-shrink-0">
                            <div
                              className={cn(
                                "p-2 rounded-lg border",
                                message.type === "crisis"
                                  ? "bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700"
                                  : message.type === "assessment"
                                    ? "bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700"
                                    : "bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700",
                              )}
                            >
                              <Bot
                                className={cn(
                                  "h-4 w-4",
                                  message.type === "crisis"
                                    ? "text-red-600 dark:text-red-400"
                                    : message.type === "assessment"
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-blue-600 dark:text-blue-400",
                                )}
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex-1 max-w-[85%] sm:max-w-[80%]">
                          <div
                            className={cn(
                              "rounded-lg px-4 py-3 shadow-sm",
                              message.sender === "user"
                                ? "bg-blue-600 text-white ml-auto"
                                : message.type === "crisis"
                                  ? "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-gray-900 dark:text-white"
                                  : message.type === "assessment"
                                    ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-gray-900 dark:text-white"
                                    : "bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white",
                            )}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

                            {/* Message metadata */}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <p
                                  className={cn(
                                    "text-xs opacity-70",
                                    message.sender === "user" ? "text-blue-100" : "text-gray-500 dark:text-gray-400",
                                  )}
                                >
                                  {message.timestamp.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                                {message.riskLevel && message.riskLevel !== "low" && (
                                  <Badge
                                    variant={message.riskLevel === "crisis" ? "destructive" : "secondary"}
                                    className="text-xs"
                                  >
                                    {message.riskLevel}
                                  </Badge>
                                )}
                              </div>

                              {/* Message actions */}
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleBookmark(message.id)}
                                  className={cn(
                                    "h-6 w-6 p-0",
                                    bookmarkedMessages.includes(message.id) && "text-yellow-500",
                                  )}
                                >
                                  <Bookmark className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => addReaction(message.id, "helpful")}
                                  className="h-6 w-6 p-0"
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Reactions */}
                            {message.reactions && message.reactions.length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {message.reactions.map((reaction, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    👍 {reaction.count}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {message.sender === "user" && (
                          <div className="flex-shrink-0">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
                              <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex gap-3 sm:gap-4 justify-start">
                        <div className="flex-shrink-0">
                          <div className="p-2 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
                            <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 shadow-sm">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-gray-600 dark:text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Analyzing and responding...
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </CardContent>

                  {/* Enhanced Input */}
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 bg-gray-50 dark:bg-gray-800">
                    <div className="flex gap-2 sm:gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsListening(!isListening)}
                        className={cn(
                          "px-3",
                          isListening && "bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700",
                        )}
                        disabled={!isVoiceEnabled}
                      >
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                      <Input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Share your thoughts, concerns, or questions..."
                        className="flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isLoading}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage(inputValue)
                          }
                        }}
                      />
                      <Button
                        onClick={() => handleSendMessage(inputValue)}
                        disabled={!inputValue.trim() || isLoading}
                        size={isMobile ? "sm" : "default"}
                        className="px-3 sm:px-4 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Press Enter to send • Voice input {isVoiceEnabled ? "enabled" : "disabled"} • Confidential
                      conversation
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Assessment Tab */}
          <TabsContent value="assessment" className="space-y-6">
            {currentAssessment ? (
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {currentAssessment.type} Assessment
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <Progress
                      value={(currentAssessment.currentQuestion / currentAssessment.questions.length) * 100}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {currentAssessment.currentQuestion + 1} of {currentAssessment.questions.length}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Over the last 2 weeks, how often have you been bothered by:
                    </h3>
                    <p className="text-base mb-6">
                      {currentAssessment.questions[currentAssessment.currentQuestion].question}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {currentAssessment.questions[currentAssessment.currentQuestion].scale?.labels.map(
                      (label, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={() => handleAssessmentResponse(index)}
                          className="w-full justify-start text-left h-auto p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium">{index}</span>
                            </div>
                            <span>{label}</span>
                          </div>
                        </Button>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="max-w-4xl mx-auto">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Stethoscope className="h-5 w-5" />
                        PHQ-9 Depression Screening
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        A 9-question screening tool for depression symptoms over the past 2 weeks.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm">
                          <ClockIcon className="h-4 w-4" />
                          <span>5 minutes</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Shield className="h-4 w-4" />
                          <span>Clinically validated</span>
                        </div>
                        <Button onClick={() => startAssessment("PHQ-9")} className="w-full">
                          Start PHQ-9 Assessment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        GAD-7 Anxiety Screening
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        A 7-question screening tool for generalized anxiety disorder symptoms.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm">
                          <ClockIcon className="h-4 w-4" />
                          <span>4 minutes</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Shield className="h-4 w-4" />
                          <span>Clinically validated</span>
                        </div>
                        <Button onClick={() => startAssessment("GAD-7")} className="w-full">
                          Start GAD-7 Assessment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {userProgress.assessmentHistory.length > 0 && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Assessment History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userProgress.assessmentHistory.map((result, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-medium">{result.type}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {result.timestamp.toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">Score: {result.score}</div>
                              <Badge variant={result.severity === "severe" ? "destructive" : "secondary"}>
                                {result.severity}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Mood Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Current Mood</span>
                      <span className="font-medium">
                        {userProgress.moodTrend[userProgress.moodTrend.length - 1]}/10
                      </span>
                    </div>
                    <Progress value={userProgress.moodTrend[userProgress.moodTrend.length - 1] * 10} />
                    <div className="grid grid-cols-10 gap-1 mt-4">
                      {userProgress.moodTrend.map((mood, index) => (
                        <div
                          key={index}
                          className={cn(
                            "h-8 rounded",
                            mood >= 7 ? "bg-green-500" : mood >= 4 ? "bg-yellow-500" : "bg-red-500",
                          )}
                          style={{ height: `${mood * 4}px` }}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Conversation Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Sessions</span>
                      <span className="font-medium">{userProgress.conversationInsights.totalSessions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Session Length</span>
                      <span className="font-medium">{userProgress.conversationInsights.averageSessionLength} min</span>
                    </div>
                    <div>
                      <span className="text-sm block mb-2">Common Topics</span>
                      <div className="flex flex-wrap gap-2">
                        {userProgress.conversationInsights.commonTopics.map((topic, index) => (
                          <Badge key={index} variant="secondary">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Personal Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {userProgress.goals.map((goal) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{goal.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{goal.progress}%</span>
                          {goal.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                        </div>
                      </div>
                      <Progress value={goal.progress} />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Target: {goal.target}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Self-Care Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <span>Guided Breathing Exercise</span>
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <span>Progressive Muscle Relaxation</span>
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <span>Mindfulness Meditation</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Educational Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <span>Understanding Depression</span>
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <span>Managing Anxiety</span>
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <span>Stress Management</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Support Networks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <span>Peer Support Groups</span>
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <span>Campus Counseling</span>
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <span>Professional Referrals</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
