import { renderHook, act, waitFor } from "@testing-library/react"
import { useBugData } from "@/hooks/use-bug-data"
import { bugzillaApi } from "@/services/bugzilla-api"
import type { BugData } from "@/types/bug"
import jest from "jest" // Import jest to declare it

jest.mock("@/services/bugzilla-api")
const mockBugzillaApi = bugzillaApi as jest.Mocked<typeof bugzillaApi>

const mockBugData: BugData = {
  id: 123,
  summary: "Test bug",
  status: "NEW",
  product: "TestProduct",
  component: "TestComponent",
  version: "1.0",
  priority: "P1",
  severity: "major",
  platform: "All",
  op_sys: "All",
  assigned_to: "test@example.com",
  creator: "reporter@example.com",
  creation_time: "2025-01-01T00:00:00Z",
  last_change_time: "2025-01-01T00:00:00Z",
  classification: "Unclassified",
}

describe("useBugData", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("fetches bug data on mount", async () => {
    mockBugzillaApi.getBug.mockResolvedValue(mockBugData)

    const { result } = renderHook(() => useBugData(123))

    expect(result.current.loading).toBe(true)
    expect(result.current.bug).toBe(null)
    expect(result.current.error).toBe(null)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.bug).toEqual(mockBugData)
      expect(result.current.error).toBe(null)
    })

    expect(mockBugzillaApi.getBug).toHaveBeenCalledWith(123)
  })

  it("handles fetch error", async () => {
    mockBugzillaApi.getBug.mockRejectedValue(new Error("API Error"))

    const { result } = renderHook(() => useBugData(123))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.bug).toBe(null)
      expect(result.current.error).toBe("Failed to fetch bug data")
    })
  })

  it("updates bug data", async () => {
    mockBugzillaApi.getBug.mockResolvedValue(mockBugData)
    mockBugzillaApi.updateBug.mockResolvedValue()

    const { result } = renderHook(() => useBugData(123))

    await waitFor(() => {
      expect(result.current.bug).toEqual(mockBugData)
    })

    await act(async () => {
      await result.current.updateBug({ summary: "Updated summary" })
    })

    expect(mockBugzillaApi.updateBug).toHaveBeenCalledWith(123, { summary: "Updated summary" })
    expect(result.current.bug?.summary).toBe("Updated summary")
  })

  it("handles update error", async () => {
    mockBugzillaApi.getBug.mockResolvedValue(mockBugData)
    mockBugzillaApi.updateBug.mockRejectedValue(new Error("Update failed"))

    const { result } = renderHook(() => useBugData(123))

    await waitFor(() => {
      expect(result.current.bug).toEqual(mockBugData)
    })

    await act(async () => {
      try {
        await result.current.updateBug({ summary: "Updated summary" })
      } catch (error) {
        // Expected to throw
      }
    })

    expect(result.current.error).toBe("Failed to update bug")
  })

  it("refetches data", async () => {
    mockBugzillaApi.getBug.mockResolvedValue(mockBugData)

    const { result } = renderHook(() => useBugData(123))

    await waitFor(() => {
      expect(result.current.bug).toEqual(mockBugData)
    })

    mockBugzillaApi.getBug.mockClear()

    await act(async () => {
      await result.current.refetch()
    })

    expect(mockBugzillaApi.getBug).toHaveBeenCalledWith(123)
  })
})
