"use client"

import { useState, useEffect } from "react"
import type { BugData } from "@/types/bug"
import { mockBugzillaApi, BugzillaApiError } from "@/services/bugzilla-api-mock"

interface UseBugDataReturn {
  bug: BugData | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  updateBug: (updates: Partial<BugData>) => Promise<void>
  saving: boolean
}

export function useBugDataMock(bugId: number): UseBugDataReturn {
  const [bug, setBug] = useState<BugData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBug = async () => {
    try {
      setLoading(true)
      setError(null)
      const bugData = await mockBugzillaApi.getBug(bugId)
      setBug(bugData)
    } catch (err) {
      const errorMessage = err instanceof BugzillaApiError ? err.message : "Failed to fetch bug data"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateBug = async (updates: Partial<BugData>) => {
    if (!bug) return

    try {
      setSaving(true)
      setError(null)
      await mockBugzillaApi.updateBug(bug.id, updates)
      setBug((prev) => (prev ? { ...prev, ...updates } : null))
    } catch (err) {
      const errorMessage = err instanceof BugzillaApiError ? err.message : "Failed to update bug"
      setError(errorMessage)
      throw err
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    fetchBug()
  }, [bugId])

  return {
    bug,
    loading,
    error,
    refetch: fetchBug,
    updateBug,
    saving,
  }
}
