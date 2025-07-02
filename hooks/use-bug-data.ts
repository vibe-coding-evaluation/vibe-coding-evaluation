"use client"

import { useState, useEffect } from "react"
import type { BugData } from "@/types/bug"
import { getBugData } from "@/data/mock-data"

interface UseBugDataReturn {
  bug: BugData | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  updateBug: (updates: Partial<BugData>) => Promise<void>
  saving: boolean
}

// In-memory storage for bug updates
const bugUpdates = new Map<number, Partial<BugData>>()

export function useBugData(bugId: number): UseBugDataReturn {
  const [bug, setBug] = useState<BugData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBug = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      const bugData = getBugData(bugId)
      if (!bugData) {
        setError(`Bug ${bugId} not found`)
        return
      }

      // Apply any stored updates
      const updates = bugUpdates.get(bugId)
      const finalBugData = updates ? { ...bugData, ...updates } : bugData

      setBug(finalBugData)
    } catch (err) {
      setError("Failed to fetch bug data")
    } finally {
      setLoading(false)
    }
  }

  const updateBug = async (updates: Partial<BugData>) => {
    if (!bug) return

    try {
      setSaving(true)
      setError(null)

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Store updates in memory
      const existingUpdates = bugUpdates.get(bug.id) || {}
      const newUpdates = { ...existingUpdates, ...updates }
      bugUpdates.set(bug.id, newUpdates)

      // Update local state
      setBug((prev) => (prev ? { ...prev, ...updates, last_change_time: new Date().toISOString() } : null))

      console.log(`Bug ${bug.id} updated:`, updates)
    } catch (err) {
      setError("Failed to update bug")
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
