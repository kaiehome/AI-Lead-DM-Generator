'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGenerateMessage } from '@/hooks/use-message-generation'
import { GenerateMessageParams } from '@/types/message'
import { Sparkles, Copy, CheckCircle, AlertCircle, Loader2, MessageSquare, Users, Building } from 'lucide-react'

interface MessageGeneratorProps {
  lead: {
    name: string
    role: string
    company: string
    linkedin_url?: string
    industry?: string
    company_size?: string
  }
  onMessageGenerated: (message: string) => void
}

export function MessageGenerator({ lead, onMessageGenerated }: MessageGeneratorProps) {
  const [generatedMessage, setGeneratedMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const generateMessage = useGenerateMessage()

  const handleGenerate = async () => {
    try {
      const params: GenerateMessageParams = {
        name: lead.name,
        role: lead.role,
        company: lead.company,
        linkedin_url: lead.linkedin_url,
        industry: lead.industry,
        company_size: lead.company_size,
        style: 'professional',
        target: 'connection',
        length: 'standard',
        include_emojis: false
      }
      
      const result = await generateMessage.mutateAsync(params)
      const message = result.message
      setGeneratedMessage(message)
      onMessageGenerated(message)
    } catch (error) {
      console.error('Failed to generate message:', error)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedMessage)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy message:', error)
    }
  }

  const characterCount = generatedMessage.length
  const isOverLimit = characterCount > 500
  const remainingChars = 500 - characterCount

  return (
    <div className="space-y-4">
      {/* Prospect Information Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-blue-800 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Prospect Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-blue-800">Name:</span>
              <span className="text-blue-700">{lead.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-blue-800">Role:</span>
              <span className="text-blue-700">{lead.role}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-blue-800">Company:</span>
              <span className="text-blue-700">{lead.company}</span>
            </div>
            {lead.industry && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-blue-800">Industry:</span>
                <span className="text-blue-700">{lead.industry}</span>
              </div>
            )}
            {lead.linkedin_url && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-blue-800">LinkedIn:</span>
                <a
                  href={lead.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-xs"
                >
                  View Profile
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            AI Message Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Button
            onClick={handleGenerate}
            disabled={generateMessage.isPending}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            {generateMessage.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating message...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Personalized Message
              </>
            )}
          </Button>
          
          {generateMessage.isError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Generation Failed</span>
              </div>
              <p className="text-xs text-red-600 mt-1">
                Please check your network connection and API configuration
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated Message */}
      {generatedMessage && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-green-800 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Generated Message
              </span>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    isOverLimit 
                      ? 'bg-red-100 text-red-800 border-red-200' 
                      : 'bg-green-100 text-green-800 border-green-200'
                  }`}
                >
                  {characterCount}/500 chars
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  className="h-6 px-2 text-xs"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Textarea
              value={generatedMessage}
              onChange={(e) => {
                setGeneratedMessage(e.target.value)
                onMessageGenerated(e.target.value)
              }}
              placeholder="AI will generate personalized message here..."
              className={`min-h-[120px] resize-none border-0 bg-white ${
                isOverLimit ? 'border-red-300 focus:border-red-400' : ''
              }`}
            />
            
            {/* Character Count Hint */}
            <div className="mt-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {isOverLimit ? (
                  <div className="flex items-center gap-1 text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    <span>{Math.abs(remainingChars)} chars over limit</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-3 w-3" />
                    <span>{remainingChars} chars remaining</span>
                  </div>
                )}
              </div>
              <span className="text-gray-500">
                LinkedIn message recommended length: 200-500 characters
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Tips */}
      <Card className="border-gray-200 bg-gray-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Building className="h-4 w-4" />
            Usage Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-800 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">1</span>
              <span>AI generates personalized messages based on prospect&apos;s role, company, and industry</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-800 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">2</span>
              <span>You can edit the generated message content to fit your needs</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-800 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">3</span>
              <span>Keep messages between 200-500 characters for optimal results</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 