"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  User,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Heart,
  Brain,
  Activity,
  AlertTriangle,
  FileText,
  Users,
  Target,
  TrendingUp,
  Star,
  Award,
  Home,
  Globe,
  MessageSquare,
  Video,
  Edit,
  Save,
  Plus,
  Download,
  Eye,
  EyeOff,
  CheckCircle,
  Camera,
  School,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Enhanced interfaces for Ghanaian context
interface StudentProfile {
  // Personal Information
  id: string
  studentId: string
  firstName: string
  middleName?: string
  lastName: string
  preferredName?: string
  dateOfBirth: Date
  age: number
  gender: "Male" | "Female" | "Non-binary" | "Prefer not to say"
  nationality: string
  region: string
  hometown: string
  currentAddress: {
    street: string
    city: string
    region: string
    digitalAddress?: string // Ghana Post GPS
    nearestLandmark?: string
  }
  permanentAddress: {
    street: string
    city: string
    region: string
    digitalAddress?: string
    nearestLandmark?: string
  }

  // Contact Information
  phoneNumber: string
  alternatePhone?: string
  email: string
  alternateEmail?: string

  // Cultural & Religious Background
  ethnicity: string
  primaryLanguage: string
  otherLanguages: string[]
  religion?: string
  denomination?: string
  culturalPractices?: string[]

  // Family Information
  maritalStatus: "Single" | "Married" | "Divorced" | "Widowed" | "Separated"
  numberOfChildren?: number
  fatherName?: string
  fatherOccupation?: string
  fatherPhone?: string
  motherName?: string
  motherOccupation?: string
  motherPhone?: string
  guardianName?: string
  guardianRelationship?: string
  guardianPhone?: string
  numberOfSiblings: number
  birthOrder: number
  familyIncome?: "Below GHS 1,000" | "GHS 1,000-3,000" | "GHS 3,000-5,000" | "GHS 5,000-10,000" | "Above GHS 10,000"

  // Academic Information
  university: string
  campus?: string
  faculty: string
  department: string
  programme: string
  level: "Level 100" | "Level 200" | "Level 300" | "Level 400" | "Postgraduate"
  yearOfAdmission: number
  expectedGraduation: number
  currentGPA?: number
  cumulativeGPA?: number
  academicStanding: "Excellent" | "Very Good" | "Good" | "Satisfactory" | "Probation" | "Suspended"
  scholarships?: string[]
  previousEducation: {
    seniorHighSchool: string
    shsProgram:
      | "General Arts"
      | "General Science"
      | "Business"
      | "Visual Arts"
      | "Home Economics"
      | "Technical"
      | "Agricultural Science"
    wasceResults?: string
    juniorHighSchool?: string
    primarySchool?: string
  }

  // Health & Wellness
  bloodGroup?: string
  genotype?: string
  allergies?: string[]
  chronicConditions?: string[]
  currentMedications?: string[]
  disabilities?: string[]
  mentalHealthHistory?: string[]
  substanceUse?: {
    alcohol: "Never" | "Occasionally" | "Regularly" | "Frequently"
    tobacco: "Never" | "Occasionally" | "Regularly" | "Frequently"
    other?: string
  }

  // Counseling Information
  riskLevel: "Low" | "Medium" | "High" | "Critical"
  status: "Active" | "At-Risk" | "Improving" | "Stable" | "Crisis" | "Inactive"
  counselorAssigned: string
  supervisorAssigned?: string
  firstSessionDate: Date
  lastSessionDate?: Date
  nextSessionDate?: Date
  totalSessions: number
  sessionFrequency: "Weekly" | "Bi-weekly" | "Monthly" | "As needed"
  counselingType: "Individual" | "Group" | "Family" | "Couples" | "Crisis"
  referralSource: "Self" | "Faculty" | "Friend" | "Family" | "Medical" | "Academic" | "Disciplinary"
  presentingConcerns: string[]
  treatmentGoals: string[]
  interventionsUsed: string[]

  // Assessments & Scores
  assessments: {
    depressionScore?: number
    anxietyScore?: number
    stressScore?: number
    wellbeingScore?: number
    academicSelfEfficacy?: number
    socialSupport?: number
    resilienceScore?: number
    lastAssessmentDate?: Date
  }

  // Social & Economic
  accommodationType: "University Hostel" | "Private Hostel" | "Home" | "Rented Apartment" | "Family House"
  transportationMode: "Walking" | "Bicycle" | "Trotro" | "Taxi" | "Uber/Bolt" | "Private Car" | "University Bus"
  financialSupport:
    | "Parents"
    | "Scholarship"
    | "Student Loan"
    | "Part-time Job"
    | "Business"
    | "Relatives"
    | "Multiple Sources"
  partTimeJob?: string
  monthlyAllowance?: string
  financialStress: "None" | "Mild" | "Moderate" | "Severe"

  // Interests & Activities
  hobbies: string[]
  sportsActivities: string[]
  clubMemberships: string[]
  volunteerWork: string[]
  leadershipRoles: string[]
  talents: string[]

  // Technology & Digital
  internetAccess: "Excellent" | "Good" | "Fair" | "Poor" | "None"
  deviceOwnership: string[]
  socialMediaUsage: "Heavy" | "Moderate" | "Light" | "None"
  onlineLearningComfort: "Very Comfortable" | "Comfortable" | "Neutral" | "Uncomfortable" | "Very Uncomfortable"

  // Goals & Aspirations
  careerGoals: string[]
  shortTermGoals: string[]
  longTermGoals: string[]
  postGraduationPlans:
    | "Employment"
    | "Further Studies"
    | "Entrepreneurship"
    | "National Service"
    | "Travel"
    | "Undecided"
  dreamJob?: string
  roleModels?: string[]

