'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { 
  Settings, 
  Save, 
  Plus, 
  Trash2, 
  MessageSquare,
  Palette,
  Target,
  Type,
  Smile
} from 'lucide-react'
import { 
  MessageStyle, 
  MessageTarget, 
  MessageLength, 
  UserPreferences,
  MessageTemplate 
} from '@/types/message'

interface MessageSettingsProps {
  preferences: UserPreferences
  onPreferencesChange: (preferences: UserPreferences) => void
  templates: MessageTemplate[]
  onTemplateSave: (template: Omit<MessageTemplate, 'id' | 'created_at'>) => void
  onTemplateDelete: (templateId: string) => void
}

const MESSAGE_STYLES: { value: MessageStyle; label: string; description: string }[] = [
  { value: 'professional', label: 'Professional Business', description: 'Formal, business-oriented' },
  { value: 'friendly', label: 'Friendly & Approachable', description: 'Warm, easy-going' },
  { value: 'casual', label: 'Casual & Relaxed', description: 'Relaxed, conversational' },
  { value: 'formal', label: 'Very Formal', description: 'Highly professional, respectful' },
  { value: 'enthusiastic', label: 'Enthusiastic & Positive', description: 'Energetic, positive attitude' }
]

const MESSAGE_TARGETS: { value: MessageTarget; label: string; description: string }[] = [
  { value: 'connection', label: 'Build Connection', description: 'Establish professional connection' },
  { value: 'business', label: 'Business Partnership', description: 'Explore business opportunities' },
  { value: 'recruitment', label: 'Recruitment Purpose', description: 'Explore career opportunities' },
  { value: 'networking', label: 'Expand Network', description: 'Expand professional network' },
  { value: 'event', label: 'Event Invitation', description: 'Invite to events or meetings' },
  { value: 'collaboration', label: 'Project Collaboration', description: 'Propose specific collaboration projects' }
]

const MESSAGE_LENGTHS: { value: MessageLength; label: string; description: string }[] = [
  { value: 'short', label: 'Short', description: '100-200 characters' },
  { value: 'standard', label: 'Standard', description: '200-400 characters' },
  { value: 'detailed', label: 'Detailed', description: '400-500 characters' }
]

export function MessageSettings({ 
  preferences, 
  onPreferencesChange, 
  templates, 
  onTemplateSave, 
  onTemplateDelete 
}: MessageSettingsProps) {
  const [showNewTemplate, setShowNewTemplate] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    content: '',
    style: 'professional' as MessageStyle,
    target: 'connection' as MessageTarget,
    industry: '',
    is_default: false
  })

  const handlePreferenceChange = (key: keyof UserPreferences, value: string | boolean) => {
    onPreferencesChange({
      ...preferences,
      [key]: value
    })
  }

  const handleSaveTemplate = () => {
    if (newTemplate.name && newTemplate.content) {
      onTemplateSave(newTemplate)
      setNewTemplate({
        name: '',
        content: '',
        style: 'professional',
        target: 'connection',
        industry: '',
        is_default: false
      })
      setShowNewTemplate(false)
    }
  }

  const handleCopyTemplate = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
    } catch (error) {
      console.error('Failed to copy template:', error)
    }
  }

  return (
    <Card className="business-card">
      <CardHeader className="border-b border-blue-100">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Settings className="h-5 w-5" />
          Message Settings
        </CardTitle>
        <CardDescription className="text-blue-600">
          Customize your message generation preferences and template management
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Preference Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Default Message Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1 text-blue-700">
                <Palette className="h-4 w-4" />
                Default Message Style
              </Label>
              <Select 
                value={preferences.default_style} 
                onValueChange={(value: MessageStyle) => handlePreferenceChange('default_style', value)}
              >
                <SelectTrigger className="border-blue-200 min-w-[160px]">
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
              <Label className="text-sm font-medium flex items-center gap-1 text-blue-700">
                <Target className="h-4 w-4" />
                Default Message Target
              </Label>
              <Select 
                value={preferences.default_target} 
                onValueChange={(value: MessageTarget) => handlePreferenceChange('default_target', value)}
              >
                <SelectTrigger className="border-blue-200 min-w-[160px]">
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
              <Label className="text-sm font-medium flex items-center gap-1 text-blue-700">
                <Type className="h-4 w-4" />
                Preferred Message Length
              </Label>
              <Select 
                value={preferences.preferred_length} 
                onValueChange={(value: MessageLength) => handlePreferenceChange('preferred_length', value)}
              >
                <SelectTrigger className="border-blue-200 min-w-[160px]">
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

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1 text-blue-700">
                <Smile className="h-4 w-4" />
                Include Emojis by Default
              </Label>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-600">Include emojis in messages</span>
                <Switch
                  checked={preferences.include_emojis}
                  onCheckedChange={(checked) => handlePreferenceChange('include_emojis', checked)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Message Templates */}
        <div className="pt-4 border-t border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Message Templates
            </h3>
            <Button
              size="sm"
              onClick={() => setShowNewTemplate(!showNewTemplate)}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              {showNewTemplate ? 'Cancel' : 'New Template'}
            </Button>
          </div>

          {showNewTemplate && (
            <div className="space-y-4 p-4 border border-blue-200 rounded-lg bg-blue-50 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-blue-700">Template Name</Label>
                  <Input
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    placeholder="Enter template name"
                    className="border-blue-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-blue-700">Applicable Industry</Label>
                  <Input
                    value={newTemplate.industry}
                    onChange={(e) => setNewTemplate({ ...newTemplate, industry: e.target.value })}
                    placeholder="Optional: applicable industry"
                    className="border-blue-200"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-blue-700">Template Content</Label>
                <Textarea
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                  placeholder="Enter template content, use variables like {name}, {company}, {role}"
                  rows={4}
                  className="border-blue-200"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveTemplate} className="business-button">
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {templates.map((template) => (
              <div key={template.id} className="p-4 border border-blue-200 rounded-lg bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-blue-900">{template.name}</h4>
                    {template.is_default && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        Default
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyTemplate(template.content)}
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onTemplateDelete(template.id)}
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-blue-700 bg-blue-50 p-2 rounded">
                  {template.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-blue-200">
          <Button className="w-full business-button" onClick={() => console.log('Settings saved')}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 