import { render, screen, fireEvent } from "@testing-library/react"
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

  it("handles save button click", () => {
    render(<DeliveryMatrix />)

    const saveButton = screen.getByText("Save Changes")
    fireEvent.click(saveButton)

    expect(screen.getByText("Saving...")).toBeInTheDocument()
  })

  it("shows zebra striping on table rows", () => {
    render(<DeliveryMatrix />)

    const tableRows = screen.getAllByRole("row")
    // Skip header row (index 0)
    const firstDataRow = tableRows[1]
    const secondDataRow = tableRows[2]

    expect(firstDataRow).toHaveClass("bg-white")
    expect(secondDataRow).toHaveClass("bg-gray-50")
  })

  it("displays branch information", () => {
    render(<DeliveryMatrix />)

    expect(screen.getByText("(hana2sp05)")).toBeInTheDocument()
    expect(screen.getByText("(hana2sp07)")).toBeInTheDocument()
    expect(screen.getByText("(orange)")).toBeInTheDocument()
    expect(screen.getByText("(CE2024.14)")).toBeInTheDocument()
    expect(screen.getByText("(master)")).toBeInTheDocument()
  })

  it("shows footer links", () => {
    render(<DeliveryMatrix />)

    expect(screen.getByText("Bugzilla FAQ")).toBeInTheDocument()
    expect(screen.getByText("Developer FAQ")).toBeInTheDocument()
    expect(screen.getByText("Delivery Schedule")).toBeInTheDocument()
    expect(screen.getByText("Delivery Graph")).toBeInTheDocument()
    expect(screen.getByText("Show inactive codelines")).toBeInTheDocument()
  })

  it("handles HANA Cloud row differently", () => {
    render(<DeliveryMatrix />)

    // HANA Cloud row should not have delivery and release blocker dropdowns
    const tableRows = screen.getAllByRole("row")
    const hanaCloudRow = tableRows[tableRows.length - 1] // Last row

    expect(hanaCloudRow).toHaveTextContent("HANA Cloud")
    expect(hanaCloudRow).toHaveTextContent("(master)")
  })
})
