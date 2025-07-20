export interface GenerateMessageParams {
  name: string
  role: string
  company: string
  linkedin_url?: string
  industry?: string
  company_size?: string
  linkedin_data?: LinkedInData
  style?: MessageStyle
  target?: MessageTarget
  length?: MessageLength
  include_emojis?: boolean
  custom_context?: string
}

export interface LinkedInData {
  headline?: string
  summary?: string
  experience?: Experience[]
  education?: Education[]
  skills?: string[]
  location?: string
  connections?: number
}

export interface Experience {
  title: string
  company: string
  duration: string
  description?: string
}

export interface Education {
  school: string
  degree?: string
  field?: string
  year?: string
}

export type MessageStyle = 
  | 'professional'
  | 'friendly'
  | 'casual'
  | 'formal'
  | 'enthusiastic'

export type MessageTarget = 
  | 'connection'
  | 'business'
  | 'recruitment'
  | 'networking'
  | 'event'
  | 'collaboration'

export type MessageLength = 
  | 'short'    // 100-200 characters
  | 'standard' // 200-400 characters
  | 'detailed' // 400-500 characters

export interface MessageTemplate {
  id: string
  name: string
  content: string
  style: MessageStyle
  target: MessageTarget
  industry?: string
  is_default: boolean
  created_at: string
}

export interface UserPreferences {
  default_style: MessageStyle
  default_target: MessageTarget
  preferred_length: MessageLength
  include_emojis: boolean
  auto_save_templates?: boolean
  show_character_count?: boolean
}

export interface GeneratedMessage {
  message: string
  style: MessageStyle
  target: MessageTarget
  length: MessageLength
  character_count: number
  suggestions?: string[]
  confidence_score?: number
}

export interface ABTestResult {
  version_a: GeneratedMessage
  version_b: GeneratedMessage
  version_c?: GeneratedMessage
  recommended_version: 'a' | 'b' | 'c'
  reasoning: string
} 