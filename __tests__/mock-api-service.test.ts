import { mockBugzillaApi, BugzillaApiError } from "@/services/bugzilla-api-mock"
import { mockServer } from "@/mocks/mock-server"

describe("MockBugzillaApiService", () => {
  beforeEach(() => {
    mockServer.reset()
  })

  describe("getBug", () => {
    it("fetches bug data successfully", async () => {
      const result = await mockBugzillaApi.getBug(338662)

      expect(result.id).toBe(338662)
      expect(result.summary).toBe("Database crash when executing complex query with multiple joins")
      expect(result.status).toBe("REOPENED")
    })

    it("throws error when bug not found", async () => {
      await expect(mockBugzillaApi.getBug(999999)).rejects.toThrow(
        new BugzillaApiError("Bug #999999 does not exist.", 101),
      )
    })

    it("handles server errors", async () => {
      mockServer.setFailureRate(1)

      await expect(mockBugzillaApi.getBug(338662)).rejects.toThrow(new BugzillaApiError("Internal server error", 500))
    })

    it("handles network errors", async () => {
      mockServer.setOnline(false)

      await expect(mockBugzillaApi.getBug(338662)).rejects.toThrow(
        new BugzillaApiError("Network error: Server is offline", 0),
      )
    })
  })

  describe("updateBug", () => {
    it("updates bug successfully", async () => {
      const updates = { summary: "Updated summary", status: "RESOLVED" }

      await mockBugzillaApi.updateBug(338662, updates)

      // Verify the update was applied
      const updatedBug = await mockBugzillaApi.getBug(338662)
      expect(updatedBug.summary).toBe("Updated summary")
      expect(updatedBug.status).toBe("RESOLVED")
    })

    it("throws error for non-existent bug", async () => {
      await expect(mockBugzillaApi.updateBug(999999, { summary: "Test" })).rejects.toThrow(
        new BugzillaApiError("Bug #999999 does not exist.", 101),
      )
    })

    it("handles validation errors", async () => {
      await expect(mockBugzillaApi.updateBug(338662, { summary: "INVALID" })).rejects.toThrow(
        new BugzillaApiError("Summary cannot be 'INVALID'", 50),
      )
    })

    it("handles server errors", async () => {
      mockServer.setFailureRate(1)

      await expect(mockBugzillaApi.updateBug(338662, { summary: "Test" })).rejects.toThrow(
        new BugzillaApiError("Failed to update bug", 500),
      )
    })
  })

  describe("searchBugs", () => {
    it("searches bugs successfully", async () => {
      const results = await mockBugzillaApi.searchBugs({ product: "NewDB" })

      expect(results.length).toBeGreaterThan(0)
      results.forEach((bug) => {
        expect(bug.product).toBe("NewDB")
      })
    })

    it("returns empty array when no matches", async () => {
      const results = await mockBugzillaApi.searchBugs({ product: "NonExistentProduct" })

      expect(results).toHaveLength(0)
    })

    it("handles server errors", async () => {
      mockServer.setFailureRate(1)

      await expect(mockBugzillaApi.searchBugs({})).rejects.toThrow(new BugzillaApiError("Search failed", 500))
    })
  })
})
