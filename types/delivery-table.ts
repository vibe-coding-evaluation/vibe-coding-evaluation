export interface DeliveryTableRow {
  id: string
  codeLine: string
  branch: string
  affected: string
  delivery: string
  releaseBlocker: string
  targetRelease: string
  fixedInCodeLine: string
  shippedRelease: string
  deliveryRemark: string
  deliveryDisabled?: boolean
  releaseBlockerDisabled?: boolean
}

export interface DeliveryTableData {
  rows: DeliveryTableRow[]
  showInactive: boolean
  lastModified: string
}
