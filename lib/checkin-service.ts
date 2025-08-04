import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "./firebase"

export interface DailyCheckinData {
  // User identification
  userId: string
  timestamp: Timestamp
  date: string // YYYY-MM-DD format

  // Mood data
  mood: {
    primary: number | null
    intensity: number
    secondary: string[]
  }

  // Mental health metrics
  mentalHealth: {
    energyLevel: number
    anxietyLevel: number
    stressLevel: number
  }

  // Sleep data
  sleep: {
    quality: number
    hours: number
  }

  // Physical symptoms
  physicalSymptoms: Record<
    string,
    {
      severity: number
      notes?: string
    }
  >

  // Habits tracking
  habits: Record<string, boolean>

  // Medications
  medications: Array<{
    key: string
    label: string
    dosage: string
    time: string
    taken: boolean
  }>

  // Social interactions
  socialInteractions: Array<{
    key: string
    label: string
    quality: number
    duration: number
  }>

  // Coping strategies
  copingStrategies: Array<{
    key: string
    label: string
    used: boolean
    effectiveness: number
  }>

  // Triggers
  triggers: Array<{
    key: string
    label: string
    severity: number
  }>

  // Academic stress
  academicStress: {
    workload: number
    upcomingDeadlines: number
    examAnxiety: number
    performancePressure: number
  }

  // Financial stress
  financialStress: {
    moneyWorries: number
    budgetingConcerns: boolean
    employmentStress: number
  }

  // Relationship quality
  relationshipQuality: {
    familySatisfaction: number
    friendSatisfaction: number
    romanticSatisfaction: number
    socialIsolation: number
  }

  // Therapy session
  therapySession: {
    hadSession: boolean
    sessionType: string
    effectiveness: number
    notes: string
  }

  // Reflection data
  reflection: {
    gratitude: string[]
    dailyGoals: string[]
    goalCompletion: boolean[]
    notes: string
    weather: string
    location: string
  }

  // Media attachments
  media: {
    photoUrl?: string
    voiceNoteUrl?: string
  }

  // Sharing preferences
  sharing: {
    sharePublic: boolean
    notifyPartner: boolean
  }

  // Completion metadata
  completionPercentage: number
  submittedAt: Timestamp
}

export class CheckinService {
  private static COLLECTION_NAME = "daily_checkins"

  /**
   * Save a daily check-in to Firebase
   */
  static async saveCheckin(
    userId: string,
    checkinData: Omit<DailyCheckinData, "userId" | "timestamp" | "submittedAt">,
    photoFile?: File,
    voiceFile?: Blob,
  ): Promise<string> {
    try {
      // Upload media files if provided
      const mediaUrls: { photoUrl?: string; voiceNoteUrl?: string } = {}

      if (photoFile) {
        const photoRef = ref(storage, `checkins/${userId}/${Date.now()}_photo.jpg`)
        const photoSnapshot = await uploadBytes(photoRef, photoFile)
        mediaUrls.photoUrl = await getDownloadURL(photoSnapshot.ref)
      }

      if (voiceFile) {
        const voiceRef = ref(storage, `checkins/${userId}/${Date.now()}_voice.webm`)
        const voiceSnapshot = await uploadBytes(voiceRef, voiceFile)
        mediaUrls.voiceNoteUrl = await getDownloadURL(voiceSnapshot.ref)
      }

      // Prepare the complete checkin data
      const completeCheckinData: DailyCheckinData = {
        ...checkinData,
        userId,
        timestamp: Timestamp.now(),
        submittedAt: serverTimestamp() as Timestamp,
        media: {
          ...checkinData.media,
          ...mediaUrls,
        },
      }

      // Save to Firestore
      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), completeCheckinData)

      return docRef.id
    } catch (error) {
      console.error("Error saving checkin:", error)
      throw new Error("Failed to save daily check-in")
    }
  }

  /**
   * Get user's check-ins for a specific date range
   */
  static async getUserCheckins(
    userId: string,
    startDate?: string,
    endDate?: string,
    limitCount = 30,
  ): Promise<DailyCheckinData[]> {
    try {
      let q = query(
        collection(db, this.COLLECTION_NAME),
        where("userId", "==", userId),
        orderBy("timestamp", "desc"),
        limit(limitCount),
      )

      if (startDate && endDate) {
        q = query(
          collection(db, this.COLLECTION_NAME),
          where("userId", "==", userId),
          where("date", ">=", startDate),
          where("date", "<=", endDate),
          orderBy("date", "desc"),
        )
      }

      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as DailyCheckinData & { id: string },
      )
    } catch (error) {
      console.error("Error fetching checkins:", error)
      throw new Error("Failed to fetch check-ins")
    }
  }

  /**
   * Check if user has already submitted a check-in today
   */
  static async hasCheckinToday(userId: string): Promise<boolean> {
    try {
      const today = new Date().toISOString().split("T")[0]
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where("userId", "==", userId),
        where("date", "==", today),
        limit(1),
      )

      const querySnapshot = await getDocs(q)
      return !querySnapshot.empty
    } catch (error) {
      console.error("Error checking today's checkin:", error)
      return false
    }
  }

  /**
   * Get user's streak count
   */
  static async getUserStreak(userId: string): Promise<number> {
    try {
      const checkins = await this.getUserCheckins(userId, undefined, undefined, 365)

      if (checkins.length === 0) return 0

      let streak = 0
      const today = new Date()

      for (let i = 0; i < checkins.length; i++) {
        const checkinDate = new Date(checkins[i].date)
        const daysDiff = Math.floor((today.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24))

        if (daysDiff === streak) {
          streak++
        } else {
          break
        }
      }

      return streak
    } catch (error) {
      console.error("Error calculating streak:", error)
      return 0
    }
  }

  /**
   * Get analytics data for user
   */
  static async getUserAnalytics(
    userId: string,
    days = 30,
  ): Promise<{
    averageMood: number
    averageEnergy: number
    averageSleep: number
    habitSuccessRate: number
    totalCheckins: number
  }> {
    try {
      const endDate = new Date().toISOString().split("T")[0]
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

      const checkins = await this.getUserCheckins(userId, startDate, endDate, days)

      if (checkins.length === 0) {
        return {
          averageMood: 0,
          averageEnergy: 0,
          averageSleep: 0,
          habitSuccessRate: 0,
          totalCheckins: 0,
        }
      }

      const totals = checkins.reduce(
        (acc, checkin) => {
          acc.mood += checkin.mood.primary || 0
          acc.energy += checkin.mentalHealth.energyLevel
          acc.sleep += checkin.sleep.hours

          const habitCount = Object.keys(checkin.habits).length
          const completedHabits = Object.values(checkin.habits).filter(Boolean).length
          acc.habitSuccess += habitCount > 0 ? (completedHabits / habitCount) * 100 : 0

          return acc
        },
        { mood: 0, energy: 0, sleep: 0, habitSuccess: 0 },
      )

      return {
        averageMood: Number((totals.mood / checkins.length).toFixed(1)),
        averageEnergy: Number((totals.energy / checkins.length).toFixed(1)),
        averageSleep: Number((totals.sleep / checkins.length).toFixed(1)),
        habitSuccessRate: Number((totals.habitSuccess / checkins.length).toFixed(0)),
        totalCheckins: checkins.length,
      }
    } catch (error) {
      console.error("Error getting analytics:", error)
      throw new Error("Failed to get analytics data")
    }
  }
}
