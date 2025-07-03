"use client"

import { render, screen, fireEvent } from "@testing-library/react"
import { BugFormRight } from "@/components/bug-form-right"
import { mockBugData } from "@/data/mock-data"
import { jest } from "@jest/globals"

describe("BugFormRight", () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it("renders all right column fields", () => {
    render(<BugFormRight bug={mockBugData} onChange={mockOnChange} />)

    expect(screen.getByText("Assigned To")).toBeInTheDocument()
    expect(screen.getByText("QA Contact")).toBeInTheDocument()
    expect(screen.getByText("Reported")).toBeInTheDocument()
    expect(screen.getByText("Modified")).toBeInTheDocument()
    expect(screen.getByText("Backlog Duration")).toBeInTheDocument()
    expect(screen.getByText("MPT Due Date")).toBeInTheDocument()
    expect(screen.getByText("CC List")).toBeInTheDocument()
    expect(screen.getByText("Reported Release")).toBeInTheDocument()
    expect(screen.getByText("Reported Cloud Edition")).toBeInTheDocument()
    expect(screen.getByText("Reported Branch")).toBeInTheDocument()
    expect(screen.getByText("Reported HANA Cloud Instance(s)")).toBeInTheDocument()
    expect(screen.getByText("CVSS Score")).toBeInTheDocument()
    expect(screen.getByText("URL")).toBeInTheDocument()
    expect(screen.getByText("Keywords")).toBeInTheDocument()
    expect(screen.getByText("Additional tags")).toBeInTheDocument()
    expect(screen.getByText("Problem Identifier")).toBeInTheDocument()
    expect(screen.getByText("Alias")).toBeInTheDocument()
    expect(screen.getByText("Internal Messages")).toBeInTheDocument()
    expect(screen.getByText("Customer Messages")).toBeInTheDocument()
    expect(screen.getByText("Affected Customers")).toBeInTheDocument()
    expect(screen.getByText("Internal Stakeholders")).toBeInTheDocument()
  })

  it("displays formatted dates", () => {
    render(<BugFormRight bug={mockBugData} onChange={mockOnChange} />)

    // Check that dates are formatted and displayed
    expect(screen.getByText(/05\/20\/2025/)).toBeInTheDocument()
    expect(screen.getByText(/07\/02\/2025/)).toBeInTheDocument()
  })

  it("displays user information with edit links", () => {
    render(<BugFormRight bug={mockBugData} onChange={mockOnChange} />)

    expect(screen.getByText("Kang, Sanghun")).toBeInTheDocument()
    expect(screen.getAllByText("edit")).toHaveLength(4) // Assigned To, QA Contact, CC List, Alias
  })

  it("handles CVSS score input", () => {
    render(<BugFormRight bug={mockBugData} onChange={mockOnChange} />)

    const cvssInput = screen.getByDisplayValue("7.5")
    fireEvent.change(cvssInput, { target: { value: "8.0" } })

    expect(mockOnChange).toHaveBeenCalledWith("cvss_score", 8.0)
  })

  it("handles text input changes", () => {
    render(<BugFormRight bug={mockBugData} onChange={mockOnChange} />)

    const branchInput = screen.getByDisplayValue("main")
    fireEvent.change(branchInput, { target: { value: "develop" } })

    expect(mockOnChange).toHaveBeenCalledWith("reported_branch", "develop")
  })

  it("handles textarea changes", () => {
    render(<BugFormRight bug={mockBugData} onChange={mockOnChange} />)

    const internalMessagesTextarea = screen.getByDisplayValue(/Critical issue affecting/)
    fireEvent.change(internalMessagesTextarea, { target: { value: "Updated message" } })

    expect(mockOnChange).toHaveBeenCalledWith("internal_messages", "Updated message")
  })

  it("shows backlog duration with tooltip", () => {
    render(<BugFormRight bug={mockBugData} onChange={mockOnChange} />)

    expect(screen.getByText("42 day(s)")).toBeInTheDocument()
  })

  it("shows CC list count", () => {
    render(<BugFormRight bug={mockBugData} onChange={mockOnChange} />)

    expect(screen.getByText("2 user(s)")).toBeInTheDocument()
  })

  it("shows HANA instance count and format hint", () => {
    render(<BugFormRight bug={mockBugData} onChange={mockOnChange} />)

    expect(screen.getByText("Sum of reported instances: 2")).toBeInTheDocument()
    expect(screen.getByText(/UUID v4/)).toBeInTheDocument()
  })

  it("shows customer missing link", () => {
    render(<BugFormRight bug={mockBugData} onChange={mockOnChange} />)

    expect(screen.getByText("Customer missing in this list?")).toBeInTheDocument()
  })
})
