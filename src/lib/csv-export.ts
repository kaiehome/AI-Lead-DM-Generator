import { Parser } from 'json2csv'
import { Lead, Message } from '@/lib/supabase'

export interface ExportOptions {
  fields?: string[]
  filename?: string
  includeHeaders?: boolean
}

export interface LeadExportData {
  id: string
  name: string
  role: string
  company: string
  linkedin_url?: string
  industry?: string
  company_size?: string
  email?: string
  location?: string
  notes?: string
  status: string
  created_at: string
  updated_at: string
}

export interface MessageExportData {
  id: string
  lead_id: string
  lead_name: string
  lead_company: string
  content: string
  status: string
  template_used?: string
  ai_model?: string
  character_count?: number
  generated_at: string
  updated_at: string
}

export function exportToCSV<T>(
  data: T[],
  options: ExportOptions = {}
): void {
  const {
    fields,
    filename = 'export.csv',
    includeHeaders = true
  } = options

  try {
    const parser = new Parser({
      fields,
      header: includeHeaders
    })

    const csv = parser.parse(data)
    downloadCSV(csv, filename)
  } catch (error) {
    console.error('CSV导出失败:', error)
    throw new Error('CSV导出失败')
  }
}

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

export function exportLeadsToCSV(leads: LeadExportData[], options: ExportOptions = {}): void {
  const defaultFields = [
    'name',
    'role', 
    'company',
    'linkedin_url',
    'industry',
    'company_size',
    'email',
    'location',
    'notes',
    'status',
    'created_at'
  ]

  exportToCSV(leads, {
    fields: options.fields || defaultFields,
    filename: options.filename || `leads_export_${new Date().toISOString().split('T')[0]}.csv`,
    ...options
  })
}

export function exportMessagesToCSV(messages: MessageExportData[], options: ExportOptions = {}): void {
  const defaultFields = [
    'lead_name',
    'lead_company',
    'content',
    'status',
    'template_used',
    'ai_model',
    'character_count',
    'generated_at'
  ]

  exportToCSV(messages, {
    fields: options.fields || defaultFields,
    filename: options.filename || `messages_export_${new Date().toISOString().split('T')[0]}.csv`,
    ...options
  })
}

export function exportCombinedToCSV(
  leads: LeadExportData[],
  messages: MessageExportData[],
  options: ExportOptions = {}
): void {
  const combinedData: Record<string, unknown>[] = [
    ...leads.map(lead => ({
      type: 'lead',
      ...lead
    })),
    ...messages.map(message => ({
      type: 'message',
      ...message
    }))
  ]

  exportToCSV(combinedData, {
    fields: options.fields || [
      'type',
      'name',
      'role',
      'company',
      'content',
      'status',
      'created_at'
    ],
    filename: options.filename || `combined_export_${new Date().toISOString().split('T')[0]}.csv`,
    ...options
  })
}

// 格式化数据用于导出
export function formatLeadsForExport(leads: Lead[]): LeadExportData[] {
  return leads.map(lead => ({
    id: String(lead.id || ''),
    name: String(lead.name || ''),
    role: String(lead.role || ''),
    company: String(lead.company || ''),
    linkedin_url: String(lead.linkedin_url || ''),
    industry: '',
    company_size: '',
    email: '',
    location: '',
    notes: '',
    status: String(lead.status || 'Active'),
    created_at: String(lead.created_at || ''),
    updated_at: String(lead.updated_at || '')
  }))
}

export function formatMessagesForExport(messages: Message[]): MessageExportData[] {
  return messages.map(message => ({
    id: String(message.id || ''),
    lead_id: String(message.lead_id || ''),
    lead_name: '', // 需要从关联的lead数据中获取
    lead_company: '', // 需要从关联的lead数据中获取
    content: String(message.content || ''),
    status: String(message.status || 'Draft'),
    template_used: String(message.template_used || ''),
    ai_model: String(message.ai_model || ''),
    character_count: Number(message.character_count || 0),
    generated_at: String(message.generated_at || ''),
    updated_at: String(message.updated_at || '')
  }))
} 