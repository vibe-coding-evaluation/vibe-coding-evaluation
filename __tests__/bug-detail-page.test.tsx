import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BugDetailPage } from "@/components/bug-detail-page"
import { bugzillaApi } from "@/services/bugzilla-api"
import type { BugData } from "@/types/bug"
import jest from "jest" // Declare the jest variable

// Mock the API service
jest.mock("@/services/bugzilla-api")
const mockBugzillaApi = bugzillaApi as jest.Mocked<typeof bugzillaApi>

const mockBugData: BugData = {
  id: 338662,
  summary: "Test bug summary",
  status: "REOPENED",
  product: "NewDB",
  component: "Crash Consulting",
  version: "1.0",
  priority: "P1",
  severity: "major",
  platform: "All",
  op_sys: "All",
  assigned_to: "test@example.com",
  creator: "reporter@example.com",
  creation_time: "2025-05-20T09:29:04Z",
  last_change_time: "2025-07-02T03:44:00Z",
  classification: "Unclassified",
  symptom: "crash_callstack_string",
  steps_to_reproduce: "1. , 2. , 3. , ...",
  workaround: "how the issue can be circumvented",
  keywords: ["D_CRASH", "I_CLOUD_ISSUE"],
}

describe("BugDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders loading state initially", () => {
    mockBugzillaApi.getBug.mockImplementation(() => new Promise(() => {}))

    render(<BugDetailPage bugId={338662} />)

    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("renders bug data when loaded successfully", async () => {
    mockBugzillaApi.getBug.mockResolvedValue(mockBugData)

    render(<BugDetailPage bugId={338662} />)

    await waitFor(() => {
      expect(screen.getByText("Bug 338662")).toBeInTheDocument()
      expect(screen.getByText("Test bug summary")).toBeInTheDocument()
      expect(screen.getByDisplayValue("REOPENED")).toBeInTheDocument()
      expect(screen.getByDisplayValue("NewDB")).toBeInTheDocument()
    })
  })

  it("renders error state when API fails", async () => {
    mockBugzillaApi.getBug.mockRejectedValue(new Error("API Error"))

    render(<BugDetailPage bugId={338662} />)

    await waitFor(() => {
      expect(screen.getByText(/Failed to load bug data/)).toBeInTheDocument()
    })
  })

  it("handles form field changes", async () => {
    mockBugzillaApi.getBug.mockResolvedValue(mockBugData)

    render(<BugDetailPage bugId={338662} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue("crash_callstack_string")).toBeInTheDocument()
    })

    const symptomTextarea = screen.getByDisplayValue("crash_callstack_string")
    fireEvent.change(symptomTextarea, { target: { value: "updated symptom" } })

    expect(symptomTextarea).toHaveValue("updated symptom")
  })

  it("calls updateBug when save button is clicked", async () => {
    mockBugzillaApi.getBug.mockResolvedValue(mockBugData)
    mockBugzillaApi.updateBug.mockResolvedValue()

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
      expect(mockBugzillaApi.updateBug).toHaveBeenCalledWith(338662, {
        symptom: "updated symptom",
      })
    })
  })

  it("switches tabs correctly", async () => {
    mockBugzillaApi.getBug.mockResolvedValue(mockBugData)

    render(<BugDetailPage bugId={338662} />)

    await waitFor(() => {
      expect(screen.getByText("Development")).toBeInTheDocument()
    })

    const qaTab = screen.getByText("QA Delivery and Dev Support")
    fireEvent.click(qaTab)

    // Tab should be active (this would depend on your tab implementation)
    expect(qaTab).toHaveAttribute("data-state", "active")
  })
})
