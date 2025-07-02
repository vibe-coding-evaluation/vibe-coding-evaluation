import type { BugData, ApiResponse, BugUpdateRequest, ApiError } from "@/types/bug"
import { mockFetch } from "@/mocks/offline-mock"

const API_BASE_URL = process.env.NEXT_PUBLIC_BUGZILLA_API_URL || "https://bugzilla.example.com/rest"
const USE_OFFLINE_MOCK = process.env.NEXT_PUBLIC_USE_OFFLINE_MOCK === "true"

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

export class BugzillaApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    // Use offline mock if enabled, otherwise use real fetch
    const fetchFunction = USE_OFFLINE_MOCK ? mockFetch : fetch

    try {
      const response = await fetchFunction(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new BugzillaApiError(`HTTP ${response.status}: ${response.statusText}`, response.status)
      }

      const data = await response.json()

      if (data.faults && data.faults.length > 0) {
        throw new BugzillaApiError(data.faults[0].faultString, data.faults[0].faultCode, data.faults)
      }

      return data
    } catch (error) {
      if (error instanceof BugzillaApiError) {
        throw error
      }
      throw new BugzillaApiError(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`, 0)
    }
  }

  async getBug(id: number): Promise<BugData> {
    const response = await this.request<ApiResponse<BugData>>(`/bug/${id}`)

    if (!response.bugs || response.bugs.length === 0) {
      throw new BugzillaApiError(`Bug ${id} not found`, 404)
    }

    return response.bugs[0]
  }

  async updateBug(id: number, updates: Partial<BugData>): Promise<void> {
    const updateRequest: BugUpdateRequest = {
      ids: [id],
      ...updates,
    }

    await this.request(`/bug/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateRequest),
    })
  }

  async searchBugs(params: Record<string, any>): Promise<BugData[]> {
    const searchParams = new URLSearchParams(params)
    const response = await this.request<ApiResponse<BugData>>(`/bug?${searchParams}`)

    return response.bugs || []
  }
}

export const bugzillaApi = new BugzillaApiService()
export { BugzillaApiError }
