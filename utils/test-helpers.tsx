import type React from "react"

import { render, type RenderOptions } from "@testing-library/react"
import { mockServer } from "@/mocks/mock-server"

// Custom render function that sets up mock server
export function renderWithMockServer(
  ui: React.ReactElement,
  options?: RenderOptions & {
    mockServerConfig?: {
      delay?: number
      failureRate?: number
      online?: boolean
    }
  },
) {
  const { mockServerConfig, ...renderOptions } = options || {}

  // Configure mock server
  if (mockServerConfig) {
    if (mockServerConfig.delay !== undefined) {
      mockServer.setDelay(mockServerConfig.delay)
    }
    if (mockServerConfig.failureRate !== undefined) {
      mockServer.setFailureRate(mockServerConfig.failureRate)
    }
    if (mockServerConfig.online !== undefined) {
      mockServer.setOnline(mockServerConfig.online)
    }
  }

  return render(ui, renderOptions)
}

// Helper to create test bug data
export function createTestBug(overrides: Partial<import("@/types/bug").BugData> = {}): import("@/types/bug").BugData {
  return {
    id: 12345,
    summary: "Test bug summary",
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
    ...overrides,
  }
}

// Helper to wait for async operations
export function waitForAsync(ms = 0): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Mock server control helpers
export const mockServerHelpers = {
  reset: () => mockServer.reset(),
  setDelay: (ms: number) => mockServer.setDelay(ms),
  setFailureRate: (rate: number) => mockServer.setFailureRate(rate),
  setOnline: (online: boolean) => mockServer.setOnline(online),
  addBug: (bug: import("@/types/bug").BugData) => mockServer.addBug(bug),
  getBug: (id: number) => mockServer.getBugFromStore(id),
  clearBugs: () => mockServer.clearBugs(),
}
