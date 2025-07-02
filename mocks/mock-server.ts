import type { BugData, ApiResponse, BugUpdateRequest, ApiError } from "@/types/bug"

// Mock data store
const mockBugs = new Map<number, BugData>()

// Initialize with sample data
const sampleBug: BugData = {
  id: 338662,
  summary: "Database crash when executing complex query with multiple joins",
  status: "REOPENED",
  resolution: "",
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

  // Custom fields
  symptom: "crash_callstack_string",
  steps_to_reproduce: "1. Execute complex query with multiple joins\n2. Wait for processing\n3. Database crashes",
  workaround: "Use simpler queries or break down complex joins into multiple steps",
  root_cause: "Memory allocation issue in query optimizer when handling complex join operations",
  solution: "Implement better memory management in query optimizer module",
  error_category: "crash",
  testcase_exists: true,
  testcases: "testComplexJoins.py -t 42",
  gerrit_links: ["https://gerrit.example.com/c/12345", "https://gerrit.example.com/c/12346"],
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

// Add more sample bugs
const sampleBug2: BugData = {
  ...sampleBug,
  id: 338663,
  summary: "Performance degradation in data indexing",
  status: "NEW",
  priority: "P2",
  severity: "normal",
  symptom: "slow_query_performance",
  creation_time: "2025-06-15T14:30:00Z",
  last_change_time: "2025-06-20T10:15:00Z",
}

mockBugs.set(338663, sampleBug2)

export class MockBugzillaServer {
  private static instance: MockBugzillaServer
  private delay = 500 // Simulate network delay
  private failureRate = 0 // 0-1, probability of random failures
  private isOnline = true

  static getInstance(): MockBugzillaServer {
    if (!MockBugzillaServer.instance) {
      MockBugzillaServer.instance = new MockBugzillaServer()
    }
    return MockBugzillaServer.instance
  }

  // Configuration methods for testing
  setDelay(ms: number): void {
    this.delay = ms
  }

  setFailureRate(rate: number): void {
    this.failureRate = Math.max(0, Math.min(1, rate))
  }

  setOnline(online: boolean): void {
    this.isOnline = online
  }

  reset(): void {
    this.delay = 500
    this.failureRate = 0
    this.isOnline = true
    // Reset to original sample data
    mockBugs.clear()
    mockBugs.set(338662, sampleBug)
    mockBugs.set(338663, sampleBug2)
  }

  private async simulateDelay(): Promise<void> {
    if (this.delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.delay))
    }
  }

  private shouldFail(): boolean {
    return Math.random() < this.failureRate
  }

  private createError(code: number, message: string): ApiError {
    return { faultCode: code, faultString: message }
  }

  async getBug(id: number): Promise<ApiResponse<BugData>> {
    await this.simulateDelay()

    if (!this.isOnline) {
      throw new Error("Network error: Server is offline")
    }

    if (this.shouldFail()) {
      return {
        bugs: [],
        faults: [this.createError(500, "Internal server error")],
      }
    }

    const bug = mockBugs.get(id)
    if (!bug) {
      return {
        bugs: [],
        faults: [this.createError(101, `Bug #${id} does not exist.`)],
      }
    }

    return { bugs: [bug] }
  }

  async updateBug(id: number, updates: BugUpdateRequest): Promise<ApiResponse<any>> {
    await this.simulateDelay()

    if (!this.isOnline) {
      throw new Error("Network error: Server is offline")
    }

    if (this.shouldFail()) {
      return {
        bugs: [],
        faults: [this.createError(500, "Failed to update bug")],
      }
    }

    const bug = mockBugs.get(id)
    if (!bug) {
      return {
        bugs: [],
        faults: [this.createError(101, `Bug #${id} does not exist.`)],
      }
    }

    // Simulate validation errors
    if (updates.summary === "INVALID") {
      return {
        bugs: [],
        faults: [this.createError(50, "Summary cannot be 'INVALID'")],
      }
    }

    // Apply updates
    const updatedBug = { ...bug, ...updates, last_change_time: new Date().toISOString() }
    mockBugs.set(id, updatedBug)

    return { bugs: [{ id }] }
  }

  async searchBugs(params: Record<string, any>): Promise<ApiResponse<BugData>> {
    await this.simulateDelay()

    if (!this.isOnline) {
      throw new Error("Network error: Server is offline")
    }

    if (this.shouldFail()) {
      return {
        bugs: [],
        faults: [this.createError(500, "Search failed")],
      }
    }

    let results = Array.from(mockBugs.values())

    // Apply filters
    if (params.product) {
      results = results.filter((bug) => bug.product === params.product)
    }
    if (params.status) {
      results = results.filter((bug) => bug.status === params.status)
    }
    if (params.assigned_to) {
      results = results.filter((bug) => bug.assigned_to === params.assigned_to)
    }

    // Simulate pagination
    const limit = params.limit ? Number.parseInt(params.limit) : 100
    const offset = params.offset ? Number.parseInt(params.offset) : 0
    results = results.slice(offset, offset + limit)

    return { bugs: results }
  }

  // Utility methods for testing
  addBug(bug: BugData): void {
    mockBugs.set(bug.id, bug)
  }

  getBugFromStore(id: number): BugData | undefined {
    return mockBugs.get(id)
  }

  getAllBugs(): BugData[] {
    return Array.from(mockBugs.values())
  }

  clearBugs(): void {
    mockBugs.clear()
  }
}

// Export singleton instance
export const mockServer = MockBugzillaServer.getInstance()
