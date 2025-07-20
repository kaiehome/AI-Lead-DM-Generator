export interface IndustryData {
  name: string
  keywords: string[]
  templates: string[]
  tone: string
  common_interests: string[]
  networking_events: string[]
}

export const INDUSTRY_DATA: Record<string, IndustryData> = {
  'technology': {
    name: 'Technology',
    keywords: ['innovation', 'digital transformation', 'AI/ML', 'cloud computing', 'startup', 'SaaS', 'product development'],
    templates: [
      'I noticed your work on {project} - really impressive approach to {challenge}!',
      'Your experience in {technology} caught my attention. Would love to connect and discuss industry trends.',
      'Saw your post about {topic} - great insights on the future of {industry}!'
    ],
    tone: 'innovative and forward-thinking',
    common_interests: ['emerging technologies', 'product development', 'innovation', 'startup ecosystem'],
    networking_events: ['TechCrunch Disrupt', 'SXSW', 'Web Summit', 'CES']
  },
  'finance': {
    name: 'Finance',
    keywords: ['investment', 'fintech', 'wealth management', 'banking', 'financial services', 'compliance', 'risk management'],
    templates: [
      'Your insights on {financial_topic} are valuable. Would love to discuss market trends.',
      'Impressed by your work in {area}. The financial industry is evolving rapidly.',
      'Your experience with {financial_service} caught my attention. Great to see innovation in finance.'
    ],
    tone: 'professional and trustworthy',
    common_interests: ['market analysis', 'financial innovation', 'regulatory compliance', 'investment strategies'],
    networking_events: ['Money20/20', 'Finovate', 'SIFMA', 'World Economic Forum']
  },
  'healthcare': {
    name: 'Healthcare',
    keywords: ['patient care', 'healthcare technology', 'medical devices', 'pharmaceuticals', 'telemedicine', 'healthcare innovation'],
    templates: [
      'Your work in {healthcare_area} is making a real difference. Would love to connect.',
      'Impressed by your approach to {healthcare_challenge}. The industry needs more innovative solutions.',
      'Your experience with {medical_technology} is fascinating. Healthcare innovation is crucial.'
    ],
    tone: 'compassionate and professional',
    common_interests: ['patient outcomes', 'healthcare innovation', 'medical technology', 'public health'],
    networking_events: ['HIMSS', 'JPMorgan Healthcare Conference', 'MedTech Conference', 'Health 2.0']
  },
  'marketing': {
    name: 'Marketing',
    keywords: ['digital marketing', 'brand strategy', 'content marketing', 'social media', 'growth hacking', 'customer acquisition'],
    templates: [
      'Your marketing campaigns are creative and effective! Love your approach to {strategy}.',
      'Your work on {campaign} caught my attention. Great results in {metric}!',
      'Impressed by your growth strategies. The marketing landscape is evolving rapidly.'
    ],
    tone: 'creative and results-driven',
    common_interests: ['brand building', 'customer experience', 'growth strategies', 'creative campaigns'],
    networking_events: ['SXSW', 'Inbound', 'Content Marketing World', 'Social Media Marketing World']
  },
  'consulting': {
    name: 'Consulting',
    keywords: ['strategy', 'business transformation', 'process improvement', 'change management', 'organizational development'],
    templates: [
      'Your consulting work in {industry} is impressive. Would love to discuss business challenges.',
      'Your approach to {business_problem} is innovative. The consulting world needs fresh perspectives.',
      'Your experience with {transformation_type} caught my attention. Business transformation is crucial.'
    ],
    tone: 'analytical and strategic',
    common_interests: ['business strategy', 'organizational change', 'process optimization', 'industry insights'],
    networking_events: ['Consulting Summit', 'Business Transformation Summit', 'Strategy Conference']
  },
  'education': {
    name: 'Education',
    keywords: ['edtech', 'online learning', 'curriculum development', 'student success', 'educational technology', 'academic leadership'],
    templates: [
      'Your work in {education_area} is inspiring. Education innovation is so important.',
      'Your approach to {learning_method} caught my attention. The future of education is exciting.',
      'Impressed by your commitment to {educational_goal}. Students benefit from dedicated educators.'
    ],
    tone: 'inspiring and supportive',
    common_interests: ['student success', 'educational innovation', 'learning technology', 'academic excellence'],
    networking_events: ['ISTE', 'SXSW EDU', 'AERA Annual Meeting', 'EdTechXGlobal']
  }
}

// Get industry-specific keywords
export function getIndustryKeywords(industry: string): string[] {
  const industryData = INDUSTRY_DATA[industry.toLowerCase()]
  return industryData?.keywords || []
}

// Get industry-specific templates
export function getIndustryTemplates(industry: string): string[] {
  const industryData = INDUSTRY_DATA[industry.toLowerCase()]
  return industryData?.templates || []
}

// Get industry-specific tone
export function getIndustryTone(industry: string): string {
  const industryData = INDUSTRY_DATA[industry.toLowerCase()]
  return industryData?.tone || 'professional'
}

// Get all industries list
export function getAllIndustries(): string[] {
  return Object.keys(INDUSTRY_DATA)
}

// Get industry data
export function getIndustryData(industry: string) {
  return INDUSTRY_DATA[industry.toLowerCase()]
}

// Get industry statistics
export function getIndustryStats(): Record<string, number> {
  const stats: Record<string, number> = {}
  
  Object.entries(INDUSTRY_DATA).forEach(([key, data]) => {
    stats[key] = data.keywords.length + data.templates.length
  })
  
  return stats
}

export function getCompanySizeCategory(employeeCount?: number): string {
  if (!employeeCount) return 'unknown'
  
  if (employeeCount <= 10) return 'startup'
  if (employeeCount <= 50) return 'small'
  if (employeeCount <= 200) return 'medium'
  if (employeeCount <= 1000) return 'large'
  return 'enterprise'
}

export function getRoleLevel(role: string): string {
  const roleLower = role.toLowerCase()
  
  if (roleLower.includes('ceo') || roleLower.includes('founder') || roleLower.includes('president')) {
    return 'executive'
  }
  if (roleLower.includes('director') || roleLower.includes('head of') || roleLower.includes('vp')) {
    return 'senior'
  }
  if (roleLower.includes('manager') || roleLower.includes('lead') || roleLower.includes('senior')) {
    return 'mid-level'
  }
  if (roleLower.includes('associate') || roleLower.includes('coordinator') || roleLower.includes('specialist')) {
    return 'junior'
  }
  
  return 'mid-level'
} 