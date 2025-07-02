import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BugDetailPage } from "@/components/bug-detail-page"
import { enableOfflineMock, offlineMock } from "@/mocks/offline-mock"

// Enable offline mock for these tests
beforeAll(() => {
  process.env.NEXT_PUBLIC_USE_OFFLINE_MOCK = "true"
  enableOfflineMock({ delay: 0 }) // No delay for faster tests
})

describe("Offline Integration Tests", () => {
  beforeEach(() => {
    offlineMock.reset()
  })

  it("works completely offline", async () => {
    // Simulate no internet connection
    offlineMock.setConfig({ networkError: false }) // We're using offline mock, so no real network

    render(<BugDetailPage bugId={338662} />)

    await waitFor(() => {
      expect(screen.getByText("Bug 338662")).toBeInTheDocument()
      expect(screen.getByText(/Database crash when executing complex query/)).toBeInTheDocument()
    })

    // Verify all data is loaded from local storage
    expect(screen.getByDisplayValue("REOPENED")).toBeInTheDocument()
    expect(screen.getByDisplayValue("NewDB")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Crash Consulting")).toBeInTheDocument()
  })

  it("handles form updates offline", async () => {
    render(<BugDetailPage bugId={338662} />)

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    })

    // Update a field
    const symptomField = screen.getByDisplayValue("crash_callstack_string")
    fireEvent.change(symptomField, { target: { value: "offline_updated_symptom" } })

    // Save changes
    const saveButton = screen.getByText("Save Changes")
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.queryByText("Saving...")).not.toBeInTheDocument()
    })

    // Verify the change was persisted locally
    const updatedBug = offlineMock.getBugFromStorage(338662)
    expect(updatedBug?.symptom).toBe("offline_updated_symptom")
  })

  it("displays different bugs from local storage", async () => {
    // Test FoodReplicator bug
    render(<BugDetailPage bugId={35} />)

    await waitFor(() => {
      expect(screen.getByText("Bug 35")).toBeInTheDocument()
      expect(screen.getByText("test bug")).toBeInTheDocument()
      expect(screen.getByDisplayValue("FoodReplicator")).toBeInTheDocument()
      expect(screen.getByDisplayValue("SaltSprinkler")).toBeInTheDocument()
    })
  })

  it("handles validation errors offline", async () => {
    render(<BugDetailPage bugId={35} />)

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    })

    // Try to set invalid summary
    const summaryField = screen.getByDisplayValue("test bug")
    fireEvent.change(summaryField, { target: { value: "INVALID" } })

    const saveButton = screen.getByText("Save Changes")
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText(/Summary cannot be 'INVALID'/)).toBeInTheDocument()
    })
  })

  it("simulates network conditions offline", async () => {
    // Test with simulated delay
    offlineMock.setConfig({ delay: 100 })

    render(<BugDetailPage bugId={338662} />)

    // Should show loading state
    expect(screen.getByText("Loading...")).toBeInTheDocument()

    // Eventually loads
    await waitFor(() => {
      expect(screen.getByText("Bug 338662")).toBeInTheDocument()
    })
  })

  it("handles simulated failures offline", async () => {
    offlineMock.setConfig({ failureRate: 1 }) // 100% failure rate

    render(<BugDetailPage bugId={338662} />)

    await waitFor(() => {
      expect(screen.getByText(/Failed to load bug data/)).toBeInTheDocument()
      expect(screen.getByText(/Internal server error/)).toBeInTheDocument()
    })
  })

  it("maintains data consistency across page reloads", async () => {
    // First, update some data
    render(<BugDetailPage bugId={338662} />)

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    })

    const symptomField = screen.getByDisplayValue("crash_callstack_string")
    fireEvent.change(symptomField, { target: { value: "persistent_data" } })

    const saveButton = screen.getByText("Save Changes")
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.queryByText("Saving...")).not.toBeInTheDocument()
    })

    // Simulate page reload by rendering again
    render(<BugDetailPage bugId={338662} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue("persistent_data")).toBeInTheDocument()
    })
  })
})
