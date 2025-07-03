import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BugDetailPage } from "@/components/bug-detail-page"

describe("BugDetailPage Integration", () => {
  it("renders complete bug detail page with all fields", async () => {
    render(<BugDetailPage bugId={338662} />)

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    })

    // Check header
    expect(screen.getByText("Bug 338662")).toBeInTheDocument()
    expect(screen.getByText(/Database crash when executing complex query/)).toBeInTheDocument()

    // Check tabs
    expect(screen.getByText("Development")).toBeInTheDocument()
    expect(screen.getByText("Development [read mode]")).toBeInTheDocument()
    expect(screen.getByText("QA Delivery and Dev Support")).toBeInTheDocument()
    expect(screen.getByText("Delivery Matrix")).toBeInTheDocument()

    // Check left column fields
    expect(screen.getByDisplayValue("REOPENED")).toBeInTheDocument()
    expect(screen.getByDisplayValue("NewDB")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Crash Consulting")).toBeInTheDocument()
    expect(screen.getByDisplayValue("High")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Linux")).toBeInTheDocument()
    expect(screen.getByDisplayValue("crash_callstack_string")).toBeInTheDocument()

    // Check right column fields
    expect(screen.getByText("Kang, Sanghun")).toBeInTheDocument()
    expect(screen.getByText("Cloud-Edition")).toBeInTheDocument()
    expect(screen.getByText("Standard")).toBeInTheDocument()
    expect(screen.getByDisplayValue("main")).toBeInTheDocument()
    expect(screen.getByDisplayValue("7.5")).toBeInTheDocument()
  })

  it("handles form interactions across both columns", async () => {
    render(<BugDetailPage bugId={338662} />)

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    })

    // Modify left column field
    const symptomField = screen.getByDisplayValue("crash_callstack_string")
    fireEvent.change(symptomField, { target: { value: "updated_crash_info" } })

    // Modify right column field
    const branchField = screen.getByDisplayValue("main")
    fireEvent.change(branchField, { target: { value: "develop" } })

    // Save changes
    const saveButton = screen.getByText("Save Changes")
    fireEvent.click(saveButton)

    // Wait for save to complete
    await waitFor(() => {
      expect(screen.queryByText("Saving...")).not.toBeInTheDocument()
    })

    // Verify changes persist
    expect(symptomField).toHaveValue("updated_crash_info")
    expect(branchField).toHaveValue("develop")
  })

  it("switches between tabs correctly", async () => {
    render(<BugDetailPage bugId={338662} />)

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    })

    // Switch to Delivery Matrix tab
    const deliveryTab = screen.getByText("Delivery Matrix")
    fireEvent.click(deliveryTab)

    // Should show delivery matrix
    expect(screen.getByText("Delivery Table")).toBeInTheDocument()
    expect(screen.getByText("Code Line (Branch)")).toBeInTheDocument()

    // Switch back to Development tab
    const devTab = screen.getByText("Development")
    fireEvent.click(devTab)

    // Should show bug form again
    expect(screen.getByDisplayValue("crash_callstack_string")).toBeInTheDocument()
  })

  it("handles tag inputs correctly", async () => {
    render(<BugDetailPage bugId={338662} />)

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    })

    // Check existing keywords are displayed
    expect(screen.getByText("D_CRASH")).toBeInTheDocument()
    expect(screen.getByText("I_CLOUD_ISSUE")).toBeInTheDocument()

    // Check existing HANA instances
    expect(screen.getByText("abcdefab-0123-4567-89ab-cdef12345678")).toBeInTheDocument()
    expect(screen.getByText("Sum of reported instances: 2")).toBeInTheDocument()
  })

  it("shows all external links and buttons", async () => {
    render(<BugDetailPage bugId={338662} />)

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    })

    // Check external links
    expect(screen.getByText("show other bugs")).toBeInTheDocument()
    expect(screen.getByText("Crash and error categories")).toBeInTheDocument()
    expect(screen.getByText("tree")).toBeInTheDocument()
    expect(screen.getByText("graph")).toBeInTheDocument()
    expect(screen.getByText("Customer missing in this list?")).toBeInTheDocument()

    // Check action buttons
    expect(screen.getByText("Edit Gerrit Links")).toBeInTheDocument()
    expect(screen.getByText("Edit Jira Links")).toBeInTheDocument()

    // Check edit links
    expect(screen.getAllByText("edit")).toHaveLength(4)
  })

  it("displays formatted dates and metadata correctly", async () => {
    render(<BugDetailPage bugId={338662} />)

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    })

    // Check formatted dates
    expect(screen.getByText(/05\/20\/2025/)).toBeInTheDocument()
    expect(screen.getByText(/07\/02\/2025/)).toBeInTheDocument()

    // Check metadata
    expect(screen.getByText("42 day(s)")).toBeInTheDocument()
    expect(screen.getByText("2 user(s)")).toBeInTheDocument()
    expect(screen.getByText("2025-08-01")).toBeInTheDocument()
  })

  it("handles complex field interactions", async () => {
    render(<BugDetailPage bugId={338662} />)

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    })

    // Test dependency fields
    const dependsOnField = screen.getByDisplayValue("338661")
    fireEvent.change(dependsOnField, { target: { value: "338661, 338660, 338659" } })

    const blocksField = screen.getByDisplayValue("338663")
    fireEvent.change(blocksField, { target: { value: "338663, 338664" } })

    // Test multiline fields
    const stepsField = screen.getByDisplayValue(/Execute complex query/)
    fireEvent.change(stepsField, {
      target: { value: "1. New step\n2. Another step\n3. Final step" },
    })

    // Save and verify
    const saveButton = screen.getByText("Save Changes")
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.queryByText("Saving...")).not.toBeInTheDocument()
    })

    expect(dependsOnField).toHaveValue("338661, 338660, 338659")
    expect(blocksField).toHaveValue("338663, 338664")
    expect(stepsField).toHaveValue("1. New step\n2. Another step\n3. Final step")
  })
})
