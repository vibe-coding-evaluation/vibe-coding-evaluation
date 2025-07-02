import type { BugData } from "@/types/bug"

// Local storage for bug data
const localBugStorage = new Map<number, BugData>()

// Sample bug data stored locally
const sampleBugs: BugData[] = [
  {
    id: 35,
    summary: "test bug",
    status: "RESOLVED",
    resolution: "INVALID",
    product: "FoodReplicator",
    component: "SaltSprinkler",
    version: "1.0",
    priority: "P1",
    severity: "critical",
    platform: "All",
    op_sys: "All",
    assigned_to: "user@bugzilla.org",
    assigned_to_detail: {
      id: 2,
      email: "user@bugzilla.org",
      name: "user@bugzilla.org",
      real_name: "Test User",
    },
    qa_contact: "",
    creator: "user@bugzilla.org",
    creator_detail: {
      id: 28,
      email: "namachi@netscape.com",
      name: "user@bugzilla.org",
      real_name: "hello",
    },
    creation_time: "2000-07-25T13:50:04Z",
    last_change_time: "2014-09-23T19:12:17Z",
    classification: "Unclassified",
    alias: [],
    url: "",
    whiteboard: "",
    keywords: [],
    depends_on: [],
    blocks: [],
    cc: ["foo@bar.com"],
    cc_detail: [
      {
        id: 786,
        email: "foo@bar.com",
        name: "foo@bar.com",
        real_name: "Foo Bar",
      },
    ],
    see_also: [],
    flags: [
      {
        id: 2906,
        name: "blocker",
        type_id: 11,
        status: "?",
        setter: "user@bugzilla.org",
        creation_date: "2014-09-28T21:03:47Z",
        modification_date: "2014-09-28T21:03:47Z",
      },
    ],
    custom_fields: {
      cf_drop_down: "---",
      cf_large_text: "",
      cf_bug_id: null,
      cf_qa_list_4: "---",
      cf_mulitple_select: [],
      cf_date: null,
      cf_free_text: "",
    },
    symptom: "Application crashes when attempting to replicate salt",
    steps_to_reproduce:
      "1. Start food replicator\n2. Select salt from menu\n3. Press replicate button\n4. Application crashes",
    workaround: "Use pepper instead of salt, or restart application before each replication",
    root_cause: "Memory leak in salt molecule processing algorithm",
    solution: "Implement proper memory cleanup in salt processing module",
    error_category: "crash",
    testcase_exists: true,
    testcases: "testSaltReplication.py -t 15",
    gerrit_links: ["https://gerrit.example.com/c/food-replicator/+/12345"],
    jira_links: ["https://jira.example.com/browse/FOOD-456"],
    cvss_score: 8.5,
    internal_messages: "Critical bug affecting salt replication functionality. Customer reports high priority.",
    customer_messages: "We are investigating the salt replication issue. Workaround available using pepper.",
    affected_customers: ["Restaurant Chain A", "Food Lab B"],
    internal_stakeholders: ["Food Engineering", "Quality Assurance"],
    reported_release: "Enterprise-Edition",
    reported_cloud_edition: "Standard",
    reported_branch: "release/v1.0",
    reported_hana_instances: [],
    backlog_duration: 15,
    mpt_due_date: "2024-12-31",
    problem_identifier: ["SALT_CRASH_001"],
    additional_tags: ["food-safety", "critical-path"],
  },
  {
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
    flags: [
      {
        id: 5001,
        name: "needinfo",
        type_id: 1,
        status: "?",
        setter: "qa@example.com",
        requestee: "kang.sanghun@example.com",
        creation_date: "2025-06-01T10:00:00Z",
        modification_date: "2025-06-01T10:00:00Z",
      },
    ],
    custom_fields: {
      cf_customer_priority: "High",
      cf_internal_priority: "Critical",
      cf_escalation_level: "L2",
    },
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
  },
  {
    id: 338663,
    summary: "Performance degradation in data indexing operations",
    status: "NEW",
    resolution: "",
    product: "NewDB",
    component: "Indexing Engine",
    version: "2.5.1",
    priority: "P2",
    severity: "normal",
    platform: "All",
    op_sys: "Linux",
    assigned_to: "performance.team@example.com",
    assigned_to_detail: {
      id: 1002,
      email: "performance.team@example.com",
      name: "performance.team",
      real_name: "Performance Team",
    },
    qa_contact: "qa.indexing@example.com",
    qa_contact_detail: {
      id: 1003,
      email: "qa.indexing@example.com",
      name: "qa.indexing",
      real_name: "QA Indexing Team",
    },
    creator: "customer.support@example.com",
    creator_detail: {
      id: 2002,
      email: "customer.support@example.com",
      name: "customer.support",
      real_name: "Customer Support",
    },
    creation_time: "2025-06-15T14:30:00Z",
    last_change_time: "2025-06-20T10:15:00Z",
    classification: "Unclassified",
    alias: ["PERF-INDEX-001"],
    url: "https://docs.example.com/indexing-performance",
    whiteboard: "Performance regression since v2.5.0",
    keywords: ["PERFORMANCE", "REGRESSION", "CUSTOMER_IMPACT"],
    depends_on: [338664],
    blocks: [],
    cc: ["architect@example.com", "customer.success@example.com"],
    cc_detail: [
      {
        id: 3002,
        email: "architect@example.com",
        name: "architect",
        real_name: "System Architect",
      },
    ],
    see_also: ["https://bugzilla.example.com/show_bug.cgi?id=338664"],
    flags: [],
    custom_fields: {
      cf_performance_impact: "High",
      cf_customer_tier: "Enterprise",
      cf_sla_deadline: "2025-07-01",
    },
    symptom: "slow_query_performance",
    steps_to_reproduce:
      "1. Create large dataset (>1M records)\n2. Execute indexing operation\n3. Observe 300% slower performance compared to v2.4.x",
    workaround: "Use smaller batch sizes for indexing operations",
    root_cause: "Algorithm change in v2.5.0 introduced O(n²) complexity",
    solution: "Revert to optimized algorithm from v2.4.x with additional improvements",
    error_category: "performance",
    testcase_exists: true,
    testcases: "testIndexingPerformance.py -t 100",
    gerrit_links: ["https://gerrit.example.com/c/performance/+/67890"],
    jira_links: ["https://jira.example.com/browse/PERF-123"],
    cvss_score: 4.2,
    internal_messages: "Performance regression identified. Need to prioritize fix for enterprise customers.",
    customer_messages: "We have identified the performance issue and are working on a fix. ETA: 2 weeks.",
    affected_customers: ["Enterprise Corp", "Big Data Inc", "Analytics Ltd"],
    internal_stakeholders: ["Performance Team", "Customer Success"],
    reported_release: "Cloud-Edition",
    reported_cloud_edition: "Enterprise",
    reported_branch: "release/v2.5.1",
    reported_hana_instances: [],
    backlog_duration: 5,
    mpt_due_date: "2025-07-01",
    problem_identifier: ["PERF_REGRESSION_001"],
    additional_tags: ["regression", "enterprise-customer"],
  },
]

