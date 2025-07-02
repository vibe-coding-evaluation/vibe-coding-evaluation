"use client"

import { useState } from "react"
import type { BugData, TabConfig } from "@/types/bug"
import { useBugData } from "@/hooks/use-bug-data"
import { BugHeader } from "@/components/bug-header"
import { BugTabs } from "@/components/bug-tabs"
import { BugFormLeft } from "@/components/bug-form-left"
import { BugFormRight } from "@/components/bug-form-right"
import { DeliveryMatrix } from "@/components/delivery-matrix"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

interface BugDetailPageProps {
  bugId?: number
}

export function BugDetailPage({ bugId = 338662 }: BugDetailPageProps) {
  const { bug, loading, error, updateBug, saving } = useBugData(bugId)
  const [activeTab, setActiveTab] = useState("development")
  const [formData, setFormData] = useState<Partial<BugData>>({})

  const tabs: TabConfig[] = [
    { id: "development", label: "Development", active: true },
    { id: "development-read", label: "Development [read mode]" },
    { id: "qa-delivery", label: "QA Delivery and Dev Support" },
    { id: "delivery-matrix", label: "Delivery Matrix" },
  ]

  const handleFieldChange = (field: keyof BugData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!bug || Object.keys(formData).length === 0) return

    try {
      await updateBug(formData)
      setFormData({}) // Clear form data after successful save
    } catch (error) {
      // Error is handled by the hook
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b-2 border-gray-300 px-4 py-3">
          <Skeleton className="h-6 w-96 mb-2" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 flex-1" />
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !bug) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Alert variant="destructive">
          <AlertDescription>Failed to load bug data: {error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!bug) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Alert>
          <AlertDescription>Bug not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  // Merge bug data with form changes for display
  const displayBug = { ...bug, ...formData }

  const renderTabContent = () => {
    if (activeTab === "delivery-matrix") {
      return (
        <div className="p-6">
          <DeliveryMatrix />
        </div>
      )
    }

    return (
      <div className="bg-gray-100 border-2 border-gray-300 p-6 shadow-inner">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BugFormLeft bug={displayBug} onChange={handleFieldChange} />
          <BugFormRight bug={displayBug} onChange={handleFieldChange} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <BugHeader bug={bug} onSave={handleSave} saving={saving} error={error} />

      <BugTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
        {renderTabContent()}
      </BugTabs>
    </div>
  )
}
