import type { BugData, ApiResponse, BugUpdateRequest, ApiError } from "@/types/bug"

const API_BASE_URL = process.env.NEXT_PUBLIC_BUGZILLA_API_URL || "https://bugzilla.example.com/rest"
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === "true"

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

// Mock data for development
const mockBugs = new Map<number, BugData>()

const sampleBug: BugData = {
  id: 338662,
  summary: "Database crash when executing complex query with multiple joins",
  status: "REOPENED",
  product: "NewDB",
  component: "Crash Consulting",
  version: "2.5.1",
  priority: "P1",
  severity: "major",
  platform: "All",
  op_sys: "Linux",
  assigned_to: "kang.sanghun@example.com",
  assigned_to_detail: {
    id: 1001,
    email: "kang.sanghun@example.com",
    name: "kang.sanghun",
    real_name: "Kang, Sanghun",
  },
  qa_contact: "kang.sanghun@example.com",
  qa_contact_detail: {
    id: 1001,
    email: "kang.sanghun@example.com",
    name: "kang.sanghun",
    real_name: "Kang, Sanghun",
  },
  creator: "dl.hana.cloud.crash@example.com",
  creator_detail: {
    id: 2001,
    email: "dl.hana.cloud.crash@example.com",
    name: "dl.hana.cloud.crash",
    real_name: "DL HANA Cloud Crash Dispatching",
  },
  creation_time: "2025-05-20T09:29:04Z",
  last_change_time: "2025-07-02T03:44:00Z",
  classification: "Unclassified",
  alias: [],
  url: "",
  whiteboard: "",
  keywords: ["D_CRASH", "I_CLOUD_ISSUE", "I_CLOUD_OUTAGE", "I_CUSTOMER_ISSUE"],
  depends_on: [],
  blocks: [],
  cc: ["user1@example.com", "user2@example.com"],
  cc_detail: [
    {
      id: 3001,
      email: "user1@example.com",
      name: "user1",
      real_name: "User One",
    },
  ],
  see_also: [],
  flags: [],
  custom_fields: {},
  symptom: "crash_callstack_string",
  steps_to_reproduce: "1. Execute complex query with multiple joins\n2. Wait for processing\n3. Database crashes",
  workaround: "Use simpler queries or break down complex joins into multiple steps",
  root_cause: "Memory allocation issue in query optimizer when handling complex join operations",
  solution: "Implement better memory management in query optimizer module",
  error_category: "crash",
  testcase_exists: true,
  testcases: "testComplexJoins.py -t 42",
  gerrit_links: ["https://gerrit.example.com/c/12345"],
  jira_links: ["https://jira.example.com/browse/DB-1234"],
  cvss_score: 7.5,
  internal_messages: "Critical issue affecting multiple customers. High priority fix required.",
  customer_messages: "We are aware of this issue and working on a fix. Expected resolution within 48 hours.",
  affected_customers: ["Customer A", "Customer B", "Customer C"],
  internal_stakeholders: ["HANA Cloud", "Database Team"],
  reported_release: "Cloud-Edition",
  reported_cloud_edition: "Standard",
  reported_branch: "main",
  reported_hana_instances: ["instance_guid_123", "instance_guid_456"],
  backlog_duration: 42,
  mpt_due_date: "2025-08-01",
  problem_identifier: ["problem_id_001"],
  additional_tags: ["urgent", "customer-facing"],
}

mockBugs.set(338662, sampleBug)

export class BugzillaApiService {
  private async mockRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    if (endpoint.includes("/bug/338662")) {
      const bug = mockBugs.get(338662)
      if (options.method === "PUT") {
        const body = JSON.parse(options.body as string)
        const updatedBug = { ...bug, ...body, last_change_time: new Date().toISOString() }
        mockBugs.set(338662, updatedBug as BugData)
        return { bugs: [{ id: 338662 }] } as T
      }
      return { bugs: bug ? [bug] : [], faults: [] } as T
    }

    if (endpoint.includes("/bug?")) {
      return { bugs: Array.from(mockBugs.values()), faults: [] } as T
    }

    throw new BugzillaApiError("Bug not found", 404)
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (USE_MOCK) {
      return this.mockRequest<T>(endpoint, options)
    }

    const url = `${API_BASE_URL}${endpoint}`

    try {
      const response = await fetch(url, {
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