// Initialize local storage
sampleBugs.forEach((bug) => {
  localBugStorage.set(bug.id, bug)
})

interface MockFetchConfig {
  delay?: number
  failureRate?: number
  networkError?: boolean
}

class MockResponse {
  public ok: boolean
  public status: number
  public statusText: string
  private data: any

  constructor(data: any, status = 200, statusText = "OK") {
    this.data = data
    this.status = status
    this.ok = status >= 200 && status < 300
    this.statusText = statusText
  }

  async json(): Promise<any> {
    return Promise.resolve(this.data)
  }

  async text(): Promise<string> {
    return Promise.resolve(JSON.stringify(this.data))
  }

  async blob(): Promise<Blob> {
    return Promise.resolve(new Blob([JSON.stringify(this.data)], { type: "application/json" }))
  }

  async arrayBuffer(): Promise<ArrayBuffer> {
    const text = JSON.stringify(this.data)
    const encoder = new TextEncoder()
    return Promise.resolve(encoder.encode(text).buffer)
  }

  clone(): MockResponse {
    return new MockResponse(this.data, this.status, this.statusText)
  }
}

export class OfflineMockFetch {
  private config: MockFetchConfig = {
    delay: 300,
    failureRate: 0,
    networkError: false,
  }

  constructor(config?: MockFetchConfig) {
    if (config) {
      this.config = { ...this.config, ...config }
    }
  }

