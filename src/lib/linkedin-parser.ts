import { Experience, Education } from '@/types/message'

export interface LinkedInProfile {
  headline?: string
  summary?: string
  experience: Experience[]
  education: Education[]
  skills: string[]
  location?: string
  connections?: number
  industry?: string
  company_size?: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function parseLinkedInProfile(_linkedinUrl: string): Promise<LinkedInProfile | null> {
  try {
    // This should implement actual LinkedIn profile parsing logic
    // Due to LinkedIn API limitations, this provides a mock implementation
    // In a real application, you might need to use third-party services or manual input
    
    const mockProfile: LinkedInProfile = {
      headline: 'Senior Software Engineer at Tech Company',
      summary: 'Passionate about building scalable software solutions and leading technical teams.',
      experience: [
        {
          title: 'Senior Software Engineer',
          company: 'Tech Company',
          duration: '2020 - Present',
          description: 'Leading development of cloud-based applications'
        },
        {
          title: 'Software Engineer',
          company: 'Startup Inc',
          duration: '2018 - 2020',
          description: 'Full-stack development with React and Node.js'
        }
      ],
      education: [
        {
          school: 'University of Technology',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          year: '2018'
        }
      ],
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
      location: 'San Francisco, CA',
      connections: 500,
      industry: 'technology',
      company_size: '100-500'
    }
    
    return mockProfile
  } catch (error) {
    console.error('Failed to parse LinkedIn profile:', error)
    return null
  }
}

export function extractCommonPoints(profile: LinkedInProfile, userProfile?: LinkedInProfile): string[] {
  const commonPoints: string[] = []
  
  if (!userProfile) return commonPoints
  
  // Check common skills
  const commonSkills = profile.skills.filter(skill => 
    userProfile.skills.includes(skill)
  )
  if (commonSkills.length > 0) {
    commonPoints.push(`Common skills: ${commonSkills.join(', ')}`)
  }
  
  // Check common education background
  const commonEducation = profile.education.filter(edu => 
    userProfile.education.some(userEdu => userEdu.school === edu.school)
  )
  if (commonEducation.length > 0) {
    commonPoints.push(`Common education: ${commonEducation.map(e => e.school).join(', ')}`)
  }
  
  // Check common industry
  if (profile.industry && userProfile.industry && profile.industry === userProfile.industry) {
    commonPoints.push(`Common industry: ${profile.industry}`)
  }
  
  // Check common location
  if (profile.location && userProfile.location && profile.location === userProfile.location) {
    commonPoints.push(`Common location: ${profile.location}`)
  }
  
  return commonPoints
}

export function analyzeProfileInsights(profile: LinkedInProfile): {
  seniority: string
  industry: string
  companySize: string
  activityLevel: string
  networkingPotential: string
} {
  // Analyze job level
  const seniority = analyzeSeniority(profile.experience)
  
  // Analyze industry
  const industry = profile.industry || 'unknown'
  
  // Analyze company size
  const companySize = profile.company_size || 'unknown'
  
  // Analyze activity level (based on connections)
  const activityLevel = profile.connections 
    ? profile.connections > 1000 ? 'high' 
    : profile.connections > 500 ? 'medium' 
    : 'low'
    : 'unknown'
  
  // Analyze networking potential
  const networkingPotential = analyzeNetworkingPotential(profile)
  
  return {
    seniority,
    industry,
    companySize,
    activityLevel,
    networkingPotential
  }
}

function analyzeSeniority(experience: Experience[]): string {
  if (experience.length === 0) return 'entry'
  
  const titles = experience.map(exp => exp.title.toLowerCase())
  
  if (titles.some(title => title.includes('senior') || title.includes('lead') || title.includes('manager'))) {
    return 'senior'
  } else if (titles.some(title => title.includes('junior') || title.includes('associate'))) {
    return 'junior'
  } else {
    return 'mid'
  }
}

function analyzeNetworkingPotential(profile: LinkedInProfile): string {
  let score = 0
  
  // Based on connections
  if (profile.connections) {
    if (profile.connections > 1000) score += 3
    else if (profile.connections > 500) score += 2
    else if (profile.connections > 100) score += 1
  }
  
  // Based on experience richness
  if (profile.experience.length > 5) score += 2
  else if (profile.experience.length > 2) score += 1
  
  // Based on skill diversity
  if (profile.skills.length > 10) score += 2
  else if (profile.skills.length > 5) score += 1
  
  if (score >= 5) return 'high'
  else if (score >= 3) return 'medium'
  else return 'low'
} 