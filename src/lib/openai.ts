import OpenAI from 'openai'
import { 
  GenerateMessageParams, 
  GeneratedMessage, 
  MessageStyle, 
  MessageTarget, 
  MessageLength,
  LinkedInData 
} from '@/types/message'
import { getIndustryData, getRoleLevel, IndustryData } from './industry-data'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Message style configurations
const STYLE_CONFIGS: Record<MessageStyle, { tone: string; emojis: boolean; formality: string }> = {
  professional: { tone: 'professional and business-focused', emojis: false, formality: 'formal' },
  friendly: { tone: 'warm and approachable', emojis: true, formality: 'semi-formal' },
  casual: { tone: 'relaxed and conversational', emojis: true, formality: 'informal' },
  formal: { tone: 'very professional and respectful', emojis: false, formality: 'very formal' },
  enthusiastic: { tone: 'energetic and positive', emojis: true, formality: 'semi-formal' }
}

// Target configurations
const TARGET_CONFIGS: Record<MessageTarget, { purpose: string; call_to_action: string }> = {
  connection: { purpose: 'establish a professional connection', call_to_action: 'connect and stay in touch' },
  business: { purpose: 'explore business opportunities', call_to_action: 'discuss potential collaboration' },
  recruitment: { purpose: 'explore career opportunities', call_to_action: 'discuss career possibilities' },
  networking: { purpose: 'expand professional network', call_to_action: 'network and share insights' },
  event: { purpose: 'invite to an event or conference', call_to_action: 'attend the event' },
  collaboration: { purpose: 'propose a specific collaboration', call_to_action: 'work together on a project' }
}

// Length configurations
const LENGTH_CONFIGS: Record<MessageLength, { max_chars: number; description: string }> = {
  short: { max_chars: 200, description: 'brief and concise' },
  standard: { max_chars: 400, description: 'balanced and informative' },
  detailed: { max_chars: 500, description: 'comprehensive and detailed' }
}

function buildAdvancedPrompt(params: GenerateMessageParams): string {
  const { name, role, company, industry, company_size, linkedin_data, style, target, length, include_emojis, custom_context } = params
  
  // Get industry data
  const industryData = industry ? getIndustryData(industry) : null
  const roleLevel = getRoleLevel(role)
  
  // Get configurations
  const styleConfig = STYLE_CONFIGS[style || 'professional']
  const targetConfig = TARGET_CONFIGS[target || 'connection']
  const lengthConfig = LENGTH_CONFIGS[length || 'standard']
  
  // Build LinkedIn data context
  let linkedinContext = ''
  if (linkedin_data) {
    linkedinContext = buildLinkedInContext(linkedin_data)
  }
  
  // Build personalization elements
  const personalizationElements = buildPersonalizationElements(params, industryData)
  
  const prompt = `You are an expert LinkedIn networking professional with deep knowledge of ${industryData?.name || 'various industries'}.

TARGET PERSON:
- Name: ${name}
- Role: ${role} (${roleLevel} level)
- Company: ${company}${company_size ? ` (${company_size} company)` : ''}
- Industry: ${industry || 'Not specified'}

MESSAGE REQUIREMENTS:
- Style: ${styleConfig.tone}
- Target: ${targetConfig.purpose}
- Length: ${lengthConfig.description} (max ${lengthConfig.max_chars} characters)
- Emojis: ${include_emojis ? 'Include 1-2 relevant emojis' : 'No emojis'}
- Formality: ${styleConfig.formality}

${linkedinContext}

${personalizationElements}

${custom_context ? `ADDITIONAL CONTEXT: ${custom_context}` : ''}

INSTRUCTIONS:
1. Write a personalized LinkedIn message that feels authentic and specific to ${name}
2. Use the ${styleConfig.tone} tone
3. Focus on ${targetConfig.purpose}
4. Keep it under ${lengthConfig.max_chars} characters
5. End with a clear call to action for ${targetConfig.call_to_action}
6. Make it feel like a real person wrote it, not a template
7. Reference specific details from their profile when possible

Generate only the message content, no additional formatting or explanations.`

  return prompt
}

