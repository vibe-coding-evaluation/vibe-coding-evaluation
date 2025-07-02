import type { BugData, ApiResponse, BugUpdateRequest, ApiError } from "@/types/bug"

// Mock data store
const mockBugs = new Map<number, BugData>()

// Initialize with realistic Bugzilla API sample data
const sampleBugzillaResponse: BugData = {
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

  // Extended fields for our implementation
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
}

// Add our enhanced bug (Bug 338662 from original screenshot)
const enhancedBug: BugData = {
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

// Initialize mock data
mockBugs.set(35, sampleBugzillaResponse)
mockBugs.set(338662, enhancedBug)

// Add more realistic test data
const performanceBug: BugData = {
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
}

mockBugs.set(338663, performanceBug)

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
    mockBugs.set(35, sampleBugzillaResponse)
    mockBugs.set(338662, enhancedBug)
    mockBugs.set(338663, performanceBug)
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

    // Return in Bugzilla API format
    return {
      bugs: [bug],
      faults: [],
    }
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

    if (updates.status === "INVALID_STATUS") {
      return {
        bugs: [],
        faults: [
          this.createError(504, "You are not allowed to change the Status field from REOPENED to INVALID_STATUS"),
        ],
      }
    }

    // Apply updates
    const updatedBug = { ...bug, ...updates, last_change_time: new Date().toISOString() }
    mockBugs.set(id, updatedBug)

    return {
      bugs: [{ id }],
      faults: [],
    }
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
    if (params.component) {
      results = results.filter((bug) => bug.component === params.component)
    }
    if (params.severity) {
      results = results.filter((bug) => bug.severity === params.severity)
    }
    if (params.priority) {
      results = results.filter((bug) => bug.priority === params.priority)
    }

    // Simulate pagination
    const limit = params.limit ? Number.parseInt(params.limit) : 100
    const offset = params.offset ? Number.parseInt(params.offset) : 0
    results = results.slice(offset, offset + limit)

    return {
      bugs: results,
      faults: [],
    }
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

  // Method to simulate specific error scenarios
  simulateErrorScenario(scenario: "server_error" | "not_found" | "validation_error" | "permission_denied"): void {
    switch (scenario) {
      case "server_error":
        this.setFailureRate(1)
        break
      case "not_found":
        this.clearBugs()
        break
      case "validation_error":
        // This will be handled in updateBug method
        break
      case "permission_denied":
        this.setFailureRate(1)
        break
    }
  }
}

// Export singleton instance
export const mockServer = MockBugzillaServer.getInstance()
