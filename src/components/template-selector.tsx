'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  FileText, 
  Search, 
  Sparkles, 
  Plus,
  Trash2,
  Star
} from 'lucide-react'
import { 
  MessageTemplate, 
  getRecommendedTemplates,
  fillTemplate,
  validateTemplate
} from '@/lib/message-templates'
import { MessageStyle, MessageTarget } from '@/types/message'

interface TemplateSelectorProps {
  industry?: string
  style?: MessageStyle
  target?: MessageTarget
  onTemplateSelected: (template: MessageTemplate, filledContent: string) => void
  onTemplateApplied: (content: string) => void
}

export function TemplateSelector({ 
  industry, 
  style, 
  target, 
  onTemplateSelected, 
  onTemplateApplied 
}: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<MessageTemplate[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<MessageTemplate[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null)
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({})
  const [filledContent, setFilledContent] = useState('')
  const [showCustomTemplate, setShowCustomTemplate] = useState(false)
  const [customTemplate, setCustomTemplate] = useState<Partial<MessageTemplate>>({
    name: '',
    description: '',
    template: '',
    variables: []
  })

  useEffect(() => {
    // Get recommended templates
    const recommendedTemplates = getRecommendedTemplates(industry, style, target)
    setTemplates(recommendedTemplates)
    setFilteredTemplates(recommendedTemplates)
  }, [industry, style, target])

  useEffect(() => {
    // Filter templates
    const filtered = templates.filter(template =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.industry?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredTemplates(filtered)
  }, [templates, searchTerm])

  useEffect(() => {
    // When template variables change, refill content
    if (selectedTemplate) {
      const filled = fillTemplate(selectedTemplate.template, templateVariables)
      setFilledContent(filled)
    }
  }, [selectedTemplate, templateVariables])

  const handleTemplateSelect = (template: MessageTemplate) => {
    setSelectedTemplate(template)
    setTemplateVariables({})
    setFilledContent(template.template)
  }

  const handleVariableChange = (variable: string, value: string) => {
    setTemplateVariables(prev => ({
      ...prev,
      [variable]: value
    }))
  }

  const handleApplyTemplate = () => {
    if (selectedTemplate && filledContent) {
      onTemplateSelected(selectedTemplate, filledContent)
      onTemplateApplied(filledContent)
    }
  }

  const handleCreateCustomTemplate = () => {
    setShowCustomTemplate(true)
    setSelectedTemplate(null)
  }

  const handleSaveCustomTemplate = () => {
    const validation = validateTemplate(customTemplate as MessageTemplate)
    if (!validation.isValid) {
      alert(`Template validation failed:\n${validation.errors.join('\n')}`)
      return
    }

    const newTemplate: MessageTemplate = {
      id: `custom-${Date.now()}`,
      name: customTemplate.name || '',
      description: customTemplate.description || '',
      template: customTemplate.template || '',
      variables: customTemplate.variables || [],
      style: style || 'professional',
      target: target || 'connection',
      length: 'standard',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    setTemplates(prev => [newTemplate, ...prev])
    setSelectedTemplate(newTemplate)
    setShowCustomTemplate(false)
    setCustomTemplate({
      name: '',
      description: '',
      template: '',
      variables: []
    })
  }

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId))
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null)
      setFilledContent('')
    }
  }

  return (
    <Card className="business-card">
      <CardHeader className="border-b border-blue-100 pb-4">
        <CardTitle className="flex items-center gap-2 text-blue-800 text-lg">
          <FileText className="h-5 w-5" />
          Message Templates
        </CardTitle>
        <CardDescription className="text-blue-600 text-sm">
          Select or create message templates for your outreach
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-blue-200 text-sm"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCreateCustomTemplate}
            className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50 text-sm"
          >
            <Plus className="h-4 w-4" />
            New
          </Button>
        </div>

        {/* Template List */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedTemplate?.id === template.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-blue-200 hover:border-blue-300 hover:bg-blue-25'
              }`}
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-sm text-blue-900 truncate">{template.name}</h4>
                    {template.isDefault && (
                      <Star className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-blue-600 mb-3 leading-relaxed">{template.description}</p>
                  <div className="flex items-center gap-1 flex-wrap">
                    <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300">
                      {template.style}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300">
                      {template.target}
                    </Badge>
                    {template.industry && (
                      <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300">
                        {template.industry}
                      </Badge>
                    )}
                  </div>
                </div>
                {!template.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteTemplate(template.id)
                    }}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0 ml-2"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Custom Template Creation */}
      {showCustomTemplate && (
        <Card className="business-card mt-4">
          <CardHeader className="border-b border-blue-100 pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-blue-800">
              <Plus className="h-4 w-4" />
              Create Custom Template
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label className="text-blue-700 text-sm">Template Name</Label>
                <Input
                  value={customTemplate.name}
                  onChange={(e) => setCustomTemplate(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter template name"
                  className="border-blue-200 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-blue-700 text-sm">Description</Label>
                <Input
                  value={customTemplate.description}
                  onChange={(e) => setCustomTemplate(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Template purpose description"
                  className="border-blue-200 text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-blue-700 text-sm">Template Content</Label>
              <Textarea
                value={customTemplate.template}
                onChange={(e) => setCustomTemplate(prev => ({ ...prev, template: e.target.value }))}
                placeholder="Use {variable_name} format to define variables, e.g.: Hi {name}, I noticed your work at {company}..."
                rows={4}
                className="border-blue-200 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-blue-700 text-sm">Variable List (comma-separated)</Label>
              <Input
                value={customTemplate.variables?.join(', ') || ''}
                onChange={(e) => setCustomTemplate(prev => ({ 
                  ...prev, 
                  variables: e.target.value.split(',').map(v => v.trim()).filter(Boolean)
                }))}
                placeholder="name, company, role"
                className="border-blue-200 text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveCustomTemplate} className="flex-1 business-button text-sm">
                Save Template
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCustomTemplate(false)}
                className="border-blue-300 text-blue-700 hover:bg-blue-50 text-sm"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template Preview and Variable Filling */}
      {selectedTemplate && !showCustomTemplate && (
        <Card className="business-card mt-4">
          <CardHeader className="border-b border-blue-100 pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-blue-800">
              <Sparkles className="h-4 w-4" />
              Template Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {/* Variable Input */}
            {selectedTemplate.variables.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-blue-700">Fill Variables</Label>
                <div className="grid grid-cols-1 gap-3">
                  {selectedTemplate.variables.map((variable) => (
                    <div key={variable} className="space-y-1">
                      <Label className="text-xs text-blue-600">{variable}</Label>
                      <Input
                        value={templateVariables[variable] || ''}
                        onChange={(e) => handleVariableChange(variable, e.target.value)}
                        placeholder={`Enter ${variable}`}
                        className="text-sm border-blue-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preview Content */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-blue-700">Preview Content</Label>
              <Textarea
                value={filledContent}
                onChange={(e) => setFilledContent(e.target.value)}
                placeholder="Template content will be displayed here..."
                rows={4}
                className="text-sm border-blue-200"
              />
            </div>

            {/* Apply Button */}
            <Button 
              onClick={handleApplyTemplate}
              className="w-full business-button text-sm"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Apply Template
            </Button>
          </CardContent>
        </Card>
      )}
    </Card>
  )
} 