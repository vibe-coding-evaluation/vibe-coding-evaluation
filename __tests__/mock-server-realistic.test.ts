import { mockServer } from "@/mocks/mock-server"

describe("MockBugzillaServer - Realistic Data", () => {
  beforeEach(() => {
    mockServer.reset()
  })

  describe("Bugzilla API Format Compliance", () => {
    it("returns bug data in correct Bugzilla API format", async () => {
      const response = await mockServer.getBug(35)

      expect(response).toHaveProperty("bugs")
      expect(response).toHaveProperty("faults")
      expect(response.faults).toEqual([])
      expect(response.bugs).toHaveLength(1)

      const bug = response.bugs[0]

      // Check required Bugzilla fields
      expect(bug).toHaveProperty("id", 35)
      expect(bug).toHaveProperty("summary", "test bug")
      expect(bug).toHaveProperty("status", "RESOLVED")
      expect(bug).toHaveProperty("resolution", "INVALID")
      expect(bug).toHaveProperty("product", "FoodReplicator")
      expect(bug).toHaveProperty("component", "SaltSprinkler")
      expect(bug).toHaveProperty("assigned_to", "user@bugzilla.org")
      expect(bug).toHaveProperty("creator", "user@bugzilla.org")
      expect(bug).toHaveProperty("creation_time", "2000-07-25T13:50:04Z")
      expect(bug).toHaveProperty("last_change_time", "2014-09-23T19:12:17Z")
    })

    it("includes detailed user information", async () => {
      const response = await mockServer.getBug(35)
      const bug = response.bugs[0]

      expect(bug.assigned_to_detail).toEqual({
        id: 2,
        email: "user@bugzilla.org",
        name: "user@bugzilla.org",
        real_name: "Test User",
      })

      expect(bug.creator_detail).toEqual({
        id: 28,
        email: "namachi@netscape.com",
        name: "user@bugzilla.org",
        real_name: "hello",
      })

      expect(bug.cc_detail).toEqual([
        {
          id: 786,
          email: "foo@bar.com",
          name: "foo@bar.com",
          real_name: "Foo Bar",
        },
      ])
    })

    it("includes flags information", async () => {
      const response = await mockServer.getBug(35)
      const bug = response.bugs[0]

      expect(bug.flags).toHaveLength(1)
      expect(bug.flags[0]).toEqual({
        id: 2906,
        name: "blocker",
        type_id: 11,
        status: "?",
        setter: "user@bugzilla.org",
        creation_date: "2014-09-28T21:03:47Z",
        modification_date: "2014-09-28T21:03:47Z",
      })
    })

    it("includes custom fields", async () => {
      const response = await mockServer.getBug(35)
      const bug = response.bugs[0]

      expect(bug.custom_fields).toEqual({
        cf_drop_down: "---",
        cf_large_text: "",
        cf_bug_id: null,
        cf_qa_list_4: "---",
        cf_mulitple_select: [],
        cf_date: null,
        cf_free_text: "",
      })
    })
  })

  describe("Enhanced Bug Data (338662)", () => {
    it("returns enhanced bug with all custom fields", async () => {
      const response = await mockServer.getBug(338662)
      const bug = response.bugs[0]

      expect(bug.id).toBe(338662)
      expect(bug.summary).toBe("Database crash when executing complex query with multiple joins")
      expect(bug.status).toBe("REOPENED")
      expect(bug.product).toBe("NewDB")
      expect(bug.component).toBe("Crash Consulting")

      // Check custom fields
      expect(bug.symptom).toBe("crash_callstack_string")
      expect(bug.steps_to_reproduce).toContain("Execute complex query")
      expect(bug.workaround).toContain("Use simpler queries")
      expect(bug.root_cause).toContain("Memory allocation issue")
      expect(bug.solution).toContain("Implement better memory management")
      expect(bug.error_category).toBe("crash")
      expect(bug.testcase_exists).toBe(true)
      expect(bug.testcases).toBe("testComplexJoins.py -t 42")
      expect(bug.cvss_score).toBe(7.5)
    })

    it("includes HANA-specific fields", async () => {
      const response = await mockServer.getBug(338662)
      const bug = response.bugs[0]

      expect(bug.reported_release).toBe("Cloud-Edition")
      expect(bug.reported_cloud_edition).toBe("Standard")
      expect(bug.reported_branch).toBe("main")
      expect(bug.reported_hana_instances).toEqual(["instance_guid_123", "instance_guid_456"])
      expect(bug.backlog_duration).toBe(42)
      expect(bug.mpt_due_date).toBe("2025-08-01")
      expect(bug.problem_identifier).toEqual(["problem_id_001"])
    })

    it("includes stakeholder information", async () => {
      const response = await mockServer.getBug(338662)
      const bug = response.bugs[0]

      expect(bug.affected_customers).toEqual(["Customer A", "Customer B", "Customer C"])
      expect(bug.internal_stakeholders).toEqual(["HANA Cloud", "Database Team"])
      expect(bug.internal_messages).toContain("Critical issue affecting multiple customers")
      expect(bug.customer_messages).toContain("Expected resolution within 48 hours")
    })
  })

  describe("Performance Bug Data (338663)", () => {
    it("returns performance bug with regression details", async () => {
      const response = await mockServer.getBug(338663)
      const bug = response.bugs[0]

      expect(bug.id).toBe(338663)
      expect(bug.summary).toBe("Performance degradation in data indexing operations")
      expect(bug.status).toBe("NEW")
      expect(bug.severity).toBe("normal")
      expect(bug.priority).toBe("P2")
      expect(bug.error_category).toBe("performance")
      expect(bug.symptom).toBe("slow_query_performance")
      expect(bug.whiteboard).toBe("Performance regression since v2.5.0")
      expect(bug.keywords).toContain("PERFORMANCE")
      expect(bug.keywords).toContain("REGRESSION")
    })

    it("includes dependency information", async () => {
      const response = await mockServer.getBug(338663)
      const bug = response.bugs[0]

      expect(bug.depends_on).toEqual([338664])
      expect(bug.blocks).toEqual([])
      expect(bug.see_also).toEqual(["https://bugzilla.example.com/show_bug.cgi?id=338664"])
    })

    it("includes enterprise customer fields", async () => {
      const response = await mockServer.getBug(338663)
      const bug = response.bugs[0]

      expect(bug.custom_fields?.cf_customer_tier).toBe("Enterprise")
      expect(bug.custom_fields?.cf_sla_deadline).toBe("2025-07-01")
      expect(bug.affected_customers).toContain("Enterprise Corp")
      expect(bug.reported_cloud_edition).toBe("Enterprise")
    })
  })

  describe("Error Scenarios with Realistic Data", () => {
    it("returns proper error format for non-existent bug", async () => {
      const response = await mockServer.getBug(999999)

      expect(response.bugs).toEqual([])
      expect(response.faults).toHaveLength(1)
      expect(response.faults[0]).toEqual({
        faultCode: 101,
        faultString: "Bug #999999 does not exist.",
      })
    })

    it("handles validation errors with proper format", async () => {
      const response = await mockServer.updateBug(35, {
        ids: [35],
        summary: "INVALID",
      })

      expect(response.bugs).toEqual([])
      expect(response.faults).toHaveLength(1)
      expect(response.faults[0]).toEqual({
        faultCode: 50,
        faultString: "Summary cannot be 'INVALID'",
      })
    })

    it("handles permission errors", async () => {
      const response = await mockServer.updateBug(35, {
        ids: [35],
        status: "INVALID_STATUS",
      })

      expect(response.bugs).toEqual([])
      expect(response.faults).toHaveLength(1)
      expect(response.faults[0]).toEqual({
        faultCode: 504,
        faultString: "You are not allowed to change the Status field from REOPENED to INVALID_STATUS",
      })
    })

    it("simulates server errors", async () => {
      mockServer.setFailureRate(1)

      const response = await mockServer.getBug(35)

      expect(response.bugs).toEqual([])
      expect(response.faults).toHaveLength(1)
      expect(response.faults[0]).toEqual({
        faultCode: 500,
        faultString: "Internal server error",
      })
    })
  })

  describe("Search Functionality with Realistic Data", () => {
    it("searches by product", async () => {
      const response = await mockServer.searchBugs({ product: "FoodReplicator" })

      expect(response.bugs).toHaveLength(1)
      expect(response.bugs[0].product).toBe("FoodReplicator")
      expect(response.bugs[0].id).toBe(35)
      expect(response.faults).toEqual([])
    })

    it("searches by status", async () => {
      const response = await mockServer.searchBugs({ status: "RESOLVED" })

      expect(response.bugs).toHaveLength(1)
      expect(response.bugs[0].status).toBe("RESOLVED")
      expect(response.bugs[0].id).toBe(35)
    })

    it("searches by multiple criteria", async () => {
      const response = await mockServer.searchBugs({
        product: "NewDB",
        status: "REOPENED",
        component: "Crash Consulting",
      })

      expect(response.bugs).toHaveLength(1)
      expect(response.bugs[0].id).toBe(338662)
      expect(response.bugs[0].product).toBe("NewDB")
      expect(response.bugs[0].status).toBe("REOPENED")
      expect(response.bugs[0].component).toBe("Crash Consulting")
    })

    it("returns empty results for no matches", async () => {
      const response = await mockServer.searchBugs({ product: "NonExistentProduct" })

      expect(response.bugs).toEqual([])
      expect(response.faults).toEqual([])
    })

    it("handles pagination", async () => {
      const response = await mockServer.searchBugs({ limit: "1", offset: "0" })

      expect(response.bugs).toHaveLength(1)
      expect(response.faults).toEqual([])
    })
  })

  describe("Data Integrity", () => {
    it("maintains data consistency after updates", async () => {
      const originalResponse = await mockServer.getBug(35)
      const originalBug = originalResponse.bugs[0]

      const updateResponse = await mockServer.updateBug(35, {
        ids: [35],
        summary: "Updated test bug",
        status: "IN_PROGRESS",
      })

      expect(updateResponse.bugs).toHaveLength(1)
      expect(updateResponse.faults).toEqual([])

      const updatedResponse = await mockServer.getBug(35)
      const updatedBug = updatedResponse.bugs[0]

      expect(updatedBug.summary).toBe("Updated test bug")
      expect(updatedBug.status).toBe("IN_PROGRESS")
      expect(updatedBug.last_change_time).not.toBe(originalBug.last_change_time)
      expect(updatedBug.id).toBe(originalBug.id)
      expect(updatedBug.creation_time).toBe(originalBug.creation_time)
    })

    it("preserves complex data structures", async () => {
      const response = await mockServer.getBug(338662)
      const bug = response.bugs[0]

      // Verify arrays are preserved
      expect(Array.isArray(bug.keywords)).toBe(true)
      expect(Array.isArray(bug.cc)).toBe(true)
      expect(Array.isArray(bug.cc_detail)).toBe(true)
      expect(Array.isArray(bug.flags)).toBe(true)
      expect(Array.isArray(bug.gerrit_links)).toBe(true)
      expect(Array.isArray(bug.affected_customers)).toBe(true)

      // Verify objects are preserved
      expect(typeof bug.assigned_to_detail).toBe("object")
      expect(typeof bug.creator_detail).toBe("object")
      expect(typeof bug.custom_fields).toBe("object")
    })
  })
})
