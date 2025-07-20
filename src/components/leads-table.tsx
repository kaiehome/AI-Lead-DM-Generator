'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Lead } from '@/lib/supabase'
import { useUpdateLead, useDeleteLead } from '@/hooks/use-leads'
import { Sparkles, Edit, Trash2, CheckCircle, Clock, Send, Users } from 'lucide-react'

interface LeadsTableProps {
  leads: Lead[]
  onLeadSelect?: (lead: Lead) => void
  onLeadUpdate?: (id: string, data: Partial<Lead>) => void
  onLeadDelete?: (id: string) => void
  selectedLead?: Lead | null
  isLoading?: boolean
}

export function LeadsTable({ 
  leads, 
  onLeadSelect
}: LeadsTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Lead>>({})
  
  const updateLead = useUpdateLead()
  const deleteLead = useDeleteLead()

  const handleEdit = (lead: Lead) => {
    setEditingId(lead.id)
    setEditData(lead)
  }

  const handleSave = async () => {
    if (editingId) {
      try {
        await updateLead.mutateAsync({
          id: editingId,
          data: editData
        })
        setEditingId(null)
        setEditData({})
      } catch (error) {
        console.error('Failed to update lead:', error)
      }
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData({})
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteLead.mutateAsync(id)
      } catch (error) {
        console.error('Failed to delete lead:', error)
      }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Draft':
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" />Draft</Badge>
      case 'Approved':
        return <Badge variant="secondary" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" />Approved</Badge>
      case 'Sent':
        return <Badge variant="default" className="flex items-center gap-1"><Send className="h-3 w-3" />Sent</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No leads yet</h3>
        <p className="text-gray-500">Add your first lead above, then you can use AI to generate personalized messages!</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Name</TableHead>
            <TableHead className="w-[150px]">Role</TableHead>
            <TableHead className="w-[180px]">Company</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[120px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>
                {editingId === lead.id ? (
                  <Input
                    value={editData.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="h-8"
                  />
                ) : (
                  <div className="font-medium">{lead.name}</div>
                )}
              </TableCell>
              <TableCell>
                {editingId === lead.id ? (
                  <Input
                    value={editData.role || ''}
                    onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                    className="h-8"
                  />
                ) : (
                  <div className="text-sm text-gray-600">{lead.role}</div>
                )}
              </TableCell>
              <TableCell>
                {editingId === lead.id ? (
                  <Input
                    value={editData.company || ''}
                    onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                    className="h-8"
                  />
                ) : (
                  <div className="text-sm text-gray-600">{lead.company}</div>
                )}
              </TableCell>
              <TableCell>
                {getStatusBadge(lead.status)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 justify-center">
                  {editingId === lead.id ? (
                    <>
                      <Button size="sm" onClick={handleSave} className="h-7 px-2">
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel} className="h-7 px-2">
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(lead)}
                        className="h-7 px-2"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onLeadSelect?.(lead)}
                        className="h-7 px-2 bg-blue-50 hover:bg-blue-100 border-blue-200"
                      >
                        <Sparkles className="h-3 w-3 text-blue-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(lead.id)}
                        className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 