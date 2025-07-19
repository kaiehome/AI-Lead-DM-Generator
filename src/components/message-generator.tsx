'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGenerateMessage } from '@/hooks/use-message-generation'
import { GenerateMessageParams } from '@/lib/openai'

interface MessageGeneratorProps {
  lead: GenerateMessageParams
  onMessageGenerated: (message: string) => void
}

export function MessageGenerator({ lead, onMessageGenerated }: MessageGeneratorProps) {
  const [generatedMessage, setGeneratedMessage] = useState('')
  const generateMessage = useGenerateMessage()

  const handleGenerate = async () => {
    try {
      const result = await generateMessage.mutateAsync(lead)
      const message = result.message
      setGeneratedMessage(message)
      onMessageGenerated(message)
    } catch (error) {
      console.error('Failed to generate message:', error)
    }
  }

  const characterCount = generatedMessage.length
  const isOverLimit = characterCount > 500

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Generate Message
          <Badge variant={isOverLimit ? "destructive" : "secondary"}>
            {characterCount}/500
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p><strong>To:</strong> {lead.name} ({lead.role} at {lead.company})</p>
        </div>
        
        <Button 
          onClick={handleGenerate} 
          disabled={generateMessage.isPending}
          className="w-full"
        >
          {generateMessage.isPending ? 'Generating...' : 'Generate Message'}
        </Button>

        {generatedMessage && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Generated Message:</label>
            <Textarea
              value={generatedMessage}
              onChange={(e) => setGeneratedMessage(e.target.value)}
              placeholder="Your generated message will appear here..."
              className={`min-h-[120px] ${isOverLimit ? 'border-red-500' : ''}`}
            />
            {isOverLimit && (
              <p className="text-sm text-red-500">
                Message exceeds 500 characters. Please shorten it.
              </p>
            )}
          </div>
        )}

        {generateMessage.isError && (
          <p className="text-sm text-red-500">
            Failed to generate message. Please try again.
          </p>
        )}
      </CardContent>
    </Card>
  )
} 