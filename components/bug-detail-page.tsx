"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export function BugDetailPage() {
  const [selectedTab, setSelectedTab] = useState("development")

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Bug List: (4 of 500)
            <a href="#" className="text-blue-600 underline ml-1">
              First
            </a>
            <a href="#" className="text-blue-600 underline ml-1">
              Last
            </a>
            <a href="#" className="text-blue-600 underline ml-1">
              Prev
            </a>
            <a href="#" className="text-blue-600 underline ml-1">
              Next
            </a>
            <a href="#" className="text-blue-600 underline ml-2">
              Show last search results
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <h1 className="text-lg font-normal">
            <a href="#" className="text-blue-600 underline">
              Bug 338662
            </a>{" "}
            - summary (
            <a href="#" className="text-blue-600 underline">
              edit
            </a>
            )
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-100 border-gray-400 text-black hover:bg-gray-200 font-normal"
            >
              Save Changes
            </Button>
            <div className="text-xs text-gray-600">
              <input type="checkbox" className="mr-1" />
              This is a minor update (do not send email)
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="bg-gray-200 border-b border-gray-300 rounded-none h-auto p-0">
          <TabsTrigger
            value="development"
            className="bg-blue-600 text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-none border-r border-gray-400 px-4 py-2"
          >
            Development
          </TabsTrigger>
          <TabsTrigger
            value="development-read"
            className="bg-gray-300 text-black data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-none border-r border-gray-400 px-4 py-2"
          >
            Development [read mode]
          </TabsTrigger>
          <TabsTrigger
            value="qa-delivery"
            className="bg-gray-300 text-black data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-none px-4 py-2"
          >
            QA Delivery and Dev Support
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-0">
          <div className="bg-gray-100 border border-gray-300 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right">
                    <a href="#" className="underline">
                      Status:
                    </a>
                  </Label>
                  <span className="font-mono">REOPENED</span>
                  <span className="text-gray-600">
                    (
                    <a href="#" className="text-blue-600 underline">
                      edit
                    </a>
                    )
                  </span>
                </div>

                {/* Product */}
                <div className="flex items-center gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right">
                    <a href="#" className="underline">
                      Product:
                    </a>
                  </Label>
                  <Select defaultValue="newdb">
                    <SelectTrigger className="w-48 bg-white border-gray-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newdb">NewDB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Component */}
                <div className="flex items-center gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right">
                    <a href="#" className="underline">
                      Component:
                    </a>
                  </Label>
                  <Select defaultValue="crash-consulting">
                    <SelectTrigger className="w-48 bg-white border-gray-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crash-consulting">Crash Consulting</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-gray-600">
                    (
                    <a href="#" className="text-blue-600 underline">
                      show other bugs
                    </a>
                    )
                  </span>
                </div>

                {/* Importance */}
                <div className="flex items-center gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right">
                    <a href="#" className="underline">
                      Importance:
                    </a>
                  </Label>
                  <Select defaultValue="high">
                    <SelectTrigger className="w-20 bg-white border-gray-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="bug">
                    <SelectTrigger className="w-20 bg-white border-gray-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bug">bug</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-gray-600">
                    (
                    <a href="#" className="text-blue-600 underline">
                      vote
                    </a>
                    )
                  </span>
                </div>

                {/* OS */}
                <div className="flex items-center gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right">OS:</Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48 bg-white border-gray-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Symptom */}
                <div className="flex items-start gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right mt-2">
                    <a href="#" className="underline">
                      Symptom:
                    </a>
                  </Label>
                  <Textarea
                    defaultValue="crash_callstack_string"
                    className="flex-1 bg-white border-gray-400 font-mono text-sm"
                    rows={3}
                  />
                </div>

                {/* Steps to reproduce */}
                <div className="flex items-start gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right mt-2">
                    <a href="#" className="underline">
                      Steps to reproduce:
                    </a>
                  </Label>
                  <Textarea
                    defaultValue="1. , 2. , 3. , ..."
                    className="flex-1 bg-white border-gray-400 font-mono text-sm"
                    rows={3}
                  />
                </div>

                {/* Workaround */}
                <div className="flex items-start gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right mt-2">
                    <a href="#" className="underline">
                      Workaround:
                    </a>
                  </Label>
                  <Textarea
                    defaultValue="how the issue can be circumvented"
                    className="flex-1 bg-white border-gray-400 font-mono text-sm"
                    rows={3}
                  />
                </div>

                {/* Root cause */}
                <div className="flex items-start gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right mt-2">
                    <a href="#" className="underline">
                      Root cause:
                    </a>
                  </Label>
                  <Textarea className="flex-1 bg-white border-gray-400 font-mono text-sm" rows={3} />
                </div>

                {/* Solution */}
                <div className="flex items-start gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right mt-2">
                    <a href="#" className="underline">
                      Solution:
                    </a>
                  </Label>
                  <Textarea
                    defaultValue="how the issue was solved logically"
                    className="flex-1 bg-white border-gray-400 font-mono text-sm"
                    rows={3}
                  />
                </div>

                {/* Error Category */}
                <div className="flex items-center gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right">
                    <a href="#" className="underline">
                      Error Category:
                    </a>
                  </Label>
                  <Select defaultValue="---">
                    <SelectTrigger className="w-48 bg-white border-gray-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="---">---</SelectItem>
                    </SelectContent>
                  </Select>
                  <a href="#" className="text-blue-600 underline">
                    Crash and error categories
                  </a>
                </div>

                {/* Dependencies */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="w-24 text-blue-600 font-normal text-right">
                      <a href="#" className="underline">
                        Depends on:
                      </a>
                    </Label>
                    <Input className="flex-1 bg-white border-gray-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-24 text-blue-600 font-normal text-right">
                      <a href="#" className="underline">
                        Blocks:
                      </a>
                    </Label>
                    <Input className="flex-1 bg-white border-gray-400" />
                  </div>
                  <div className="ml-26 text-sm">
                    Show dependency{" "}
                    <a href="#" className="text-blue-600 underline">
                      tree
                    </a>{" "}
                    /{" "}
                    <a href="#" className="text-blue-600 underline">
                      graph
                    </a>
                  </div>
                </div>

                {/* Testcase */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="w-24 text-blue-600 font-normal text-right">
                      <a href="#" className="underline">
                        Testcase exists:
                      </a>
                    </Label>
                    <Select defaultValue="---">
                      <SelectTrigger className="w-32 bg-white border-gray-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="---">---</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-24 text-blue-600 font-normal text-right">
                      <a href="#" className="underline">
                        Testcases:
                      </a>
                    </Label>
                    <Input
                      defaultValue="e.g. testAlterTable.py -t 42"
                      className="flex-1 bg-white border-gray-400 font-mono text-sm"
                    />
                  </div>
                </div>

                {/* Gerrit Links */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="w-24 text-blue-600 font-normal text-right">
                      <a href="#" className="underline">
                        Gerrit link(s) for fix:
                      </a>
                    </Label>
                    <Input className="flex-1 bg-white border-gray-400" />
                    <Button variant="outline" size="sm" className="bg-gray-100 border-gray-400">
                      Edit Gerrit Links
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-24 text-blue-600 font-normal text-right">
                      <a href="#" className="underline">
                        Regression Commit Link(s):
                      </a>
                    </Label>
                    <Input className="flex-1 bg-white border-gray-400" />
                    <Button variant="outline" size="sm" className="bg-gray-100 border-gray-400">
                      Edit Gerrit Links
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-24 text-blue-600 font-normal text-right">
                      <a href="#" className="underline">
                        Reason why not provided:
                      </a>
                    </Label>
                    <Input className="flex-1 bg-white border-gray-400" />
                  </div>
                </div>

                {/* Jira Links */}
                <div className="flex items-center gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right">
                    <a href="#" className="underline">
                      Jira Link(s):
                    </a>
                  </Label>
                  <Input className="flex-1 bg-white border-gray-400" />
                  <Button variant="outline" size="sm" className="bg-gray-100 border-gray-400">
                    Edit Jira Links
                  </Button>
                </div>

                {/* Root Cause Analysis */}
                <div className="flex items-center gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right">
                    <a href="#" className="underline">
                      Root Cause Analysis:
                    </a>
                  </Label>
                  <Select defaultValue="---">
                    <SelectTrigger className="w-32 bg-white border-gray-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="---">---</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input className="flex-1 bg-white border-gray-400" />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Assigned To */}
                <div className="flex items-center gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right">
                    <a href="#" className="underline">
                      Assigned To:
                    </a>
                  </Label>
                  <a href="#" className="text-blue-600 underline">
                    Kang, Sanghun
                  </a>
                  <span className="text-gray-600">
                    (
                    <a href="#" className="text-blue-600 underline">
                      edit
                    </a>
                    )
                  </span>
                </div>

                {/* QA Contact */}
                <div className="flex items-center gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right">
                    <a href="#" className="underline">
                      QA Contact:
                    </a>
                  </Label>
                  <a href="#" className="text-blue-600 underline">
                    Kang, Sanghun
                  </a>
                  <span className="text-gray-600">
                    (
                    <a href="#" className="text-blue-600 underline">
                      edit
                    </a>
                    )
                  </span>
                </div>

                {/* Reported */}
                <div className="flex items-center gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right">
                    <a href="#" className="underline">
                      Reported:
                    </a>
                  </Label>
                  <span className="font-mono text-sm">2025-05-20 09:29:04 CEST</span>
                  <span>by</span>
                  <a href="#" className="text-blue-600 underline">
                    DL HANA Cloud Crash Dispatching
                  </a>
                </div>

                {/* Modified */}
                <div className="flex items-center gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right">
                    <a href="#" className="underline">
                      Modified:
                    </a>
                  </Label>
                  <span className="font-mono text-sm">2025-07-02 03:44 CEST</span>
                  <span className="text-gray-600">
                    (
                    <a href="#" className="text-blue-600 underline">
                      History
                    </a>
                    )
                  </span>
                </div>

                {/* Backlog Duration */}
                <div className="flex items-center gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right">
                    <a href="#" className="underline">
                      Backlog Duration:
                    </a>
                  </Label>
                  <span>42 day(s)</span>
                  <span className="text-gray-600">ⓘ</span>
                </div>

                {/* MPT Due Date */}
                <div className="flex items-center gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right">
                    <a href="#" className="underline">
                      MPT Due Date:
                    </a>
                  </Label>
                  <span>None</span>
                </div>

                {/* CC List */}
                <div className="flex items-center gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right">
                    <a href="#" className="underline">
                      CC List:
                    </a>
                  </Label>
                  <span>1 user including you</span>
                  <span className="text-gray-600">
                    (
                    <a href="#" className="text-blue-600 underline">
                      edit
                    </a>
                    )
                  </span>
                </div>

                {/* Reported Release */}
                <div className="flex items-center gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right">
                    <a href="#" className="underline">
                      Reported Release:
                    </a>
                  </Label>
                  <Select defaultValue="cloud-edition">
                    <SelectTrigger className="w-48 bg-white border-gray-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cloud-edition">Cloud-Edition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reported Cloud Edition */}
                <div className="flex items-center gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right">
                    <a href="#" className="underline">
                      Reported Cloud Edition:
                    </a>
                  </Label>
                  <Select defaultValue="---">
                    <SelectTrigger className="w-48 bg-white border-gray-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="---">---</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reported Branch */}
                <div className="flex items-center gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right">
                    <a href="#" className="underline">
                      Reported Branch:
                    </a>
                  </Label>
                  <Input className="flex-1 bg-white border-gray-400" />
                </div>

                {/* Reported HANA Cloud Instance */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="w-24 text-blue-600 font-normal text-right">
                      <a href="#" className="underline">
                        Reported HANA Cloud Instance(s):
                      </a>
                    </Label>
                    <div className="flex-1">
                      <Input defaultValue="instance_guid" className="bg-white border-gray-400" />
                      <Badge variant="secondary" className="mt-1">
                        instance_guid
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    </div>
                  </div>
                  <div className="ml-26 text-xs text-gray-600">
                    Sum of reported instances: 1<br />
                    Format for instances:{" "}
                    <a href="#" className="text-blue-600 underline">
                      UUID v4 (e.g., abcdefab-0123-4567-89ab-cdef12345678)
                    </a>
                  </div>
                </div>

                {/* CVSS Score */}
                <div className="flex items-center gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right">
                    <a href="#" className="underline">
                      CVSS Score:
                    </a>
                  </Label>
                  <Input className="w-32 bg-white border-gray-400" />
                </div>

                {/* URL */}
                <div className="flex items-center gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right">
                    <a href="#" className="underline">
                      URL:
                    </a>
                  </Label>
                  <Input className="flex-1 bg-white border-gray-400" />
                </div>

                {/* Keywords */}
                <div className="flex items-center gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right">
                    <a href="#" className="underline">
                      Keywords:
                    </a>
                  </Label>
                  <Input
                    defaultValue="D_CRASH, I_CLOUD_ISSUE, I_CLOUD_OUTAGE, I_CUSTOMER_ISSUE"
                    className="flex-1 bg-white border-gray-400 font-mono text-sm"
                  />
                </div>

                {/* Additional tags */}
                <div className="flex items-center gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right">
                    <a href="#" className="underline">
                      Additional tags:
                    </a>
                  </Label>
                  <Input className="flex-1 bg-white border-gray-400" />
                </div>

                {/* Problem Identifier */}
                <div className="flex items-center gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right">
                    <a href="#" className="underline">
                      Problem Identifier:
                    </a>
                  </Label>
                  <div className="flex-1">
                    <Badge variant="secondary">
                      problem_id
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  </div>
                </div>

                {/* Alias */}
                <div className="flex items-center gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right">
                    <a href="#" className="underline">
                      Alias:
                    </a>
                  </Label>
                  <span>None</span>
                  <span className="text-gray-600">
                    (
                    <a href="#" className="text-blue-600 underline">
                      edit
                    </a>
                    )
                  </span>
                </div>

                {/* Internal Messages */}
                <div className="flex items-start gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right mt-2">
                    <a href="#" className="underline">
                      Internal Messages:
                    </a>
                  </Label>
                  <Textarea className="flex-1 bg-white border-gray-400" rows={3} />
                </div>

                {/* Customer Messages */}
                <div className="flex items-start gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right mt-2">
                    <a href="#" className="underline">
                      Customer Messages:
                    </a>
                  </Label>
                  <Textarea className="flex-1 bg-white border-gray-400" rows={3} />
                </div>

                {/* Affected Customers */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Label className="w-24 text-blue-600 font-normal text-right mt-2">
                      <a href="#" className="underline">
                        Affected Customers:
                      </a>
                    </Label>
                    <Textarea
                      placeholder="Choose one or more customers"
                      className="flex-1 bg-white border-gray-400"
                      rows={3}
                    />
                  </div>
                  <div className="ml-26">
                    <a href="#" className="text-blue-600 underline text-sm">
                      Customer missing in this list?
                    </a>
                  </div>
                </div>

                {/* Internal Stakeholders */}
                <div className="flex items-center gap-2">
                  <Label className="w-24 text-blue-600 font-normal text-right">
                    <a href="#" className="underline">
                      Internal Stakeholders:
                    </a>
                  </Label>
                  <div className="flex-1">
                    <Badge variant="secondary">
                      HANA Cloud
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
