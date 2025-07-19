'use client'

import { useState } from 'react'
import { LeadForm } from '@/components/lead-form'
import { MessageGenerator } from '@/components/message-generator'
import { LeadsTable } from '@/components/leads-table'
import { useLeads, useCreateLead, useUpdateLead } from '@/hooks/use-leads'
import { Lead, CreateLeadData } from '@/lib/supabase'

export default function Home() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showMessageGenerator, setShowMessageGenerator] = useState(false)
  
  const { data: leadsData, isLoading, error } = useLeads()
  const createLead = useCreateLead()
  const updateLead = useUpdateLead()

  const leads = leadsData?.leads || []

  const handleCreateLead = async (data: CreateLeadData) => {
    try {
      await createLead.mutateAsync(data)
    } catch (error) {
      console.error('Failed to create lead:', error)
    }
  }

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead)
    setShowMessageGenerator(true)
  }

  const handleMessageGenerated = async (message: string) => {
    if (selectedLead) {
      try {
        await updateLead.mutateAsync({
          id: selectedLead.id,
          data: { message, status: 'Draft' }
        })
        setShowMessageGenerator(false)
        setSelectedLead(null)
      } catch (error) {
        console.error('Failed to update lead with message:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading leads...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-red-500">Error loading leads. Please check your configuration.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">AI Lead DM Generator</h1>
        <p className="text-muted-foreground">
          Generate personalized LinkedIn outreach messages using AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Form */}
        <div>
          <LeadForm 
            onSubmit={handleCreateLead} 
            loading={createLead.isPending}
          />
        </div>

        {/* Message Generator */}
        {showMessageGenerator && selectedLead && (
          <div>
            <MessageGenerator
              lead={{
                name: selectedLead.name,
                role: selectedLead.role,
                company: selectedLead.company,
                linkedin_url: selectedLead.linkedin_url,
              }}
              onMessageGenerated={handleMessageGenerated}
            />
          </div>
        )}
      </div>

      {/* Leads Table */}
      <div>
        <LeadsTable 
          leads={leads} 
          onEdit={handleEditLead}
        />
      </div>

      {leads.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No leads yet. Add your first lead above!</p>
        </div>
      )}
    </div>
  )
}