  // Support System
  closeFriends: number
  socialSupport: "Strong" | "Moderate" | "Weak" | "None"
  campusConnections: string[]
  mentors?: string[]
  supportGroups?: string[]

  // Crisis Information
  suicidalIdeation: boolean
  selfHarmHistory: boolean
  crisisContacts: {
    name: string
    relationship: string
    phone: string
    isPrimary: boolean
  }[]
  safetyPlan?: string
  warningSigns?: string[]
  copingStrategies?: string[]

  // Administrative
  consentGiven: boolean
  parentalConsentRequired: boolean
  confidentialityAgreed: boolean
  recordsReleaseConsent: boolean
  emergencyContactConsent: boolean
  photographyConsent: boolean
  researchParticipationConsent: boolean

  // Metadata
  createdAt: Date
  updatedAt: Date
  lastLoginDate?: Date
  profileCompleteness: number
  verificationStatus: "Pending" | "Verified" | "Incomplete"
  notes: string
  flags: string[]
  tags: string[]
}

// Mock data for Ghanaian student
const mockStudent: StudentProfile = {
  id: "student_001",
  studentId: "10876543",
  firstName: "Akosua",
  middleName: "Ama",
  lastName: "Asante",
  preferredName: "Kosi",
  dateOfBirth: new Date("2002-03-15"),
  age: 22,
  gender: "Female",
  nationality: "Ghanaian",
  region: "Ashanti Region",
  hometown: "Kumasi",
  currentAddress: {
    street: "Block A, Room 205, Unity Hall",
    city: "Legon",
    region: "Greater Accra Region",
    digitalAddress: "GA-456-7890",
    nearestLandmark: "Near University of Ghana Main Gate",
  },
  permanentAddress: {
    street: "House No. 15, Adum",
    city: "Kumasi",
    region: "Ashanti Region",
    digitalAddress: "AK-123-4567",
    nearestLandmark: "Behind Kumasi Central Market",
  },

  phoneNumber: "+233 24 567 8901",
  alternatePhone: "+233 20 123 4567",
  email: "akosua.asante@st.ug.edu.gh",
  alternateEmail: "kosi.asante@gmail.com",

  ethnicity: "Akan",
  primaryLanguage: "Twi",
  otherLanguages: ["English", "Ga", "Hausa"],
  religion: "Christianity",
  denomination: "Methodist",
  culturalPractices: ["Traditional naming ceremonies", "Adae festivals", "Kente weaving"],

  maritalStatus: "Single",
  numberOfChildren: 0,
  fatherName: "Kwame Asante",
  fatherOccupation: "Teacher",
  fatherPhone: "+233 24 111 2222",
  motherName: "Ama Serwaa",
  motherOccupation: "Trader",
  motherPhone: "+233 20 333 4444",
  numberOfSiblings: 3,
  birthOrder: 2,
  familyIncome: "GHS 3,000-5,000",

  university: "University of Ghana",
  campus: "Legon",
  faculty: "Faculty of Arts",
  department: "Department of Psychology",
  programme: "BA Psychology",
  level: "Level 300",
  yearOfAdmission: 2021,
  expectedGraduation: 2025,
  currentGPA: 3.2,
  cumulativeGPA: 3.1,
  academicStanding: "Good",
  scholarships: ["Ghana Education Trust Fund"],
  previousEducation: {
    seniorHighSchool: "Opoku Ware School",
    shsProgram: "General Arts",
    wasceResults: "6A's 2B's",
    juniorHighSchool: "Kumasi Anglican JHS",
    primarySchool: "Kumasi Methodist Primary",
  },

  bloodGroup: "O+",
  genotype: "AA",
  allergies: ["Peanuts"],
  chronicConditions: [],
  currentMedications: [],
  disabilities: [],
  mentalHealthHistory: ["Anxiety", "Academic stress"],
  substanceUse: {
    alcohol: "Occasionally",
    tobacco: "Never",
  },

  riskLevel: "Medium",
  status: "Active",
  counselorAssigned: "Dr. Jennifer Osei",
  firstSessionDate: new Date("2024-01-15"),
  lastSessionDate: new Date("2024-11-20"),
  nextSessionDate: new Date("2024-12-05"),
  totalSessions: 8,
  sessionFrequency: "Bi-weekly",
  counselingType: "Individual",
  referralSource: "Self",
  presentingConcerns: ["Academic pressure", "Family expectations", "Career uncertainty", "Social anxiety"],
  treatmentGoals: [
    "Improve stress management",
    "Enhance academic performance",
    "Build confidence",
    "Develop coping strategies",
  ],
  interventionsUsed: ["Cognitive Behavioral Therapy", "Mindfulness techniques", "Study skills training"],

  assessments: {
    depressionScore: 12,
    anxietyScore: 18,
    stressScore: 22,
    wellbeingScore: 65,
    academicSelfEfficacy: 70,
    socialSupport: 75,
    resilienceScore: 68,
    lastAssessmentDate: new Date("2024-11-15"),
  },

  accommodationType: "University Hostel",
  transportationMode: "Trotro",
  financialSupport: "Multiple Sources",
  partTimeJob: "Tutorial services",
  monthlyAllowance: "GHS 800",
  financialStress: "Moderate",

  hobbies: ["Reading", "Dancing", "Cooking", "Listening to music"],
  sportsActivities: ["Netball", "Volleyball"],
  clubMemberships: ["Psychology Students Association", "Methodist Students Union", "Debate Society"],
  volunteerWork: ["Community health education", "Literacy programs"],
  leadershipRoles: ["Class Representative", "Hall Prefect"],
  talents: ["Public speaking", "Traditional dancing", "Singing"],

  internetAccess: "Good",
  deviceOwnership: ["Smartphone", "Laptop"],
  socialMediaUsage: "Moderate",
  onlineLearningComfort: "Comfortable",

  careerGoals: ["Clinical Psychologist", "Counseling Psychologist"],
  shortTermGoals: ["Improve GPA to 3.5", "Complete internship", "Learn French"],
  longTermGoals: ["Pursue Masters degree", "Open private practice", "Contribute to mental health awareness"],
  postGraduationPlans: "Further Studies",
  dreamJob: "Clinical Psychologist at Korle-Bu Teaching Hospital",
  roleModels: ["Prof. Angela Ofori-Atta", "Dr. Akwasi Osei"],

  closeFriends: 5,
  socialSupport: "Moderate",
  campusConnections: ["Study group members", "Hall mates", "Course mates"],
  mentors: ["Dr. Jennifer Osei", "Prof. Kwame Sakyi"],
  supportGroups: ["Psychology Students Support Group"],

  suicidalIdeation: false,
  selfHarmHistory: false,
  crisisContacts: [
    {
      name: "Ama Serwaa",
      relationship: "Mother",
      phone: "+233 20 333 4444",
      isPrimary: true,
    },
    {
      name: "Kwame Asante",
      relationship: "Father",
      phone: "+233 24 111 2222",
      isPrimary: false,
    },
    {
      name: "Yaa Asante",
      relationship: "Sister",
      phone: "+233 26 555 6666",
      isPrimary: false,
    },
  ],
  safetyPlan: "Contact counselor, call family, use breathing exercises, go to safe space",
  warningSignsL: ["Isolation", "Sleep disturbances", "Loss of appetite", "Excessive worry"],
  copingStrategies: ["Deep breathing", "Prayer", "Talking to friends", "Listening to music", "Exercise"],

  consentGiven: true,
  parentalConsentRequired: false,
  confidentialityAgreed: true,
  recordsReleaseConsent: true,
  emergencyContactConsent: true,
  photographyConsent: true,
  researchParticipationConsent: false,

  createdAt: new Date("2024-01-10"),
  updatedAt: new Date("2024-11-25"),
  lastLoginDate: new Date("2024-11-24"),
  profileCompleteness: 92,
  verificationStatus: "Verified",
  notes:
    "Highly motivated student with strong family support. Responds well to CBT interventions. Shows good progress in managing academic stress.",
  flags: ["Academic pressure", "Financial stress"],
  tags: ["High achiever", "Family oriented", "Culturally aware", "Resilient"],
}

