import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Lead {
  id: string
  name: string
  role: string
  company: string
  linkedin_url?: string
  status: 'Active' | 'Inactive' | 'Converted'
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  lead_id: string
  content: string
  status: 'Draft' | 'Approved' | 'Sent'
  template_used?: string
  ai_model?: string
  character_count?: number
  generated_at: string
  updated_at: string
}

export interface CreateLeadData {
  name: string
  role: string
  company: string
  linkedin_url?: string
}

export interface UpdateLeadData {
  name?: string
  role?: string
  company?: string
  linkedin_url?: string
  status?: 'Active' | 'Inactive' | 'Converted'
}

export interface CreateMessageData {
  lead_id: string
  content: string
  template_used?: string
  ai_model?: string
  character_count?: number
}

export interface UpdateMessageData {
  content?: string
  status?: 'Draft' | 'Approved' | 'Sent'
  template_used?: string
  ai_model?: string
  character_count?: number
} 