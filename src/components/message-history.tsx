'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageSquare, Copy, Edit, Trash2, Check, X } from 'lucide-react'
import { useMessages, useUpdateMessage, useDeleteMessage } from '@/hooks/use-messages'
import { Lead, Message } from '@/lib/supabase'

interface MessageHistoryProps {
  selectedLead: Lead | null
}

export function MessageHistory({ selectedLead }: MessageHistoryProps) {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  
  const { data: messagesData, isLoading, error } = useMessages(selectedLead?.id || '')
  
  const updateMessage = useUpdateMessage()
  const deleteMessage = useDeleteMessage()
  
  const messages = messagesData?.messages || []
  
  const handleEdit = (message: Message) => {
    setEditingMessageId(message.id)
    setEditContent(message.content)
  }
  
  const handleSave = async (messageId: string) => {
    try {
      await updateMessage.mutateAsync({
        id: messageId,
        content: editContent
      })
      setEditingMessageId(null)
      setEditContent('')
    } catch (error) {
      console.error('Failed to update message:', error)
    }
  }
  
  const handleCancel = () => {
    setEditingMessageId(null)
    setEditContent('')
  }
  
  const handleDelete = async (messageId: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteMessage.mutateAsync(messageId)
      } catch (error) {
        console.error('Failed to delete message:', error)
      }
    }
  }
  
  const handleStatusChange = async (messageId: string, status: 'Draft' | 'Approved' | 'Sent') => {
    try {
      await updateMessage.mutateAsync({
        id: messageId,
        status
      })
    } catch (error) {
      console.error('Failed to update message status:', error)
    }
  }
  
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800'
      case 'Approved': return 'bg-blue-100 text-blue-800'
      case 'Sent': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'Draft': return 'Draft'
      case 'Approved': return 'Approved'
      case 'Sent': return 'Sent'
      default: return status
    }
  }
  
  if (!selectedLead) {
    return (
      <Card className="business-card">
        <CardHeader className="border-b border-blue-100">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <MessageSquare className="h-5 w-5" />
            Message History
          </CardTitle>
          <CardDescription className="text-blue-600">
            Select a prospect to view message history
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="p-4 bg-blue-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">No Message History</h3>
            <p className="text-blue-600">Select a prospect to view their message history</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="business-card">
      <CardHeader className="border-b border-blue-100">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <MessageSquare className="h-5 w-5" />
          Message History - {selectedLead.name}
        </CardTitle>
        <CardDescription className="text-blue-600">
          {selectedLead.role} at {selectedLead.company}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-blue-600 mt-2">Loading messages...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600">Failed to load messages: {error.message}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="p-4 bg-blue-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">No Messages Yet</h3>
            <p className="text-blue-600">Generate the first message for this prospect</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message: Message) => (
              <div key={message.id} className="border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(message.status)}>
                      {getStatusText(message.status)}
                    </Badge>
                    <span className="text-sm text-blue-600">
                      {new Date(message.generated_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={message.status}
                      onValueChange={(value: 'Draft' | 'Approved' | 'Sent') => 
                        handleStatusChange(message.id, value)
                      }
                    >
                      <SelectTrigger className="w-28 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Sent">Sent</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(message.content)}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(message)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(message.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {editingMessageId === message.id ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSave(message.id)}
                        className="business-button"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-3 rounded border">
                    <p className="text-gray-800 whitespace-pre-wrap">{message.content}</p>
                  </div>
                )}
                
                {message.template_used && (
                  <div className="mt-2 text-sm text-blue-600">
                    Template used: {message.template_used}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 