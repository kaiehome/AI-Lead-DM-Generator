'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreateLeadData } from '@/lib/supabase'
import { UserPlus, Building2, Briefcase, Link } from 'lucide-react'

interface LeadFormProps {
  onSubmit: (data: CreateLeadData) => void
  loading?: boolean
  initialData?: Partial<CreateLeadData>
}

export function LeadForm({ onSubmit, loading = false, initialData }: LeadFormProps) {
  const [formData, setFormData] = useState<CreateLeadData>({
    name: initialData?.name || '',
    role: initialData?.role || '',
    company: initialData?.company || '',
    linkedin_url: initialData?.linkedin_url || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.role && formData.company) {
      onSubmit(formData)
    }
  }

  const handleChange = (field: keyof CreateLeadData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
          <Label htmlFor="name" className="text-blue-800 font-medium flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Name *
          </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., John Smith"
                required
            className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
          <Label htmlFor="role" className="text-blue-800 font-medium flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Role *
          </Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
            placeholder="e.g., Marketing Director"
                required
            className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="space-y-2">
        <Label htmlFor="company" className="text-blue-800 font-medium flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Company *
        </Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
          placeholder="e.g., Microsoft"
              required
          className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
        <Label htmlFor="linkedin_url" className="text-blue-800 font-medium flex items-center gap-2">
          <Link className="h-4 w-4" />
          LinkedIn Profile URL (Optional)
        </Label>
            <Input
              id="linkedin_url"
              value={formData.linkedin_url}
              onChange={(e) => handleChange('linkedin_url', e.target.value)}
          placeholder="https://linkedin.com/in/johnsmith"
              type="url"
          className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
            />
        <p className="text-sm text-blue-600">
          Adding a LinkedIn URL helps AI better analyze prospect background for more personalized messages
        </p>
          </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          type="submit" 
          disabled={loading || !formData.name || !formData.role || !formData.company}
          className="business-button"
        >
          {loading ? 'Adding...' : 'Add Prospect'}
          </Button>
      </div>
        </form>
  )
} 