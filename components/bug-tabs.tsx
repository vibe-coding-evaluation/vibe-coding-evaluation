"use client"

import type React from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { TabConfig } from "@/types/bug"

interface BugTabsProps {
  tabs: TabConfig[]
  activeTab: string
  onTabChange: (tab: string) => void
  children: React.ReactNode
}

export function BugTabs({ tabs, activeTab, onTabChange, children }: BugTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="bg-gray-200 border-b-2 border-gray-300 rounded-none h-auto p-0 shadow-sm">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className={`
              px-4 py-2 rounded-none border-r-2 border-gray-400 last:border-r-0
              data-[state=active]:bg-blue-600 data-[state=active]:text-white
              data-[state=inactive]:bg-gray-300 data-[state=inactive]:text-black
              hover:bg-blue-500 hover:text-white transition-colors
            `}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={activeTab} className="mt-0">
        {children}
      </TabsContent>
    </Tabs>
  )
}
