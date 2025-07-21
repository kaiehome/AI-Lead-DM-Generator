'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLeads } from '@/hooks/use-leads'
import { useDeleteLead } from '@/hooks/use-leads'
import { Lead, CreateLeadData } from '@/lib/supabase'
import { SimplifiedLeadForm } from '@/components/simplified-lead-form'
import { exportLeadsToCSV, formatLeadsForExport } from '@/lib/csv-export'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Upload, 
  Edit, 
  Trash2, 
  Building2,
  ExternalLink,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  const { data: leadsData, isLoading, error, refetch } = useLeads()
  const deleteLead = useDeleteLead()
  
  const leads = leadsData?.leads || []

  // Filter leads based on search and status
  const filteredLeads = leads.filter((lead: Lead) => {
    const matchesSearch = (
      lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    const matchesStatus = !statusFilter || lead.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleAddLead = async (data: CreateLeadData) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        await refetch()
        setShowLeadForm(false)
        console.log('Lead added successfully')
      } else {
        throw new Error('Failed to add lead')
      }
    } catch (error) {
      console.error('Error adding lead:', error)
    }
  }

  const handleUpdateLead = async (lead: Lead) => {
    try {
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lead),
      })

      if (response.ok) {
        await refetch()
        setEditingLead(null)
        console.log('Lead updated successfully')
      } else {
        throw new Error('Failed to update lead')
      }
    } catch (error) {
      console.error('Error updating lead:', error)
    }
  }

  const handleDeleteLead = async (leadId: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteLead.mutateAsync(leadId)
        console.log('Lead deleted successfully')
      } catch (error) {
        console.error('Error deleting lead:', error)
      }
    }
  }

  const handleExportLeads = () => {
    const formattedLeads = formatLeadsForExport(filteredLeads)
    exportLeadsToCSV(formattedLeads)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Active</span>
      case 'Inactive':
        return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">Inactive</span>
      case 'Converted':
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">Converted</span>
      default:
        return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">{status}</span>
    }
  }

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-blue-600">Loading leads...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center space-y-4">
        <p className="text-red-600 font-medium">Loading failed: {error.message}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  ← Back to Home
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleExportLeads}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Export
              </Button>
              <Button
                onClick={() => setShowLeadForm(true)}
                className="business-button"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filters
            </CardTitle>
            <CardDescription>
              Find and filter your leads
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, role, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Converted">Converted</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <Filter className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
            
            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Company Size</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Sizes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Sizes</SelectItem>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201+">201+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Industry</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Industries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Industries</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Date Added</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Lead Form */}
        {showLeadForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Lead</CardTitle>
              <CardDescription>
                Enter the lead&apos;s information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimplifiedLeadForm
                onSubmit={handleAddLead}
                loading={false}
              />
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowLeadForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leads List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Leads ({filteredLeads.length})</span>
              <div className="text-sm text-gray-500">
                Showing {filteredLeads.length} of {leads.length} leads
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredLeads.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || statusFilter ? 'Try adjusting your search or filters.' : 'Get started by adding your first lead.'}
                </p>
                {!searchQuery && !statusFilter && (
                  <Button onClick={() => setShowLeadForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Lead
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLeads.map((lead: Lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Building2 className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-600">{lead.role} at {lead.company}</div>
                        <div className="text-xs text-gray-500">
                          Added {new Date(lead.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusBadge(lead.status)}
                      
                      {lead.linkedin_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(lead.linkedin_url, '_blank')}
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingLead(lead)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteLead(lead.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 