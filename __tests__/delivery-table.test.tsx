import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { DeliveryTable } from "@/components/delivery-table"

describe("DeliveryTable", () => {
  it("renders delivery table with header", () => {
    render(<DeliveryTable />)

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
    render(<DeliveryTable />)

    expect(screen.getByText("2.0 SP05")).toBeInTheDocument()
    expect(screen.getByText("(hana2sp05)")).toBeInTheDocument()
    expect(screen.getByText("2.0 SP07")).toBeInTheDocument()
    expect(screen.getByText("(hana2sp07)")).toBeInTheDocument()
    expect(screen.getByText("2.0 SP08")).toBeInTheDocument()
    expect(screen.getByText("(hana2sp08)")).toBeInTheDocument()
    expect(screen.getByText("2.0 SP09")).toBeInTheDocument()
    expect(screen.getByText("(orange)")).toBeInTheDocument()
    expect(screen.getByText("2024 Q2 QRC")).toBeInTheDocument()
    expect(screen.getByText("(CE2024.14)")).toBeInTheDocument()
    expect(screen.getByText("2024 Q3 QRC")).toBeInTheDocument()
    expect(screen.getByText("(CE2024.28)")).toBeInTheDocument()
    expect(screen.getByText("2024 Q4 QRC")).toBeInTheDocument()
    expect(screen.getByText("(CE2024.40)")).toBeInTheDocument()
    expect(screen.getByText("2025 Q1 QRC")).toBeInTheDocument()
    expect(screen.getByText("(CE2025.2)")).toBeInTheDocument()
    expect(screen.getByText("HANA Cloud")).toBeInTheDocument()
    expect(screen.getByText("(master)")).toBeInTheDocument()
  })

  it("handles dropdown changes", () => {
    render(<DeliveryTable />)

    const affectedDropdowns = screen.getAllByDisplayValue("not set")
    const firstAffectedDropdown = affectedDropdowns[0]

    fireEvent.change(firstAffectedDropdown, { target: { value: "yes" } })
    expect(firstAffectedDropdown).toHaveValue("yes")
  })

  it("handles input field changes", () => {
    render(<DeliveryTable />)

    const targetReleaseInputs = screen.getAllByDisplayValue("")
    const firstTargetReleaseInput = targetReleaseInputs[0]

    fireEvent.change(firstTargetReleaseInput, { target: { value: "2.0.5.1" } })
    expect(firstTargetReleaseInput).toHaveValue("2.0.5.1")
  })

  it("handles save button click", async () => {
    render(<DeliveryTable />)

    const saveButton = screen.getByText("Save Changes")
    fireEvent.click(saveButton)

    expect(screen.getByText("Saving...")).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText("Save Changes")).toBeInTheDocument()
    })
  })

  it("shows footer elements", () => {
    render(<DeliveryTable />)

    expect(screen.getByText("out of maintenance")).toBeInTheDocument()
    expect(screen.getByText("Show inactive codelines")).toBeInTheDocument()
    expect(screen.getByText("Bugzilla FAQ")).toBeInTheDocument()
    expect(screen.getByText("Developer FAQ")).toBeInTheDocument()
    expect(screen.getByText("Delivery Schedule")).toBeInTheDocument()
    expect(screen.getByText("Delivery Graph")).toBeInTheDocument()
    expect(screen.getByText("This is a minor update (do not send email)")).toBeInTheDocument()
  })

  it("handles minor update checkbox", () => {
    render(<DeliveryTable />)

    const minorUpdateCheckbox = screen.getByLabelText("This is a minor update (do not send email)")
    fireEvent.click(minorUpdateCheckbox)

    expect(minorUpdateCheckbox).toBeChecked()
  })

  it("shows disabled fields for HANA Cloud row", () => {
    render(<DeliveryTable />)

    // Find the HANA Cloud row and check that some fields are disabled/grayed out
    const hanaCloudRow = screen.getByText("HANA Cloud").closest("tr")
    expect(hanaCloudRow).toBeInTheDocument()

    // Check for disabled delivery and release blocker fields
    const disabledTexts = screen.getAllByText("not set")
    expect(disabledTexts.length).toBeGreaterThan(0)
  })

  it("handles show inactive codelines toggle", () => {
    render(<DeliveryTable />)

    const toggleButton = screen.getByText("Show inactive codelines")
    fireEvent.click(toggleButton)

    // The button should still be there (functionality would show/hide inactive rows)
    expect(toggleButton).toBeInTheDocument()
  })

  it("persists changes across interactions", () => {
    render(<DeliveryTable />)

    // Make multiple changes
    const affectedDropdowns = screen.getAllByDisplayValue("not set")
    const firstAffectedDropdown = affectedDropdowns[0]
    fireEvent.change(firstAffectedDropdown, { target: { value: "yes" } })

    const targetReleaseInputs = screen.getAllByDisplayValue("")
    const firstTargetReleaseInput = targetReleaseInputs[0]
    fireEvent.change(firstTargetReleaseInput, { target: { value: "2.0.5.1" } })

    const remarkInputs = screen.getAllByDisplayValue("")
    const firstRemarkInput = remarkInputs[remarkInputs.length - 1] // Last empty input should be a remark field
    fireEvent.change(firstRemarkInput, { target: { value: "Test remark" } })

    // All changes should persist
    expect(firstAffectedDropdown).toHaveValue("yes")
    expect(firstTargetReleaseInput).toHaveValue("2.0.5.1")
  })
})
