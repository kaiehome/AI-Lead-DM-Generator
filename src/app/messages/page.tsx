'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAllMessages } from '@/hooks/use-messages'
import { useUpdateMessageStatus } from '@/hooks/use-messages'
import { Message } from '@/lib/supabase'
import { SimplifiedMessagesTable } from '@/components/simplified-messages-table'
import { exportMessagesToCSV, formatMessagesForExport } from '@/lib/csv-export'
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Calendar,
  User,
  Upload
} from 'lucide-react'
import Link from 'next/link'

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  
  const { data: messagesData, isLoading, error } = useAllMessages()
  const updateMessageStatus = useUpdateMessageStatus()
  
  const messages = messagesData?.messages || []

  // Filter messages based on search and status
  const filteredMessages = messages.filter((message: Message & { lead?: { name: string; linkedin_url?: string } }) => {
    const matchesSearch = (
      message.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.lead?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.template_used?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    const matchesStatus = !statusFilter || message.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleCopyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (error) {
      console.error('Failed to copy message:', error)
    }
  }

  const handleStatusChange = async (messageId: string, status: string) => {
    try {
      await updateMessageStatus.mutateAsync({ id: messageId, status })
      console.log('Message status updated successfully')
    } catch (error) {
      console.error('Error updating message status:', error)
    }
  }

  const handleExportMessages = () => {
    const formattedMessages = formatMessagesForExport(filteredMessages)
    exportMessagesToCSV(formattedMessages)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Draft':
        return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">Draft</span>
      case 'Approved':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Approved</span>
      case 'Sent':
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">Sent</span>
      default:
        return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">{status}</span>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-blue-600">Loading messages...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center space-y-4">
        <p className="text-red-600 font-medium">Loading failed: {error.message}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  ← Back to Home
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Messages Management</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleExportMessages}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filters
            </CardTitle>
            <CardDescription>
              Find and filter your messages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by content, lead name, or template..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Sent">Sent</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <Filter className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
            
            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">AI Model</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Models" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Models</SelectItem>
                      <SelectItem value="GPT-4">GPT-4</SelectItem>
                      <SelectItem value="GPT-3.5">GPT-3.5</SelectItem>
                      <SelectItem value="Claude">Claude</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Template Used</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Templates" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Templates</SelectItem>
                      <SelectItem value="AI Generated">AI Generated</SelectItem>
                      <SelectItem value="Custom Template">Custom Template</SelectItem>
                      <SelectItem value="Professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Date Generated</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Messages List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Messages ({filteredMessages.length})</span>
              <div className="text-sm text-gray-500">
                Showing {filteredMessages.length} of {messages.length} messages
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredMessages.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || statusFilter ? 'Try adjusting your search or filters.' : 'Generate your first message to get started.'}
                </p>
                {!searchQuery && !statusFilter && (
                  <Link href="/">
                    <Button>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Generate First Message
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredMessages.map((message: Message & { lead?: { name: string; linkedin_url?: string } }) => (
                  <div
                    key={message.id}
                    className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            Message for {message.lead?.name || 'Unknown Lead'}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(message.generated_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {message.character_count} characters
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getStatusBadge(message.status)}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyMessage(message.content, message.id)}
                          className="h-8 w-8 p-0"
                        >
                          {copiedMessageId === message.id ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        
                        {message.lead?.linkedin_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(message.lead!.linkedin_url, '_blank')}
                            className="h-8 w-8 p-0"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>Template: {message.template_used || 'N/A'}</span>
                        <span>AI Model: {message.ai_model || 'N/A'}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Select
                          value={message.status}
                          onValueChange={(status) => handleStatusChange(message.id, status)}
                        >
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Draft">Draft</SelectItem>
                            <SelectItem value="Approved">Approved</SelectItem>
                            <SelectItem value="Sent">Sent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 