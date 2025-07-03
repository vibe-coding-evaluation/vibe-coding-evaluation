"use client"

import { render, screen, fireEvent } from "@testing-library/react"
import { TagInput } from "@/components/ui/tag-input"
import { jest } from "@jest/globals"

describe("TagInput", () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it("renders existing tags", () => {
    render(<TagInput value={["tag1", "tag2", "tag3"]} onChange={mockOnChange} placeholder="Add tag..." />)

    expect(screen.getByText("tag1")).toBeInTheDocument()
    expect(screen.getByText("tag2")).toBeInTheDocument()
    expect(screen.getByText("tag3")).toBeInTheDocument()
  })

  it("adds new tag on Enter key", () => {
    render(<TagInput value={["existing"]} onChange={mockOnChange} placeholder="Add tag..." />)

    const input = screen.getByPlaceholderText("Add tag...")
    fireEvent.change(input, { target: { value: "newtag" } })
    fireEvent.keyDown(input, { key: "Enter" })

    expect(mockOnChange).toHaveBeenCalledWith(["existing", "newtag"])
  })

  it("adds new tag on comma key", () => {
    render(<TagInput value={["existing"]} onChange={mockOnChange} placeholder="Add tag..." />)

    const input = screen.getByPlaceholderText("Add tag...")
    fireEvent.change(input, { target: { value: "newtag" } })
    fireEvent.keyDown(input, { key: "," })

    expect(mockOnChange).toHaveBeenCalledWith(["existing", "newtag"])
  })

  it("removes tag on X click", () => {
    render(<TagInput value={["tag1", "tag2"]} onChange={mockOnChange} placeholder="Add tag..." />)

    const removeButtons = screen.getAllByRole("button")
    fireEvent.click(removeButtons[0])

    expect(mockOnChange).toHaveBeenCalledWith(["tag2"])
  })

  it("removes last tag on backspace when input is empty", () => {
    render(<TagInput value={["tag1", "tag2"]} onChange={mockOnChange} placeholder="Add tag..." />)

    const input = screen.getByPlaceholderText("Add tag...")
    fireEvent.keyDown(input, { key: "Backspace" })

    expect(mockOnChange).toHaveBeenCalledWith(["tag1"])
  })

  it("prevents duplicate tags", () => {
    render(<TagInput value={["existing"]} onChange={mockOnChange} placeholder="Add tag..." />)

    const input = screen.getByPlaceholderText("Add tag...")
    fireEvent.change(input, { target: { value: "existing" } })
    fireEvent.keyDown(input, { key: "Enter" })

    expect(mockOnChange).not.toHaveBeenCalled()
  })

  it("trims whitespace from new tags", () => {
    render(<TagInput value={[]} onChange={mockOnChange} placeholder="Add tag..." />)

    const input = screen.getByPlaceholderText("Add tag...")
    fireEvent.change(input, { target: { value: "  newtag  " } })
    fireEvent.keyDown(input, { key: "Enter" })

    expect(mockOnChange).toHaveBeenCalledWith(["newtag"])
  })

  it("clears input after adding tag", () => {
    render(<TagInput value={[]} onChange={mockOnChange} placeholder="Add tag..." />)

    const input = screen.getByPlaceholderText("Add tag...")
    fireEvent.change(input, { target: { value: "newtag" } })
    fireEvent.keyDown(input, { key: "Enter" })

    expect(input).toHaveValue("")
  })
})
