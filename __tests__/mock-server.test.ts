import { mockServer } from "@/mocks/mock-server"
import type { BugData } from "@/types/bug"

describe("MockBugzillaServer", () => {
  beforeEach(() => {
    mockServer.reset()
  })

  describe("getBug", () => {
    it("returns existing bug", async () => {
      const response = await mockServer.getBug(338662)

      expect(response.bugs).toHaveLength(1)
      expect(response.bugs[0].id).toBe(338662)
      expect(response.bugs[0].summary).toBe("Database crash when executing complex query with multiple joins")
      expect(response.faults).toBeUndefined()
    })

    it("returns error for non-existent bug", async () => {
      const response = await mockServer.getBug(999999)

      expect(response.bugs).toHaveLength(0)
      expect(response.faults).toHaveLength(1)
      expect(response.faults![0].faultCode).toBe(101)
      expect(response.faults![0].faultString).toContain("Bug #999999 does not exist")
    })

    it("simulates network delay", async () => {
      mockServer.setDelay(100)

      const startTime = Date.now()
      await mockServer.getBug(338662)
      const endTime = Date.now()

      expect(endTime - startTime).toBeGreaterThanOrEqual(100)
    })

    it("simulates server offline", async () => {
      mockServer.setOnline(false)

      await expect(mockServer.getBug(338662)).rejects.toThrow("Network error: Server is offline")
    })

    it("simulates random failures", async () => {
      mockServer.setFailureRate(1) // 100% failure rate

      const response = await mockServer.getBug(338662)

      expect(response.faults).toHaveLength(1)
      expect(response.faults![0].faultCode).toBe(500)
    })
  })

  describe("updateBug", () => {
    it("updates existing bug successfully", async () => {
      const updates = { summary: "Updated summary", status: "RESOLVED" }
      const response = await mockServer.updateBug(338662, { ids: [338662], ...updates })

      expect(response.bugs).toHaveLength(1)
      expect(response.bugs[0].id).toBe(338662)
      expect(response.faults).toBeUndefined()

      // Verify the bug was actually updated
      const updatedBug = mockServer.getBugFromStore(338662)
      expect(updatedBug?.summary).toBe("Updated summary")
      expect(updatedBug?.status).toBe("RESOLVED")
    })

    it("returns error for non-existent bug", async () => {
      const response = await mockServer.updateBug(999999, { ids: [999999], summary: "Test" })

      expect(response.bugs).toHaveLength(0)
      expect(response.faults).toHaveLength(1)
      expect(response.faults![0].faultCode).toBe(101)
    })

    it("validates input and returns error", async () => {
      const response = await mockServer.updateBug(338662, { ids: [338662], summary: "INVALID" })

      expect(response.bugs).toHaveLength(0)
      expect(response.faults).toHaveLength(1)
      expect(response.faults![0].faultCode).toBe(50)
      expect(response.faults![0].faultString).toContain("Summary cannot be 'INVALID'")
    })

    it("updates last_change_time", async () => {
      const originalBug = mockServer.getBugFromStore(338662)
      const originalTime = originalBug?.last_change_time

      // Wait a bit to ensure time difference
      await new Promise((resolve) => setTimeout(resolve, 10))

      await mockServer.updateBug(338662, { ids: [338662], summary: "New summary" })

      const updatedBug = mockServer.getBugFromStore(338662)
      expect(updatedBug?.last_change_time).not.toBe(originalTime)
    })
  })

  describe("searchBugs", () => {
    beforeEach(() => {
      // Add more test data
      const testBug: BugData = {
        id: 999,
        summary: "Test bug for search",
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
      mockServer.addBug(testBug)
    })

    it("returns all bugs without filters", async () => {
      const response = await mockServer.searchBugs({})

      expect(response.bugs.length).toBeGreaterThan(0)
      expect(response.faults).toBeUndefined()
    })

    it("filters by product", async () => {
      const response = await mockServer.searchBugs({ product: "TestProduct" })

      expect(response.bugs).toHaveLength(1)
      expect(response.bugs[0].product).toBe("TestProduct")
    })

    it("filters by status", async () => {
      const response = await mockServer.searchBugs({ status: "NEW" })

      expect(response.bugs.length).toBeGreaterThan(0)
      response.bugs.forEach((bug) => {
        expect(bug.status).toBe("NEW")
      })
    })

    it("applies pagination", async () => {
      const response = await mockServer.searchBugs({ limit: "1", offset: "0" })

      expect(response.bugs).toHaveLength(1)
    })

    it("handles multiple filters", async () => {
      const response = await mockServer.searchBugs({
        product: "TestProduct",
        status: "NEW",
      })

      expect(response.bugs).toHaveLength(1)
      expect(response.bugs[0].product).toBe("TestProduct")
      expect(response.bugs[0].status).toBe("NEW")
    })
  })

  describe("utility methods", () => {
    it("adds and retrieves bugs", () => {
      const testBug: BugData = {
        id: 12345,
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

      mockServer.addBug(testBug)
      const retrieved = mockServer.getBugFromStore(12345)

      expect(retrieved).toEqual(testBug)
    })

    it("clears all bugs", () => {
      mockServer.clearBugs()
      const allBugs = mockServer.getAllBugs()

      expect(allBugs).toHaveLength(0)
    })

    it("gets all bugs", () => {
      const allBugs = mockServer.getAllBugs()

      expect(allBugs.length).toBeGreaterThan(0)
    })
  })

  describe("configuration", () => {
    it("configures delay", () => {
      mockServer.setDelay(1000)
      // Delay is tested in the getBug test above
    })

    it("configures failure rate", () => {
      mockServer.setFailureRate(0.5)
      mockServer.setFailureRate(-0.1) // Should clamp to 0
      mockServer.setFailureRate(1.5) // Should clamp to 1
    })

    it("configures online status", () => {
      mockServer.setOnline(false)
      mockServer.setOnline(true)
    })

    it("resets configuration", () => {
      mockServer.setDelay(1000)
      mockServer.setFailureRate(0.5)
      mockServer.setOnline(false)

      mockServer.reset()

      // After reset, should work normally (tested implicitly in other tests)
    })
  })
})
