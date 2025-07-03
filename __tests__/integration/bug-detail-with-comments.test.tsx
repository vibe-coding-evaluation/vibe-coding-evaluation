import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BugDetailPage } from "@/components/bug-detail-page"

describe("BugDetailPage with Comments Integration", () => {
  it("renders complete page with comments section", async () => {
    render(<BugDetailPage bugId={338662} />)

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    })

    // Check main bug details
    expect(screen.getByText("Bug 338662")).toBeInTheDocument()

    // Check comments section is present
    expect(screen.getByText("Additional Comments:")).toBeInTheDocument()
    expect(screen.getByText("For All Comments:")).toBeInTheDocument()
    expect(screen.getByText("DL HANA Cloud Crash Dispatching")).toBeInTheDocument()
    expect(screen.getByText("Kang, Sanghun")).toBeInTheDocument()
  })

  it("handles status change from comments section", async () => {
    render(<BugDetailPage bugId={338662} />)

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    })

    // Change status in comments section
    const statusSelects = screen.getAllByDisplayValue("REOPENED")
    const commentStatusSelect = statusSelects[statusSelects.length - 1] // Last one should be in comments

    fireEvent.change(commentStatusSelect, { target: { value: "RESOLVED" } })

    // Add a comment to trigger the status change
    const textarea = screen.getByPlaceholderText("Enter your comment here...")
    fireEvent.change(textarea, { target: { value: "Resolving this issue" } })

    const saveButton = screen.getByText("Save Changes")
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.queryByText("Saving...")).not.toBeInTheDocument()
    })

    // Status should be updated in the main form as well
    expect(screen.getByText("Resolving this issue")).toBeInTheDocument()
  })

  it("maintains form state when switching tabs", async () => {
    render(<BugDetailPage bugId={338662} />)

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    })

    // Make changes in the main form
    const symptomField = screen.getByDisplayValue("crash_callstack_string")
    fireEvent.change(symptomField, { target: { value: "updated_symptom" } })

    // Add a comment
    const textarea = screen.getByPlaceholderText("Enter your comment here...")
    fireEvent.change(textarea, { target: { value: "Test comment" } })

    // Switch to delivery matrix tab
    const deliveryTab = screen.getByText("Delivery Matrix")
    fireEvent.click(deliveryTab)

    expect(screen.getByText("Delivery Table")).toBeInTheDocument()

    // Switch back to development tab
    const devTab = screen.getByText("Development")
    fireEvent.click(devTab)

    // Form state should be maintained
    expect(screen.getByDisplayValue("updated_symptom")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Test comment")).toBeInTheDocument()
  })

  it("shows all comment features", async () => {
    render(<BugDetailPage bugId={338662} />)

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    })

    // Check all comment features are present
    expect(screen.getByText("Make comment private (visible only to members of the editbugs group)")).toBeInTheDocument()
    expect(screen.getByText("Mark as Duplicate")).toBeInTheDocument()
    expect(screen.getByText("Expand Width")).toBeInTheDocument()
    expect(screen.getByText("Decorate (Crash Dump)")).toBeInTheDocument()
    expect(screen.getByText("Collapse")).toBeInTheDocument()
    expect(screen.getAllByText("[reply]")).toHaveLength(3)
    expect(screen.getByText("Add Comment")).toBeInTheDocument()
  })
})
