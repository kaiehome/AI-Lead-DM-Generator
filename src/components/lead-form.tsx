'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateLeadData } from '@/lib/supabase'

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
    <Card>
      <CardHeader>
        <CardTitle>Add New Lead</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                placeholder="Marketing Lead"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder="Tech Corp"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin_url">LinkedIn URL (Optional)</Label>
            <Input
              id="linkedin_url"
              value={formData.linkedin_url}
              onChange={(e) => handleChange('linkedin_url', e.target.value)}
              placeholder="https://linkedin.com/in/johndoe"
              type="url"
            />
          </div>
          <Button type="submit" disabled={loading || !formData.name || !formData.role || !formData.company}>
            {loading ? 'Adding...' : 'Add Lead'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 