import type { Comment } from "@/types/comment"

// Mock comment data matching the screenshot
export const mockComments: Comment[] = [
  {
    id: 0,
    bug_id: 338662,
    author: "dl.hana.cloud.crash@example.com",
    author_detail: {
      id: 2001,
      email: "dl.hana.cloud.crash@example.com",
      name: "dl.hana.cloud.crash",
      real_name: "DL HANA Cloud Crash Dispatching",
    },
    time: "2025-05-20T09:29:04+02:00",
    creation_time: "2025-05-20T09:29:04+02:00",
    text: "description",
    is_private: false,
    count: 0,
    tags: ["Description"],
  },
  {
    id: 1,
    bug_id: 338662,
    author: "kang.sanghun@example.com",
    author_detail: {
      id: 1001,
      email: "kang.sanghun@example.com",
      name: "kang.sanghun",
      real_name: "Kang, Sanghun",
    },
    time: "2025-07-02T03:44:05+02:00",
    creation_time: "2025-07-02T03:44:05+02:00",
    text: "Adding comments for testing purposes. This demonstrates the comment functionality.",
    is_private: false,
    count: 1,
    tags: ["Comment 1"],
  },
  {
    id: 2,
    bug_id: 338662,
    author: "qa.team@example.com",
    author_detail: {
      id: 3001,
      email: "qa.team@example.com",
      name: "qa.team",
      real_name: "QA Team",
    },
    time: "2025-07-02T15:30:22+02:00",
    creation_time: "2025-07-02T15:30:22+02:00",
    text: "Verified the issue on our test environment. The crash occurs consistently with the provided steps. Stack trace shows memory allocation failure in the query optimizer module.",
    is_private: true,
    count: 2,
    tags: ["Comment 2"],
  },
]

// Get comments for a specific bug
export function getCommentsForBug(bugId: number): Comment[] {
  return mockComments.filter((comment) => comment.bug_id === bugId)
}

// Add a new comment
export function addComment(
  bugId: number,
  newComment: Omit<Comment, "id" | "bug_id" | "time" | "creation_time" | "count">,
): Comment {
  const now = new Date().toISOString().replace("Z", "+02:00")
  const nextCount = Math.max(...mockComments.map((c) => c.count)) + 1

  const comment: Comment = {
    id: mockComments.length,
    bug_id: bugId,
    time: now,
    creation_time: now,
    count: nextCount,
    ...newComment,
  }

  mockComments.push(comment)
  return comment
}
