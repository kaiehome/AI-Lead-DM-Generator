'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateLeadData, UpdateLeadData } from '@/lib/supabase'

// Fetch leads
export function useLeads(status?: string, page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['leads', status, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      if (status) params.append('status', status)
      
      const response = await fetch(`/api/leads?${params}`)
      if (!response.ok) throw new Error('Failed to fetch leads')
      return response.json()
    },
  })
}

// Create lead
export function useCreateLead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateLeadData) => {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to create lead')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })
}

// Update lead
export function useUpdateLead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateLeadData }) => {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to update lead')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })
}

// Delete lead
export function useDeleteLead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete lead')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })
} 