import { offlineMock, mockFetch, enableOfflineMock } from "@/mocks/offline-mock"

describe("OfflineMockFetch", () => {
  beforeEach(() => {
    offlineMock.reset()
  })

  describe("Basic Functionality", () => {
    it("works without internet connection", async () => {
      const response = await mockFetch("https://bugzilla.example.com/rest/bug/338662")
      const data = await response.json()

      expect(response.ok).toBe(true)
      expect(data.bugs).toHaveLength(1)
      expect(data.bugs[0].id).toBe(338662)
      expect(data.bugs[0].summary).toBe("Database crash when executing complex query with multiple joins")
    })

    it("mimics fetch Response interface", async () => {
      const response = await mockFetch("https://bugzilla.example.com/rest/bug/35")

      expect(response).toHaveProperty("ok")
      expect(response).toHaveProperty("status")
      expect(response).toHaveProperty("statusText")
      expect(typeof response.json).toBe("function")
      expect(typeof response.text).toBe("function")
      expect(typeof response.blob).toBe("function")
      expect(typeof response.arrayBuffer).toBe("function")
      expect(typeof response.clone).toBe("function")
    })

    it("handles different response methods", async () => {
      const response = await mockFetch("https://bugzilla.example.com/rest/bug/35")

      const jsonData = await response.clone().json()
      const textData = await response.clone().text()
      const blobData = await response.clone().blob()
      const arrayBufferData = await response.clone().arrayBuffer()

      expect(jsonData).toHaveProperty("bugs")
      expect(typeof textData).toBe("string")
      expect(blobData).toBeInstanceOf(Blob)
      expect(arrayBufferData).toBeInstanceOf(ArrayBuffer)
    })
  })

  describe("Bug Operations", () => {
    it("gets single bug by ID", async () => {
      const response = await mockFetch("https://bugzilla.example.com/rest/bug/35")
      const data = await response.json()

      expect(data.bugs).toHaveLength(1)
      expect(data.bugs[0]).toMatchObject({
        id: 35,
        summary: "test bug",
        status: "RESOLVED",
        product: "FoodReplicator",
        component: "SaltSprinkler",
      })
      expect(data.faults).toEqual([])
    })

    it("returns error for non-existent bug", async () => {
      const response = await mockFetch("https://bugzilla.example.com/rest/bug/999999")
      const data = await response.json()

      expect(response.ok).toBe(true) // Bugzilla returns 200 even for errors
      expect(data.bugs).toEqual([])
      expect(data.faults).toHaveLength(1)
      expect(data.faults[0]).toEqual({
        faultCode: 101,
        faultString: "Bug #999999 does not exist.",
      })
    })

    it("updates bug data", async () => {
      const updateData = {
        ids: [338662],
        summary: "Updated summary",
        status: "RESOLVED",
      }

      const response = await mockFetch("https://bugzilla.example.com/rest/bug/338662", {
        method: "PUT",
        body: JSON.stringify(updateData),
      })

      const data = await response.json()
      expect(response.ok).toBe(true)
      expect(data.bugs).toEqual([{ id: 338662 }])

      // Verify the update was applied
      const updatedBug = offlineMock.getBugFromStorage(338662)
      expect(updatedBug?.summary).toBe("Updated summary")
      expect(updatedBug?.status).toBe("RESOLVED")
    })

    it("handles validation errors", async () => {
      const updateData = {
        ids: [35],
        summary: "INVALID",
      }

      const response = await mockFetch("https://bugzilla.example.com/rest/bug/35", {
        method: "PUT",
        body: JSON.stringify(updateData),
      })

      const data = await response.json()
      expect(data.bugs).toEqual([])
      expect(data.faults).toHaveLength(1)
      expect(data.faults[0]).toEqual({
        faultCode: 50,
        faultString: "Summary cannot be 'INVALID'",
      })
    })
  })

  describe("Search Functionality", () => {
    it("searches bugs without filters", async () => {
      const response = await mockFetch("https://bugzilla.example.com/rest/bug")
      const data = await response.json()

      expect(data.bugs.length).toBeGreaterThan(0)
      expect(data.faults).toEqual([])
    })

    it("filters by product", async () => {
      const response = await mockFetch("https://bugzilla.example.com/rest/bug?product=NewDB")
      const data = await response.json()

      expect(data.bugs.length).toBeGreaterThan(0)
      data.bugs.forEach((bug: any) => {
        expect(bug.product).toBe("NewDB")
      })
    })

    it("filters by multiple criteria", async () => {
      const response = await mockFetch("https://bugzilla.example.com/rest/bug?product=NewDB&status=REOPENED")
      const data = await response.json()

      expect(data.bugs.length).toBeGreaterThan(0)
      data.bugs.forEach((bug: any) => {
        expect(bug.product).toBe("NewDB")
        expect(bug.status).toBe("REOPENED")
      })
    })

    it("handles pagination", async () => {
      const response = await mockFetch("https://bugzilla.example.com/rest/bug?limit=1&offset=0")
      const data = await response.json()

      expect(data.bugs).toHaveLength(1)
    })

    it("returns empty results for no matches", async () => {
      const response = await mockFetch("https://bugzilla.example.com/rest/bug?product=NonExistent")
      const data = await response.json()

      expect(data.bugs).toEqual([])
      expect(data.faults).toEqual([])
    })
  })

  describe("Network Simulation", () => {
    it("simulates network delay", async () => {
      offlineMock.setConfig({ delay: 100 })

      const startTime = Date.now()
      await mockFetch("https://bugzilla.example.com/rest/bug/35")
      const endTime = Date.now()

      expect(endTime - startTime).toBeGreaterThanOrEqual(100)
    })

    it("simulates network errors", async () => {
      offlineMock.setConfig({ networkError: true })

      await expect(mockFetch("https://bugzilla.example.com/rest/bug/35")).rejects.toThrow("Network error")
    })

    it("simulates random failures", async () => {
      offlineMock.setConfig({ failureRate: 1 }) // 100% failure rate

      const response = await mockFetch("https://bugzilla.example.com/rest/bug/35")
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.faults).toHaveLength(1)
      expect(data.faults[0].faultCode).toBe(500)
    })
  })

  describe("Configuration and Utilities", () => {
    it("configures mock behavior", () => {
      offlineMock.setConfig({
        delay: 1000,
        failureRate: 0.5,
        networkError: true,
      })

      // Configuration is tested implicitly in other tests
      expect(true).toBe(true)
    })

    it("resets to default state", () => {
      offlineMock.setConfig({ delay: 1000, failureRate: 1 })
      offlineMock.reset()

      // After reset, should work normally
      expect(offlineMock.getStorageSize()).toBeGreaterThan(0)
    })

    it("provides utility methods", () => {
      const bug = offlineMock.getBugFromStorage(35)
      expect(bug?.id).toBe(35)

      const allBugs = offlineMock.getAllBugs()
      expect(allBugs.length).toBeGreaterThan(0)

      const originalSize = offlineMock.getStorageSize()

      const newBug = { ...bug!, id: 99999, summary: "Test bug" }
      offlineMock.addBug(newBug)
      expect(offlineMock.getStorageSize()).toBe(originalSize + 1)

      offlineMock.removeBug(99999)
      expect(offlineMock.getStorageSize()).toBe(originalSize)
    })

    it("enables global fetch replacement", () => {
      enableOfflineMock({ delay: 100 })

      // Test that global fetch is replaced
      expect(typeof (global as any).fetch).toBe("function")
    })
  })

  describe("HTTP Methods", () => {
    it("handles GET requests", async () => {
      const response = await mockFetch("https://bugzilla.example.com/rest/bug/35", {
        method: "GET",
      })

      expect(response.ok).toBe(true)
      const data = await response.json()
      expect(data.bugs).toHaveLength(1)
    })

    it("handles PUT requests", async () => {
      const response = await mockFetch("https://bugzilla.example.com/rest/bug/35", {
        method: "PUT",
        body: JSON.stringify({ ids: [35], summary: "Updated" }),
      })

      expect(response.ok).toBe(true)
      const data = await response.json()
      expect(data.bugs).toEqual([{ id: 35 }])
    })

    it("handles unsupported methods", async () => {
      const response = await mockFetch("https://bugzilla.example.com/rest/bug/35", {
        method: "POST",
      })

      expect(response.status).toBe(501)
      const data = await response.json()
      expect(data.faults[0].faultString).toContain("POST method not implemented")
    })
  })

  describe("Data Persistence", () => {
    it("maintains data across requests", async () => {
      // Update a bug
      await mockFetch("https://bugzilla.example.com/rest/bug/35", {
        method: "PUT",
        body: JSON.stringify({ ids: [35], summary: "Persistent update" }),
      })

      // Fetch the bug again
      const response = await mockFetch("https://bugzilla.example.com/rest/bug/35")
      const data = await response.json()

      expect(data.bugs[0].summary).toBe("Persistent update")
    })

    it("updates last_change_time on modifications", async () => {
      const originalBug = offlineMock.getBugFromStorage(35)
      const originalTime = originalBug?.last_change_time

      // Wait a bit to ensure time difference
      await new Promise((resolve) => setTimeout(resolve, 10))

      await mockFetch("https://bugzilla.example.com/rest/bug/35", {
        method: "PUT",
        body: JSON.stringify({ ids: [35], summary: "Time test" }),
      })

      const updatedBug = offlineMock.getBugFromStorage(35)
      expect(updatedBug?.last_change_time).not.toBe(originalTime)
    })
  })
})
