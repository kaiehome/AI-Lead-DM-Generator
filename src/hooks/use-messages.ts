'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Message } from '@/lib/supabase'

// Fetch messages for a specific lead
export function useMessages(leadId: string) {
  return useQuery({
    queryKey: ['messages', leadId],
    queryFn: async () => {
      const response = await fetch(`/api/messages?leadId=${leadId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }
      return response.json()
    },
    enabled: !!leadId
  })
}

// Fetch all messages
export function useAllMessages() {
  return useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const response = await fetch('/api/messages')
      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }
      return response.json()
    }
  })
}

// Create a new message
export function useCreateMessage() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (message: Omit<Message, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create message')
      }
      
      return response.json()
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch messages for the specific lead
      queryClient.invalidateQueries({ queryKey: ['messages', variables.lead_id] })
      // Also invalidate all messages
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })
}

// Update a message
export function useUpdateMessage() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...message }: Partial<Message> & { id: string }) => {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update message')
      }
      
      return response.json()
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch messages for the specific lead
      queryClient.invalidateQueries({ queryKey: ['messages', variables.lead_id] })
      // Also invalidate all messages
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })
}

// Delete a message
export function useDeleteMessage() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete message')
      }
      
      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch all messages
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })
}

// Update message status
export function useUpdateMessageStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update message status')
      }
      
      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch all messages
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })
} 