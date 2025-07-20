import { MessageStyle, MessageTarget, MessageLength } from '@/types/message'

export interface MessageTemplate {
  id: string
  name: string
  description: string
  industry?: string
  style: MessageStyle
  target: MessageTarget
  length: MessageLength
  template: string
  variables: string[]
  isDefault?: boolean
  created_at?: string
  updated_at?: string
}

// Default template library
export const DEFAULT_TEMPLATES: MessageTemplate[] = [
  {
    id: 'tech-connection',
    name: 'Tech Industry Connection',
    description: 'Professional initial outreach for technology industry',
    industry: 'technology',
    style: 'professional',
    target: 'connection',
    length: 'standard',
    template: 'Hi {name}, I noticed your work on {project/company} and was impressed by your approach to {challenge/technology}. I\'d love to connect and discuss industry trends. Would you be open to a brief conversation?',
    variables: ['name', 'project/company', 'challenge/technology'],
    isDefault: true
  },
  {
    id: 'startup-collaboration',
    name: 'Startup Partnership',
    description: 'Explore collaboration opportunities with startups',
    industry: 'technology',
    style: 'enthusiastic',
    target: 'business',
    length: 'detailed',
    template: 'Hi {name}! I came across {company} and was excited to see what you\'re building in the {industry} space. Your approach to {specific_aspect} really caught my attention. I\'d love to explore potential collaboration opportunities. Are you open to discussing how we might work together?',
    variables: ['name', 'company', 'industry', 'specific_aspect'],
    isDefault: true
  },
  {
    id: 'finance-networking',
    name: 'Finance Industry Networking',
    description: 'Professional networking expansion in finance sector',
    industry: 'finance',
    style: 'formal',
    target: 'networking',
    length: 'standard',
    template: 'Dear {name}, I hope this message finds you well. I noticed your role at {company} and your expertise in {area_of_expertise}. I would appreciate the opportunity to connect and discuss developments in the {industry} sector. Would you be available for a brief conversation?',
    variables: ['name', 'company', 'area_of_expertise', 'industry'],
    isDefault: true
  },
  {
    id: 'healthcare-partnership',
    name: 'Healthcare Collaboration',
    description: 'Explore partnership opportunities in healthcare',
    industry: 'healthcare',
    style: 'professional',
    target: 'business',
    length: 'detailed',
    template: 'Hello {name}, I hope you\'re doing well. I\'ve been following {company}\'s work in {specific_area} and am impressed by your innovative approach to {challenge}. I believe there could be valuable partnership opportunities between our organizations. Would you be interested in discussing potential collaboration?',
    variables: ['name', 'company', 'specific_area', 'challenge'],
    isDefault: true
  },
  {
    id: 'recruitment-senior',
    name: 'Senior Talent Recruitment',
    description: 'Recruitment outreach for senior positions',
    style: 'professional',
    target: 'recruitment',
    length: 'standard',
    template: 'Hi {name}, I hope this message finds you well. I came across your profile and was impressed by your experience in {field}. We\'re currently looking for a {position} at {company} and I believe your background would be a great fit. Would you be interested in learning more about this opportunity?',
    variables: ['name', 'field', 'position', 'company'],
    isDefault: true
  },
  {
    id: 'event-invitation',
    name: 'Event Invitation',
    description: 'Invitation to industry events or conferences',
    style: 'friendly',
    target: 'event',
    length: 'short',
    template: 'Hi {name}! I wanted to personally invite you to {event_name} on {date}. Given your expertise in {area}, I think you\'d find the discussions on {topic} particularly valuable. Would you be interested in attending?',
    variables: ['name', 'event_name', 'date', 'area', 'topic'],
    isDefault: true
  },
  {
    id: 'casual-connection',
    name: 'Casual Connection',
    description: 'Light and friendly initial outreach',
    style: 'casual',
    target: 'connection',
    length: 'short',
    template: 'Hey {name}! 👋 I noticed we both work in {industry} and I thought it would be great to connect. I\'m always interested in meeting fellow professionals in the space. Would love to chat sometime!',
    variables: ['name', 'industry'],
    isDefault: true
  }
]

// Get templates by industry
export function getTemplatesByIndustry(industry?: string): MessageTemplate[] {
  if (!industry) return DEFAULT_TEMPLATES.filter(t => !t.industry)
  
  return DEFAULT_TEMPLATES.filter(template => 
    !template.industry || template.industry === industry
  )
}

// Get templates by style and target
export function getTemplatesByStyleAndTarget(
  style: MessageStyle, 
  target: MessageTarget
): MessageTemplate[] {
  return DEFAULT_TEMPLATES.filter(template => 
    template.style === style && template.target === target
  )
}

// Get recommended templates
export function getRecommendedTemplates(
  industry?: string,
  style?: MessageStyle,
  target?: MessageTarget
): MessageTemplate[] {
  let templates = DEFAULT_TEMPLATES

  if (industry) {
    templates = templates.filter(t => !t.industry || t.industry === industry)
  }

  if (style) {
    templates = templates.filter(t => t.style === style)
  }

  if (target) {
    templates = templates.filter(t => t.target === target)
  }

  return templates.slice(0, 3) // Return top 3 recommended templates
}

// Parse template variables
export function parseTemplateVariables(template: string): string[] {
  const variableRegex = /\{([^}]+)\}/g
  const variables: string[] = []
  let match

  while ((match = variableRegex.exec(template)) !== null) {
    variables.push(match[1])
  }

  return [...new Set(variables)] // Remove duplicates
}

// Fill template with variables
export function fillTemplate(template: string, variables: Record<string, string>): string {
  let filledTemplate = template

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{${key}\\}`, 'g')
    filledTemplate = filledTemplate.replace(regex, value)
  }

  return filledTemplate
}

// Validate template
export function validateTemplate(template: MessageTemplate): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!template.name.trim()) {
    errors.push('Template name cannot be empty')
  }

  if (!template.template.trim()) {
    errors.push('Template content cannot be empty')
  }

  if (!template.variables || template.variables.length === 0) {
    errors.push('Template must contain at least one variable')
  }

  // Check if template variables match defined variables
  const parsedVariables = parseTemplateVariables(template.template)
  const definedVariables = template.variables || []

  for (const variable of parsedVariables) {
    if (!definedVariables.includes(variable)) {
      errors.push(`Template uses undefined variable: ${variable}`)
    }
  }

  for (const variable of definedVariables) {
    if (!parsedVariables.includes(variable)) {
      errors.push(`Variable defined but not used in template: ${variable}`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
} 