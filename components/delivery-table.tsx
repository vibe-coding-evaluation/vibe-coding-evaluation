"use client"

import { useState } from "react"
import type { DeliveryTableRow } from "@/types/delivery-table"
import {
  initialDeliveryTableRows,
  affectedOptions,
  deliveryOptions,
  releaseBlockerOptions,
} from "@/data/delivery-table-data"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

// In-memory storage for delivery table updates
const deliveryTableUpdates = new Map<string, Partial<DeliveryTableRow>>()

export function DeliveryTable() {
  const [rows, setRows] = useState<DeliveryTableRow[]>(() => {
    // Apply any stored updates on initialization
    return initialDeliveryTableRows.map((row) => {
      const updates = deliveryTableUpdates.get(row.id)
      return updates ? { ...row, ...updates } : row
    })
  })
  const [showInactive, setShowInactive] = useState(false)
  const [saving, setSaving] = useState(false)
  const [minorUpdate, setMinorUpdate] = useState(false)

  const updateRow = (id: string, field: keyof DeliveryTableRow, value: string) => {
    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: value }

          // Store updates in memory
          const existingUpdates = deliveryTableUpdates.get(id) || {}
          deliveryTableUpdates.set(id, { ...existingUpdates, [field]: value })

          return updatedRow
        }
        return row
      }),
    )
  }

  const handleSave = async () => {
    setSaving(true)

    // Simulate save operation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSaving(false)
    console.log("Delivery table saved:", rows)
    console.log("Minor update:", minorUpdate)
    console.log("Stored updates:", Object.fromEntries(deliveryTableUpdates))
  }

  return (
    <div className="bg-white border-2 border-gray-300 shadow-sm">
      {/* Header */}
      <div className="bg-gray-500 text-white px-3 py-2 font-bold text-sm border-b-2 border-gray-300">
        Delivery Table
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-400 text-white border-b-2 border-gray-300">
              <th className="border-r border-gray-300 px-3 py-2 text-left text-sm font-bold">
                Code Line <span className="font-normal">(Branch)</span>
              </th>
              <th className="border-r border-gray-300 px-3 py-2 text-left text-sm font-bold">Affected</th>
              <th className="border-r border-gray-300 px-3 py-2 text-left text-sm font-bold">Delivery</th>
              <th className="border-r border-gray-300 px-3 py-2 text-left text-sm font-bold">Release Blocker</th>
              <th className="border-r border-gray-300 px-3 py-2 text-left text-sm font-bold">Target Release</th>
              <th className="border-r border-gray-300 px-3 py-2 text-left text-sm font-bold">Fixed in Code Line</th>
              <th className="border-r border-gray-300 px-3 py-2 text-left text-sm font-bold">Shipped Release</th>
              <th className="px-3 py-2 text-left text-sm font-bold">Delivery Remark</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {/* Code Line */}
                <td className="border-r border-gray-300 px-3 py-2 text-sm">
                  <div className="font-medium">{row.codeLine}</div>
                  <div className="text-gray-600 text-xs font-mono">({row.branch})</div>
                </td>

                {/* Affected */}
                <td className="border-r border-gray-300 px-3 py-2">
                  <select
                    value={row.affected}
                    onChange={(e) => updateRow(row.id, "affected", e.target.value)}
                    className="w-20 text-xs border-2 border-gray-400 bg-white font-mono px-1 py-1 rounded-none"
                  >
                    {affectedOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Delivery */}
                <td className="border-r border-gray-300 px-3 py-2">
                  {row.deliveryDisabled ? (
                    <span className="text-xs text-gray-400 font-mono">not set</span>
                  ) : (
                    <select
                      value={row.delivery}
                      onChange={(e) => updateRow(row.id, "delivery", e.target.value)}
                      className="w-20 text-xs border-2 border-gray-400 bg-white font-mono px-1 py-1 rounded-none"
                    >
                      {deliveryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                </td>

                {/* Release Blocker */}
                <td className="border-r border-gray-300 px-3 py-2">
                  {row.releaseBlockerDisabled ? (
                    <span className="text-xs text-gray-400 font-mono">not set</span>
                  ) : (
                    <select
                      value={row.releaseBlocker}
                      onChange={(e) => updateRow(row.id, "releaseBlocker", e.target.value)}
                      className="w-20 text-xs border-2 border-gray-400 bg-white font-mono px-1 py-1 rounded-none"
                    >
                      {releaseBlockerOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                </td>

                {/* Target Release */}
                <td className="border-r border-gray-300 px-3 py-2">
                  <input
                    type="text"
                    value={row.targetRelease}
                    onChange={(e) => updateRow(row.id, "targetRelease", e.target.value)}
                    className="w-24 text-xs border-2 border-gray-400 bg-white font-mono px-1 py-1 rounded-none"
                  />
                </td>

                {/* Fixed in Code Line */}
                <td className="border-r border-gray-300 px-3 py-2">
                  <input
                    type="text"
                    value={row.fixedInCodeLine}
                    onChange={(e) => updateRow(row.id, "fixedInCodeLine", e.target.value)}
                    className="w-24 text-xs border-2 border-gray-400 bg-white font-mono px-1 py-1 rounded-none"
                  />
                </td>

                {/* Shipped Release */}
                <td className="border-r border-gray-300 px-3 py-2">
                  <input
                    type="text"
                    value={row.shippedRelease}
                    onChange={(e) => updateRow(row.id, "shippedRelease", e.target.value)}
                    className="w-24 text-xs border-2 border-gray-400 bg-white font-mono px-1 py-1 rounded-none"
                  />
                </td>

                {/* Delivery Remark */}
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Add Remarks:</span>
                    <input
                      type="text"
                      value={row.deliveryRemark}
                      onChange={(e) => updateRow(row.id, "deliveryRemark", e.target.value)}
                      className="flex-1 text-xs border-2 border-gray-400 bg-white font-mono px-1 py-1 rounded-none"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-300 p-3 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs">
            <span className="text-gray-600">out of maintenance</span>
            <button
              onClick={() => setShowInactive(!showInactive)}
              className="text-blue-600 underline hover:text-blue-800"
            >
              Show inactive codelines
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-4 text-xs">
              <a href="#" className="text-blue-600 underline hover:text-blue-800">
                Bugzilla FAQ
              </a>
              <a href="#" className="text-blue-600 underline hover:text-blue-800">
                Developer FAQ
              </a>
              <a href="#" className="text-blue-600 underline hover:text-blue-800">
                Delivery Schedule
              </a>
              <button className="border-2 border-gray-400 px-2 py-1 bg-white text-xs hover:bg-gray-100 rounded-none">
                Delivery Graph
              </button>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-gray-100 border-2 border-gray-400 text-black hover:bg-gray-200 text-xs px-3 py-1 h-auto rounded-none"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <div className="flex items-center gap-2">
                <label htmlFor="minor-update-delivery" className="text-xs cursor-pointer">
                  This is a minor update (do not send email)
                </label>
                <Checkbox
                  id="minor-update-delivery"
                  checked={minorUpdate}
                  onCheckedChange={(checked) => setMinorUpdate(!!checked)}
                  className="border-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
