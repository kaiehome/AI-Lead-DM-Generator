'use client'

import { useMutation } from '@tanstack/react-query'
import { GenerateMessageParams, GeneratedMessage } from '@/types/message'

export function useGenerateMessage() {
  return useMutation({
    mutationFn: async (params: GenerateMessageParams): Promise<GeneratedMessage> => {
      const response = await fetch('/api/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate message')
      }
      
      const data = await response.json()
      return {
        message: data.message,
        style: data.style,
        target: data.target,
        length: data.length,
        character_count: data.character_count,
        confidence_score: data.confidence_score
      }
    },
  })
} 