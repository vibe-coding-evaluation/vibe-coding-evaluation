import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BugDetailPageMock } from "@/components/bug-detail-page-mock"
import { mockServer } from "@/mocks/mock-server"

describe("BugDetailPageMock Integration", () => {
  beforeEach(() => {
    mockServer.reset()
    mockServer.setDelay(0) // Remove delay for faster tests
  })

  it("renders complete bug detail page", async () => {
    render(<BugDetailPageMock bugId={338662} />)

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    })

    // Check header
    expect(screen.getByText("Bug 338662")).toBeInTheDocument()
    expect(screen.getByText(/Database crash when executing complex query/)).toBeInTheDocument()

    // Check tabs
    expect(screen.getByText("Development")).toBeInTheDocument()
    expect(screen.getByText("QA Delivery and Dev Support")).toBeInTheDocument()

    // Check form fields
    expect(screen.getByDisplayValue("REOPENED")).toBeInTheDocument()
    expect(screen.getByDisplayValue("NewDB")).toBeInTheDocument()
    expect(screen.getByDisplayValue("crash_callstack_string")).toBeInTheDocument()
  })

  it("handles form interactions and saves changes", async () => {
    render(<BugDetailPageMock bugId={338662} />)

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    })

    // Find and modify the symptom field
    const symptomField = screen.getByDisplayValue("crash_callstack_string")
    fireEvent.change(symptomField, { target: { value: "updated_crash_info" } })

    // Save changes
    const saveButton = screen.getByText("Save Changes")
    fireEvent.click(saveButton)

    // Wait for save to complete
    await waitFor(() => {
      expect(screen.queryByText("Saving...")).not.toBeInTheDocument()
    })

    // Verify the change was saved (check in mock server)
    const updatedBug = mockServer.getBugFromStore(338662)
    expect(updatedBug?.symptom).toBe("updated_crash_info")
  })

  it("displays error when bug not found", async () => {
    render(<BugDetailPageMock bugId={999999} />)

    await waitFor(() => {
      expect(screen.getByText(/Failed to load bug data/)).toBeInTheDocument()
      expect(screen.getByText(/Bug #999999 does not exist/)).toBeInTheDocument()
    })
  })

  it("handles server errors gracefully", async () => {
    mockServer.setFailureRate(1)

    render(<BugDetailPageMock bugId={338662} />)

    await waitFor(() => {
      expect(screen.getByText(/Failed to load bug data/)).toBeInTheDocument()
      expect(screen.getByText(/Internal server error/)).toBeInTheDocument()
    })
  })

  it("handles network errors", async () => {
    mockServer.setOnline(false)

    render(<BugDetailPageMock bugId={338662} />)

    await waitFor(() => {
      expect(screen.getByText(/Failed to load bug data/)).toBeInTheDocument()
    })
  })

  it("shows loading state", () => {
    mockServer.setDelay(1000) // Long delay to test loading state

    render(<BugDetailPageMock bugId={338662} />)

    expect(screen.getByText("Loading...")).toBeInTheDocument()
    // Should show skeleton loaders
    expect(screen.getAllByTestId("skeleton")).toBeTruthy()
  })

  it("handles tab switching", async () => {
    render(<BugDetailPageMock bugId={338662} />)

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    })

    // Switch to QA tab
    const qaTab = screen.getByText("QA Delivery and Dev Support")
    fireEvent.click(qaTab)

    // Verify tab is active (this depends on your tab implementation)
    expect(qaTab).toHaveAttribute("data-state", "active")
  })

  it("handles validation errors on save", async () => {
    render(<BugDetailPageMock bugId={338662} />)

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    })

    // Find summary field and set invalid value
    const summaryField = screen.getByDisplayValue(/Database crash when executing complex query/)
    fireEvent.change(summaryField, { target: { value: "INVALID" } })

    // Try to save
    const saveButton = screen.getByText("Save Changes")
    fireEvent.click(saveButton)

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/Summary cannot be 'INVALID'/)).toBeInTheDocument()
    })
  })

  it("updates form fields correctly", async () => {
    render(<BugDetailPageMock bugId={338662} />)

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    })

    // Test various field types
    const symptomField = screen.getByDisplayValue("crash_callstack_string")
    fireEvent.change(symptomField, { target: { value: "new symptom" } })
    expect(symptomField).toHaveValue("new symptom")

    // Test dropdown (if accessible)
    const statusSelect = screen.getByDisplayValue("REOPENED")
    // Note: Testing select components might require different approach depending on implementation
  })
})
