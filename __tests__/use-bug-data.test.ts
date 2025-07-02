import { renderHook, act, waitFor } from "@testing-library/react"
import { useBugData } from "@/hooks/use-bug-data"

// Mock environment variable to use mock API
process.env.NEXT_PUBLIC_USE_MOCK_API = "true"

describe("useBugData", () => {
  it("fetches bug data on mount", async () => {
    const { result } = renderHook(() => useBugData(338662))

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
    const { result } = renderHook(() => useBugData(999999))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.bug).toBe(null)
      expect(result.current.error).toBe("Bug 999999 not found")
    })
  })

  it("updates bug data", async () => {
    const { result } = renderHook(() => useBugData(338662))

    await waitFor(() => {
      expect(result.current.bug).not.toBe(null)
    })

    await act(async () => {
      await result.current.updateBug({ summary: "Updated summary" })
    })

    expect(result.current.bug?.summary).toBe("Updated summary")
    expect(result.current.error).toBe(null)
  })

  it("refetches data", async () => {
    const { result } = renderHook(() => useBugData(338662))

    await waitFor(() => {
      expect(result.current.bug).not.toBe(null)
    })

    await act(async () => {
      await result.current.refetch()
    })

    expect(result.current.bug?.id).toBe(338662)
  })
})
