"use client"

import { render, screen, fireEvent } from "@testing-library/react"
import { BugFormLeft } from "@/components/bug-form-left"
import { mockBugData } from "@/data/mock-data"
import { jest } from "@jest/globals"

describe("BugFormLeft", () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it("renders all left column fields", () => {
    render(<BugFormLeft bug={mockBugData} onChange={mockOnChange} />)

    expect(screen.getByText("Status")).toBeInTheDocument()
    expect(screen.getByText("Product")).toBeInTheDocument()
    expect(screen.getByText("Component")).toBeInTheDocument()
    expect(screen.getByText("Importance")).toBeInTheDocument()
    expect(screen.getByText("OS")).toBeInTheDocument()
    expect(screen.getByText("Symptom")).toBeInTheDocument()
    expect(screen.getByText("Steps to reproduce")).toBeInTheDocument()
    expect(screen.getByText("Workaround")).toBeInTheDocument()
    expect(screen.getByText("Root cause")).toBeInTheDocument()
    expect(screen.getByText("Solution")).toBeInTheDocument()
    expect(screen.getByText("Error Category")).toBeInTheDocument()
    expect(screen.getByText("Depends on")).toBeInTheDocument()
    expect(screen.getByText("Blocks")).toBeInTheDocument()
    expect(screen.getByText("Testcase exists")).toBeInTheDocument()
    expect(screen.getByText("Testcases")).toBeInTheDocument()
    expect(screen.getByText("Gerrit link(s) for fix")).toBeInTheDocument()
    expect(screen.getByText("Regression Commit Link(s)")).toBeInTheDocument()
    expect(screen.getByText("Reason why not provided")).toBeInTheDocument()
    expect(screen.getByText("Jira Link(s)")).toBeInTheDocument()
    expect(screen.getByText("Root Cause Analysis")).toBeInTheDocument()
  })

  it("displays bug data correctly", () => {
    render(<BugFormLeft bug={mockBugData} onChange={mockOnChange} />)

    expect(screen.getByDisplayValue("REOPENED")).toBeInTheDocument()
    expect(screen.getByDisplayValue("NewDB")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Crash Consulting")).toBeInTheDocument()
    expect(screen.getByDisplayValue("High")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Linux")).toBeInTheDocument()
    expect(screen.getByDisplayValue("crash_callstack_string")).toBeInTheDocument()
  })

  it("handles field changes", () => {
    render(<BugFormLeft bug={mockBugData} onChange={mockOnChange} />)

    const symptomInput = screen.getByDisplayValue("crash_callstack_string")
    fireEvent.change(symptomInput, { target: { value: "new symptom" } })

    expect(mockOnChange).toHaveBeenCalledWith("symptom", "new symptom")
  })

  it("handles dropdown changes", () => {
    render(<BugFormLeft bug={mockBugData} onChange={mockOnChange} />)

    const statusSelect = screen.getByDisplayValue("REOPENED")
    fireEvent.change(statusSelect, { target: { value: "RESOLVED" } })

    expect(mockOnChange).toHaveBeenCalledWith("status", "RESOLVED")
  })

  it("handles textarea changes", () => {
    render(<BugFormLeft bug={mockBugData} onChange={mockOnChange} />)

    const stepsTextarea = screen.getByDisplayValue(/Execute complex query/)
    fireEvent.change(stepsTextarea, { target: { value: "New steps" } })

    expect(mockOnChange).toHaveBeenCalledWith("steps_to_reproduce", "New steps")
  })

  it("shows external links", () => {
    render(<BugFormLeft bug={mockBugData} onChange={mockOnChange} />)

    expect(screen.getByText("show other bugs")).toBeInTheDocument()
    expect(screen.getByText("Crash and error categories")).toBeInTheDocument()
    expect(screen.getByText("tree")).toBeInTheDocument()
    expect(screen.getByText("graph")).toBeInTheDocument()
  })

  it("shows action buttons", () => {
    render(<BugFormLeft bug={mockBugData} onChange={mockOnChange} />)

    expect(screen.getByText("Edit Gerrit Links")).toBeInTheDocument()
    expect(screen.getByText("Edit Jira Links")).toBeInTheDocument()
  })

  it("handles dependency fields correctly", () => {
    render(<BugFormLeft bug={mockBugData} onChange={mockOnChange} />)

    const dependsOnInput = screen.getByDisplayValue("338661")
    fireEvent.change(dependsOnInput, { target: { value: "338661, 338660" } })

    expect(mockOnChange).toHaveBeenCalledWith("depends_on", [338661, 338660])
  })
})
