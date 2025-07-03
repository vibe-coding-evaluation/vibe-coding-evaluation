import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BugComments } from "@/components/bug-comments"
import { mockBugData } from "@/data/mock-data"
import { jest } from "@jest/globals"

describe("BugComments", () => {
  const mockOnStatusChange = jest.fn()

  beforeEach(() => {
    mockOnStatusChange.mockClear()
  })

  it("renders comment submission form", () => {
    render(<BugComments bug={mockBugData} onStatusChange={mockOnStatusChange} />)

    expect(screen.getByText("Additional Comments:")).toBeInTheDocument()
    expect(screen.getByText("Make comment private (visible only to members of the editbugs group)")).toBeInTheDocument()
    expect(screen.getByText("Status:")).toBeInTheDocument()
    expect(screen.getByText("Mark as Duplicate")).toBeInTheDocument()
    expect(screen.getByText("Save Changes")).toBeInTheDocument()
    expect(screen.getByText("This is a minor update (do not send email)")).toBeInTheDocument()
  })

  it("renders display options", () => {
    render(<BugComments bug={mockBugData} onStatusChange={mockOnStatusChange} />)

    expect(screen.getByText("For All Comments:")).toBeInTheDocument()
    expect(screen.getByText("Expand Width")).toBeInTheDocument()
    expect(screen.getByText("Decorate (Crash Dump)")).toBeInTheDocument()
    expect(screen.getByText("Collapse")).toBeInTheDocument()
  })

  it("renders existing comments", () => {
    render(<BugComments bug={mockBugData} onStatusChange={mockOnStatusChange} />)

    expect(screen.getByText("DL HANA Cloud Crash Dispatching")).toBeInTheDocument()
    expect(screen.getByText("Kang, Sanghun")).toBeInTheDocument()
    expect(screen.getByText("Description")).toBeInTheDocument()
    expect(screen.getByText("Comment 1")).toBeInTheDocument()
    expect(screen.getAllByText("Private")).toHaveLength(3) // 2 existing comments + 1 form checkbox
    expect(screen.getAllByText("[reply]")).toHaveLength(3)
  })

  it("handles new comment submission", async () => {
    render(<BugComments bug={mockBugData} onStatusChange={mockOnStatusChange} />)

    const textarea = screen.getByPlaceholderText("Enter your comment here...")
    fireEvent.change(textarea, { target: { value: "This is a test comment" } })

    const saveButton = screen.getByText("Save Changes")
    fireEvent.click(saveButton)

    expect(screen.getByText("Saving...")).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText("Save Changes")).toBeInTheDocument()
    })

    // Comment should be added to the list
    expect(screen.getByText("This is a test comment")).toBeInTheDocument()
    expect(textarea).toHaveValue("")
  })

  it("handles status change", async () => {
    render(<BugComments bug={mockBugData} onStatusChange={mockOnStatusChange} />)

    const statusSelect = screen.getByDisplayValue("REOPENED")
    fireEvent.change(statusSelect, { target: { value: "RESOLVED" } })

    const textarea = screen.getByPlaceholderText("Enter your comment here...")
    fireEvent.change(textarea, { target: { value: "Resolving this issue" } })

    const saveButton = screen.getByText("Save Changes")
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(mockOnStatusChange).toHaveBeenCalledWith("RESOLVED")
    })
  })

  it("handles private comment checkbox", () => {
    render(<BugComments bug={mockBugData} onStatusChange={mockOnStatusChange} />)

    const privateCheckbox = screen.getByLabelText(
      "Make comment private (visible only to members of the editbugs group)",
    )
    fireEvent.click(privateCheckbox)

    expect(privateCheckbox).toBeChecked()
  })

  it("handles display options", () => {
    render(<BugComments bug={mockBugData} onStatusChange={mockOnStatusChange} />)

    const expandWidthCheckbox = screen.getByLabelText("Expand Width")
    const decorateCheckbox = screen.getByLabelText("Decorate (Crash Dump)")
    const collapseCheckbox = screen.getByLabelText("Collapse")

    fireEvent.click(expandWidthCheckbox)
    fireEvent.click(decorateCheckbox)
    fireEvent.click(collapseCheckbox)

    expect(expandWidthCheckbox).toBeChecked()
    expect(decorateCheckbox).toBeChecked()
    expect(collapseCheckbox).toBeChecked()
  })

  it("toggles comment privacy", () => {
    render(<BugComments bug={mockBugData} onStatusChange={mockOnStatusChange} />)

    const commentPrivateCheckboxes = screen.getAllByLabelText("Private")
    const firstCommentCheckbox = commentPrivateCheckboxes[0]

    fireEvent.click(firstCommentCheckbox)
    expect(firstCommentCheckbox).toBeChecked()

    fireEvent.click(firstCommentCheckbox)
    expect(firstCommentCheckbox).not.toBeChecked()
  })

  it("disables save button when comment is empty", () => {
    render(<BugComments bug={mockBugData} onStatusChange={mockOnStatusChange} />)

    const saveButton = screen.getByText("Save Changes")
    expect(saveButton).toBeDisabled()

    const textarea = screen.getByPlaceholderText("Enter your comment here...")
    fireEvent.change(textarea, { target: { value: "Test comment" } })

    expect(saveButton).not.toBeDisabled()
  })

  it("formats timestamps correctly", () => {
    render(<BugComments bug={mockBugData} onStatusChange={mockOnStatusChange} />)

    // Check that timestamps are formatted properly
    expect(screen.getByText(/2025-05-20/)).toBeInTheDocument()
    expect(screen.getByText(/2025-07-02/)).toBeInTheDocument()
  })

  it("shows Add Comment link", () => {
    render(<BugComments bug={mockBugData} onStatusChange={mockOnStatusChange} />)

    expect(screen.getByText("Add Comment")).toBeInTheDocument()
  })
})
