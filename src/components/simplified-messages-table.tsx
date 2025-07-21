'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Message } from '@/lib/supabase'
import { MessageSquare, Copy, ExternalLink, Calendar } from 'lucide-react'

interface SimplifiedMessagesTableProps {
  messages: (Message & { lead?: { name: string; linkedin_url?: string } })[]
  onMessageSelect?: (message: Message) => void
  onMessageStatusChange?: (messageId: string, status: string) => void
}

export function SimplifiedMessagesTable({ 
  messages, 
  onMessageSelect,
  onMessageStatusChange 
}: SimplifiedMessagesTableProps) {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)

  const handleCopyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (error) {
      console.error('Failed to copy message:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Draft':
        return <Badge variant="outline" className="bg-gray-100 text-gray-700">Draft</Badge>
      case 'Approved':
        return <Badge variant="default" className="bg-green-100 text-green-700">Approved</Badge>
      case 'Sent':
        return <Badge variant="default" className="bg-blue-100 text-blue-700">Sent</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-blue-800">Generated Messages ({messages.length})</h3>
      </div>

      {/* Messages list */}
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className="border border-blue-200 rounded-lg p-4 hover:border-blue-300 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-blue-900">
                    Message for {message.lead?.name || 'Unknown Lead'}
                  </div>
                  <div className="text-sm text-blue-600 flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {formatDate(message.generated_at)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(message.status)}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyMessage(message.content, message.id)}
                  className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                >
                  {copiedMessageId === message.id ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md mb-3">
              <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span>Characters: {message.character_count}</span>
                <span>Template: {message.template_used}</span>
                <span>AI Model: {message.ai_model}</span>
              </div>
              <div className="flex items-center gap-2">
                                 {message.lead?.linkedin_url && (
                   <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => window.open(message.lead!.linkedin_url, '_blank')}
                     className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                   >
                     <ExternalLink className="h-3 w-3" />
                   </Button>
                 )}
                {onMessageStatusChange && (
                  <select
                    value={message.status}
                    onChange={(e) => onMessageStatusChange(message.id, e.target.value)}
                    className="text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Approved">Approved</option>
                    <option value="Sent">Sent</option>
                  </select>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {messages.length === 0 && (
        <div className="text-center py-8">
          <div className="p-4 bg-blue-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">No Messages Yet</h3>
          <p className="text-blue-600">Generate your first message to get started</p>
        </div>
      )}
    </div>
  )
} 