export interface BugData {
  id: number
  summary: string
  status: string
  resolution?: string
  product: string
  component: string
  version: string
  priority: string
  severity: string
  platform: string
  op_sys: string
  assigned_to: string
  assigned_to_detail?: UserDetail
  qa_contact?: string
  qa_contact_detail?: UserDetail
  creator: string
  creator_detail?: UserDetail
  creation_time: string
  last_change_time: string
  classification: string
  alias?: string[]
  url?: string
  whiteboard?: string
  keywords?: string[]
  depends_on?: number[]
  blocks?: number[]
  cc?: string[]
  cc_detail?: UserDetail[]
  see_also?: string[]
  flags?: Flag[]
  custom_fields?: Record<string, any>

  // Custom fields for our implementation
  symptom?: string
  steps_to_reproduce?: string
  workaround?: string
  root_cause?: string
  solution?: string
  error_category?: string
  testcase_exists?: boolean
  testcases?: string
  gerrit_links?: string[]
  jira_links?: string[]
  cvss_score?: number
  internal_messages?: string
  customer_messages?: string
  affected_customers?: string[]
  internal_stakeholders?: string[]
  reported_release?: string
  reported_cloud_edition?: string
  reported_branch?: string
  reported_hana_instances?: string[]
  backlog_duration?: number
  mpt_due_date?: string
  problem_identifier?: string[]
  additional_tags?: string[]
}

export interface UserDetail {
  id: number
  email: string
  name: string
  real_name: string
}

export interface Flag {
  id: number
  name: string
  type_id: number
  status: string
  setter: string
  requestee?: string
  creation_date: string
  modification_date: string
}

export interface BugFormData extends Partial<BugData> {
  // Form-specific fields
}

export interface ApiResponse<T> {
  bugs: T[]
  faults?: ApiError[]
}

export interface ApiError {
  faultCode: number
  faultString: string
}

export interface BugUpdateRequest {
  ids: number[]
  [key: string]: any
}

export interface TabConfig {
  id: string
  label: string
  active?: boolean
}

export interface FieldConfig {
  key: keyof BugData
  label: string
  type: "text" | "textarea" | "select" | "multiselect" | "date" | "number"
  options?: { value: string; label: string }[]
  monospace?: boolean
  required?: boolean
  readonly?: boolean
}
