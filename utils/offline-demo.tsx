"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { offlineMock } from "@/mocks/offline-mock"

export function OfflineDemo() {
  const [config, setConfig] = useState({
    delay: 300,
    failureRate: 0,
    networkError: false,
  })

  const [testResults, setTestResults] = useState<string[]>([])

  const updateConfig = (key: keyof typeof config, value: any) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    offlineMock.setConfig(newConfig)
  }

  const runTest = async (testName: string, testFn: () => Promise<void>) => {
    try {
      await testFn()
      setTestResults((prev) => [...prev, `✅ ${testName}: Success`])
    } catch (error) {
      setTestResults((prev) => [...prev, `❌ ${testName}: ${error instanceof Error ? error.message : "Failed"}`])
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Offline Mock Demo</CardTitle>
          <CardDescription>
            Test the offline mock functionality without internet connection. All data is stored locally.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Network Delay (ms)</label>
              <input
                type="number"
                value={config.delay}
                onChange={(e) => updateConfig("delay", Number.parseInt(e.target.value))}
                className="w-full p-2 border rounded"
                min="0"
                max="5000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Failure Rate (0-1)</label>
              <input
                type="number"
                value={config.failureRate}
                onChange={(e) => updateConfig("failureRate", Number.parseFloat(e.target.value))}
                className="w-full p-2 border rounded"
                min="0"
                max="1"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Network Error</label>
              <input
                type="checkbox"
                checked={config.networkError}
                onChange={(e) => updateConfig("networkError", e.target.checked)}
                className="w-4 h-4 mt-2"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() =>
                runTest("Get Bug 338662", async () => {
                  const response = await fetch("https://bugzilla.example.com/rest/bug/338662")
                  const data = await response.json()
                  if (!data.bugs || data.bugs.length === 0) throw new Error("No bug data")
                })
              }
            >
              Test Get Bug
            </Button>

            <Button
              onClick={() =>
                runTest("Update Bug", async () => {
                  const response = await fetch("https://bugzilla.example.com/rest/bug/338662", {
                    method: "PUT",
                    body: JSON.stringify({ ids: [338662], summary: "Demo update" }),
                  })
                  const data = await response.json()
                  if (data.faults && data.faults.length > 0) throw new Error(data.faults[0].faultString)
                })
              }
            >
              Test Update
            </Button>

            <Button
              onClick={() =>
                runTest("Search Bugs", async () => {
                  const response = await fetch("https://bugzilla.example.com/rest/bug?product=NewDB")
                  const data = await response.json()
                  if (!data.bugs) throw new Error("No search results")
                })
              }
            >
              Test Search
            </Button>

            <Button
              onClick={() =>
                runTest("Validation Error", async () => {
                  const response = await fetch("https://bugzilla.example.com/rest/bug/35", {
                    method: "PUT",
                    body: JSON.stringify({ ids: [35], summary: "INVALID" }),
                  })
                  const data = await response.json()
                  if (!data.faults || data.faults.length === 0) throw new Error("Expected validation error")
                })
              }
            >
              Test Validation
            </Button>

            <Button onClick={clearResults} variant="outline">
              Clear Results
            </Button>

            <Button onClick={() => offlineMock.reset()} variant="outline">
              Reset Mock
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Local Storage Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Bugs Stored</p>
              <p className="text-2xl font-bold">{offlineMock.getStorageSize()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Available Bug IDs</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {offlineMock.getAllBugs().map((bug) => (
                  <Badge key={bug.id} variant="secondary">
                    {bug.id}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="font-mono text-sm p-2 bg-gray-100 rounded">
                  {result}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
