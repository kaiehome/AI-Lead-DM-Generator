'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Linkedin, 
  User, 
  Users, 
  Target, 
  TrendingUp,
  Loader2,
  AlertCircle,
  CheckCircle,
  Sparkles
} from 'lucide-react'
import { parseLinkedInProfile, extractCommonPoints, analyzeProfileInsights, LinkedInProfile } from '@/lib/linkedin-parser'
import { Lead } from '@/lib/supabase'

interface LinkedInAnalyzerProps {
  lead: Lead
  onProfileAnalyzed: (profile: LinkedInProfile) => void
}

export function LinkedInAnalyzer({ lead, onProfileAnalyzed }: LinkedInAnalyzerProps) {
  const [linkedinUrl, setLinkedinUrl] = useState(lead.linkedin_url || '')
  const [profile, setProfile] = useState<LinkedInProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showManualInput, setShowManualInput] = useState(false)

  useEffect(() => {
    if (lead.linkedin_url) {
      setLinkedinUrl(lead.linkedin_url)
    }
  }, [lead.linkedin_url])

  const handleAnalyzeProfile = async () => {
    if (!linkedinUrl.trim()) {
      setError('Please enter a LinkedIn URL')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const parsedProfile = await parseLinkedInProfile(linkedinUrl)
      if (parsedProfile) {
        setProfile(parsedProfile)
        onProfileAnalyzed(parsedProfile)
      } else {
        setError('Unable to parse LinkedIn profile. Please check the URL or enter information manually')
        setShowManualInput(true)
      }
    } catch {
      setError('Error analyzing LinkedIn profile')
      setShowManualInput(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualInput = () => {
    setShowManualInput(true)
  }

  const handleManualSave = () => {
    if (profile) {
      onProfileAnalyzed(profile)
    }
  }

  const insights = profile ? analyzeProfileInsights(profile) : null
  const commonPoints = profile ? extractCommonPoints(profile) : []

  return (
    <Card className="business-card">
      <CardHeader className="border-b border-blue-100">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Linkedin className="h-5 w-5" />
          LinkedIn Profile Analysis
        </CardTitle>
        <CardDescription className="text-blue-600">
          Analyze LinkedIn profile to generate personalized messages
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="linkedin-url" className="text-blue-700">LinkedIn URL</Label>
          <div className="flex gap-2">
            <Input
              id="linkedin-url"
              placeholder="https://linkedin.com/in/username"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="flex-1 border-blue-200"
            />
            <Button 
              onClick={handleAnalyzeProfile} 
              disabled={!linkedinUrl || isLoading}
              className="business-button"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Analyze
            </Button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {!profile && !isLoading && (
          <div className="text-center py-4">
            <Button variant="outline" onClick={handleManualInput} className="border-blue-300 text-blue-700 hover:bg-blue-50">
              Enter Profile Information Manually
            </Button>
          </div>
        )}
      </CardContent>

      {/* Manual Input Form */}
      {showManualInput && !profile && (
        <Card className="business-card mt-4">
          <CardHeader className="border-b border-blue-100">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <User className="h-5 w-5" />
              Manual LinkedIn Profile Input
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-blue-700">Job Title</Label>
                <Input 
                  placeholder="Senior Software Engineer"
                  onChange={(e) => setProfile(prev => ({ ...prev, headline: e.target.value } as LinkedInProfile))}
                  className="border-blue-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-blue-700">Location</Label>
                <Input 
                  placeholder="San Francisco, CA"
                  onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value } as LinkedInProfile))}
                  className="border-blue-200"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-blue-700">Professional Summary</Label>
              <Textarea 
                placeholder="Briefly describe your professional background and interests..."
                rows={3}
                onChange={(e) => setProfile(prev => ({ ...prev, summary: e.target.value } as LinkedInProfile))}
                className="border-blue-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-blue-700">Industry</Label>
                <Input 
                  placeholder="Technology"
                  onChange={(e) => setProfile(prev => ({ ...prev, industry: e.target.value } as LinkedInProfile))}
                  className="border-blue-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-blue-700">Company Size</Label>
                <Input 
                  placeholder="100-500"
                  onChange={(e) => setProfile(prev => ({ ...prev, company_size: e.target.value } as LinkedInProfile))}
                  className="border-blue-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-blue-700">Skills (comma-separated)</Label>
              <Input 
                placeholder="JavaScript, React, Node.js, Python"
                onChange={(e) => setProfile(prev => ({ 
                  ...prev, 
                  skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                } as LinkedInProfile))}
                className="border-blue-200"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-blue-700">Work Experience (semicolon-separated, format: Title@Company)</Label>
              <Textarea 
                placeholder="Senior Developer@Tech Corp; Junior Developer@Startup Inc"
                rows={2}
                onChange={(e) => setProfile(prev => ({ 
                  ...prev, 
                  experience: e.target.value.split(';').map(exp => {
                    const [title, company] = exp.split('@').map(s => s.trim())
                    return { title: title || '', company: company || '', duration: '' }
                  }).filter(exp => exp.title && exp.company)
                } as LinkedInProfile))}
                className="border-blue-200"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleManualSave} className="flex-1 business-button">
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Profile
              </Button>
              <Button variant="outline" onClick={() => setShowManualInput(false)} className="border-blue-300 text-blue-700 hover:bg-blue-50">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {profile && (
        <div className="space-y-4 mt-4">
          {/* Basic Information */}
          <Card className="business-card">
            <CardHeader className="border-b border-blue-100">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-blue-800">
                <User className="h-4 w-4" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-600">Job Title:</span>
                  <p className="text-blue-900">{profile.headline || 'Not provided'}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-600">Location:</span>
                  <p className="text-blue-900">{profile.location || 'Not provided'}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-600">Industry:</span>
                  <p className="text-blue-900">{profile.industry || 'Not provided'}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-600">Company Size:</span>
                  <p className="text-blue-900">{profile.company_size || 'Not provided'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Analysis */}
          {profile.skills && profile.skills.length > 0 && (
            <Card className="business-card">
              <CardHeader className="border-b border-blue-100">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-blue-800">
                  <Target className="h-4 w-4" />
                  Skills Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700 border-blue-300">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Common Points */}
          {commonPoints.length > 0 && (
            <Card className="business-card">
              <CardHeader className="border-b border-blue-100">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-blue-800">
                  <Users className="h-4 w-4" />
                  Potential Common Points
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  {commonPoints.map((point, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-blue-700">{point}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Insights Analysis */}
          {insights && (
            <Card className="business-card">
              <CardHeader className="border-b border-blue-100">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-blue-800">
                  <TrendingUp className="h-4 w-4" />
                  AI Insights Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-2">
                    <Label className="text-xs text-blue-500">Seniority Level</Label>
                    <Badge variant="outline" className="capitalize bg-blue-100 text-blue-700 border-blue-300">
                      {insights.seniority}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-blue-500">Industry</Label>
                    <Badge variant="outline" className="capitalize bg-blue-100 text-blue-700 border-blue-300">
                      {insights.industry}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-blue-500">Company Size</Label>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                      {insights.companySize}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-blue-500">Activity Level</Label>
                    <Badge variant="outline" className="capitalize bg-blue-100 text-blue-700 border-blue-300">
                      {insights.activityLevel}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-blue-500">Networking Potential</Label>
                    <Badge variant="outline" className="capitalize bg-blue-100 text-blue-700 border-blue-300">
                      {insights.networkingPotential}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </Card>
  )
} 