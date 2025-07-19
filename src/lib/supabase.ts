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
  message?: string
  status: 'Draft' | 'Approved' | 'Sent'
  created_at: string
  updated_at: string
}

export interface CreateLeadData {
  name: string
  role: string
  company: string
  linkedin_url?: string
  message?: string
}

export interface UpdateLeadData {
  name?: string
  role?: string
  company?: string
  linkedin_url?: string
  message?: string
  status?: 'Draft' | 'Approved' | 'Sent'
} 