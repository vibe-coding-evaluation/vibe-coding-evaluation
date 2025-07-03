"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { BugData } from "@/types/bug"

interface BugHeaderProps {
  bug: BugData | null
  onSave: () => void
  saving: boolean
  error: string | null
}

export function BugHeader({ bug, onSave, saving, error }: BugHeaderProps) {
  return (
    <div className="bg-white border-b-2 border-gray-300 px-4 py-3 shadow-sm sticky top-0 z-10">
      {/* Navigation */}
      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
        <div className="space-x-2">
          <span>Bug List: (4 of 500)</span>
          <a href="#" className="text-blue-600 underline hover:text-blue-800">
            First
          </a>
          <a href="#" className="text-blue-600 underline hover:text-blue-800">
            Last
          </a>
          <a href="#" className="text-blue-600 underline hover:text-blue-800">
            Prev
          </a>
          <a href="#" className="text-blue-600 underline hover:text-blue-800">
            Next
          </a>
          <a href="#" className="text-blue-600 underline hover:text-blue-800 ml-4">
            Show last search results
          </a>
        </div>
      </div>

      {/* Bug Title and Actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-normal">
          <a href="#" className="text-blue-600 underline hover:text-blue-800">
            Bug {bug?.id || "---"}
          </a>
          {" - "}
          {bug?.summary || "Loading..."}{" "}
          <span className="text-gray-600">
            (
            <a href="#" className="text-blue-600 underline hover:text-blue-800">
              edit
            </a>
            )
          </span>
        </h1>

        <div className="flex items-center gap-3">
          {error && <span className="text-red-600 text-sm">{error}</span>}
          <div className="flex flex-col items-end gap-2">
            <Button
              onClick={onSave}
              disabled={saving}
              className="bg-gray-100 border-2 border-gray-400 text-black hover:bg-gray-200 shadow-sm rounded-none text-sm px-4 py-2"
              variant="outline"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <div className="flex items-center space-x-2">
              <Checkbox id="minor-update" className="border-gray-400" />
              <label htmlFor="minor-update" className="text-xs text-gray-600 cursor-pointer">
                This is a minor update (do not send email)
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
