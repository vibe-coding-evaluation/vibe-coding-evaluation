import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { DeliveryMatrix } from "@/components/delivery-matrix"

describe("DeliveryMatrix", () => {
  it("renders delivery matrix table", () => {
    render(<DeliveryMatrix />)

    expect(screen.getByText("Delivery Table")).toBeInTheDocument()
    expect(screen.getByText("Code Line (Branch)")).toBeInTheDocument()
    expect(screen.getByText("Affected")).toBeInTheDocument()
    expect(screen.getByText("Delivery")).toBeInTheDocument()
    expect(screen.getByText("Release Blocker")).toBeInTheDocument()
    expect(screen.getByText("Target Release")).toBeInTheDocument()
    expect(screen.getByText("Fixed in Code Line")).toBeInTheDocument()
    expect(screen.getByText("Shipped Release")).toBeInTheDocument()
    expect(screen.getByText("Delivery Remark")).toBeInTheDocument()
  })

  it("displays all release branches", () => {
    render(<DeliveryMatrix />)

    expect(screen.getByText("2.0 SP05")).toBeInTheDocument()
    expect(screen.getByText("2.0 SP07")).toBeInTheDocument()
    expect(screen.getByText("2.0 SP08")).toBeInTheDocument()
    expect(screen.getByText("2.0 SP09")).toBeInTheDocument()
    expect(screen.getByText("2024 Q2 QRC")).toBeInTheDocument()
    expect(screen.getByText("2024 Q3 QRC")).toBeInTheDocument()
    expect(screen.getByText("2024 Q4 QRC")).toBeInTheDocument()
    expect(screen.getByText("2025 Q1 QRC")).toBeInTheDocument()
    expect(screen.getByText("HANA Cloud")).toBeInTheDocument()
  })

  it("handles dropdown changes", () => {
    render(<DeliveryMatrix />)

    const affectedDropdowns = screen.getAllByDisplayValue("not set")
    const firstAffectedDropdown = affectedDropdowns[0]

    fireEvent.change(firstAffectedDropdown, { target: { value: "yes" } })
    expect(firstAffectedDropdown).toHaveValue("yes")
  })

  it("handles input field changes", () => {
    render(<DeliveryMatrix />)

    const targetReleaseInputs = screen.getAllByDisplayValue("")
    const firstTargetReleaseInput = targetReleaseInputs[0]

    fireEvent.change(firstTargetReleaseInput, { target: { value: "2.0.5.1" } })
    expect(firstTargetReleaseInput).toHaveValue("2.0.5.1")
  })

  it("handles save button click", async () => {
    render(<DeliveryMatrix />)

    const saveButton = screen.getByText("Save Changes")
    fireEvent.click(saveButton)

    expect(screen.getByText("Saving...")).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText("Save Changes")).toBeInTheDocument()
    })
  })

  it("persists changes across interactions", () => {
    render(<DeliveryMatrix />)

    // Make a change
    const affectedDropdowns = screen.getAllByDisplayValue("not set")
    const firstAffectedDropdown = affectedDropdowns[0]
    fireEvent.change(firstAffectedDropdown, { target: { value: "yes" } })

    // Make another change
    const targetReleaseInputs = screen.getAllByDisplayValue("")
    const firstTargetReleaseInput = targetReleaseInputs[0]
    fireEvent.change(firstTargetReleaseInput, { target: { value: "2.0.5.1" } })

    // Both changes should persist
    expect(firstAffectedDropdown).toHaveValue("yes")
    expect(firstTargetReleaseInput).toHaveValue("2.0.5.1")
  })
})
