"use client"

import { useState } from "react"
import type { DeliveryMatrixRow } from "@/types/delivery"
import { Button } from "@/components/ui/button"

const initialRows: DeliveryMatrixRow[] = [
  {
    id: "sp05",
    codeLine: "2.0 SP05",
    branch: "(hana2sp05)",
    affected: "not set",
    delivery: "not set",
    releaseBlocker: "not set",
    targetRelease: "",
    fixedInCodeLine: "",
    shippedRelease: "",
    deliveryRemark: "",
  },
  {
    id: "sp07",
    codeLine: "2.0 SP07",
    branch: "(hana2sp07)",
    affected: "not set",
    delivery: "not set",
    releaseBlocker: "not set",
    targetRelease: "",
    fixedInCodeLine: "",
    shippedRelease: "",
    deliveryRemark: "",
  },
  {
    id: "sp08",
    codeLine: "2.0 SP08",
    branch: "(hana2sp08)",
    affected: "not set",
    delivery: "not set",
    releaseBlocker: "not set",
    targetRelease: "",
    fixedInCodeLine: "",
    shippedRelease: "",
    deliveryRemark: "",
  },
  {
    id: "sp09",
    codeLine: "2.0 SP09",
    branch: "(orange)",
    affected: "not set",
    delivery: "not set",
    releaseBlocker: "not set",
    targetRelease: "",
    fixedInCodeLine: "",
    shippedRelease: "",
    deliveryRemark: "",
  },
  {
    id: "q2qrc",
    codeLine: "2024 Q2 QRC",
    branch: "(CE2024.14)",
    affected: "not set",
    delivery: "not set",
    releaseBlocker: "not set",
    targetRelease: "",
    fixedInCodeLine: "",
    shippedRelease: "",
    deliveryRemark: "",
  },
  {
    id: "q3qrc",
    codeLine: "2024 Q3 QRC",
    branch: "(CE2024.28)",
    affected: "not set",
    delivery: "not set",
    releaseBlocker: "not set",
    targetRelease: "",
    fixedInCodeLine: "",
    shippedRelease: "",
    deliveryRemark: "",
  },
  {
    id: "q4qrc",
    codeLine: "2024 Q4 QRC",
    branch: "(CE2024.40)",
    affected: "not set",
    delivery: "not set",
    releaseBlocker: "not set",
    targetRelease: "",
    fixedInCodeLine: "",
    shippedRelease: "",
    deliveryRemark: "",
  },
  {
    id: "q1qrc2025",
    codeLine: "2025 Q1 QRC",
    branch: "(CE2025.2)",
    affected: "not set",
    delivery: "not set",
    releaseBlocker: "not set",
    targetRelease: "",
    fixedInCodeLine: "",
    shippedRelease: "",
    deliveryRemark: "",
  },
  {
    id: "hanacloud",
    codeLine: "HANA Cloud",
    branch: "(master)",
    affected: "not set",
    delivery: "",
    releaseBlocker: "",
    targetRelease: "",
    fixedInCodeLine: "",
    shippedRelease: "",
    deliveryRemark: "",
  },
]

const affectedOptions = ["not set", "---", "yes", "no"]
const deliveryOptions = ["not set", "---", "yes", "no", "planned"]
const releaseBlockerOptions = ["not set", "---", "yes", "no"]

