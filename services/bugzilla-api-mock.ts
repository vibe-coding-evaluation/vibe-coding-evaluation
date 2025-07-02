import type { BugData, ApiResponse, BugUpdateRequest, ApiError } from "@/types/bug"
import { mockServer } from "@/mocks/mock-server"

class BugzillaApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public faults?: ApiError[],
  ) {
    super(message)
    this.name = "BugzillaApiError"
  }
}

export class MockBugzillaApiService {
  private async handleResponse<T>(response: ApiResponse<T>): Promise<T[]> {
    if (response.faults && response.faults.length > 0) {
      const fault = response.faults[0]
      throw new BugzillaApiError(fault.faultString, fault.faultCode, response.faults)
    }
    return response.bugs
  }

  async getBug(id: number): Promise<BugData> {
    try {
      const response = await mockServer.getBug(id)
      const bugs = await this.handleResponse(response)

      if (bugs.length === 0) {
        throw new BugzillaApiError(`Bug ${id} not found`, 404)
      }

      return bugs[0]
    } catch (error) {
      if (error instanceof BugzillaApiError) {
        throw error
      }
      throw new BugzillaApiError(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`, 0)
    }
  }

  async updateBug(id: number, updates: Partial<BugData>): Promise<void> {
    try {
      const updateRequest: BugUpdateRequest = {
        ids: [id],
        ...updates,
      }

      const response = await mockServer.updateBug(id, updateRequest)
      await this.handleResponse(response)
    } catch (error) {
      if (error instanceof BugzillaApiError) {
        throw error
      }
      throw new BugzillaApiError(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`, 0)
    }
  }

  async searchBugs(params: Record<string, any>): Promise<BugData[]> {
    try {
      const response = await mockServer.searchBugs(params)
      return await this.handleResponse(response)
    } catch (error) {
      if (error instanceof BugzillaApiError) {
        throw error
      }
      throw new BugzillaApiError(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`, 0)
    }
  }
}

export const mockBugzillaApi = new MockBugzillaApiService()
export { BugzillaApiError }
