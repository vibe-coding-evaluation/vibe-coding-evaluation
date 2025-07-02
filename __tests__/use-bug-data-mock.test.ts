import { renderHook, act, waitFor } from "@testing-library/react"
import { useBugDataMock } from "@/hooks/use-bug-data-mock"
import { mockServer } from "@/mocks/mock-server"

describe("useBugDataMock", () => {
  beforeEach(() => {
    mockServer.reset()
  })

  it("fetches bug data on mount", async () => {
    const { result } = renderHook(() => useBugDataMock(338662))

    expect(result.current.loading).toBe(true)
    expect(result.current.bug).toBe(null)
    expect(result.current.error).toBe(null)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.bug).not.toBe(null)
      expect(result.current.bug?.id).toBe(338662)
      expect(result.current.error).toBe(null)
    })
  })

  it("handles fetch error", async () => {
    mockServer.setFailureRate(1)

    const { result } = renderHook(() => useBugDataMock(338662))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.bug).toBe(null)
      expect(result.current.error).toBe("Internal server error")
    })
  })

  it("handles network error", async () => {
    mockServer.setOnline(false)

    const { result } = renderHook(() => useBugDataMock(338662))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.bug).toBe(null)
      expect(result.current.error).toBe("Failed to fetch bug data")
    })
  })

  it("updates bug data", async () => {
    const { result } = renderHook(() => useBugDataMock(338662))

    await waitFor(() => {
      expect(result.current.bug).not.toBe(null)
    })

    await act(async () => {
      await result.current.updateBug({ summary: "Updated summary" })
    })

    expect(result.current.bug?.summary).toBe("Updated summary")
    expect(result.current.error).toBe(null)
  })

  it("handles update error", async () => {
    const { result } = renderHook(() => useBugDataMock(338662))

    await waitFor(() => {
      expect(result.current.bug).not.toBe(null)
    })

    await act(async () => {
      try {
        await result.current.updateBug({ summary: "INVALID" })
      } catch (error) {
        // Expected to throw
      }
    })

    expect(result.current.error).toBe("Summary cannot be 'INVALID'")
  })

  it("shows saving state during update", async () => {
    mockServer.setDelay(100)
    const { result } = renderHook(() => useBugDataMock(338662))

    await waitFor(() => {
      expect(result.current.bug).not.toBe(null)
    })

    const updatePromise = act(async () => {
      await result.current.updateBug({ summary: "Updated summary" })
    })

    // Check saving state
    expect(result.current.saving).toBe(true)

    await updatePromise

    expect(result.current.saving).toBe(false)
  })

  it("refetches data", async () => {
    const { result } = renderHook(() => useBugDataMock(338662))

    await waitFor(() => {
      expect(result.current.bug).not.toBe(null)
    })

    // Modify the bug in the mock server directly
    const originalBug = mockServer.getBugFromStore(338662)!
    mockServer.addBug({ ...originalBug, summary: "Modified externally" })

    await act(async () => {
      await result.current.refetch()
    })

    expect(result.current.bug?.summary).toBe("Modified externally")
  })

  it("handles bug not found", async () => {
    const { result } = renderHook(() => useBugDataMock(999999))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.bug).toBe(null)
      expect(result.current.error).toBe("Bug #999999 does not exist.")
    })
  })
})
