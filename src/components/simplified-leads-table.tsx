'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Lead } from '@/lib/supabase'
import { Building2, MessageSquare, ExternalLink } from 'lucide-react'

interface SimplifiedLeadsTableProps {
  leads: Lead[]
  selectedLeads: string[]
  onSelectionChange: (selectedIds: string[]) => void
  onGenerateMessage: (leadIds: string[]) => void
  isGenerating: boolean
}

export function SimplifiedLeadsTable({ 
  leads, 
  selectedLeads, 
  onSelectionChange, 
  onGenerateMessage,
  isGenerating 
}: SimplifiedLeadsTableProps) {
  const [selectAll, setSelectAll] = useState(false)

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    if (checked) {
      onSelectionChange(leads.map(lead => lead.id))
    } else {
      onSelectionChange([])
    }
  }

  const handleSelectLead = (leadId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedLeads, leadId])
    } else {
      onSelectionChange(selectedLeads.filter(id => id !== leadId))
    }
  }

  const handleGenerateForSelected = () => {
    if (selectedLeads.length > 0) {
      onGenerateMessage(selectedLeads)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header with select all and bulk actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={selectAll}
            onCheckedChange={handleSelectAll}
            className="border-blue-300"
          />
          <span className="text-sm font-medium text-blue-800">
            Select All ({leads.length})
          </span>
        </div>
        {selectedLeads.length > 0 && (
          <Button
            onClick={handleGenerateForSelected}
            disabled={isGenerating}
            size="sm"
            className={`${
              isGenerating 
                ? 'bg-orange-500 hover:bg-orange-600 animate-pulse' 
                : 'business-button'
            } transition-all duration-300`}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                <span className="font-semibold">Generating...</span>
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4 mr-2" />
                Generate for {selectedLeads.length} selected
              </>
            )}
          </Button>
        )}
      </div>

      {/* Leads list */}
      <div className="space-y-3">
        {leads.map((lead) => {
          const isSelected = selectedLeads.includes(lead.id)
          const isGeneratingForThisLead = isGenerating && isSelected
          
          return (
            <div
              key={lead.id}
              className={`flex items-center justify-between p-4 border rounded-lg transition-all duration-200 ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-blue-200 hover:border-blue-300 hover:bg-blue-25'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => handleSelectLead(lead.id, checked as boolean)}
                  className="border-blue-300"
                />
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Building2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900">{lead.name}</div>
                    <div className="text-sm text-blue-600">{lead.role} at {lead.company}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {lead.linkedin_url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(lead.linkedin_url, '_blank')}
                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  size="sm" 
                  disabled={isGeneratingForThisLead}
                  onClick={() => onGenerateMessage([lead.id])}
                  className={`${
                    isGeneratingForThisLead 
                      ? 'bg-orange-500 hover:bg-orange-600 animate-pulse' 
                      : 'business-button'
                  } transition-all duration-300`}
                >
                  {isGeneratingForThisLead ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                      <span className="font-semibold">Generating...</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty state */}
      {leads.length === 0 && (
        <div className="text-center py-8">
          <div className="p-4 bg-blue-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">No Prospects Found</h3>
          <p className="text-blue-600">Add your first prospect to get started</p>
        </div>
      )}
    </div>
  )
} 