import { bugzillaApi, BugzillaApiError } from "@/services/bugzilla-api"

// Mock environment variable to use mock API
process.env.NEXT_PUBLIC_USE_MOCK_API = "true"

describe("BugzillaApiService", () => {
  describe("getBug", () => {
    it("fetches bug data successfully", async () => {
      const result = await bugzillaApi.getBug(338662)

      expect(result.id).toBe(338662)
      expect(result.summary).toBe("Database crash when executing complex query with multiple joins")
      expect(result.status).toBe("REOPENED")
      expect(result.product).toBe("NewDB")
      expect(result.component).toBe("Crash Consulting")
    })

    it("throws error when bug not found", async () => {
      await expect(bugzillaApi.getBug(999999)).rejects.toThrow(BugzillaApiError)
    })
  })

  describe("updateBug", () => {
    it("updates bug successfully", async () => {
      const updates = { summary: "Updated summary", status: "RESOLVED" }

      await bugzillaApi.updateBug(338662, updates)

      // Verify the update was applied
      const updatedBug = await bugzillaApi.getBug(338662)
      expect(updatedBug.summary).toBe("Updated summary")
      expect(updatedBug.status).toBe("RESOLVED")
    })
  })

  describe("searchBugs", () => {
    it("searches bugs successfully", async () => {
      const results = await bugzillaApi.searchBugs({ product: "NewDB" })

      expect(results.length).toBeGreaterThan(0)
      results.forEach((bug) => {
        expect(bug.product).toBe("NewDB")
      })
    })
  })
})