export function DeliveryMatrix() {
  const [rows, setRows] = useState<DeliveryMatrixRow[]>(initialRows)
  const [saving, setSaving] = useState(false)

  const updateRow = (id: string, field: keyof DeliveryMatrixRow, value: string) => {
    setRows((prevRows) => prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row)))
  }

  const handleSave = async () => {
    setSaving(true)
    // Simulate save operation
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    console.log("Delivery matrix saved:", rows)
  }

  return (
    <div className="bg-white border border-gray-400 shadow-sm">
      {/* Header */}
      <div className="bg-gray-400 text-white px-3 py-2 font-bold text-sm">Delivery Table</div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-2 py-1 text-left text-xs font-normal">
                Code Line <span className="font-normal">(Branch)</span>
              </th>
              <th className="border border-gray-300 px-2 py-1 text-left text-xs font-normal">Affected</th>
              <th className="border border-gray-300 px-2 py-1 text-left text-xs font-normal">Delivery</th>
              <th className="border border-gray-300 px-2 py-1 text-left text-xs font-normal">Release Blocker</th>
              <th className="border border-gray-300 px-2 py-1 text-left text-xs font-normal">Target Release</th>
              <th className="border border-gray-300 px-2 py-1 text-left text-xs font-normal">Fixed in Code Line</th>
              <th className="border border-gray-300 px-2 py-1 text-left text-xs font-normal">Shipped Release</th>
              <th className="border border-gray-300 px-2 py-1 text-left text-xs font-normal">Delivery Remark</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {/* Code Line */}
                <td className="border border-gray-300 px-2 py-1 text-xs">
                  <div className="font-medium">{row.codeLine}</div>
                  <div className="text-gray-600 text-xs">{row.branch}</div>
                </td>

                {/* Affected */}
                <td className="border border-gray-300 px-2 py-1">
                  <select
                    value={row.affected}
                    onChange={(e) => updateRow(row.id, "affected", e.target.value)}
                    className="w-20 text-xs border border-gray-400 bg-white font-mono"
                  >
                    {affectedOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Delivery */}
                <td className="border border-gray-300 px-2 py-1">
                  {row.id === "hanacloud" ? (
                    <span className="text-xs text-gray-400">-</span>
                  ) : (
                    <select
                      value={row.delivery}
                      onChange={(e) => updateRow(row.id, "delivery", e.target.value)}
                      className="w-20 text-xs border border-gray-400 bg-white font-mono"
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
                <td className="border border-gray-300 px-2 py-1">
                  {row.id === "hanacloud" ? (
                    <span className="text-xs text-gray-400">-</span>
                  ) : (
                    <select
                      value={row.releaseBlocker}
                      onChange={(e) => updateRow(row.id, "releaseBlocker", e.target.value)}
                      className="w-20 text-xs border border-gray-400 bg-white font-mono"
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
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="text"
                    value={row.targetRelease}
                    onChange={(e) => updateRow(row.id, "targetRelease", e.target.value)}
                    className="w-24 text-xs border border-gray-400 bg-white font-mono px-1"
                  />
                </td>

                {/* Fixed in Code Line */}
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="text"
                    value={row.fixedInCodeLine}
                    onChange={(e) => updateRow(row.id, "fixedInCodeLine", e.target.value)}
                    className="w-24 text-xs border border-gray-400 bg-white font-mono px-1"
                  />
                </td>

                {/* Shipped Release */}
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="text"
                    value={row.shippedRelease}
                    onChange={(e) => updateRow(row.id, "shippedRelease", e.target.value)}
                    className="w-24 text-xs border border-gray-400 bg-white font-mono px-1"
                  />
                </td>

                {/* Delivery Remark */}
                <td className="border border-gray-300 px-2 py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Add Remarks:</span>
                    <input
                      type="text"
                      value={row.deliveryRemark}
                      onChange={(e) => updateRow(row.id, "deliveryRemark", e.target.value)}
                      className="flex-1 text-xs border border-gray-400 bg-white font-mono px-1"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-300 p-2 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span>out of maintenance</span>
            <button className="text-blue-600 underline hover:text-blue-800">Show inactive codelines</button>
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
              <button className="border border-gray-400 px-2 py-1 bg-white text-xs">Delivery Graph</button>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gray-100 border border-gray-400 text-black hover:bg-gray-200 text-xs px-3 py-1 h-auto"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
        <div className="text-xs text-gray-600 mt-1">This is a minor update (do not send email)</div>
      </div>
    </div>
  )
}
