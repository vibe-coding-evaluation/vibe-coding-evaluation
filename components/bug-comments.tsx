"use client"

import { useState } from "react"
import type { Comment, CommentDisplayOptions, NewComment } from "@/types/comment"
import type { BugData } from "@/types/bug"
import { getCommentsForBug, addComment } from "@/data/comment-data"
import { VintageTextarea, VintageSelect } from "@/components/ui/vintage-input"
import { SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Minus } from "lucide-react"

interface BugCommentsProps {
  bug: BugData
  onStatusChange?: (status: string) => void
}

export function BugComments({ bug, onStatusChange }: BugCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(() => getCommentsForBug(bug.id))
  const [newComment, setNewComment] = useState<NewComment>({
    text: "",
    is_private: false,
    status: bug.status,
    minor_update: false,
  })
  const [displayOptions, setDisplayOptions] = useState<CommentDisplayOptions>({
    expandWidth: false,
    decorate: false,
    collapse: false,
  })
  const [saving, setSaving] = useState(false)

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date
      .toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      })
      .replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$1-$2")
  }

  const handleSaveChanges = async () => {
    if (!newComment.text.trim()) return

    setSaving(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      const comment = addComment(bug.id, {
        author: "current.user@example.com",
        author_detail: {
          id: 9999,
          email: "current.user@example.com",
          name: "current.user",
          real_name: "Current User",
        },
        text: newComment.text,
        is_private: newComment.is_private,
        tags: [`Comment ${comments.length + 1}`],
      })

      setComments((prev) => [...prev, comment])

      // Handle status change
      if (newComment.status && newComment.status !== bug.status) {
        onStatusChange?.(newComment.status)
      }

      // Reset form
      setNewComment({
        text: "",
        is_private: false,
        status: newComment.status,
        minor_update: false,
      })

      console.log("Comment added successfully")
    } catch (error) {
      console.error("Failed to add comment:", error)
    } finally {
      setSaving(false)
    }
  }

  const toggleCommentPrivacy = (commentId: number) => {
    setComments((prev) =>
      prev.map((comment) => (comment.id === commentId ? { ...comment, is_private: !comment.is_private } : comment)),
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Section: Comment Submission */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <label className="font-bold text-sm">Additional Comments:</label>
          <div className="flex items-center gap-2">
            <Checkbox
              id="private-comment"
              checked={newComment.is_private}
              onCheckedChange={(checked) => setNewComment((prev) => ({ ...prev, is_private: !!checked }))}
              className="border-gray-400"
            />
            <label htmlFor="private-comment" className="text-sm cursor-pointer">
              Make comment private (visible only to members of the editbugs group)
            </label>
          </div>
        </div>

        <VintageTextarea
          value={newComment.text}
          onChange={(e) => setNewComment((prev) => ({ ...prev, text: e.target.value }))}
          rows={8}
          className="w-full"
          placeholder="Enter your comment here..."
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="font-bold text-sm text-purple-700">Status:</label>
              <VintageSelect
                value={newComment.status || bug.status}
                onValueChange={(value) => setNewComment((prev) => ({ ...prev, status: value }))}
                className="w-40"
              >
                <SelectItem value="NEW">NEW</SelectItem>
                <SelectItem value="ASSIGNED">ASSIGNED</SelectItem>
                <SelectItem value="REOPENED">REOPENED</SelectItem>
                <SelectItem value="RESOLVED">RESOLVED</SelectItem>
                <SelectItem value="VERIFIED">VERIFIED</SelectItem>
                <SelectItem value="CLOSED">CLOSED</SelectItem>
              </VintageSelect>
            </div>
            <a href="#" className="text-blue-600 underline hover:text-blue-800 text-sm">
              Mark as Duplicate
            </a>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Button
              onClick={handleSaveChanges}
              disabled={saving || !newComment.text.trim()}
              className="bg-gray-100 border-2 border-gray-400 text-black hover:bg-gray-200 shadow-sm rounded-none text-sm px-4 py-2"
              variant="outline"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <div className="flex items-center gap-2">
              <label htmlFor="minor-update-comment" className="text-sm cursor-pointer">
                This is a minor update (do not send email)
              </label>
              <Checkbox
                id="minor-update-comment"
                checked={newComment.minor_update}
                onCheckedChange={(checked) => setNewComment((prev) => ({ ...prev, minor_update: !!checked }))}
                className="border-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Display Options */}
      <div className="bg-gray-100 border-2 border-gray-300 p-3">
        <div className="flex items-center gap-6">
          <span className="font-bold text-sm">For All Comments:</span>

          <div className="flex items-center gap-2">
            <Checkbox
              id="expand-width"
              checked={displayOptions.expandWidth}
              onCheckedChange={(checked) => setDisplayOptions((prev) => ({ ...prev, expandWidth: !!checked }))}
              className="border-gray-400"
            />
            <label htmlFor="expand-width" className="text-sm cursor-pointer">
              Expand Width
            </label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="decorate"
              checked={displayOptions.decorate}
              onCheckedChange={(checked) => setDisplayOptions((prev) => ({ ...prev, decorate: !!checked }))}
              className="border-gray-400"
            />
            <label htmlFor="decorate" className="text-sm cursor-pointer">
              Decorate (Crash Dump)
            </label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="collapse"
              checked={displayOptions.collapse}
              onCheckedChange={(checked) => setDisplayOptions((prev) => ({ ...prev, collapse: !!checked }))}
              className="border-gray-400"
            />
            <label htmlFor="collapse" className="text-sm cursor-pointer">
              Collapse
            </label>
          </div>
        </div>
      </div>

      {/* Bottom Section: Comment History List */}
      <div className="space-y-2">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 border-2 border-gray-300 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <a href="#" className="text-blue-600 underline hover:text-blue-800 font-bold">
                  {comment.author_detail?.real_name || comment.author}
                </a>
                <span className="font-bold text-sm">{formatTimestamp(comment.time)}</span>
                {comment.tags && comment.tags.length > 0 && (
                  <a href="#" className="text-blue-600 underline hover:text-blue-800 text-sm">
                    {comment.tags[0]}
                  </a>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`private-${comment.id}`}
                    checked={comment.is_private}
                    onCheckedChange={() => toggleCommentPrivacy(comment.id)}
                    className="border-gray-400"
                  />
                  <label htmlFor={`private-${comment.id}`} className="text-sm cursor-pointer">
                    Private
                  </label>
                </div>
                <a href="#" className="text-blue-600 underline hover:text-blue-800 text-sm">
                  [reply]
                </a>
                <button className="text-gray-600 hover:text-gray-800">
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-sm leading-relaxed">
              {displayOptions.decorate && comment.text.includes("crash") ? (
                <pre className="font-mono text-xs bg-white p-2 border-2 border-gray-200 overflow-x-auto rounded-none">
                  {comment.text}
                </pre>
              ) : (
                <div className="whitespace-pre-wrap">{comment.text}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Comment Link */}
      <div className="pt-2">
        <a href="#" className="text-blue-600 underline hover:text-blue-800 text-sm">
          Add Comment
        </a>
      </div>
    </div>
  )
}