function buildLinkedInContext(linkedinData: LinkedInData): string {
  let context = 'LINKEDIN PROFILE INSIGHTS:\n'
  
  if (linkedinData.headline) {
    context += `- Headline: ${linkedinData.headline}\n`
  }
  
  if (linkedinData.summary) {
    context += `- Summary: ${linkedinData.summary.substring(0, 200)}...\n`
  }
  
  if (linkedinData.experience && linkedinData.experience.length > 0) {
    const recentExp = linkedinData.experience[0]
    context += `- Current Role: ${recentExp.title} at ${recentExp.company} (${recentExp.duration})\n`
  }
  
  if (linkedinData.skills && linkedinData.skills.length > 0) {
    context += `- Key Skills: ${linkedinData.skills.slice(0, 5).join(', ')}\n`
  }
  
  if (linkedinData.education && linkedinData.education.length > 0) {
    const education = linkedinData.education[0]
    context += `- Education: ${education.degree || ''} ${education.field || ''} at ${education.school}\n`
  }
  
  if (linkedinData.location) {
    context += `- Location: ${linkedinData.location}\n`
  }
  
  return context
}

function buildPersonalizationElements(params: GenerateMessageParams, industryData: IndustryData | null): string {
  const { role } = params
  
  let elements = 'PERSONALIZATION ELEMENTS:\n'
  
  // Industry-specific elements
  if (industryData) {
    elements += `- Industry Tone: ${industryData.tone}\n`
    elements += `- Industry Keywords: ${industryData.keywords.slice(0, 3).join(', ')}\n`
    elements += `- Common Interests: ${industryData.common_interests.slice(0, 2).join(', ')}\n`
  }
  
  // Role level specific suggestions
  const roleLevel = getRoleLevel(role)
  switch (roleLevel) {
    case 'executive':
      elements += '- Executive Level: Focus on strategic insights and high-level business value\n'
      break
    case 'senior':
      elements += '- Senior Level: Emphasize leadership experience and industry expertise\n'
      break
    case 'mid-level':
      elements += '- Mid-Level: Highlight specific skills and project experience\n'
      break
    case 'junior':
      elements += '- Junior Level: Focus on growth potential and learning opportunities\n'
      break
  }
  
  // Company size specific suggestions
  if (params.company_size) {
    switch (params.company_size) {
      case 'startup':
        elements += '- Startup Environment: Emphasize innovation and growth opportunities\n'
        break
      case 'enterprise':
        elements += '- Enterprise Environment: Focus on scale and established processes\n'
        break
    }
  }
  
  return elements
}

export async function generateMessage(params: GenerateMessageParams): Promise<GeneratedMessage> {
  const { style = 'professional', target = 'connection', length = 'standard' } = params
  
  const prompt = buildAdvancedPrompt(params)
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional LinkedIn networking expert who writes highly personalized and effective outreach messages. You understand different industries, company cultures, and professional levels. Always write authentic, specific messages that feel personal and relevant."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    }, {
      timeout: 30000, // 30 second timeout
    })

    const message = completion.choices[0]?.message?.content || 'Failed to generate message'
    
    return {
      message: message.trim(),
      style: style,
      target: target,
      length: length,
      character_count: message.length,
      confidence_score: 0.85 // Can be dynamically calculated based on response quality
    }
  } catch (error) {
    console.error('Error generating message:', error)
    throw new Error('Failed to generate message. Please try again.')
  }
}

// Keep backward compatibility with simple interface
export async function generateSimpleMessage(params: { name: string; role: string; company: string; linkedin_url?: string }): Promise<string> {
  const result = await generateMessage({
    ...params,
    style: 'professional',
    target: 'connection',
    length: 'standard'
  })
  
  return result.message
} 