"use client"

import { useState } from "react"
import { CheckinService, type DailyCheckinData } from "@/lib/checkin-service"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"

export function useCheckin() {
  const [user] = useAuthState(auth)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitCheckin = async (
    checkinData: Omit<DailyCheckinData, "userId" | "timestamp" | "submittedAt">,
    photoFile?: File,
    voiceFile?: Blob,
  ) => {
    if (!user) {
      setError("User must be authenticated")
      return null
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const checkinId = await CheckinService.saveCheckin(user.uid, checkinData, photoFile, voiceFile)

      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)

      return checkinId
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit check-in")
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  const checkTodaySubmission = async () => {
    if (!user) return false

    try {
      return await CheckinService.hasCheckinToday(user.uid)
    } catch (err) {
      console.error("Error checking today's submission:", err)
      return false
    }
  }

  const getUserStreak = async () => {
    if (!user) return 0

    try {
      return await CheckinService.getUserStreak(user.uid)
    } catch (err) {
      console.error("Error getting streak:", err)
      return 0
    }
  }

  const getUserAnalytics = async (days = 30) => {
    if (!user) return null

    try {
      return await CheckinService.getUserAnalytics(user.uid, days)
    } catch (err) {
      console.error("Error getting analytics:", err)
      return null
    }
  }

  return {
    submitCheckin,
    checkTodaySubmission,
    getUserStreak,
    getUserAnalytics,
    isSubmitting,
    submitted,
    error,
    user,
  }
}
