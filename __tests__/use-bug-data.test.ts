import { renderHook, act, waitFor } from "@testing-library/react"
import { useBugData } from "@/hooks/use-bug-data"

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

  it("handles bug not found", async () => {
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

  it("shows saving state during update", async () => {
    const { result } = renderHook(() => useBugData(338662))

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
    const { result } = renderHook(() => useBugData(338662))

    await waitFor(() => {
      expect(result.current.bug).not.toBe(null)
    })

    await act(async () => {
      await result.current.refetch()
    })

    expect(result.current.bug?.id).toBe(338662)
  })

  it("persists updates across refetch", async () => {
    const { result } = renderHook(() => useBugData(338662))

    await waitFor(() => {
      expect(result.current.bug).not.toBe(null)
    })

    // Update the bug
    await act(async () => {
      await result.current.updateBug({ summary: "Persistent update" })
    })

    // Refetch should maintain the update
    await act(async () => {
      await result.current.refetch()
    })

    expect(result.current.bug?.summary).toBe("Persistent update")
  })
})
