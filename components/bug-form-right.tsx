"use client"

import type { BugData } from "@/types/bug"
import { FormField } from "@/components/ui/form-field"
import { VintageInput, VintageTextarea, VintageSelect } from "@/components/ui/vintage-input"
import { SelectItem } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

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

      <FormField label="Reported">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm">{formatDate(bug.creation_time)}</span>
          <span>by</span>
          <a href="#" className="text-blue-600 underline hover:text-blue-800">
            {bug.creator_detail?.real_name || bug.creator}
          </a>
        </div>
      </FormField>

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

      <FormField label="Backlog Duration">
        <div className="flex items-center gap-2">
          <span>{bug.backlog_duration || 0} day(s)</span>
          <span className="text-gray-600">ⓘ</span>
        </div>
      </FormField>

      <FormField label="MPT Due Date">
        <span>{bug.mpt_due_date || "None"}</span>
      </FormField>

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

      <FormField label="Reported Release">
        <VintageSelect
          value={bug.reported_release || "Unknown"}
          onValueChange={(value) => onChange("reported_release", value)}
          className="w-48"
        >
          <SelectItem value="Unknown">---</SelectItem>
          <SelectItem value="Cloud-Edition">Cloud-Edition</SelectItem>
          <SelectItem value="On-Premise">On-Premise</SelectItem>
        </VintageSelect>
      </FormField>

      <FormField label="Reported Cloud Edition">
        <VintageSelect
          value={bug.reported_cloud_edition || "Unknown"}
          onValueChange={(value) => onChange("reported_cloud_edition", value)}
          className="w-48"
        >
          <SelectItem value="Unknown">---</SelectItem>
          <SelectItem value="Standard">Standard</SelectItem>
          <SelectItem value="Enterprise">Enterprise</SelectItem>
        </VintageSelect>
      </FormField>

      <FormField label="Reported Branch">
        <VintageInput value={bug.reported_branch || ""} onChange={(e) => onChange("reported_branch", e.target.value)} />
      </FormField>

      <FormField label="Reported HANA Cloud Instance(s)">
        <div className="space-y-2">
          <VintageInput
            value={bug.reported_hana_instances?.join(", ") || ""}
            onChange={(e) =>
              onChange(
                "reported_hana_instances",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter((s) => s),
              )
            }
            placeholder="instance_guid"
          />
          <div className="flex flex-wrap gap-1">
            {bug.reported_hana_instances?.map((instance, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {instance}
                <X
                  className="w-3 h-3 ml-1 cursor-pointer"
                  onClick={() => {
                    const newInstances = bug.reported_hana_instances?.filter((_, i) => i !== index)
                    onChange("reported_hana_instances", newInstances)
                  }}
                />
              </Badge>
            ))}
          </div>
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

      <FormField label="URL">
        <VintageInput value={bug.url || ""} onChange={(e) => onChange("url", e.target.value)} type="url" />
      </FormField>

      <FormField label="Keywords">
        <VintageInput
          value={bug.keywords?.join(", ") || ""}
          onChange={(e) =>
            onChange(
              "keywords",
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s),
            )
          }
          monospace
        />
      </FormField>

      <FormField label="Additional tags">
        <VintageInput
          value={bug.additional_tags?.join(", ") || ""}
          onChange={(e) =>
            onChange(
              "additional_tags",
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s),
            )
          }
        />
      </FormField>

      <FormField label="Problem Identifier">
        <div className="flex flex-wrap gap-1">
          {bug.problem_identifier?.map((id, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {id}
              <X
                className="w-3 h-3 ml-1 cursor-pointer"
                onClick={() => {
                  const newIds = bug.problem_identifier?.filter((_, i) => i !== index)
                  onChange("problem_identifier", newIds)
                }}
              />
            </Badge>
          ))}
        </div>
      </FormField>

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

      <FormField label="Internal Messages">
        <VintageTextarea
          value={bug.internal_messages || ""}
          onChange={(e) => onChange("internal_messages", e.target.value)}
          rows={3}
        />
      </FormField>

      <FormField label="Customer Messages">
        <VintageTextarea
          value={bug.customer_messages || ""}
          onChange={(e) => onChange("customer_messages", e.target.value)}
          rows={3}
        />
      </FormField>

      <FormField label="Affected Customers">
        <div className="space-y-2">
          <VintageTextarea
            value={bug.affected_customers?.join("\n") || ""}
            onChange={(e) =>
              onChange(
                "affected_customers",
                e.target.value.split("\n").filter((s) => s.trim()),
              )
            }
            placeholder="Choose one or more customers"
            rows={3}
          />
          <a href="#" className="text-blue-600 underline hover:text-blue-800 text-sm">
            Customer missing in this list?
          </a>
        </div>
      </FormField>

      <FormField label="Internal Stakeholders">
        <div className="flex flex-wrap gap-1">
          {bug.internal_stakeholders?.map((stakeholder, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {stakeholder}
              <X
                className="w-3 h-3 ml-1 cursor-pointer"
                onClick={() => {
                  const newStakeholders = bug.internal_stakeholders?.filter((_, i) => i !== index)
                  onChange("internal_stakeholders", newStakeholders)
                }}
              />
            </Badge>
          ))}
        </div>
      </FormField>
    </div>
  )
}
