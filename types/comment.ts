export interface Comment {
  id: number
  bug_id: number
  author: string
  author_detail?: {
    id: number
    email: string
    name: string
    real_name: string
  }
  time: string
  creation_time: string
  text: string
  is_private: boolean
  is_markdown?: boolean
  attachment_id?: number
  count: number
  tags?: string[]
}

export interface CommentDisplayOptions {
  expandWidth: boolean
  decorate: boolean
  collapse: boolean
}

export interface NewComment {
  text: string
  is_private: boolean
  status?: string
  minor_update: boolean
}
