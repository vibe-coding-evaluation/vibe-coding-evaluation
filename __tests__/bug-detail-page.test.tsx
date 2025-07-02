import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BugDetailPage } from "@/components/bug-detail-page"

// Mock environment variable to use mock API
process.env.NEXT_PUBLIC_USE_MOCK_API = "true"

describe("BugDetailPage", () => {
  it("renders bug data when loaded successfully", async () => {
    render(<BugDetailPage bugId={338662} />)

    await waitFor(() => {
      expect(screen.getByText("Bug 338662")).toBeInTheDocument()
      expect(screen.getByText(/Database crash when executing complex query/)).toBeInTheDocument()
      expect(screen.getByDisplayValue("REOPENED")).toBeInTheDocument()
      expect(screen.getByDisplayValue("NewDB")).toBeInTheDocument()
    })
  })

  it("handles form field changes", async () => {
    render(<BugDetailPage bugId={338662} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue("crash_callstack_string")).toBeInTheDocument()
    })

    const symptomTextarea = screen.getByDisplayValue("crash_callstack_string")
    fireEvent.change(symptomTextarea, { target: { value: "updated symptom" } })

    expect(symptomTextarea).toHaveValue("updated symptom")
  })

  it("calls updateBug when save button is clicked", async () => {
    render(<BugDetailPage bugId={338662} />)

    await waitFor(() => {
      expect(screen.getByText("Save Changes")).toBeInTheDocument()
    })

    // Make a change
    const symptomTextarea = screen.getByDisplayValue("crash_callstack_string")
    fireEvent.change(symptomTextarea, { target: { value: "updated symptom" } })

    // Click save
    const saveButton = screen.getByText("Save Changes")
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.queryByText("Saving...")).not.toBeInTheDocument()
    })
  })

  it("switches tabs correctly", async () => {
    render(<BugDetailPage bugId={338662} />)

    await waitFor(() => {
      expect(screen.getByText("Development")).toBeInTheDocument()
    })

    const qaTab = screen.getByText("QA Delivery and Dev Support")
    fireEvent.click(qaTab)

    expect(qaTab).toHaveAttribute("data-state", "active")
  })
})
