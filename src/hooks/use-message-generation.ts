'use client'

import { useMutation } from '@tanstack/react-query'
import { GenerateMessageParams } from '@/lib/openai'

export function useGenerateMessage() {
  return useMutation({
    mutationFn: async (params: GenerateMessageParams) => {
      const response = await fetch('/api/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
      if (!response.ok) throw new Error('Failed to generate message')
      return response.json()
    },
  })
} 