// Ghanaian regions and cities
const ghanaianRegions = [
  "Greater Accra Region",
  "Ashanti Region",
  "Western Region",
  "Central Region",
  "Eastern Region",
  "Volta Region",
  "Northern Region",
  "Upper East Region",
  "Upper West Region",
  "Brong-Ahafo Region",
  "Western North Region",
  "Ahafo Region",
  "Bono Region",
  "Bono East Region",
  "Oti Region",
  "North East Region",
  "Savannah Region",
]

const ghanaianUniversities = [
  "University of Ghana",
  "Kwame Nkrumah University of Science and Technology",
  "University of Cape Coast",
  "University for Development Studies",
  "University of Education, Winneba",
  "Ghana Institute of Management and Public Administration",
  "Ashesi University",
  "Central University",
  "Presbyterian University College",
  "Valley View University",
  "Academic City University College",
  "Ghana Communication Technology University",
  "University of Professional Studies",
  "Accra Technical University",
  "Ho Technical University",
]

const ghanaianLanguages = [
  "Twi",
  "Ga",
  "Ewe",
  "Dagbani",
  "Hausa",
  "Fante",
  "Nzema",
  "Kasem",
  "Dagaare",
  "Gonja",
  "Mampruli",
  "Kusaal",
  "Buli",
  "Sissala",
  "English",
]

