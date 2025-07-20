'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useGenerateMessage } from '@/hooks/use-message-generation'
import { LinkedInAnalyzer } from '@/components/linkedin-analyzer'
import { 
  GenerateMessageParams, 
  MessageStyle, 
  MessageTarget, 
  MessageLength,
  LinkedInData
} from '@/types/message'
import { LinkedInProfile } from '@/lib/linkedin-parser'
import { 
  Sparkles, 
  Copy, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  MessageSquare, 
  Users, 
  Settings,
  Target,
  Type,
  Palette,
  Linkedin,
  User,
  Building2,
  TrendingUp
} from 'lucide-react'

interface AdvancedMessageGeneratorProps {
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

const MESSAGE_STYLES: { value: MessageStyle; label: string; description: string }[] = [
  { value: 'professional', label: 'Professional', description: 'Formal, business-oriented' },
  { value: 'friendly', label: 'Friendly', description: 'Warm, approachable' },
  { value: 'casual', label: 'Casual', description: 'Relaxed, conversational' },
  { value: 'formal', label: 'Very Formal', description: 'Highly professional, respectful' },
  { value: 'enthusiastic', label: 'Enthusiastic', description: 'Energetic, positive' }
]

const MESSAGE_TARGETS: { value: MessageTarget; label: string; description: string }[] = [
  { value: 'connection', label: 'Build Connection', description: 'Establish professional connection' },
  { value: 'business', label: 'Business Partnership', description: 'Explore business opportunities' },
  { value: 'recruitment', label: 'Recruitment', description: 'Explore career opportunities' },
  { value: 'networking', label: 'Expand Network', description: 'Expand professional network' },
  { value: 'event', label: 'Event Invitation', description: 'Invite to events or meetings' },
  { value: 'collaboration', label: 'Project Collaboration', description: 'Propose specific collaboration' }
]

const MESSAGE_LENGTHS: { value: MessageLength; label: string; description: string; maxChars: number }[] = [
  { value: 'short', label: 'Short', description: '100-200 characters', maxChars: 200 },
  { value: 'standard', label: 'Standard', description: '200-400 characters', maxChars: 400 },
  { value: 'detailed', label: 'Detailed', description: '400-500 characters', maxChars: 500 }
]

export function AdvancedMessageGenerator({ lead, onMessageGenerated }: AdvancedMessageGeneratorProps) {
  const [generatedMessage, setGeneratedMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [customContext, setCustomContext] = useState('')
  
  // Message generation options
  const [messageStyle, setMessageStyle] = useState<MessageStyle>('professional')
  const [messageTarget, setMessageTarget] = useState<MessageTarget>('connection')
  const [messageLength, setMessageLength] = useState<MessageLength>('standard')
  const [includeEmojis, setIncludeEmojis] = useState(false)
  const [linkedinData, setLinkedinData] = useState<LinkedInData | null>(null)
  const [showLinkedInAnalyzer, setShowLinkedInAnalyzer] = useState(false)
  
  const generateMessage = useGenerateMessage()

  const handleLinkedInProfileAnalyzed = (profile: LinkedInProfile) => {
    const linkedinData: LinkedInData = {
      headline: profile.headline,
      summary: profile.summary,
      experience: profile.experience,
      education: profile.education,
      skills: profile.skills,
      location: profile.location,
      connections: profile.connections
    }
    setLinkedinData(linkedinData)
    setShowLinkedInAnalyzer(false)
  }

  const handleGenerate = async () => {
    try {
      const params: GenerateMessageParams = {
        name: lead.name,
        role: lead.role,
        company: lead.company,
        linkedin_url: lead.linkedin_url,
        industry: lead.industry,
        company_size: lead.company_size,
        linkedin_data: linkedinData || undefined,
        style: messageStyle,
        target: messageTarget,
        length: messageLength,
        include_emojis: includeEmojis,
        custom_context: customContext || undefined
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

  const selectedLength = MESSAGE_LENGTHS.find(l => l.value === messageLength)
  const characterCount = generatedMessage.length
  const isOverLimit = characterCount > (selectedLength?.maxChars || 400)
  const remainingChars = (selectedLength?.maxChars || 400) - characterCount

  return (
    <div className="space-y-4">
      {/* Prospect Information Card */}
      <Card className="business-card">
        <CardHeader className="pb-3 border-b border-blue-100">
          <CardTitle className="text-sm font-semibold text-blue-800 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Prospect Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <User className="h-3 w-3 text-blue-600" />
              </div>
              <div>
                <span className="font-medium text-blue-800">Name:</span>
                <span className="ml-2 text-blue-700">{lead.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Target className="h-3 w-3 text-blue-600" />
              </div>
              <div>
                <span className="font-medium text-blue-800">Role:</span>
                <span className="ml-2 text-blue-700">{lead.role}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Building2 className="h-3 w-3 text-blue-600" />
              </div>
              <div>
                <span className="font-medium text-blue-800">Company:</span>
                <span className="ml-2 text-blue-700">{lead.company}</span>
              </div>
            </div>
            {lead.industry && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <TrendingUp className="h-3 w-3 text-blue-600" />
                </div>
                <div>
                  <span className="font-medium text-blue-800">Industry:</span>
                  <span className="ml-2 text-blue-700">{lead.industry}</span>
                </div>
              </div>
            )}
            {lead.linkedin_url && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Linkedin className="h-3 w-3 text-blue-600" />
                </div>
                <div>
                  <span className="font-medium text-blue-800">LinkedIn:</span>
                  <a
                    href={lead.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:text-blue-800 hover:underline text-xs"
                  >
                    View Profile
                  </a>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Options Toggle */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Message Settings
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="h-6 px-2 text-xs"
            >
              {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Basic Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium flex items-center gap-1">
                <Palette className="h-3 w-3" />
                Message Style
              </Label>
              <Select value={messageStyle} onValueChange={(value: MessageStyle) => setMessageStyle(value)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MESSAGE_STYLES.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      <div>
                        <div className="font-medium">{style.label}</div>
                        <div className="text-xs text-gray-500">{style.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium flex items-center gap-1">
                <Target className="h-3 w-3" />
                Message Target
              </Label>
              <Select value={messageTarget} onValueChange={(value: MessageTarget) => setMessageTarget(value)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MESSAGE_TARGETS.map((target) => (
                    <SelectItem key={target.value} value={target.value}>
                      <div>
                        <div className="font-medium">{target.label}</div>
                        <div className="text-xs text-gray-500">{target.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium flex items-center gap-1">
                <Type className="h-3 w-3" />
                Message Length
              </Label>
              <Select value={messageLength} onValueChange={(value: MessageLength) => setMessageLength(value)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MESSAGE_LENGTHS.map((length) => (
                    <SelectItem key={length.value} value={length.value}>
                      <div>
                        <div className="font-medium">{length.label}</div>
                        <div className="text-xs text-gray-500">{length.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Options */}
          {showAdvancedOptions && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Include Emojis</Label>
                <Switch
                  checked={includeEmojis}
                  onCheckedChange={setIncludeEmojis}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Additional Context (Optional)</Label>
                <Textarea
                  value={customContext}
                  onChange={(e) => setCustomContext(e.target.value)}
                  placeholder="Add any additional context information to help AI generate more personalized messages..."
                  className="min-h-[80px] text-sm"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* LinkedIn Profile Analyzer */}
      {lead.linkedin_url && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 text-blue-600" />
                LinkedIn Profile Analysis
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLinkedInAnalyzer(!showLinkedInAnalyzer)}
                className="h-6 px-2 text-xs"
              >
                {showLinkedInAnalyzer ? 'Hide' : 'Analyze'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {showLinkedInAnalyzer ? (
              <LinkedInAnalyzer 
                lead={{
                  id: '',
                  name: lead.name,
                  role: lead.role,
                  company: lead.company,
                  linkedin_url: lead.linkedin_url,
                  status: 'Active',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }} 
                onProfileAnalyzed={handleLinkedInProfileAnalyzed}
              />
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-600 mb-2">
                  {linkedinData ? 'LinkedIn profile analyzed' : 'Click to analyze LinkedIn profile for more personalized messages'}
                </p>
                {linkedinData && (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">Profile analysis completed</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
                Generating Message...
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
                  {characterCount}/{selectedLength?.maxChars} chars
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
              placeholder="AI will generate personalized messages here..."
              className={`min-h-[120px] resize-none border-0 bg-white ${
                isOverLimit ? 'border-red-300 focus:border-red-400' : ''
              }`}
            />
            
            {/* Character Count Indicator */}
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
                Current: {MESSAGE_STYLES.find(s => s.value === messageStyle)?.label} | {MESSAGE_TARGETS.find(t => t.value === messageTarget)?.label}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 