  // Configure mock behavior
  setConfig(config: Partial<MockFetchConfig>): void {
    this.config = { ...this.config, ...config }
  }

  // Reset to default configuration
  reset(): void {
    this.config = {
      delay: 300,
      failureRate: 0,
      networkError: false,
    }
    // Reset data to original state
    localBugStorage.clear()
    sampleBugs.forEach((bug) => {
      localBugStorage.set(bug.id, bug)
    })
  }

  // Simulate network delay
  private async simulateDelay(): Promise<void> {
    if (this.config.delay && this.config.delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.config.delay))
    }
  }

  // Simulate random failures
  private shouldFail(): boolean {
    return Math.random() < (this.config.failureRate || 0)
  }

  // Parse URL and extract information
  private parseUrl(url: string): { endpoint: string; params: URLSearchParams; bugId?: number } {
    const urlObj = new URL(url, "https://example.com")
    const pathname = urlObj.pathname
    const params = urlObj.searchParams

    // Extract bug ID from URL like /rest/bug/123
    const bugIdMatch = pathname.match(/\/bug\/(\d+)/)
    const bugId = bugIdMatch ? Number.parseInt(bugIdMatch[1]) : undefined

    return {
      endpoint: pathname,
      params,
      bugId,
    }
  }

  // Handle GET requests
  private handleGet(endpoint: string, params: URLSearchParams, bugId?: number): MockResponse {
    if (bugId) {
      // Get single bug
      const bug = localBugStorage.get(bugId)
      if (!bug) {
        return new MockResponse(
          {
            bugs: [],
            faults: [{ faultCode: 101, faultString: `Bug #${bugId} does not exist.` }],
          },
          200,
        )
      }
      return new MockResponse({ bugs: [bug], faults: [] })
    }

    if (endpoint.includes("/bug")) {
      // Search bugs
      let results = Array.from(localBugStorage.values())

      // Apply filters
      const product = params.get("product")
      const status = params.get("status")
      const component = params.get("component")
      const assignedTo = params.get("assigned_to")
      const severity = params.get("severity")
      const priority = params.get("priority")

      if (product) {
        results = results.filter((bug) => bug.product === product)
      }
      if (status) {
        results = results.filter((bug) => bug.status === status)
      }
      if (component) {
        results = results.filter((bug) => bug.component === component)
      }
      if (assignedTo) {
        results = results.filter((bug) => bug.assigned_to === assignedTo)
      }
      if (severity) {
        results = results.filter((bug) => bug.severity === severity)
      }
      if (priority) {
        results = results.filter((bug) => bug.priority === priority)
      }

      // Apply pagination
      const limit = params.get("limit") ? Number.parseInt(params.get("limit")!) : 100
      const offset = params.get("offset") ? Number.parseInt(params.get("offset")!) : 0
      results = results.slice(offset, offset + limit)

      return new MockResponse({ bugs: results, faults: [] })
    }

    return new MockResponse({ error: "Endpoint not found" }, 404, "Not Found")
  }

  // Handle PUT requests (updates)
  private handlePut(endpoint: string, body: any, bugId?: number): MockResponse {
    if (!bugId) {
      return new MockResponse(
        {
          bugs: [],
          faults: [{ faultCode: 400, faultString: "Bug ID is required for updates" }],
        },
        400,
      )
    }

    const bug = localBugStorage.get(bugId)
    if (!bug) {
      return new MockResponse(
        {
          bugs: [],
          faults: [{ faultCode: 101, faultString: `Bug #${bugId} does not exist.` }],
        },
        200,
      )
    }

    // Simulate validation errors
    if (body.summary === "INVALID") {
      return new MockResponse(
        {
          bugs: [],
          faults: [{ faultCode: 50, faultString: "Summary cannot be 'INVALID'" }],
        },
        200,
      )
    }

    if (body.status === "INVALID_STATUS") {
      return new MockResponse(
        {
          bugs: [],
          faults: [
            {
              faultCode: 504,
              faultString: `You are not allowed to change the Status field from ${bug.status} to INVALID_STATUS`,
            },
          ],
        },
        200,
      )
    }

    // Apply updates
    const updatedBug = {
      ...bug,
      ...body,
      last_change_time: new Date().toISOString(),
    }

    // Remove ids field from the update (it's not part of bug data)
    delete (updatedBug as any).ids

    localBugStorage.set(bugId, updatedBug)

    return new MockResponse({ bugs: [{ id: bugId }], faults: [] })
  }

  // Main fetch function that mimics the native fetch API
  async fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    await this.simulateDelay()

    // Simulate network errors
    if (this.config.networkError) {
      throw new Error("Network error: Unable to connect to server")
    }

    // Simulate random failures
    if (this.shouldFail()) {
      return new MockResponse(
        {
          bugs: [],
          faults: [{ faultCode: 500, faultString: "Internal server error" }],
        },
        500,
        "Internal Server Error",
      ) as any
    }

    const url = typeof input === "string" ? input : input.toString()
    const method = init?.method || "GET"
    const { endpoint, params, bugId } = this.parseUrl(url)

    try {
      let response: MockResponse

      switch (method.toUpperCase()) {
        case "GET":
          response = this.handleGet(endpoint, params, bugId)
          break

        case "PUT":
          const body = init?.body ? JSON.parse(init.body as string) : {}
          response = this.handlePut(endpoint, body, bugId)
          break

        case "POST":
          // Handle POST requests (create new bugs)
          response = new MockResponse(
            {
              bugs: [],
              faults: [{ faultCode: 501, faultString: "POST method not implemented in mock" }],
            },
            501,
          )
          break

        case "DELETE":
          // Handle DELETE requests
          response = new MockResponse(
            {
              bugs: [],
              faults: [{ faultCode: 501, faultString: "DELETE method not implemented in mock" }],
            },
            501,
          )
          break

        default:
          response = new MockResponse({ error: "Method not allowed" }, 405, "Method Not Allowed")
      }

      return response as any
    } catch (error) {
      return new MockResponse(
        {
          bugs: [],
          faults: [
            {
              faultCode: 500,
              faultString: `Server error: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
        },
        500,
        "Internal Server Error",
      ) as any
    }
  }

  // Utility methods for testing and debugging
  getBugFromStorage(id: number): BugData | undefined {
    return localBugStorage.get(id)
  }

  getAllBugs(): BugData[] {
    return Array.from(localBugStorage.values())
  }

  addBug(bug: BugData): void {
    localBugStorage.set(bug.id, bug)
  }

  removeBug(id: number): boolean {
    return localBugStorage.delete(id)
  }

  clearStorage(): void {
    localBugStorage.clear()
  }

  getStorageSize(): number {
    return localBugStorage.size
  }
}

// Create singleton instance
export const offlineMock = new OfflineMockFetch()

// Export a fetch-compatible function
export const mockFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  return offlineMock.fetch(input, init)
}

// Helper function to replace global fetch with mock
export function enableOfflineMock(config?: MockFetchConfig): void {
  if (config) {
    offlineMock.setConfig(config)
  }
  // Replace global fetch
  ;(global as any).fetch = mockFetch

  // For browser environments
  if (typeof window !== "undefined") {
    ;(window as any).fetch = mockFetch
  }
}

// Helper function to restore original fetch
export function disableOfflineMock(): void {
  // Note: This is a simplified restore - in a real implementation,
  // you'd want to store the original fetch function
  if (typeof window !== "undefined" && window.fetch) {
    // Restore would require storing original fetch
    console.warn("Original fetch restore not implemented in this mock")
  }
}

export default offlineMock
