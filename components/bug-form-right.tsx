"use client"

import type { BugData } from "@/types/bug"
import { FormField } from "@/components/ui/form-field"
import { VintageInput, VintageTextarea, VintageSelect } from "@/components/ui/vintage-input"
import { SelectItem } from "@/components/ui/select"
import { TagInput } from "@/components/ui/tag-input"
import { Info } from "lucide-react"

interface BugFormRightProps {
  bug: BugData
  onChange: (field: keyof BugData, value: any) => void
}

export function BugFormRight({ bug, onChange }: BugFormRightProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    })
  }

  return (
    <div className="space-y-4">
      {/* Assigned To */}
      <FormField label="Assigned To">
        <div className="flex items-center gap-2">
          <a href="#" className="text-blue-600 underline hover:text-blue-800">
            {bug.assigned_to_detail?.real_name || bug.assigned_to}
          </a>
          <span className="text-gray-600">
            (
            <a href="#" className="text-blue-600 underline hover:text-blue-800">
              edit
            </a>
            )
          </span>
        </div>
      </FormField>

      {/* QA Contact */}
      <FormField label="QA Contact">
        <div className="flex items-center gap-2">
          <a href="#" className="text-blue-600 underline hover:text-blue-800">
            {bug.qa_contact_detail?.real_name || bug.qa_contact || "None"}
          </a>
          <span className="text-gray-600">
            (
            <a href="#" className="text-blue-600 underline hover:text-blue-800">
              edit
            </a>
            )
          </span>
        </div>
      </FormField>

      {/* Reported */}
      <FormField label="Reported">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm">{formatDate(bug.creation_time)}</span>
          <span>by</span>
          <a href="#" className="text-blue-600 underline hover:text-blue-800">
            {bug.creator_detail?.real_name || bug.creator}
          </a>
        </div>
      </FormField>

      {/* Modified */}
      <FormField label="Modified">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm">{formatDate(bug.last_change_time)}</span>
          <span className="text-gray-600">
            (
            <a href="#" className="text-blue-600 underline hover:text-blue-800">
              History
            </a>
            )
          </span>
        </div>
      </FormField>

      {/* Backlog Duration */}
      <FormField label="Backlog Duration">
        <div className="flex items-center gap-2">
          <span>{bug.backlog_duration || 0} day(s)</span>
          <Info className="w-4 h-4 text-gray-500" title="Time since bug was reported" />
        </div>
      </FormField>

      {/* MPT Due Date */}
      <FormField label="MPT Due Date">
        <span>{bug.mpt_due_date || "None"}</span>
      </FormField>

      {/* CC List */}
      <FormField label="CC List">
        <div className="flex items-center gap-2">
          <span>{bug.cc?.length || 0} user(s)</span>
          <span className="text-gray-600">
            (
            <a href="#" className="text-blue-600 underline hover:text-blue-800">
              edit
            </a>
            )
          </span>
        </div>
      </FormField>

      {/* Reported Release */}
      <FormField label="Reported Release">
        <VintageSelect
          value={bug.reported_release || "Unknown"}
          onValueChange={(value) => onChange("reported_release", value)}
          className="w-48"
        >
          <SelectItem value="Unknown">---</SelectItem>
          <SelectItem value="Cloud-Edition">Cloud-Edition</SelectItem>
          <SelectItem value="Enterprise-Edition">Enterprise-Edition</SelectItem>
          <SelectItem value="On-Premise">On-Premise</SelectItem>
        </VintageSelect>
      </FormField>

      {/* Reported Cloud Edition */}
      <FormField label="Reported Cloud Edition">
        <VintageSelect
          value={bug.reported_cloud_edition || "Unknown"}
          onValueChange={(value) => onChange("reported_cloud_edition", value)}
          className="w-48"
        >
          <SelectItem value="Unknown">---</SelectItem>
          <SelectItem value="Standard">Standard</SelectItem>
          <SelectItem value="Enterprise">Enterprise</SelectItem>
          <SelectItem value="Premium">Premium</SelectItem>
        </VintageSelect>
      </FormField>

      {/* Reported Branch */}
      <FormField label="Reported Branch">
        <VintageInput
          value={bug.reported_branch || ""}
          onChange={(e) => onChange("reported_branch", e.target.value)}
          className="w-full"
        />
      </FormField>

      {/* Reported HANA Cloud Instance(s) */}
      <FormField label="Reported HANA Cloud Instance(s)">
        <div className="space-y-2">
          <TagInput
            value={bug.reported_hana_instances || []}
            onChange={(instances) => onChange("reported_hana_instances", instances)}
            placeholder="instance_guid"
            className="w-full"
          />
          <div className="text-xs text-gray-600">
            Sum of reported instances: {bug.reported_hana_instances?.length || 0}
            <br />
            Format for instances:{" "}
            <a href="#" className="text-blue-600 underline hover:text-blue-800">
              UUID v4 (e.g., abcdefab-0123-4567-89ab-cdef12345678)
            </a>
          </div>
        </div>
      </FormField>

      {/* CVSS Score */}
      <FormField label="CVSS Score">
        <VintageInput
          type="number"
          value={bug.cvss_score || ""}
          onChange={(e) => onChange("cvss_score", Number.parseFloat(e.target.value) || undefined)}
          className="w-32"
          min="0"
          max="10"
          step="0.1"
        />
      </FormField>

      {/* URL */}
      <FormField label="URL">
        <VintageInput
          value={bug.url || ""}
          onChange={(e) => onChange("url", e.target.value)}
          type="url"
          className="w-full"
        />
      </FormField>

      {/* Keywords */}
      <FormField label="Keywords">
        <TagInput
          value={bug.keywords || []}
          onChange={(keywords) => onChange("keywords", keywords)}
          placeholder="Add keyword..."
          className="w-full"
        />
      </FormField>

      {/* Additional tags */}
      <FormField label="Additional tags">
        <TagInput
          value={bug.additional_tags || []}
          onChange={(tags) => onChange("additional_tags", tags)}
          placeholder="Add tag..."
          className="w-full"
        />
      </FormField>

      {/* Problem Identifier */}
      <FormField label="Problem Identifier">
        <TagInput
          value={bug.problem_identifier || []}
          onChange={(ids) => onChange("problem_identifier", ids)}
          placeholder="Add problem ID..."
          className="w-full"
        />
      </FormField>

      {/* Alias */}
      <FormField label="Alias">
        <div className="flex items-center gap-2">
          <span>{bug.alias?.join(", ") || "None"}</span>
          <span className="text-gray-600">
            (
            <a href="#" className="text-blue-600 underline hover:text-blue-800">
              edit
            </a>
            )
          </span>
        </div>
      </FormField>

      {/* Internal Messages */}
      <FormField label="Internal Messages">
        <VintageTextarea
          value={bug.internal_messages || ""}
          onChange={(e) => onChange("internal_messages", e.target.value)}
          rows={3}
          className="w-full"
        />
      </FormField>

      {/* Customer Messages */}
      <FormField label="Customer Messages">
        <VintageTextarea
          value={bug.customer_messages || ""}
          onChange={(e) => onChange("customer_messages", e.target.value)}
          rows={3}
          className="w-full"
        />
      </FormField>

      {/* Affected Customers */}
      <FormField label="Affected Customers">
        <div className="space-y-2">
          <TagInput
            value={bug.affected_customers || []}
            onChange={(customers) => onChange("affected_customers", customers)}
            placeholder="Choose one or more customers"
            className="w-full"
          />
          <a href="#" className="text-blue-600 underline hover:text-blue-800 text-sm">
            Customer missing in this list?
          </a>
        </div>
      </FormField>

      {/* Internal Stakeholders */}
      <FormField label="Internal Stakeholders">
        <TagInput
          value={bug.internal_stakeholders || []}
          onChange={(stakeholders) => onChange("internal_stakeholders", stakeholders)}
          placeholder="Add stakeholder..."
          className="w-full"
        />
      </FormField>
    </div>
  )
}
