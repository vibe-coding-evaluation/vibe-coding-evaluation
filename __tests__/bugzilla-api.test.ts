import { bugzillaApi, BugzillaApiError } from "@/services/bugzilla-api"
import type { BugData } from "@/types/bug"
import jest from "jest"

// Mock fetch
global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe("BugzillaApiService", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("getBug", () => {
    it("fetches bug data successfully", async () => {
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

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ bugs: [mockBugData] }),
      } as Response)

      const result = await bugzillaApi.getBug(123)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/rest/bug/123"),
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Accept: "application/json",
          }),
        }),
      )
      expect(result).toEqual(mockBugData)
    })

    it("throws error when bug not found", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ bugs: [] }),
      } as Response)

      await expect(bugzillaApi.getBug(123)).rejects.toThrow(new BugzillaApiError("Bug 123 not found", 404))
    })

    it("throws error when API returns error", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          faults: [{ faultCode: 100, faultString: "Invalid bug ID" }],
        }),
      } as Response)

      await expect(bugzillaApi.getBug(123)).rejects.toThrow(new BugzillaApiError("Invalid bug ID", 100))
    })

    it("throws error when HTTP request fails", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      } as Response)

      await expect(bugzillaApi.getBug(123)).rejects.toThrow(
        new BugzillaApiError("HTTP 500: Internal Server Error", 500),
      )
    })

    it("throws error when network fails", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"))

      await expect(bugzillaApi.getBug(123)).rejects.toThrow(new BugzillaApiError("Network error: Network error", 0))
    })
  })

  describe("updateBug", () => {
    it("updates bug successfully", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({}),
      } as Response)

      await bugzillaApi.updateBug(123, { summary: "Updated summary" })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/rest/bug/123"),
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({
            ids: [123],
            summary: "Updated summary",
          }),
        }),
      )
    })
  })

  describe("searchBugs", () => {
    it("searches bugs successfully", async () => {
      const mockBugs: BugData[] = [
        {
          id: 123,
          summary: "Bug 1",
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
        },
      ]

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ bugs: mockBugs }),
      } as Response)

      const result = await bugzillaApi.searchBugs({ product: "TestProduct" })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/rest/bug?product=TestProduct"),
        expect.any(Object),
      )
      expect(result).toEqual(mockBugs)
    })
  })
})