export default function StudentProfilePage() {
  const [student, setStudent] = useState<StudentProfile>(mockStudent)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false)
  const [showAddNoteModal, setShowAddNoteModal] = useState(false)
  const [showAssessmentModal, setShowAssessmentModal] = useState(false)
  const [showCrisisModal, setShowCrisisModal] = useState(false)
  const [newNote, setNewNote] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  // Mobile detection
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Crisis":
        return "bg-red-500 text-white"
      case "At-Risk":
        return "bg-red-100 text-red-800"
      case "Active":
        return "bg-blue-100 text-blue-800"
      case "Improving":
        return "bg-green-100 text-green-800"
      case "Stable":
        return "bg-purple-100 text-purple-800"
      case "Inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const calculateAge = (birthDate: Date) => {
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const getAssessmentColor = (score: number, type: string) => {
    if (
      type === "wellbeing" ||
      type === "academicSelfEfficacy" ||
      type === "socialSupport" ||
      type === "resilienceScore"
    ) {
      // Higher is better
      if (score >= 80) return "text-green-600"
      if (score >= 60) return "text-yellow-600"
      return "text-red-600"
    } else {
      // Lower is better (depression, anxiety, stress)
      if (score <= 10) return "text-green-600"
      if (score <= 20) return "text-yellow-600"
      return "text-red-600"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" />
                  <AvatarFallback className="text-lg sm:text-xl font-bold bg-blue-100 text-blue-700">
                    {student.firstName[0]}
                    {student.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -bottom-1 -right-1 h-6 w-6 p-0 bg-white border border-gray-200 rounded-full"
                >
                  <Camera className="h-3 w-3" />
                </Button>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {student.firstName} {student.middleName} {student.lastName}
                  </h1>
                  {student.preferredName && (
                    <Badge variant="secondary" className="text-xs">
                      "{student.preferredName}"
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                  <span>{student.studentId}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{student.programme}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{student.level}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getRiskColor(student.riskLevel)} variant="secondary">
                    {student.riskLevel} Risk
                  </Badge>
                  <Badge className={getStatusColor(student.status)} variant="secondary">
                    {student.status}
                  </Badge>
                  {student.verificationStatus === "Verified" && (
                    <Badge className="bg-green-100 text-green-800" variant="secondary">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}>
                {showSensitiveInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant={isEditing ? "default" : "outline"} size="sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                {isEditing ? "Save" : "Edit"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{student.totalSessions}</div>
              <div className="text-xs text-gray-600">Total Sessions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{student.currentGPA?.toFixed(1) || "N/A"}</div>
              <div className="text-xs text-gray-600">Current GPA</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{student.assessments.wellbeingScore || "N/A"}</div>
              <div className="text-xs text-gray-600">Wellbeing Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{student.age}</div>
              <div className="text-xs text-gray-600">Age (Years)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{student.assessments.stressScore || "N/A"}</div>
              <div className="text-xs text-gray-600">Stress Level</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{student.profileCompleteness}%</div>
              <div className="text-xs text-gray-600">Profile Complete</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-8">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="personal" className="text-xs sm:text-sm">
              Personal
            </TabsTrigger>
            <TabsTrigger value="academic" className="text-xs sm:text-sm">
              Academic
            </TabsTrigger>
            <TabsTrigger value="counseling" className="text-xs sm:text-sm">
              Counseling
            </TabsTrigger>
            <TabsTrigger value="health" className="text-xs sm:text-sm">
              Health
            </TabsTrigger>
            <TabsTrigger value="social" className="text-xs sm:text-sm">
              Social
            </TabsTrigger>
            <TabsTrigger value="assessments" className="text-xs sm:text-sm">
              Assessments
            </TabsTrigger>
            <TabsTrigger value="crisis" className="text-xs sm:text-sm">
              Crisis
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Summary */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                      <p className="text-sm">
                        {student.firstName} {student.middleName} {student.lastName}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Student ID</Label>
                      <p className="text-sm">{student.studentId}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Programme</Label>
                      <p className="text-sm">{student.programme}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Level</Label>
                      <p className="text-sm">{student.level}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">University</Label>
                      <p className="text-sm">{student.university}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Campus</Label>
                      <p className="text-sm">{student.campus}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Hometown</Label>
                      <p className="text-sm">
                        {student.hometown}, {student.region}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Primary Language</Label>
                      <p className="text-sm">{student.primaryLanguage}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Label className="text-sm font-medium text-gray-700">Presenting Concerns</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {student.presentingConcerns.map((concern, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {concern}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Treatment Goals</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {student.treatmentGoals.map((goal, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Target className="h-3 w-3 mr-1" />
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Last Session</p>
                        <p className="text-xs text-gray-600">{formatDate(student.lastSessionDate!)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Assessment Completed</p>
                        <p className="text-xs text-gray-600">{formatDate(student.assessments.lastAssessmentDate!)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Profile Updated</p>
                        <p className="text-xs text-gray-600">{formatDate(student.updatedAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Next Session</p>
                        <p className="text-xs text-gray-600">{formatDate(student.nextSessionDate!)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button size="sm" className="w-full" onClick={() => setShowAddNoteModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Wellbeing Score</Label>
                      <span
                        className={cn(
                          "text-sm font-bold",
                          getAssessmentColor(student.assessments.wellbeingScore!, "wellbeing"),
                        )}
                      >
                        {student.assessments.wellbeingScore}/100
                      </span>
                    </div>
                    <Progress value={student.assessments.wellbeingScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Academic Self-Efficacy</Label>
                      <span
                        className={cn(
                          "text-sm font-bold",
                          getAssessmentColor(student.assessments.academicSelfEfficacy!, "academicSelfEfficacy"),
                        )}
                      >
                        {student.assessments.academicSelfEfficacy}/100
                      </span>
                    </div>
                    <Progress value={student.assessments.academicSelfEfficacy} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Social Support</Label>
                      <span
                        className={cn(
                          "text-sm font-bold",
                          getAssessmentColor(student.assessments.socialSupport!, "socialSupport"),
                        )}
                      >
                        {student.assessments.socialSupport}/100
                      </span>
                    </div>
                    <Progress value={student.assessments.socialSupport} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Resilience Score</Label>
                      <span
                        className={cn(
                          "text-sm font-bold",
                          getAssessmentColor(student.assessments.resilienceScore!, "resilienceScore"),
                        )}
                      >
                        {student.assessments.resilienceScore}/100
                      </span>
                    </div>
                    <Progress value={student.assessments.resilienceScore} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>First Name</Label>
                      {isEditing ? (
                        <Input
                          value={student.firstName}
                          onChange={(e) => setStudent({ ...student, firstName: e.target.value })}
                        />
                      ) : (
                        <p className="text-sm mt-1">{student.firstName}</p>
                      )}
                    </div>
                    <div>
                      <Label>Middle Name</Label>
                      {isEditing ? (
                        <Input
                          value={student.middleName || ""}
                          onChange={(e) => setStudent({ ...student, middleName: e.target.value })}
                        />
                      ) : (
                        <p className="text-sm mt-1">{student.middleName || "N/A"}</p>
                      )}
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      {isEditing ? (
                        <Input
                          value={student.lastName}
                          onChange={(e) => setStudent({ ...student, lastName: e.target.value })}
                        />
                      ) : (
                        <p className="text-sm mt-1">{student.lastName}</p>
                      )}
                    </div>
                    <div>
                      <Label>Preferred Name</Label>
                      {isEditing ? (
                        <Input
                          value={student.preferredName || ""}
                          onChange={(e) => setStudent({ ...student, preferredName: e.target.value })}
                        />
                      ) : (
                        <p className="text-sm mt-1">{student.preferredName || "N/A"}</p>
                      )}
                    </div>
                    <div>
                      <Label>Date of Birth</Label>
                      {isEditing ? (
                        <Input type="date" value={student.dateOfBirth.toISOString().split("T")[0]} />
                      ) : (
                        <p className="text-sm mt-1">
                          {formatDate(student.dateOfBirth)} ({student.age} years)
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>Gender</Label>
                      {isEditing ? (
                        <Select value={student.gender}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Non-binary">Non-binary</SelectItem>
                            <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm mt-1">{student.gender}</p>
                      )}
                    </div>
                    <div>
                      <Label>Nationality</Label>
                      <p className="text-sm mt-1">{student.nationality}</p>
                    </div>
                    <div>
                      <Label>Marital Status</Label>
                      <p className="text-sm mt-1">{student.maritalStatus}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Primary Phone</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{student.phoneNumber}</span>
                    </div>
                  </div>
                  {student.alternatePhone && (
                    <div>
                      <Label>Alternate Phone</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{student.alternatePhone}</span>
                      </div>
                    </div>
                  )}
                  <div>
                    <Label>Primary Email</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{student.email}</span>
                    </div>
                  </div>
                  {student.alternateEmail && (
                    <div>
                      <Label>Alternate Email</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{student.alternateEmail}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Address Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="font-medium">Current Address</Label>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">{student.currentAddress.street}</p>
                      <p className="text-sm">
                        {student.currentAddress.city}, {student.currentAddress.region}
                      </p>
                      {student.currentAddress.digitalAddress && (
                        <p className="text-sm text-gray-600">GPS: {student.currentAddress.digitalAddress}</p>
                      )}
                      {student.currentAddress.nearestLandmark && (
                        <p className="text-sm text-gray-600">Near: {student.currentAddress.nearestLandmark}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="font-medium">Permanent Address</Label>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">{student.permanentAddress.street}</p>
                      <p className="text-sm">
                        {student.permanentAddress.city}, {student.permanentAddress.region}
                      </p>
                      {student.permanentAddress.digitalAddress && (
                        <p className="text-sm text-gray-600">GPS: {student.permanentAddress.digitalAddress}</p>
                      )}
                      {student.permanentAddress.nearestLandmark && (
                        <p className="text-sm text-gray-600">Near: {student.permanentAddress.nearestLandmark}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cultural & Religious Background */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Cultural & Religious Background
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Ethnicity</Label>
                    <p className="text-sm mt-1">{student.ethnicity}</p>
                  </div>
                  <div>
                    <Label>Primary Language</Label>
                    <p className="text-sm mt-1">{student.primaryLanguage}</p>
                  </div>
                  <div>
                    <Label>Other Languages</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {student.otherLanguages.map((lang, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Religion</Label>
                    <p className="text-sm mt-1">{student.religion}</p>
                  </div>
                  {student.denomination && (
                    <div>
                      <Label>Denomination</Label>
                      <p className="text-sm mt-1">{student.denomination}</p>
                    </div>
                  )}
                  {student.culturalPractices && student.culturalPractices.length > 0 && (
                    <div>
                      <Label>Cultural Practices</Label>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {student.culturalPractices.map((practice, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {practice}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Academic Information Tab */}
          <TabsContent value="academic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Academic Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Current Academic Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>University</Label>
                      <p className="text-sm mt-1">{student.university}</p>
                    </div>
                    <div>
                      <Label>Campus</Label>
                      <p className="text-sm mt-1">{student.campus}</p>
                    </div>
                    <div>
                      <Label>Faculty</Label>
                      <p className="text-sm mt-1">{student.faculty}</p>
                    </div>
                    <div>
                      <Label>Department</Label>
                      <p className="text-sm mt-1">{student.department}</p>
                    </div>
                    <div>
                      <Label>Programme</Label>
                      <p className="text-sm mt-1">{student.programme}</p>
                    </div>
                    <div>
                      <Label>Current Level</Label>
                      <p className="text-sm mt-1">{student.level}</p>
                    </div>
                    <div>
                      <Label>Year of Admission</Label>
                      <p className="text-sm mt-1">{student.yearOfAdmission}</p>
                    </div>
                    <div>
                      <Label>Expected Graduation</Label>
                      <p className="text-sm mt-1">{student.expectedGraduation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Academic Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Academic Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Current GPA</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-bold text-blue-600">{student.currentGPA?.toFixed(2)}</span>
                        <span className="text-sm text-gray-600">/ 4.0</span>
                      </div>
                    </div>
                    <div>
                      <Label>Cumulative GPA</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-bold text-green-600">{student.cumulativeGPA?.toFixed(2)}</span>
                        <span className="text-sm text-gray-600">/ 4.0</span>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Academic Standing</Label>
                      <Badge
                        className={cn(
                          "mt-2",
                          student.academicStanding === "Excellent"
                            ? "bg-green-100 text-green-800"
                            : student.academicStanding === "Very Good"
                              ? "bg-blue-100 text-blue-800"
                              : student.academicStanding === "Good"
                                ? "bg-yellow-100 text-yellow-800"
                                : student.academicStanding === "Satisfactory"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-red-100 text-red-800",
                        )}
                        variant="secondary"
                      >
                        {student.academicStanding}
                      </Badge>
                    </div>
                  </div>

                  {student.scholarships && student.scholarships.length > 0 && (
                    <div>
                      <Label>Scholarships</Label>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {student.scholarships.map((scholarship, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Award className="h-3 w-3 mr-1" />
                            {scholarship}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Previous Education */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <School className="h-5 w-5" />
                    Previous Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Senior High School</Label>
                    <p className="text-sm mt-1">{student.previousEducation.seniorHighSchool}</p>
                  </div>
                  <div>
                    <Label>SHS Programme</Label>
                    <p className="text-sm mt-1">{student.previousEducation.shsProgram}</p>
                  </div>
                  {student.previousEducation.wasceResults && (
                    <div>
                      <Label>WASCE Results</Label>
                      <p className="text-sm mt-1">{student.previousEducation.wasceResults}</p>
                    </div>
                  )}
                  {student.previousEducation.juniorHighSchool && (
                    <div>
                      <Label>Junior High School</Label>
                      <p className="text-sm mt-1">{student.previousEducation.juniorHighSchool}</p>
                    </div>
                  )}
                  {student.previousEducation.primarySchool && (
                    <div>
                      <Label>Primary School</Label>
                      <p className="text-sm mt-1">{student.previousEducation.primarySchool}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Goals & Aspirations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Goals & Aspirations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Career Goals</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {student.careerGoals.map((goal, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Short Term Goals</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {student.shortTermGoals.map((goal, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Long Term Goals</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {student.longTermGoals.map((goal, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Post-Graduation Plans</Label>
                    <p className="text-sm mt-1">{student.postGraduationPlans}</p>
                  </div>
                  {student.dreamJob && (
                    <div>
                      <Label>Dream Job</Label>
                      <p className="text-sm mt-1">{student.dreamJob}</p>
                    </div>
                  )}
                  {student.roleModels && student.roleModels.length > 0 && (
                    <div>
                      <Label>Role Models</Label>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {student.roleModels.map((model, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            {model}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Counseling Tab */}
          <TabsContent value="counseling" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Counseling Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Counseling Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Assigned Counselor</Label>
                      <p className="text-sm mt-1">{student.counselorAssigned}</p>
                    </div>
                    {student.supervisorAssigned && (
                      <div>
                        <Label>Supervisor</Label>
                        <p className="text-sm mt-1">{student.supervisorAssigned}</p>
                      </div>
                    )}
                    <div>
                      <Label>First Session</Label>
                      <p className="text-sm mt-1">{formatDate(student.firstSessionDate)}</p>
                    </div>
                    <div>
                      <Label>Last Session</Label>
                      <p className="text-sm mt-1">
                        {student.lastSessionDate ? formatDate(student.lastSessionDate) : "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label>Next Session</Label>
                      <p className="text-sm mt-1">
                        {student.nextSessionDate ? formatDate(student.nextSessionDate) : "Not scheduled"}
                      </p>
                    </div>
                    <div>
                      <Label>Total Sessions</Label>
                      <p className="text-sm mt-1">{student.totalSessions}</p>
                    </div>
                    <div>
                      <Label>Session Frequency</Label>
                      <p className="text-sm mt-1">{student.sessionFrequency}</p>
                    </div>
                    <div>
                      <Label>Counseling Type</Label>
                      <p className="text-sm mt-1">{student.counselingType}</p>
                    </div>
                    <div>
                      <Label>Referral Source</Label>
                      <p className="text-sm mt-1">{student.referralSource}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Treatment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Treatment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Presenting Concerns</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {student.presentingConcerns.map((concern, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {concern}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Treatment Goals</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {student.treatmentGoals.map((goal, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Target className="h-3 w-3 mr-1" />
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Interventions Used</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {student.interventionsUsed.map((intervention, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {intervention}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Session Notes */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Session Notes
                    </CardTitle>
                    <Button size="sm" onClick={() => setShowAddNoteModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Note
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Latest Note</span>
                        <span className="text-xs text-gray-500">{formatDate(student.updatedAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700">{student.notes}</p>
                    </div>
                    <div className="text-center py-4">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View All Session Notes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Health Tab */}
          <TabsContent value="health" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Medical Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Medical Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Blood Group</Label>
                      <p className="text-sm mt-1">{student.bloodGroup || "Not specified"}</p>
                    </div>
                    <div>
                      <Label>Genotype</Label>
                      <p className="text-sm mt-1">{student.genotype || "Not specified"}</p>
                    </div>
                  </div>

                  {student.allergies && student.allergies.length > 0 && (
                    <div>
                      <Label>Allergies</Label>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {student.allergies.map((allergy, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {student.chronicConditions && student.chronicConditions.length > 0 && (
                    <div>
                      <Label>Chronic Conditions</Label>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {student.chronicConditions.map((condition, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {student.currentMedications && student.currentMedications.length > 0 && (
                    <div>
                      <Label>Current Medications</Label>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {student.currentMedications.map((medication, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {medication}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {student.disabilities && student.disabilities.length > 0 && (
                    <div>
                      <Label>Disabilities</Label>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {student.disabilities.map((disability, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {disability}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Mental Health History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Mental Health History
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {student.mentalHealthHistory && student.mentalHealthHistory.length > 0 && (
                    <div>
                      <Label>Previous Mental Health Concerns</Label>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {student.mentalHealthHistory.map((concern, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {concern}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {student.substanceUse && (
                    <div>
                      <Label>Substance Use</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Alcohol</span>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs",
                              student.substanceUse.alcohol === "Never"
                                ? "bg-green-100 text-green-800"
                                : student.substanceUse.alcohol === "Occasionally"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800",
                            )}
                          >
                            {student.substanceUse.alcohol}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Tobacco</span>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs",
                              student.substanceUse.tobacco === "Never"
                                ? "bg-green-100 text-green-800"
                                : student.substanceUse.tobacco === "Occasionally"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : student.substanceUse.tobacco === "Regularly"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-red-100 text-red-800",
                            )}
                          >
                            {student.substanceUse.tobacco}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Social Tab */}
          <TabsContent value="social" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Family Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Family Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Father's Name</Label>
                      <p className="text-sm mt-1">{student.fatherName || "Not specified"}</p>
                    </div>
                    <div>
                      <Label>Father's Occupation</Label>
                      <p className="text-sm mt-1">{student.fatherOccupation || "Not specified"}</p>
                    </div>
                    <div>
                      <Label>Mother's Name</Label>
                      <p className="text-sm mt-1">{student.motherName || "Not specified"}</p>
                    </div>
                    <div>
                      <Label>Mother's Occupation</Label>
                      <p className="text-sm mt-1">{student.motherOccupation || "Not specified"}</p>
                    </div>
                    <div>
                      <Label>Number of Siblings</Label>
                      <p className="text-sm mt-1">{student.numberOfSiblings}</p>
                    </div>
                    <div>
                      <Label>Birth Order</Label>
                      <p className="text-sm mt-1">
                        {student.birthOrder} of {student.numberOfSiblings + 1}
                      </p>
                    </div>
                    <div>
                      <Label>Family Income</Label>
                      <p className="text-sm mt-1">{student.familyIncome || "Not specified"}</p>
                    </div>
                  </div>

                  {student.guardianName && (
                    <div className="pt-4 border-t">
                      <Label className="font-medium">Guardian Information</Label>
                      <div className="mt-2 space-y-2">
                        <p className="text-sm">
                          <strong>Name:</strong> {student.guardianName}
                        </p>
                        <p className="text-sm">
                          <strong>Relationship:</strong> {student.guardianRelationship}
                        </p>
                        <p className="text-sm">
                          <strong>Phone:</strong> {student.guardianPhone}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Social & Economic Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Social & Economic Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Accommodation Type</Label>
                    <p className="text-sm mt-1">{student.accommodationType}</p>
                  </div>
                  <div>
                    <Label>Transportation Mode</Label>
                    <p className="text-sm mt-1">{student.transportationMode}</p>
                  </div>
                  <div>
                    <Label>Financial Support</Label>
                    <p className="text-sm mt-1">{student.financialSupport}</p>
                  </div>
                  {student.partTimeJob && (
                    <div>
                      <Label>Part-time Job</Label>
                      <p className="text-sm mt-1">{student.partTimeJob}</p>
                    </div>
                  )}
                  {student.monthlyAllowance && (
                    <div>
                      <Label>Monthly Allowance</Label>
                      <p className="text-sm mt-1">{student.monthlyAllowance}</p>
                    </div>
                  )}
                  <div>
                    <Label>Financial Stress Level</Label>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "mt-1",
                        student.financialStress === "None"
                          ? "bg-green-100 text-green-800"
                          : student.financialStress === "Mild"
                            ? "bg-yellow-100 text-yellow-800"
                            : student.financialStress === "Moderate"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-red-100 text-red-800",
                      )}
                    >
                      {student.financialStress}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Interests & Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Interests & Activities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Hobbies</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {student.hobbies.map((hobby, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {hobby}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Sports Activities</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {student.sportsActivities.map((sport, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {sport}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Club Memberships</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {student.clubMemberships.map((club, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {club}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Volunteer Work</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {student.volunteerWork.map((work, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {work}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Leadership Roles</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {student.leadershipRoles.map((role, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Talents</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {student.talents.map((talent, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {talent}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Support System */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Support System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Close Friends</Label>
                    <p className="text-sm mt-1">{student.closeFriends} close friends</p>
                  </div>
                  <div>
                    <Label>Social Support Level</Label>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "mt-1",
                        student.socialSupport === "Strong"
                          ? "bg-green-100 text-green-800"
                          : student.socialSupport === "Moderate"
                            ? "bg-yellow-100 text-yellow-800"
                            : student.socialSupport === "Weak"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-red-100 text-red-800",
                      )}
                    >
                      {student.socialSupport}
                    </Badge>
                  </div>
                  <div>
                    <Label>Campus Connections</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {student.campusConnections.map((connection, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {connection}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {student.mentors && student.mentors.length > 0 && (
                    <div>
                      <Label>Mentors</Label>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {student.mentors.map((mentor, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            {mentor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {student.supportGroups && student.supportGroups.length > 0 && (
                    <div>
                      <Label>Support Groups</Label>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {student.supportGroups.map((group, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {group}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Assessments Tab */}
          <TabsContent value="assessments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Assessment Scores */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Assessment Scores
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Depression Score</Label>
                      <span
                        className={cn(
                          "text-sm font-bold",
                          getAssessmentColor(student.assessments.depressionScore!, "depression"),
                        )}
                      >
                        {student.assessments.depressionScore}/30
                      </span>
                    </div>
                    <Progress value={(student.assessments.depressionScore! / 30) * 100} className="h-2" />
                    <p className="text-xs text-gray-600 mt-1">Lower scores indicate better mental health</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Anxiety Score</Label>
                      <span
                        className={cn(
                          "text-sm font-bold",
                          getAssessmentColor(student.assessments.anxietyScore!, "anxiety"),
                        )}
                      >
                        {student.assessments.anxietyScore}/30
                      </span>
                    </div>
                    <Progress value={(student.assessments.anxietyScore! / 30) * 100} className="h-2" />
                    <p className="text-xs text-gray-600 mt-1">Lower scores indicate better mental health</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Stress Score</Label>
                      <span
                        className={cn(
                          "text-sm font-bold",
                          getAssessmentColor(student.assessments.stressScore!, "stress"),
                        )}
                      >
                        {student.assessments.stressScore}/40
                      </span>
                    </div>
                    <Progress value={(student.assessments.stressScore! / 40) * 100} className="h-2" />
                    <p className="text-xs text-gray-600 mt-1">Lower scores indicate better stress management</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Wellbeing Score</Label>
                      <span
                        className={cn(
                          "text-sm font-bold",
                          getAssessmentColor(student.assessments.wellbeingScore!, "wellbeing"),
                        )}
                      >
                        {student.assessments.wellbeingScore}/100
                      </span>
                    </div>
                    <Progress value={student.assessments.wellbeingScore} className="h-2" />
                    <p className="text-xs text-gray-600 mt-1">Higher scores indicate better wellbeing</p>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-600">
                      Last assessment:{" "}
                      {student.assessments.lastAssessmentDate
                        ? formatDate(student.assessments.lastAssessmentDate)
                        : "Not available"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Academic & Social Assessments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Academic & Social Assessments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Academic Self-Efficacy</Label>
                      <span
                        className={cn(
                          "text-sm font-bold",
                          getAssessmentColor(student.assessments.academicSelfEfficacy!, "academicSelfEfficacy"),
                        )}
                      >
                        {student.assessments.academicSelfEfficacy}/100
                      </span>
                    </div>
                    <Progress value={student.assessments.academicSelfEfficacy} className="h-2" />
                    <p className="text-xs text-gray-600 mt-1">Confidence in academic abilities</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Social Support</Label>
                      <span
                        className={cn(
                          "text-sm font-bold",
                          getAssessmentColor(student.assessments.socialSupport!, "socialSupport"),
                        )}
                      >
                        {student.assessments.socialSupport}/100
                      </span>
                    </div>
                    <Progress value={student.assessments.socialSupport} className="h-2" />
                    <p className="text-xs text-gray-600 mt-1">Perceived social support availability</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Resilience Score</Label>
                      <span
                        className={cn(
                          "text-sm font-bold",
                          getAssessmentColor(student.assessments.resilienceScore!, "resilienceScore"),
                        )}
                      >
                        {student.assessments.resilienceScore}/100
                      </span>
                    </div>
                    <Progress value={student.assessments.resilienceScore} className="h-2" />
                    <p className="text-xs text-gray-600 mt-1">Ability to bounce back from challenges</p>
                  </div>

                  <div className="pt-4 border-t">
                    <Button size="sm" className="w-full" onClick={() => setShowAssessmentModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Assessment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Crisis Tab */}
          <TabsContent value="crisis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Crisis Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Crisis Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Suicidal Ideation</Label>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "mt-1",
                          student.suicidalIdeation ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800",
                        )}
                      >
                        {student.suicidalIdeation ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div>
                      <Label>Self-Harm History</Label>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "mt-1",
                          student.selfHarmHistory ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800",
                        )}
                      >
                        {student.selfHarmHistory ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>

                  {student.warningSigns && student.warningSigns.length > 0 && (
                    <div>
                      <Label>Warning Signs</Label>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {student.warningSigns.map((sign, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {sign}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {student.copingStrategies && student.copingStrategies.length > 0 && (
                    <div>
                      <Label>Coping Strategies</Label>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {student.copingStrategies.map((strategy, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {strategy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {student.safetyPlan && (
                    <div>
                      <Label>Safety Plan</Label>
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">{student.safetyPlan}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Crisis Contacts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Crisis Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {student.crisisContacts.map((contact, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-3 rounded-lg border",
                        contact.isPrimary ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200",
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{contact.name}</h4>
                        {contact.isPrimary && (
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                            Primary
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{contact.relationship}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{contact.phone}</span>
                        <Button size="sm" variant="outline" className="ml-auto bg-transparent">
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t">
                    <Button
                      size="sm"
                      className="w-full bg-transparent"
                      variant="outline"
                      onClick={() => setShowCrisisModal(true)}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Activate Crisis Protocol
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Note Modal */}
      <Dialog open={showAddNoteModal} onOpenChange={setShowAddNoteModal}>
        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Add Session Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Note</Label>
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter session notes..."
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowAddNoteModal(false)} className="flex-1">
                Save Note
              </Button>
              <Button variant="outline" onClick={() => setShowAddNoteModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assessment Modal */}
      <Dialog open={showAssessmentModal} onOpenChange={setShowAssessmentModal}>
        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>New Assessment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Assessment Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select assessment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="depression">Depression Scale</SelectItem>
                  <SelectItem value="anxiety">Anxiety Scale</SelectItem>
                  <SelectItem value="stress">Stress Scale</SelectItem>
                  <SelectItem value="wellbeing">Wellbeing Scale</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowAssessmentModal(false)} className="flex-1">
                Start Assessment
              </Button>
              <Button variant="outline" onClick={() => setShowAssessmentModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Crisis Modal */}
      <Dialog open={showCrisisModal} onOpenChange={setShowCrisisModal}>
        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Crisis Protocol Activation
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                This will activate the crisis intervention protocol for {student.firstName} {student.lastName}.
                Emergency contacts will be notified and immediate support will be provided.
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowCrisisModal(false)} className="flex-1 bg-red-600 hover:bg-red-700">
                Activate Protocol
              </Button>
              <Button variant="outline" onClick={() => setShowCrisisModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
