"use client"

import type { BugData, FieldConfig } from "@/types/bug"
import { FormField } from "@/components/ui/form-field"
import { VintageInput, VintageTextarea, VintageSelect } from "@/components/ui/vintage-input"
import { SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface BugFormLeftProps {
  bug: BugData
  onChange: (field: keyof BugData, value: any) => void
}

export function BugFormLeft({ bug, onChange }: BugFormLeftProps) {
  const leftFields: FieldConfig[] = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "NEW", label: "NEW" },
        { value: "ASSIGNED", label: "ASSIGNED" },
        { value: "REOPENED", label: "REOPENED" },
        { value: "RESOLVED", label: "RESOLVED" },
        { value: "VERIFIED", label: "VERIFIED" },
        { value: "CLOSED", label: "CLOSED" },
      ],
    },
    {
      key: "product",
      label: "Product",
      type: "select",
      options: [
        { value: "NewDB", label: "NewDB" },
        { value: "HANA Cloud", label: "HANA Cloud" },
        { value: "FoodReplicator", label: "FoodReplicator" },
      ],
    },
    {
      key: "component",
      label: "Component",
      type: "select",
      options: [
        { value: "Crash Consulting", label: "Crash Consulting" },
        { value: "Database", label: "Database" },
        { value: "SaltSprinkler", label: "SaltSprinkler" },
      ],
    },
    {
      key: "priority",
      label: "Importance",
      type: "select",
      options: [
        { value: "High", label: "High" },
        { value: "Medium", label: "Medium" },
        { value: "Low", label: "Low" },
      ],
    },
    {
      key: "op_sys",
      label: "OS",
      type: "select",
      options: [
        { value: "All", label: "All" },
        { value: "Linux", label: "Linux" },
        { value: "Windows", label: "Windows" },
        { value: "macOS", label: "macOS" },
      ],
    },
  ]

  return (
    <div className="space-y-4">
      {leftFields.map((field) => (
        <FormField key={field.key} label={field.label}>
          {field.type === "select" ? (
            <VintageSelect
              value={String(bug[field.key] || "N/A")}
              onValueChange={(value) => onChange(field.key, value)}
              className="w-48"
            >
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </VintageSelect>
          ) : (
            <VintageInput
              value={String(bug[field.key] || "")}
              onChange={(e) => onChange(field.key, e.target.value)}
              monospace={field.monospace}
            />
          )}
        </FormField>
      ))}

      {/* Component with external link */}
      <FormField label="Component">
        <div className="flex items-center gap-2">
          <VintageSelect
            value={bug.component || "N/A"}
            onValueChange={(value) => onChange("component", value)}
            className="w-48"
          >
            <SelectItem value="Crash Consulting">Crash Consulting</SelectItem>
            <SelectItem value="Database">Database</SelectItem>
            <SelectItem value="SaltSprinkler">SaltSprinkler</SelectItem>
          </VintageSelect>
          <a href="#" className="text-blue-600 underline hover:text-blue-800 text-sm">
            show other bugs
          </a>
        </div>
      </FormField>

      {/* Symptom */}
      <FormField label="Symptom">
        <VintageInput
          value={bug.symptom || ""}
          onChange={(e) => onChange("symptom", e.target.value)}
          monospace
          className="w-full"
        />
      </FormField>

      {/* Steps to reproduce */}
      <FormField label="Steps to reproduce">
        <VintageTextarea
          value={bug.steps_to_reproduce || ""}
          onChange={(e) => onChange("steps_to_reproduce", e.target.value)}
          rows={4}
          monospace
        />
      </FormField>

      {/* Workaround */}
      <FormField label="Workaround">
        <VintageTextarea
          value={bug.workaround || ""}
          onChange={(e) => onChange("workaround", e.target.value)}
          rows={3}
          monospace
        />
      </FormField>

      {/* Root cause */}
      <FormField label="Root cause">
        <VintageTextarea
          value={bug.root_cause || ""}
          onChange={(e) => onChange("root_cause", e.target.value)}
          rows={3}
          monospace
        />
      </FormField>

      {/* Solution */}
      <FormField label="Solution">
        <VintageTextarea
          value={bug.solution || ""}
          onChange={(e) => onChange("solution", e.target.value)}
          rows={3}
          monospace
        />
      </FormField>

      {/* Error Category */}
      <FormField label="Error Category">
        <div className="flex items-center gap-2">
          <VintageSelect
            value={bug.error_category || "N/A"}
            onValueChange={(value) => onChange("error_category", value)}
            className="w-48"
          >
            <SelectItem value="">---</SelectItem>
            <SelectItem value="crash">Crash</SelectItem>
            <SelectItem value="performance">Performance</SelectItem>
            <SelectItem value="data-corruption">Data Corruption</SelectItem>
            <SelectItem value="memory-leak">Memory Leak</SelectItem>
          </VintageSelect>
          <a href="#" className="text-blue-600 underline hover:text-blue-800 text-sm">
            Crash and error categories
          </a>
        </div>
      </FormField>

      {/* Dependencies */}
      <div className="space-y-2">
        <FormField label="Depends on">
          <VintageInput
            value={bug.depends_on?.join(", ") || ""}
            onChange={(e) =>
              onChange(
                "depends_on",
                e.target.value
                  .split(",")
                  .map((n) => Number.parseInt(n.trim()))
                  .filter((n) => !isNaN(n)),
              )
            }
            className="w-full"
          />
        </FormField>
        <FormField label="Blocks">
          <VintageInput
            value={bug.blocks?.join(", ") || ""}
            onChange={(e) =>
              onChange(
                "blocks",
                e.target.value
                  .split(",")
                  .map((n) => Number.parseInt(n.trim()))
                  .filter((n) => !isNaN(n)),
              )
            }
            className="w-full"
          />
        </FormField>
        <div className="ml-36 text-sm">
          Show dependency{" "}
          <a href="#" className="text-blue-600 underline hover:text-blue-800">
            tree
          </a>
          {" / "}
          <a href="#" className="text-blue-600 underline hover:text-blue-800">
            graph
          </a>
        </div>
      </div>

      {/* Testcase info */}
      <div className="space-y-2">
        <FormField label="Testcase exists">
          <VintageSelect
            value={bug.testcase_exists ? "yes" : "no"}
            onValueChange={(value) => onChange("testcase_exists", value === "yes")}
            className="w-32"
          >
            <SelectItem value="">---</SelectItem>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </VintageSelect>
        </FormField>
        <FormField label="Testcases">
          <VintageInput
            value={bug.testcases || ""}
            onChange={(e) => onChange("testcases", e.target.value)}
            placeholder="e.g. testAlterTable.py -t 42"
            monospace
            className="w-full"
          />
        </FormField>
      </div>

      {/* Gerrit links */}
      <FormField label="Gerrit link(s) for fix">
        <div className="flex gap-2">
          <VintageInput
            value={bug.gerrit_links?.join(", ") || ""}
            onChange={(e) =>
              onChange(
                "gerrit_links",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter((s) => s),
              )
            }
            className="flex-1"
          />
          <Button variant="outline" size="sm" className="bg-gray-100 border-2 border-gray-400">
            Edit Gerrit Links
          </Button>
        </div>
      </FormField>

      {/* Regression Commit Links */}
      <FormField label="Regression Commit Link(s)">
        <VintageInput
          value={bug.regression_commit_links?.join(", ") || ""}
          onChange={(e) =>
            onChange(
              "regression_commit_links",
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s),
            )
          }
          className="w-full"
        />
      </FormField>

      {/* Reason why not provided */}
      <FormField label="Reason why not provided">
        <VintageTextarea
          value={bug.reason_why_not_provided || ""}
          onChange={(e) => onChange("reason_why_not_provided", e.target.value)}
          rows={2}
        />
      </FormField>

      {/* Jira Links */}
      <FormField label="Jira Link(s)">
        <div className="flex gap-2">
          <VintageInput
            value={bug.jira_links?.join(", ") || ""}
            onChange={(e) =>
              onChange(
                "jira_links",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter((s) => s),
              )
            }
            className="flex-1"
          />
          <Button variant="outline" size="sm" className="bg-gray-100 border-2 border-gray-400">
            Edit Jira Links
          </Button>
        </div>
      </FormField>

      {/* Root Cause Analysis */}
      <FormField label="Root Cause Analysis">
        <VintageSelect
          value={bug.root_cause_analysis || "N/A"}
          onValueChange={(value) => onChange("root_cause_analysis", value)}
          className="w-48"
        >
          <SelectItem value="">---</SelectItem>
          <SelectItem value="Memory Management">Memory Management</SelectItem>
          <SelectItem value="Logic Error">Logic Error</SelectItem>
          <SelectItem value="Configuration Issue">Configuration Issue</SelectItem>
          <SelectItem value="External Dependency">External Dependency</SelectItem>
        </VintageSelect>
      </FormField>
    </div>
  )
}
