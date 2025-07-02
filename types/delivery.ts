export interface DeliveryMatrixRow {
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
}

export interface DeliveryMatrixData {
  rows: DeliveryMatrixRow[]
  lastModified: string
}
